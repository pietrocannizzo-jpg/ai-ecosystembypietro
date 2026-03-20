import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ── Types ───────────────────────────────────────────────────────────────

interface ParsedEntry {
  date: string;
  title: string;
  description: string;
  type: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function classifyType(title: string, desc: string): string {
  const t = `${title} ${desc}`.toLowerCase();
  if (/\bmodel\b|\bgpt-|\bclaude[\s-]\d|\bgemini\b|\bllama\b|\bsonnet\b|\bopus\b/.test(t)) return "model";
  if (/\bapi\b|\bendpoint\b|\bsdk\b|\blibrary\b/.test(t)) return "api";
  if (/\bpric|\bcost|\bfree tier|\btokens?\b.*\$/.test(t)) return "pricing";
  if (/\bsecurity\b|\bvulnerab|\bpatch\b|\bcve\b/.test(t)) return "safety";
  if (/\bintegrat|\bpartner|\bplugin|\bmarketplace\b/.test(t)) return "partnership";
  if (/\blaunch|\bintroduc|\bannounce|\breleas|\bnew\b/.test(t)) return "launch";
  if (/\bdeprecate|\bremov|\bsunset|\bend.of.life/.test(t)) return "deprecation";
  if (/\bresearch|\bpaper|\bbenchmark|\beval/.test(t)) return "research";
  return "update";
}

function normalizeDate(raw: string): string {
  try {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? raw : d.toISOString().split("T")[0];
  } catch {
    return raw;
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

// ── Parse release notes from raw HTML ───────────────────────────────────

function parseReleasebotHTML(html: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const seen = new Set<string>();

  // Strategy: find each <h2> tag, look backwards for date, forwards for description
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gs;
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    const title = stripTags(match[1]);
    if (!title || title.length < 5) continue;
    // Skip page-level headings
    if (/release notes|products$/i.test(title)) continue;
    if (/^all .* release notes/i.test(title)) continue;

    // Look backwards up to 3000 chars for the nearest date
    const preceding = html.slice(Math.max(0, match.index - 3000), match.index);
    const dateMatches = [
      ...preceding.matchAll(
        /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},\s+\d{4})/gi,
      ),
    ];
    const rawDate = dateMatches.length > 0 ? dateMatches[dateMatches.length - 1][1] : "";
    if (!rawDate) continue;

    const date = normalizeDate(rawDate);

    // Look forward up to 3000 chars for first <p> description
    const following = html.slice(match.index + match[0].length, match.index + match[0].length + 3000);
    const pMatch = /<p[^>]*>(.*?)<\/p>/s.exec(following);
    const description = pMatch ? stripTags(pMatch[1]).slice(0, 500) : "";

    // Deduplicate by title similarity
    const key = title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push({
      date,
      title,
      description,
      type: classifyType(title, description),
    });
  }

  return entries;
}

// ── Fetch a single tool ─────────────────────────────────────────────────

async function scrapeToolReleaseNotes(slug: string): Promise<ParsedEntry[]> {
  const url = `https://releasebot.io/updates/${slug}`;
  console.log(`Fetching: ${url}`);

  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AIEcosystemBot/1.0)",
      Accept: "text/html",
    },
  });

  if (!resp.ok) {
    console.error(`Failed to fetch ${url}: ${resp.status}`);
    return [];
  }

  return parseReleasebotHTML(await resp.text());
}

// ── Main handler ────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get("X-Admin-Token");
    const expectedAdmin = Deno.env.get("ADMIN_SECRET");
    const isAdmin = adminToken && expectedAdmin && adminToken === expectedAdmin;

    const body = await req.json().catch(() => ({}));
    const { cardId, releasebotSlug, mode } = body as {
      cardId?: string;
      releasebotSlug?: string;
      mode?: "preview" | "save";
    };

    // ── Batch save: scrape ALL cards with a releasebot_slug ──
    if (mode === "save" && !cardId) {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin auth required for batch save" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: cards, error } = await adminClient
        .from("cards")
        .select("id, title, releasebot_slug")
        .not("releasebot_slug", "is", null);
      if (error) throw error;

      let totalInserted = 0;
      const results: { title: string; found: number; inserted: number }[] = [];

      for (const card of cards || []) {
        const entries = await scrapeToolReleaseNotes(card.releasebot_slug);
        if (!entries.length) {
          results.push({ title: card.title, found: 0, inserted: 0 });
          continue;
        }

        // Deduplicate against existing entries
        const { data: existing } = await adminClient
          .from("timeline_entries")
          .select("date, description")
          .eq("card_id", card.id);

        const existingKeys = new Set(
          (existing || []).map((e: any) => `${e.date}::${e.description.slice(0, 60)}`),
        );

        const newEntries = entries.filter((e) => {
          const desc = `**${e.title}** — ${e.description}`.slice(0, 60);
          return !existingKeys.has(`${e.date}::${desc}`);
        });

        if (newEntries.length) {
          const rows = newEntries.map((e, i) => ({
            card_id: card.id,
            date: e.date,
            description: `**${e.title}** — ${e.description}`.slice(0, 1000),
            entry_type: e.type,
            sort_order: i,
          }));
          const { error: ie } = await adminClient.from("timeline_entries").insert(rows);
          if (ie) console.error(`Insert error for ${card.title}:`, ie);
          else totalInserted += newEntries.length;
        }

        results.push({ title: card.title, found: entries.length, inserted: newEntries.length });
        await new Promise((r) => setTimeout(r, 500));
      }

      return new Response(
        JSON.stringify({ success: true, totalInserted, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Single card ──
    if (!releasebotSlug) {
      return new Response(
        JSON.stringify({ error: "releasebotSlug is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const entries = await scrapeToolReleaseNotes(releasebotSlug);

    if (mode === "save" && cardId) {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin auth required for save" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: existing } = await adminClient
        .from("timeline_entries")
        .select("date, description")
        .eq("card_id", cardId);

      const existingKeys = new Set(
        (existing || []).map((e: any) => `${e.date}::${e.description.slice(0, 60)}`),
      );

      const newEntries = entries.filter((e) => {
        const desc = `**${e.title}** — ${e.description}`.slice(0, 60);
        return !existingKeys.has(`${e.date}::${desc}`);
      });

      if (newEntries.length) {
        const rows = newEntries.map((e, i) => ({
          card_id: cardId,
          date: e.date,
          description: `**${e.title}** — ${e.description}`.slice(0, 1000),
          entry_type: e.type,
          sort_order: i,
        }));
        const { error: ie } = await adminClient.from("timeline_entries").insert(rows);
        if (ie) throw ie;
      }

      return new Response(
        JSON.stringify({ success: true, found: entries.length, inserted: newEntries.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Preview mode (default)
    return new Response(
      JSON.stringify({ entries, count: entries.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
