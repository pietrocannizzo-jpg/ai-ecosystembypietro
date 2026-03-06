import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CardData, SubProduct, TimelineEntry } from "@/data/cardData";
import { cards as defaultCards } from "@/data/cardData";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async (): Promise<CardData[]> => {
      try {
        const { data: cards, error } = await supabase
          .from("cards")
          .select("*, sub_products(*), timeline_entries(*)")
          .order("title");

        if (error) throw error;

        const mapped: CardData[] = (cards || []).map((c) => {
          // Find matching local card to get new fields not yet in DB
          const localMatch = defaultCards.find((lc) => lc.id === (c.slug || c.id));
          return {
            id: c.slug || c.id,
            title: c.title,
            icon: c.icon || "🔧",
            category: c.category,
            subcategory: c.subcategory || "",
            color: c.color,
            summary: c.summary || "",
            pricing: localMatch?.pricing,
            price: localMatch?.price,
            bestFor: localMatch?.bestFor,
            modelUsed: localMatch?.modelUsed,
            quickstart: localMatch?.quickstart,
            tags: c.tags || [],
            links: c.links || [],
            subProducts: (c.sub_products || [])
              .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((sp: any): SubProduct => ({
                name: sp.name,
                icon: sp.icon || "📦",
                description: sp.description || "",
                releaseDate: sp.release_date || undefined,
              })),
            timeline: (c.timeline_entries || [])
              .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((te: any): TimelineEntry => ({
                date: te.date,
                description: te.description,
                type: (te.entry_type as TimelineEntry["type"]) || "update",
              })),
            positionX: c.position_x || 0,
            positionY: c.position_y || 0,
          };
        });

        // If Supabase returned data, merge with local defaults (local data takes priority for matching IDs)
        if (mapped.length > 0) {
          const dbIds = new Set(mapped.map((c) => c.id));
          const localOnly = defaultCards.filter((c) => !dbIds.has(c.id));
          return [...mapped, ...localOnly];
        }

        // Fallback to local data if Supabase is empty
        return defaultCards;
      } catch {
        // If Supabase fails entirely, use local data
        console.warn("Supabase unavailable, using local card data");
        return defaultCards;
      }
    },
    // Retry once on failure before falling back
    retry: 1,
    retryDelay: 1000,
  });
}

interface AddToolInput {
  title: string;
  icon: string;
  category: string;
  subcategory: string;
  color: string;
  summary: string;
  tags: string[];
  links: string[];
}

export function useAddTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddToolInput) => {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { error } = await supabase.from("cards").insert({
        slug,
        title: input.title,
        icon: input.icon,
        category: input.category,
        subcategory: input.subcategory,
        color: input.color,
        summary: input.summary,
        tags: input.tags,
        links: input.links,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}
