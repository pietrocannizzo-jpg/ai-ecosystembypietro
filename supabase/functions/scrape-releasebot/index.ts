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

interface ReleasebotEntry {
  id: number;
  slug: string;
  release_details: {
    is_release: boolean;
    release_name: string;
    release_number: string | null;
    release_summary: string;
    release_deep_source: string | null;
  };
  product_id: number;
  created_at: string;
  release_date: string;
  formatted_content: string;
  product: {
    id: number;
    slug: string;
    display_name: string;
    vendor_id: number;
  };
  source: {
    id: number;
    source_url: string;
  };
}

interface ParsedEntry {
  date: string;
  title: string;
  description: string;
  type: string;
  releasebot_entry_id: number;
  source_url: string | null;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function classifyType(entry: ReleasebotEntry): string {
  const name = (entry.release_details?.release_name || "").toLowerCase();
  const summary = (entry.release_details?.release_summary || "").toLowerCase();
  const product = (entry.product?.display_name || "").toLowerCase();
  const t = `${name} ${summary} ${product}`;

  if (/\bmodel\b|\bgpt-|\bclaude[\s-]\d|\bgemini\b|\bllama\b|\bsonnet\b|\bopus\b|\bhaiku\b/.test(t)) return "model";
  if (/\bapi\b|\bendpoint\b|\bsdk\b|\blibrary\b|\bcli\b/.test(t)) return "api";
  if (/\bpric|\bcost|\bfree tier|\btokens?\b.*\$/.test(t)) return "pricing";
  if (/\bsecurity\b|\bvulnerab|\bpatch\b|\bcve\b/.test(t)) return "safety";
  if (/\bintegrat|\bpartner|\bplugin|\bmarketplace\b/.test(t)) return "partnership";
  if (/\blaunch|\bintroduc|\bannounce|\bga\b|\bgenerally available/.test(t)) return "launch";
  if (/\bdeprecate|\bremov|\bsunset|\bend.of.life|\beol\b/.test(t)) return "deprecation";
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
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ── Extract JSON from SvelteKit hydration data ──────────────────────────

function findReleasesInObject(obj: unknown, depth = 0): ReleasebotEntry[] {
  if (depth > 15) return []; // prevent infinite recursion

  if (Array.isArray(obj)) {
    // Check if this array looks like release entries
    if (
      obj.length > 0 &&
      typeof obj[0] === "object" &&
      obj[0] !== null &&
      "release_details" in obj[0]
    ) {
      return obj as ReleasebotEntry[];
    }
    // Search each element
    for (const item of obj) {
      const found = findReleasesInObject(item, depth + 1);
      if (found.length > 0) return found;
    }
  } else if (obj && typeof obj === "object") {
    for (const val of Object.values(obj as Record<string, unknown>)) {
      const found = findReleasesInObject(val, depth + 1);
      if (found.length > 0) return found;
    }
  }

  return [];
}

function extractReleasebotJSON(html: string): ReleasebotEntry[] {
  // Strategy 1: SvelteKit data-sveltekit-fetched script tags (most reliable)
  const jsonScriptRegex =
    /<script[^>]*data-sveltekit-fetched[^>]*>([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;

  while ((match = jsonScriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      // SvelteKit wraps in { body: "..." } where body is a JSON string
      let data = parsed;
      if (typeof data?.body === "string") {
        data = JSON.parse(data.body);
      }
      const entries = findReleasesInObject(data);
      if (entries.length > 0) {
        console.log(
          `Strategy 1 (data-sveltekit-fetched): found ${entries.length} entries`
        );
        return entries;
      }
    } catch {
      /* continue to next script tag */
    }
  }

  // Strategy 2: Look for __sveltekit inline resolve calls
  const inlineRegex =
    /__sveltekit_\w+\.resolve\(\s*(\{[\s\S]*?\})\s*\)/g;
  while ((match = inlineRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      const entries = findReleasesInObject(parsed);
      if (entries.length > 0) {
        console.log(
          `Strategy 2 (__sveltekit resolve): found ${entries.length} entries`
        );
        return entries;
      }
    } catch {
      /* continue */
    }
  }

  // Strategy 3: Brute-force — find any large JSON array in script tags
  const allScripts = /<script[^>]*>([\s\S]*?)<\/script>/g;
  while ((match = allScripts.exec(html)) !== null) {
    const content = match[1];
    // Look for JSON arrays that might contain release data
    const arrayStart = content.indexOf("[{");
    if (arrayStart === -1) continue;

    // Try to find the matching end bracket
    let bracketDepth = 0;
    let arrayEnd = -1;
    for (let i = arrayStart; i < content.length; i++) {
      if (content[i] === "[") bracketDepth++;
      else if (content[i] === "]") {
        bracketDepth--;
        if (bracketDepth === 0) {
          arrayEnd = i + 1;
          break;
        }
      }
    }

    if (arrayEnd === -1) continue;

    try {
      const arr = JSON.parse(content.slice(arrayStart, arrayEnd));
      const entries = findReleasesInObject(arr);
      if (entries.length > 0) {
        console.log(
          `Strategy 3 (brute-force JSON): found ${entries.length} entries`
        );
        return entries;
      }
    } catch {
      /* continue */
    }
  }

  console.warn("No release entries found in any extraction strategy");
  return [];
}

// ── Fetch & parse a single tool ─────────────────────────────────────────

async function scrapeToolReleaseNotes(
  slug: string
): Promise<ParsedEntry[]> {
  const url = `https://releasebot.io/updates/${slug}`;
  console.log(`Fetching: ${url}`);

  const resp = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!resp.ok) {
    console.error(`Failed to fetch ${url}: ${resp.status}`);
    return [];
  }

  const html = await resp.text();
  const entries = extractReleasebotJSON(html);

  if (entries.length === 0) {
    console.warn(`No entries extracted for slug "${slug}" — page may have changed structure`);
    return [];
  }

  console.log(`Extracted ${entries.length} raw entries for "${slug}"`);

  return entries
    .filter((e) => e.release_details) // safety check
    .map((e) => {
      const title =
        e.release_details.release_name || e.product?.display_name || e.slug;
      const summary =
        e.release_details.release_summary ||
        stripTags(e.formatted_content || "").slice(0, 500);

      return {
        date: normalizeDate(e.release_date || e.created_at),
        title,
        description: summary,
        type: classifyType(e),
        releasebot_entry_id: e.id,
        source_url: e.source?.source_url || null,
      };
    });
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
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: cards, error } = await adminClient
        .from("cards")
        .select("id, title, releasebot_slug")
        .not("releasebot_slug", "is", null);
      if (error) throw error;

      let totalInserted = 0;
      const results: {
        title: string;
        found: number;
        inserted: number;
        errors?: string;
      }[] = [];

      for (const card of cards || []) {
        try {
          const entries = await scrapeToolReleaseNotes(card.releasebot_slug);
          if (!entries.length) {
            results.push({ title: card.title, found: 0, inserted: 0 });
            continue;
          }

          // Deduplicate against existing releasebot_entry_ids
          const { data: existing } = await adminClient
            .from("timeline_entries")
            .select("releasebot_entry_id")
            .eq("card_id", card.id)
            .not("releasebot_entry_id", "is", null);

          const existingIds = new Set(
            (existing || []).map((e: any) => e.releasebot_entry_id)
          );

          const newEntries = entries.filter(
            (e) => !existingIds.has(e.releasebot_entry_id)
          );

          if (newEntries.length) {
            const rows = newEntries.map((e, i) => ({
              card_id: card.id,
              date: e.date,
              description: `**${e.title}** — ${e.description}`.slice(0, 1000),
              entry_type: e.type,
              sort_order: i,
              releasebot_entry_id: e.releasebot_entry_id,
              source_url: e.source_url,
            }));

            const { error: ie } = await adminClient
              .from("timeline_entries")
              .insert(rows);
            if (ie) {
              console.error(`Insert error for ${card.title}:`, ie);
              results.push({
                title: card.title,
                found: entries.length,
                inserted: 0,
                errors: ie.message,
              });
            } else {
              totalInserted += newEntries.length;
              results.push({
                title: card.title,
                found: entries.length,
                inserted: newEntries.length,
              });
            }
          } else {
            results.push({
              title: card.title,
              found: entries.length,
              inserted: 0,
            });
          }

          // Rate limiting: 1 second between requests
          await new Promise((r) => setTimeout(r, 1000));
        } catch (cardError) {
          console.error(`Error processing ${card.title}:`, cardError);
          results.push({
            title: card.title,
            found: 0,
            inserted: 0,
            errors:
              cardError instanceof Error
                ? cardError.message
                : "Unknown error",
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, totalInserted, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Single card ──
    if (!releasebotSlug) {
      return new Response(
        JSON.stringify({ error: "releasebotSlug is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const entries = await scrapeToolReleaseNotes(releasebotSlug);

    if (mode === "save" && cardId) {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin auth required for save" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Deduplicate against existing releasebot_entry_ids
      const { data: existing } = await adminClient
        .from("timeline_entries")
        .select("releasebot_entry_id")
        .eq("card_id", cardId)
        .not("releasebot_entry_id", "is", null);

      const existingIds = new Set(
        (existing || []).map((e: any) => e.releasebot_entry_id)
      );

      const newEntries = entries.filter(
        (e) => !existingIds.has(e.releasebot_entry_id)
      );

      if (newEntries.length) {
        const rows = newEntries.map((e, i) => ({
          card_id: cardId,
          date: e.date,
          description: `**${e.title}** — ${e.description}`.slice(0, 1000),
          entry_type: e.type,
          sort_order: i,
          releasebot_entry_id: e.releasebot_entry_id,
          source_url: e.source_url,
        }));
        const { error: ie } = await adminClient
          .from("timeline_entries")
          .insert(rows);
        if (ie) throw ie;
      }

      return new Response(
        JSON.stringify({
          success: true,
          found: entries.length,
          inserted: newEntries.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Preview mode (default)
    return new Response(
      JSON.stringify({ entries, count: entries.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
