import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Sparkles, DollarSign, Target, Cpu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CardData } from "@/data/cardData";
import { getLogoUrl } from "@/data/companyLogos";
import { categories } from "@/data/cardData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DeepDiveContent } from "./DeepDiveContent";

interface ToolDetailSheetProps {
  card: CardData | null;
  open: boolean;
  onClose: () => void;
}

export const ToolDetailSheet = ({ card, open, onClose }: ToolDetailSheetProps) => {
  const [logoError, setLogoError] = useState(false);
  const [deepDiveData, setDeepDiveData] = useState<any>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState(false);
  const [deepDiveCardId, setDeepDiveCardId] = useState<string | null>(null);

  // Auto-load deep dive when sheet opens
  useEffect(() => {
    if (open && card && deepDiveCardId !== card.id) {
      fetchDeepDive(false);
    }
    if (!open) {
      setLogoError(false);
    }
  }, [open, card?.id]);

  if (!card) return null;

  const logoUrl = getLogoUrl(card.id);
  const cat = categories.find((c) => c.id === card.category);

  const fetchDeepDive = async (forceRegenerate = false) => {
    if (!card) return;
    if (!forceRegenerate && deepDiveCardId === card.id && deepDiveData) return;

    setDeepDiveLoading(true);
    setDeepDiveData(null);

    try {
      if (!forceRegenerate) {
        const { data: cached } = await supabase
          .from("tool_deep_dives")
          .select("content")
          .eq("card_id", card.id)
          .maybeSingle();

        if (cached?.content) {
          const content = cached.content as any;
          if (content.models) {
            setDeepDiveData(content);
            setDeepDiveCardId(card.id);
            setDeepDiveLoading(false);
            return;
          }
        }
      }

      const { data, error } = await supabase.functions.invoke("tool-deep-dive", {
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
      if (data?.error) {
        toast({ title: "AI Error", description: data.error, variant: "destructive" });
        setDeepDiveLoading(false);
        return;
      }

      const content = data.content;
      setDeepDiveData(content);
      setDeepDiveCardId(card.id);

      supabase
        .from("tool_deep_dives")
        .upsert({ card_id: card.id, content: content, updated_at: new Date().toISOString() }, { onConflict: "card_id" })
        .then(() => {});
    } catch (err: any) {
      console.error("Deep dive error:", err);
      toast({ title: "Error", description: "Failed to generate analysis. Try again.", variant: "destructive" });
    } finally {
      setDeepDiveLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg border-l border-border bg-background p-0 [&>button]:top-4 [&>button]:right-4">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <SheetHeader>
            <div className="flex items-center gap-4">
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${card.title} logo`}
                  className="w-12 h-12 rounded-xl object-contain bg-muted/50 p-1.5 border border-border/50"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-border/50"
                  style={{ background: `${card.color}10` }}
                >
                  {card.icon}
                </div>
              )}
              <div>
                <SheetTitle className="text-lg font-display font-bold text-foreground">
                  {card.title}
                </SheetTitle>
                <SheetDescription asChild>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ background: `${card.color}10`, borderColor: `${card.color}25`, color: card.color }}
                    >
                      {card.subcategory}
                    </span>
                    {cat && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {cat.label}
                      </span>
                    )}
                  </div>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-6 py-5 space-y-6">
            {/* Summary */}
            <p className="text-sm text-foreground/80 leading-relaxed">{card.summary}</p>

            {/* Quick Info Strip */}
            {(card.pricing || card.bestFor || card.modelUsed) && (
              <div className="space-y-2">
                {card.pricing && (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
                    style={{
                      background: card.pricing === 'free' ? 'hsl(142 71% 45% / 0.08)'
                        : card.pricing === 'freemium' ? 'hsl(180 70% 45% / 0.08)'
                        : card.pricing === 'paid' ? 'hsl(25 95% 53% / 0.08)'
                        : card.pricing === 'open-source' ? 'hsl(270 70% 60% / 0.08)'
                        : 'transparent',
                      borderColor: card.pricing === 'free' ? 'hsl(142 71% 45% / 0.2)'
                        : card.pricing === 'freemium' ? 'hsl(180 70% 45% / 0.2)'
                        : card.pricing === 'paid' ? 'hsl(25 95% 53% / 0.2)'
                        : card.pricing === 'open-source' ? 'hsl(270 70% 60% / 0.2)'
                        : 'hsl(var(--border))',
                    }}
                  >
                    <DollarSign className="w-3.5 h-3.5 shrink-0" style={{
                      color: card.pricing === 'free' ? 'hsl(142 71% 55%)'
                        : card.pricing === 'freemium' ? 'hsl(180 70% 55%)'
                        : card.pricing === 'paid' ? 'hsl(25 95% 63%)'
                        : card.pricing === 'open-source' ? 'hsl(270 70% 70%)'
                        : 'hsl(var(--muted-foreground))',
                    }} />
                    <span className="text-xs font-mono font-semibold" style={{
                      color: card.pricing === 'free' ? 'hsl(142 71% 55%)'
                        : card.pricing === 'freemium' ? 'hsl(180 70% 55%)'
                        : card.pricing === 'paid' ? 'hsl(25 95% 63%)'
                        : card.pricing === 'open-source' ? 'hsl(270 70% 70%)'
                        : 'hsl(var(--muted-foreground))',
                    }}>
                      {card.price || card.pricing}
                    </span>
                  </div>
                )}
                {card.bestFor && (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
                    <Target className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Best for: </span>
                      <span className="text-xs text-foreground">{card.bestFor}</span>
                    </div>
                  </div>
                )}
                {card.modelUsed && (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
                    <Cpu className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Model: </span>
                      <span className="text-xs text-foreground">{card.modelUsed}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Get Started Button */}
            {card.quickstart && (
              <a
                href={card.quickstart}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 border hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: `${card.color}15`,
                  borderColor: `${card.color}30`,
                  color: card.color,
                }}
              >
                <Rocket className="w-3.5 h-3.5" />
                Get Started
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            )}

            {/* Tags */}
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `${card.color}20`,
                      color: card.color,
                      background: `${card.color}06`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Sub-Products */}
            {card.subProducts.length > 0 && (
              <div>
                <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider mb-3">
                  Products & Features
                </h4>
                <div className="space-y-2">
                  {[...card.subProducts]
                    .sort((a, b) => {
                      if (!a.releaseDate && !b.releaseDate) return 0;
                      if (!a.releaseDate) return 1;
                      if (!b.releaseDate) return -1;
                      return a.releaseDate.localeCompare(b.releaseDate);
                    })
                    .map((sp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50"
                      >
                        <span className="text-base shrink-0 mt-0.5">{sp.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{sp.name}</span>
                            {sp.releaseDate && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/30">
                                {sp.releaseDate}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{sp.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Links */}
            {card.links.length > 0 && (
              <div>
                <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider mb-3">
                  Resources
                </h4>
                <div className="space-y-1.5">
                  {card.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 text-primary hover:bg-muted/60 transition-colors group"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="truncate">{link.replace(/^https?:\/\//, "")}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Divider + AI Analysis */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" style={{ color: card.color }} />
                  AI Analysis
                </span>
              </div>
            </div>

            {/* Deep Dive Content (auto-loaded) */}
            <DeepDiveContent
              loading={deepDiveLoading}
              data={deepDiveData}
              color={card.color}
              toolName={card.title}
              timeline={card.timeline}
              onRetry={() => fetchDeepDive()}
              onRegenerate={() => fetchDeepDive(true)}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
