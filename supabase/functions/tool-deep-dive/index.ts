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

const getCachedDeepDiveByToolName = async (toolName: string) => {
  if (!adminClient) return null;

  const { data: card, error: cardError } = await adminClient
    .from("cards")
    .select("id")
    .eq("title", toolName)
    .maybeSingle();

  if (cardError || !card?.id) return null;

  const { data: deepDive, error: deepDiveError } = await adminClient
    .from("tool_deep_dives")
    .select("content, updated_at")
    .eq("card_id", card.id)
    .maybeSingle();

  if (deepDiveError || !deepDive?.content) return null;

  const content = deepDive.content as Record<string, unknown>;
  if (!content?.models) return null;

  return {
    content,
    updatedAt: deepDive.updated_at,
  };
};

/** Verify the caller is an authenticated user */
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolName, toolSummary, toolCategory, subProducts, tags, links } = await req.json();

    // --- Auth check: only authenticated users can trigger OpenAI calls ---
    const claims = await getAuthenticatedUser(req);
    if (!claims) {
      return new Response(
        JSON.stringify({ error: "Authentication required to generate analysis." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const subProductList = (subProducts || [])
      .map((sp: { name: string; description: string }) => `- ${sp.name}: ${sp.description}`)
      .join("\n");

    const officialLinks = (links || [])
      .map((l: string) => `- ${l}`)
      .join("\n");

    const today = new Date().toISOString().split("T")[0];

    const prompt = `You are an expert AI technical analyst with access to web search. Today is ${today}. Your job is to produce a TECHNICAL FEATURE BRIEFING on the following AI tool — focused on what developers and practitioners need to know.

TOOL: ${toolName}
Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}

KNOWN PRODUCTS (from our curated database — verify and expand on these):
${subProductList || "None listed"}

OFFICIAL LINKS TO CHECK:
${officialLinks || "None listed"}

RESEARCH INSTRUCTIONS — FOCUS ON TECHNICAL FEATURES:
1. Search the web for ${toolName} focusing on:
   - "${toolName} changelog new features ${today.slice(0, 7)}"
   - "${toolName} API updates developer"
   - "${toolName} new model release"
   - "${toolName} SDK updates"
   - "${toolName} developer tools features"
   - "${toolName} GitHub"
2. Check the company's official changelog, docs, and blog for PRODUCT/FEATURE announcements only.
3. Focus on: new models, API changes, SDK releases, developer tools, security features, context window changes, pricing tier updates, new capabilities.
4. IGNORE: revenue news, funding rounds, executive hires, opinion pieces, market analysis. Only include things that affect how developers USE the tool.
5. Cross-reference our known products list. Confirm current ones, flag outdated, add ALL new ones we're missing.
6. Look for community signals: GitHub stars/activity, developer sentiment, notable open-source projects using this tool.

Respond with ONLY valid JSON (no markdown fences) in this exact structure:
{
  "models": [
    { "name": "string", "bestFor": "string", "speed": "Fast|Medium|Slow", "costTier": "Free|Low|Medium|High|Enterprise", "keyStrength": "string" }
  ],
  "differences": [
    { "name": "string", "description": "string" }
  ],
  "featureChangelog": [
    { "date": "YYYY-MM-DD", "feature": "string", "description": "string", "type": "new_model|api_change|sdk_update|security|capability|pricing|integration|deprecation", "url": "string" }
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
}

Rules:
- "models": One entry per major product/model/API. Include speed and cost estimates.
- "differences": What makes each product unique in plain English.
- "featureChangelog": 5-15 entries. ONLY include actual product/feature changes that affect developers. Sort by date descending (newest first). Types: new_model, api_change, sdk_update, security, capability, pricing, integration, deprecation.
- "community": Developer community signals. GitHub info if applicable, overall developer sentiment, 1-3 notable open source projects or integrations using this tool.
- "missingFromDatabase": ALL products, features, tools, SDKs not in our known products list.`;

    // Use OpenAI Responses API with web search (with retry)
    let response: Response | null = null;
    let lastStatus: number | null = null;
    let lastErrorText = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }

      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          tools: [
            {
              type: "web_search_preview",
              search_context_size: "high",
            },
          ],
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
      if (lastStatus === 429) {
        const cached = await getCachedDeepDiveByToolName(toolName);

        if (cached) {
          return new Response(
            JSON.stringify({
              content: cached.content,
              stale: true,
              staleUpdatedAt: cached.updatedAt,
              warning: "Using cached deep dive due temporary provider rate limit.",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            error: "OpenAI rate limit exceeded. Please wait a minute and try again.",
            retryable: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("OpenAI API error:", lastStatus ?? response?.status, lastErrorText);
      throw new Error(`OpenAI API error: ${lastStatus ?? response?.status}`);
    }

    const data = await response.json();
    
    let textContent = "";
    if (data.output) {
      for (const item of data.output) {
        if (item.type === "message" && item.content) {
          for (const part of item.content) {
            if (part.type === "output_text") {
              textContent += part.text;
            }
          }
        }
      }
    }
    
    if (!textContent && data.output_text) {
      textContent = data.output_text;
    }

    if (!textContent) {
      console.error("No content in response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No content returned from AI");
    }

    textContent = textContent.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      console.error("Invalid JSON from AI:", textContent.slice(0, 500));
      throw new Error("AI returned invalid JSON");
    }

    return new Response(
      JSON.stringify({ content: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Deep dive error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
