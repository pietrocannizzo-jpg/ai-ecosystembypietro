import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolName, toolSummary, toolCategory, subProducts, tags, links } = await req.json();

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

    const prompt = `You are an expert AI industry analyst with access to web search. Today is ${today}. Your job is to produce a COMPREHENSIVE, UP-TO-THE-MINUTE research briefing on the following AI tool.

TOOL: ${toolName}
Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}

KNOWN PRODUCTS (from our curated database — verify and expand on these):
${subProductList || "None listed"}

OFFICIAL LINKS TO CHECK:
${officialLinks || "None listed"}

RESEARCH INSTRUCTIONS — BE THOROUGH:
1. Search the web EXTENSIVELY for ${toolName}. Run multiple searches:
   - "${toolName} latest news ${today.slice(0, 7)}"
   - "${toolName} new features announcements"
   - "${toolName} changelog updates"
   - "${toolName} blog announcements"
   - "${toolName} security updates"
   - "${toolName} API changes"
   - "${toolName} pricing changes"
2. Check the company's official blog, changelog, and documentation pages.
3. Look for NEW product launches, feature releases, partnerships, security features, SDK updates, developer tools, integrations, and policy changes from the LAST 30 DAYS especially.
4. Cross-reference our known products list. Confirm which are current, flag outdated ones, and add ALL new products/features we're missing.
5. Be factual. Include exact dates. Cite sources with URLs when possible.

Respond with ONLY valid JSON (no markdown fences) in this exact structure:
{
  "models": [
    { "name": "string", "bestFor": "string", "speed": "Fast|Medium|Slow", "costTier": "Free|Low|Medium|High|Enterprise", "keyStrength": "string" }
  ],
  "differences": [
    { "name": "string", "description": "string" }
  ],
  "useCases": [
    { "title": "string", "description": "string" }
  ],
  "proTips": [
    { "tip": "string" }
  ],
  "recentNews": [
    { "date": "YYYY-MM-DD", "headline": "string", "summary": "string", "source": "string", "url": "string" }
  ],
  "missingFromDatabase": [
    { "name": "string", "description": "string", "releaseDate": "string" }
  ]
}

Rules:
- "models": One entry per major product/model/API. Include speed and cost estimates.
- "differences": What makes each product unique in plain English.
- "useCases": 4-6 specific, actionable recommendations.
- "proTips": 3-5 insider tips including latest best practices.
- "recentNews": 5-10 most recent developments. Prioritize the LAST 30 DAYS. Include feature launches, security updates, SDK releases, blog posts, partnerships. Each entry MUST have a date, headline, short summary, source name, and URL.
- "missingFromDatabase": ALL products, features, tools, SDKs, or capabilities you found that are NOT in our known products list above.`;

    // Use OpenAI Responses API with web search (with retry)
    let response: Response | null = null;
    let lastStatus: number | null = null;
    let lastErrorText = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 2000 * attempt)); // 2s, 4s backoff
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

      // Non-retryable error
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

        // Return 200 with structured error so frontend handles it gracefully without runtime crash
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
    
    // Extract text content from Responses API output
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
    
    // Fallback to output_text if available
    if (!textContent && data.output_text) {
      textContent = data.output_text;
    }

    if (!textContent) {
      console.error("No content in response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No content returned from AI");
    }

    // Strip markdown code fences if present
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
