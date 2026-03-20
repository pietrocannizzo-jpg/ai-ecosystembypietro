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

// ── Parse release notes from Releasebot HTML ────────────────────────────

interface ParsedEntry {
  date: string;
  title: string;
  description: string;
  type: string;
}

function classifyType(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (/\bmodel\b|\bgpt-|\bclaude[\s-]\d|\bgemini\b|\bllama\b/.test(text)) return "model";
  if (/\bapi\b|\bendpoint\b|\bsdk\b/.test(text)) return "api";
  if (/\bpric|\bcost|\bfree tier\b/.test(text)) return "pricing";
  if (/\bsecurity\b|\bvulnerab|\bpatch\b/.test(text)) return "safety";
  if (/\bintegrat|\bpartner|\bplugin\b/.test(text)) return "partnership";
  if (/\blaunch|\bintroduc|\bannounce|\breleas/.test(text)) return "launch";
  if (/\bdeprecate|\bremov|\bsunset/.test(text)) return "deprecation";
  if (/\bresearch|\bpaper|\bbenchmark/.test(text)) return "research";
  return "update";
}

function parseReleasebotMarkdown(markdown: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const lines = markdown.split("\n");

  let currentDate = "";
  let currentTitle = "";
  let currentDescription = "";
  let inEntry = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Date patterns: "- Mar 18, 2026" or "- March 2026"
    const dateMatch = line.match(
      /^-\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4})/i
    );
    const monthOnlyMatch = line.match(
      /^-\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i
    );

    if (dateMatch) {
      // Flush previous entry
      if (inEntry && currentTitle) {
        entries.push({
          date: currentDate,
          title: currentTitle,
          description: currentDescription.trim(),
          type: classifyType(currentTitle, currentDescription),
        });
      }
      currentDate = normalizeDate(dateMatch[1]);
      currentTitle = "";
      currentDescription = "";
      inEntry = true;
      continue;
    }

    if (monthOnlyMatch && !dateMatch) {
      if (inEntry && currentTitle) {
        entries.push({
          date: currentDate,
          title: currentTitle,
          description: currentDescription.trim(),
          type: classifyType(currentTitle, currentDescription),
        });
      }
      currentDate = normalizeDate(monthOnlyMatch[1]);
      currentTitle = "";
      currentDescription = "";
      inEntry = true;
      continue;
    }

    // H2 titles (## Title)
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match && inEntry) {
      // If we already have a title, flush the previous entry
      if (currentTitle) {
        entries.push({
          date: currentDate,
          title: currentTitle,
          description: currentDescription.trim(),
          type: classifyType(currentTitle, currentDescription),
        });
        currentDescription = "";
      }
      currentTitle = h2Match[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
      continue;
    }

    // Skip metadata lines
    if (
      line.startsWith("- Date parsed") ||
      line.startsWith("- First seen") ||
      line.startsWith("![") ||
      line.startsWith("[Follow]") ||
      line.startsWith("Get this feed") ||
      line.startsWith("### Release notes") ||
      /^\[.+\]\(https:\/\/releasebot\.io\/updates/.test(line) ||
      line === "by"
    ) {
      continue;
    }

    // Collect description text
    if (inEntry && currentTitle && line.length > 10 && !line.startsWith("#")) {
      if (currentDescription.length < 500) {
        currentDescription += (currentDescription ? " " : "") + line;
      }
    }
  }

  // Flush last entry
  if (inEntry && currentTitle) {
    entries.push({
      date: currentDate,
      title: currentTitle,
      description: currentDescription.trim(),
      type: classifyType(currentTitle, currentDescription),
    });
  }

  return entries;
}

function normalizeDate(raw: string): string {
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) {
      // Month-only like "March 2026"
      const d2 = new Date(raw + " 1");
      if (!isNaN(d2.getTime())) {
        return d2.toISOString().split("T")[0];
      }
      return raw;
    }
    return d.toISOString().split("T")[0];
  } catch {
    return raw;
  }
}

// ── Fetch & parse a single tool ─────────────────────────────────────────

async function scrapeToolReleaseNotes(
  releasebotSlug: string,
): Promise<ParsedEntry[]> {
  const url = `https://releasebot.io/updates/${releasebotSlug}`;
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

  const html = await resp.text();

  // Extract text content from HTML (simple approach — strip tags)
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(h[1-6])[^>]*>/gi, (_, tag) => {
      const level = parseInt(tag[1]);
      return "\n" + "#".repeat(level) + " ";
    })
    .replace(/<\/?(p|div|li|tr)[^>]*>/gi, "\n")
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "[$2]($1)")
    .replace(/<img[^>]+alt="([^"]*)"[^>]*>/gi, "![$1]")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n");

  return parseReleasebotMarkdown(text);
}

// ── Main handler ────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth: admin token required for writes
    const adminToken = req.headers.get("X-Admin-Token");
    const expectedAdmin = Deno.env.get("ADMIN_SECRET");
    const isAdmin = adminToken && expectedAdmin && adminToken === expectedAdmin;

    const body = await req.json().catch(() => ({}));
    const { cardId, releasebotSlug, mode } = body as {
      cardId?: string;
      releasebotSlug?: string;
      mode?: "preview" | "save";
    };

    // ── Batch mode: scrape ALL cards that have a releasebot_slug ──
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
        if (entries.length === 0) {
          results.push({ title: card.title, found: 0, inserted: 0 });
          continue;
        }

        // Get existing entries to deduplicate
        const { data: existing } = await adminClient
          .from("timeline_entries")
          .select("date, description")
          .eq("card_id", card.id);

        const existingKeys = new Set(
          (existing || []).map((e: any) => `${e.date}::${e.description.slice(0, 50)}`),
        );

        const newEntries = entries.filter(
          (e) => !existingKeys.has(`${e.date}::${e.description.slice(0, 50)}`),
        );

        if (newEntries.length > 0) {
          const rows = newEntries.map((e, i) => ({
            card_id: card.id,
            date: e.date,
            description: `**${e.title}** — ${e.description}`.slice(0, 1000),
            entry_type: e.type,
            sort_order: i,
          }));

          const { error: insertError } = await adminClient
            .from("timeline_entries")
            .insert(rows);

          if (insertError) {
            console.error(`Insert error for ${card.title}:`, insertError);
          } else {
            totalInserted += newEntries.length;
          }
        }

        results.push({
          title: card.title,
          found: entries.length,
          inserted: newEntries.length,
        });

        // Small delay to be respectful
        await new Promise((r) => setTimeout(r, 500));
      }

      return new Response(
        JSON.stringify({ success: true, totalInserted, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Single card mode ──
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

      // Deduplicate
      const { data: existing } = await adminClient
        .from("timeline_entries")
        .select("date, description")
        .eq("card_id", cardId);

      const existingKeys = new Set(
        (existing || []).map((e: any) => `${e.date}::${e.description.slice(0, 50)}`),
      );

      const newEntries = entries.filter(
        (e) =>
          !existingKeys.has(
            `${e.date}::${"**" + e.title + "** — " + e.description}`.slice(0, 50 + e.date.length + 2),
          ),
      );

      if (newEntries.length > 0) {
        const rows = newEntries.map((e, i) => ({
          card_id: cardId,
          date: e.date,
          description: `**${e.title}** — ${e.description}`.slice(0, 1000),
          entry_type: e.type,
          sort_order: i,
        }));

        const { error: insertError } = await adminClient
          .from("timeline_entries")
          .insert(rows);

        if (insertError) throw insertError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          found: entries.length,
          inserted: newEntries.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Preview mode (default) — just return parsed data
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
