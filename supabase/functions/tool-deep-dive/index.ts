import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

const adminClient =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

// ── Helpers ─────────────────────────────────────────────────────────────

const getCachedDeepDiveByToolName = async (toolName: string) => {
  if (!adminClient) return null;

  const { data: card } = await adminClient
    .from("cards")
    .select("id")
    .eq("title", toolName)
    .maybeSingle();

  if (!card?.id) return null;

  const { data: deepDive } = await adminClient
    .from("tool_deep_dives")
    .select("content, updated_at")
    .eq("card_id", card.id)
    .maybeSingle();

  if (!deepDive?.content) return null;
  const content = deepDive.content as Record<string, unknown>;
  if (!content?.models) return null;

  return { content, updatedAt: deepDive.updated_at };
};

const getAuthenticatedUser = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ") || !supabaseUrl || !anonKey) return null;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await userClient.auth.getClaims(token);
  if (error || !data?.claims) return null;
  return data.claims;
};

/** Call OpenAI Responses API with web search + retry */
const callOpenAI = async (
  apiKey: string,
  prompt: string,
  searchContextSize: "low" | "medium" | "high" = "high",
): Promise<string> => {
  let response: Response | null = null;
  let lastStatus: number | null = null;
  let lastErrorText = "";

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 2000 * attempt));

    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview", search_context_size: searchContextSize }],
        input: prompt,
      }),
    });

    if (response.ok) break;
    lastStatus = response.status;
    lastErrorText = await response.text();
    if (response.status === 429) {
      console.log(`Attempt ${attempt + 1}: rate limited, waiting...`);
      continue;
    }
    break;
  }

  if (!response || !response.ok) {
    if (lastStatus === 429) throw new Error("RATE_LIMITED");
    console.error("OpenAI API error:", lastStatus, lastErrorText);
    throw new Error(`OpenAI API error: ${lastStatus}`);
  }

  const data = await response.json();

  let textContent = "";
  if (data.output) {
    for (const item of data.output) {
      if (item.type === "message" && item.content) {
        for (const part of item.content) {
          if (part.type === "output_text") textContent += part.text;
        }
      }
    }
  }
  if (!textContent && data.output_text) textContent = data.output_text;
  if (!textContent) {
    console.error("No content in response:", JSON.stringify(data).slice(0, 500));
    throw new Error("No content returned from AI");
  }

  return textContent.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
};

// ── Main handler ────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      toolName,
      toolSummary,
      toolCategory,
      subProducts,
      tags,
      links,
      existingTimeline,
    } = await req.json();

    // --- Auth check ---
    const adminToken = req.headers.get("X-Admin-Token");
    const expectedAdmin = Deno.env.get("ADMIN_SECRET");
    const isAdmin = adminToken && expectedAdmin && adminToken === expectedAdmin;

    if (!isAdmin) {
      const claims = await getAuthenticatedUser(req);
      if (!claims) {
        const cached = await getCachedDeepDiveByToolName(toolName);
        if (cached) {
          return new Response(
            JSON.stringify({ content: cached.content }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        return new Response(
          JSON.stringify({ error: "Sign in to generate a new AI analysis.", requiresAuth: true }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const subProductList = (subProducts || [])
      .map((sp: { name: string; description: string }) => `- ${sp.name}: ${sp.description}`)
      .join("\n");

    const officialLinks = (links || []).map((l: string) => `- ${l}`).join("\n");

    const timelineList = (existingTimeline || [])
      .map((t: { date: string; description: string; entry_type?: string }) =>
        `- [${t.date}] (${t.entry_type || "update"}) ${t.description}`)
      .join("\n");

    const today = new Date().toISOString().split("T")[0];

    // ── PASS 1: Changelog & Product Updates ──────────────────────────────

    const changelogPrompt = `You are an expert AI technical researcher. Today is ${today}. Your ONLY job is to find EVERY product/feature change, update, and release for the following tool.

TOOL: ${toolName}
Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}

OFFICIAL LINKS TO CHECK:
${officialLinks || "None listed"}

EXISTING TIMELINE (already in our database — DO NOT repeat these, only find NEW ones):
${timelineList || "None yet"}

RESEARCH STRATEGY — Execute ALL of these searches:
1. "${toolName} changelog ${today.slice(0, 7)}" — official changelog page
2. "${toolName} blog announcements ${today.slice(0, 4)}" — company blog posts
3. "${toolName} release notes" — release notes page
4. "${toolName} new features ${today.slice(0, 7)}" — recent feature announcements
5. "${toolName} API updates developer docs" — API/SDK changes
6. "${toolName} new model release ${today.slice(0, 4)}" — model launches
7. "${toolName} deprecation notice" — deprecated features
8. "${toolName} pricing changes ${today.slice(0, 4)}" — pricing updates
9. "${toolName} security update" — security patches
10. "${toolName} integration launch" — new integrations/partnerships
11. site:github.com "${toolName}" releases — GitHub releases if open source
12. "${toolName} SDK update" — SDK/library updates

CRITICAL RULES:
- Find as many entries as possible. Aim for 15-30 entries covering the last 12 months.
- Each entry MUST have a real date (not approximate). If you can't find the exact date, give your best estimate with the format YYYY-MM-DD.
- Include the SOURCE URL for every entry. If you can't find a direct URL, include the closest page.
- DO NOT include entries already in our EXISTING TIMELINE above.
- Focus ONLY on product/technical changes. IGNORE: funding, revenue, executive hires, opinion pieces.
- Types: new_model, api_change, sdk_update, security, capability, pricing, integration, deprecation, platform_update

Respond with ONLY valid JSON (no markdown fences):
{
  "changelog": [
    { "date": "YYYY-MM-DD", "feature": "short title", "description": "1-2 sentence detail", "type": "string", "url": "source URL", "confidence": "high|medium|low" }
  ]
}`;

    // ── PASS 2: Models, Ecosystem & Community ────────────────────────────

    const ecosystemPrompt = `You are an expert AI technical analyst. Today is ${today}. Analyze the following AI tool's current product lineup, competitive differentiators, and developer community.

TOOL: ${toolName}
Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}

KNOWN PRODUCTS (verify, expand, flag outdated):
${subProductList || "None listed"}

RESEARCH STRATEGY:
1. "${toolName} products features overview" — current product lineup
2. "${toolName} vs competitors comparison ${today.slice(0, 4)}" — differentiators
3. "${toolName} GitHub stars" OR "github.com/${toolName.toLowerCase().replace(/\s+/g, '')}" — open source presence
4. "${toolName} developer community sentiment" — developer opinions
5. "${toolName} notable projects built with" — real-world usage

Respond with ONLY valid JSON (no markdown fences):
{
  "models": [
    { "name": "string", "bestFor": "string", "speed": "Fast|Medium|Slow", "costTier": "Free|Low|Medium|High|Enterprise", "keyStrength": "string" }
  ],
  "differences": [
    { "name": "string", "description": "string" }
  ],
  "community": {
    "githubUrl": "string or null",
    "githubStars": "string or null",
    "sentiment": "positive|mixed|negative",
    "sentimentSummary": "string",
    "notableProjects": [
      { "name": "string", "description": "string", "url": "string" }
    ]
  },
  "missingFromDatabase": [
    { "name": "string", "description": "string", "releaseDate": "string" }
  ]
}`;

    // ── Execute both passes in parallel ──────────────────────────────────

    let changelogRaw: string;
    let ecosystemRaw: string;

    try {
      [changelogRaw, ecosystemRaw] = await Promise.all([
        callOpenAI(OPENAI_API_KEY, changelogPrompt, "high"),
        callOpenAI(OPENAI_API_KEY, ecosystemPrompt, "high"),
      ]);
    } catch (err) {
      if (err instanceof Error && err.message === "RATE_LIMITED") {
        const cached = await getCachedDeepDiveByToolName(toolName);
        if (cached) {
          return new Response(
            JSON.stringify({
              content: cached.content,
              stale: true,
              staleUpdatedAt: cached.updatedAt,
              warning: "Using cached deep dive due to temporary provider rate limit.",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        return new Response(
          JSON.stringify({ error: "OpenAI rate limit exceeded. Please wait a minute and try again.", retryable: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw err;
    }

    // ── Parse both results ───────────────────────────────────────────────

    let changelogData: { changelog: any[] };
    let ecosystemData: any;

    try {
      changelogData = JSON.parse(changelogRaw);
    } catch {
      console.error("Invalid changelog JSON:", changelogRaw.slice(0, 500));
      changelogData = { changelog: [] };
    }

    try {
      ecosystemData = JSON.parse(ecosystemRaw);
    } catch {
      console.error("Invalid ecosystem JSON:", ecosystemRaw.slice(0, 500));
      throw new Error("AI returned invalid JSON for ecosystem data");
    }

    // ── Merge into final structure ───────────────────────────────────────

    // Sort changelog by date descending, deduplicate by feature name
    const seen = new Set<string>();
    const deduped = (changelogData.changelog || [])
      .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
      .filter((entry: any) => {
        const key = (entry.feature || "").toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const parsed = {
      models: ecosystemData.models || [],
      differences: ecosystemData.differences || [],
      featureChangelog: deduped,
      community: ecosystemData.community || {
        githubUrl: null,
        githubStars: null,
        sentiment: "mixed",
        sentimentSummary: "No data available",
        notableProjects: [],
      },
      missingFromDatabase: ecosystemData.missingFromDatabase || [],
    };

    return new Response(
      JSON.stringify({ content: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Deep dive error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
