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

    const systemPrompt = `You are an expert AI industry analyst. When given an AI tool/company, provide a comprehensive structured breakdown. Be factual, concise, and insightful. Use markdown formatting.

Your response MUST follow this exact structure:

## 📊 Model Comparison
Create a markdown table comparing the tool's main models/products with columns: Model | Best For | Speed | Cost Tier | Context/Limit | Key Strength

## 💬 What Makes Each Different
For each major model/version, write 1-2 sentences explaining what sets it apart in plain English. Use bullet points.

## 📰 Recent Developments  
List 3-5 of the most notable recent developments, releases, or changes. Include approximate dates where possible. Be specific.

## 🎯 Best Use Cases
Provide 4-6 specific, actionable use case recommendations in bullet points. Format: "**Use Case**: explanation of why this tool excels here"

## 💡 Pro Tips
2-3 insider tips for getting the most out of this tool that most people don't know about.`;

    const userPrompt = `Give me a deep dive breakdown of: **${toolName}**

Category: ${toolCategory}
Summary: ${toolSummary || "N/A"}
Tags: ${(tags || []).join(", ") || "N/A"}
Known Products/Models:
${subProductList || "None listed"}

Provide a thorough, up-to-date analysis following the required structure.`;

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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    return new Response(
      JSON.stringify({ content }),
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
