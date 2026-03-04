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
    const { toolName, toolSummary, toolCategory, subProducts, tags } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const subProductList = (subProducts || [])
      .map((sp: { name: string; description: string }) => `- ${sp.name}: ${sp.description}`)
      .join("\n");

    const systemPrompt = `You are an expert AI industry analyst. You MUST respond with valid JSON only — no markdown, no code fences, no extra text.

CRITICAL ACCURACY RULES:
- You are given a curated list of this tool's known products/models below. ONLY discuss those products. Do NOT invent, assume, or hallucinate products that are not in the list.
- If the product list is empty, focus on the tool's general capabilities based on its summary and category.
- If you are unsure about a detail, say "information not confirmed" rather than guessing.
- Do NOT make up release dates, pricing, or version numbers.

Respond with this exact JSON structure:
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
  ]
}

Rules for each section:
- "models": One entry per product from the provided list. If no products listed, return empty array.
- "differences": One entry per product explaining what makes it unique. Match the products list exactly.
- "useCases": 4-6 specific, actionable recommendations.
- "proTips": 2-3 insider tips.`;

    const userPrompt = `Analyze: **${toolName}**

Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}

KNOWN PRODUCTS/MODELS (use ONLY these, do not add others):
${subProductList || "None listed — focus on general tool capabilities instead."}

Return valid JSON only.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    // Validate JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Invalid JSON from AI:", content);
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
