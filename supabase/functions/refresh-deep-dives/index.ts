import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // --- Auth check: require authenticated user ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Admin secret check: prevent any registered user from triggering batch refresh ---
    const adminSecret = req.headers.get("X-Admin-Token");
    const expectedSecret = Deno.env.get("ADMIN_SECRET");
    if (!adminSecret || !expectedSecret || adminSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Forbidden — admin access required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use admin client for data operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all cards with their sub-products
    const { data: cards, error: cardsError } = await supabase
      .from("cards")
      .select("id, title, category, summary, tags, links");

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) {
      return new Response(JSON.stringify({ message: "No cards found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: allSubProducts } = await supabase
      .from("sub_products")
      .select("card_id, name, description");

    let refreshed = 0;
    let errors = 0;

    for (const card of cards) {
      try {
        const subProducts = (allSubProducts || [])
          .filter((sp) => sp.card_id === card.id)
          .map((sp) => ({ name: sp.name, description: sp.description }));

        // Call the deep dive function, forwarding the auth header
        const { data, error } = await supabase.functions.invoke("tool-deep-dive", {
          body: {
            toolName: card.title,
            toolSummary: card.summary,
            toolCategory: card.category,
            subProducts,
            tags: card.tags,
            links: card.links,
          },
          headers: {
            Authorization: authHeader,
          },
        });

        if (error || data?.error) {
          console.error(`Error refreshing ${card.title}:`, error || data?.error);
          errors++;
          continue;
        }

        // Cache the result
        await supabase
          .from("tool_deep_dives")
          .upsert(
            {
              card_id: card.id,
              content: data.content,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "card_id" }
          );

        refreshed++;
        console.log(`Refreshed: ${card.title}`);

        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        console.error(`Failed to refresh ${card.title}:`, err);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ message: `Refreshed ${refreshed} tools, ${errors} errors` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Refresh error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
