import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DeepDiveContent } from "@/components/ecosystem/DeepDiveContent";
import type { CardData } from "@/data/cardData";

interface Props {
  card: CardData;
}

export const ToolDetailDeepDive = ({ card }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadedCardId, setLoadedCardId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const cardDbId = card.dbId || card.id;

  useEffect(() => {
    if (cardDbId !== loadedCardId) {
      fetchDeepDive(false);
    }
  }, [cardDbId]);

  const fetchDeepDive = async (forceRegenerate = false) => {
    if (!forceRegenerate && loadedCardId === cardDbId && data) return;

    setLoading(true);
    setData(null);

    try {
      // Always try cache first
      if (!forceRegenerate) {
        const { data: cached } = await supabase
          .from("tool_deep_dives")
          .select("content")
          .eq("card_id", cardDbId)
          .maybeSingle();

        if (cached?.content) {
          const content = cached.content as any;
          if (content.models) {
            setData(content);
            setLoadedCardId(cardDbId);
            setLoading(false);
            return;
          }
        }
      }

      // Only call edge function if user is authenticated
      if (!isAuthenticated) {
        setLoading(false);
        if (forceRegenerate) {
          toast({ title: "Sign in required", description: "Please sign in to generate AI analysis.", variant: "destructive" });
        }
        return;
      }

      const { data: result, error } = await supabase.functions.invoke("tool-deep-dive", {
        body: {
          toolName: card.title,
          toolSummary: card.summary,
          toolCategory: card.category,
          subProducts: card.subProducts.map((sp) => ({ name: sp.name, description: sp.description })),
          tags: card.tags,
          links: card.links,
        },
      });

      if (error) throw error;
      if (result?.error) {
        toast({ title: "AI Error", description: result.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      const content = result.content;
      setData(content);
      setLoadedCardId(card.id);

      supabase
        .from("tool_deep_dives")
        .upsert({ card_id: card.id, content, updated_at: new Date().toISOString() }, { onConflict: "card_id" })
        .then(() => {});
    } catch (err: any) {
      console.error("Deep dive error:", err);
      toast({ title: "Error", description: "Failed to generate analysis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeepDiveContent
      loading={loading}
      data={data}
      color={card.color}
      toolName={card.title}
      timeline={card.timeline}
      onRetry={() => fetchDeepDive()}
      onRegenerate={() => fetchDeepDive(true)}
    />
  );
};
