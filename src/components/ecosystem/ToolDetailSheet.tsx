import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import type { CardData } from "@/data/cardData";
import { getLogoUrl } from "@/data/companyLogos";
import { categories } from "@/data/cardData";

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

export const ToolDetailSheet = ({ card, open, onClose }: ToolDetailSheetProps) => {
  const [logoError, setLogoError] = useState(false);
  if (!card) return null;

  const logoUrl = getLogoUrl(card.id);
  const cat = categories.find((c) => c.id === card.category);

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
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

        <ScrollArea className="h-[calc(100vh-120px)]">
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
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
