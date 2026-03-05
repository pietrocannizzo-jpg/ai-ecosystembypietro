import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Sparkles, Info } from "lucide-react";
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

const typeIcons: Record<string, string> = {
  launch: "🚀",
  update: "🔄",
  funding: "💰",
  milestone: "🏆",
};

type TabType = "overview" | "deepdive";

export const ToolDetailSheet = ({ card, open, onClose }: ToolDetailSheetProps) => {
  const [logoError, setLogoError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [deepDiveData, setDeepDiveData] = useState<any>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState(false);
  const [deepDiveCardId, setDeepDiveCardId] = useState<string | null>(null);

  if (!card) return null;

  const logoUrl = getLogoUrl(card.id);
  const cat = categories.find((c) => c.id === card.category);

  const fetchDeepDive = async (forceRegenerate = false) => {
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
          // Handle both old markdown format and new JSON format
          if (content.models) {
            setDeepDiveData(content);
          } else {
            // Old format — regenerate
            setDeepDiveData(null);
          }
          if (content.models) {
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

      // Cache it
      supabase
        .from("tool_deep_dives")
        .upsert({ card_id: card.id, content: content, updated_at: new Date().toISOString() }, { onConflict: "card_id" })
        .then(() => {});
    } catch (err: any) {
      console.error("Deep dive error:", err);
      toast({ title: "Error", description: "Failed to generate deep dive. Try again.", variant: "destructive" });
    } finally {
      setDeepDiveLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "deepdive") {
      fetchDeepDive();
    }
  };

  // Reset tab when card changes
  const handleOpenChange = () => {
    setActiveTab("overview");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
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

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => handleTabChange("overview")}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Info className="w-3 h-3" />
              Overview
            </button>
            <button
              onClick={() => handleTabChange("deepdive")}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "deepdive"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={
                activeTab === "deepdive"
                  ? { background: `${card.color}15`, color: card.color }
                  : undefined
              }
            >
              <Sparkles className="w-3 h-3" />
              Deep Dive
            </button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          {activeTab === "overview" ? (
            <div className="px-6 py-5 space-y-6">
              {/* Summary */}
              <p className="text-sm text-foreground/80 leading-relaxed">{card.summary}</p>

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

              {/* Timeline */}
              {card.timeline.length > 0 && (
                <div>
                  <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider mb-3">
                    Timeline
                  </h4>
                  <div className="relative pl-5 space-y-3">
                    <div
                      className="absolute left-[7px] top-1 bottom-1 w-px"
                      style={{ background: `${card.color}20` }}
                    />
                    {[...card.timeline]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((entry, i) => (
                        <div key={i} className="relative flex items-start gap-3">
                          <div
                            className="absolute -left-3 top-1.5 w-2 h-2 rounded-full"
                            style={{ background: card.color }}
                          />
                          <span
                            className="text-[10px] font-mono font-semibold shrink-0 min-w-[52px]"
                            style={{ color: card.color }}
                          >
                            {entry.date}
                          </span>
                          <span className="text-xs shrink-0">{typeIcons[entry.type] || "📌"}</span>
                          <p className="text-xs text-foreground/70 leading-relaxed">{entry.description}</p>
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

              {/* Deep Dive CTA */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTabChange("deepdive")}
                  className="w-full gap-2 font-mono text-xs border-dashed"
                  style={{ borderColor: `${card.color}30`, color: card.color }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate AI Deep Dive
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5">
              <DeepDiveContent
                loading={deepDiveLoading}
                data={deepDiveData}
                color={card.color}
                toolName={card.title}
                onRetry={() => fetchDeepDive()}
                onRegenerate={() => fetchDeepDive(true)}
              />
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
