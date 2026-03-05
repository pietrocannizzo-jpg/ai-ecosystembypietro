import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const prompt = `You are an expert AI industry analyst with access to web search. Research the following AI tool using official documentation and recent news.

TOOL: ${toolName}
Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}

KNOWN PRODUCTS (from our curated database — verify and expand on these):
${subProductList || "None listed"}

OFFICIAL LINKS TO CHECK:
${officialLinks || "None listed"}

INSTRUCTIONS:
1. Search the web for the LATEST information about ${toolName}, focusing on:
   - Official documentation and changelogs
   - Recent product announcements and releases
   - Model/product specifications and comparisons
2. Cross-reference our known products list above. Confirm which are current, note any that are outdated, and add any NEW products we're missing.
3. Be factual. Include dates. Cite what you find.

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
    { "date": "string", "headline": "string", "source": "string" }
  ],
  "missingFromDatabase": [
    { "name": "string", "description": "string", "releaseDate": "string" }
  ]
}

Rules:
- "models": One entry per major product/model. Include speed and cost estimates.
- "differences": What makes each product unique in plain English.
- "useCases": 4-6 specific recommendations.
- "proTips": 2-3 insider tips.
- "recentNews": 3-5 most recent developments with approximate dates and sources.
- "missingFromDatabase": Products/features you found that are NOT in our known products list above. This helps us keep our database current.`;

    // Use OpenAI Responses API with web search (with retry)
    let response: Response | null = null;
    let lastError = "";
    
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, 2000 * attempt)); // 2s, 4s backoff
      }

      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          tools: [{ 
            type: "web_search_preview",
            search_context_size: "low"
          }],
          input: prompt,
        }),
      });

      if (response.ok) break;
      
      if (response.status === 429) {
        lastError = "Rate limited, retrying...";
        console.log(`Attempt ${attempt + 1}: rate limited, waiting...`);
        continue;
      }
      
      // Non-retryable error
      break;
    }

    if (!response || !response.ok) {
      if (response?.status === 429) {
        return new Response(
          JSON.stringify({ error: "OpenAI rate limit exceeded. Please wait a minute and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = response ? await response.text() : "No response";
      console.error("OpenAI API error:", response?.status, errorText);
      throw new Error(`OpenAI API error: ${response?.status}`);
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
