import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CardData } from "@/data/cardData";

interface CardDetailModalProps {
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

export const CardDetailModal = ({ card, open, onClose }: CardDetailModalProps) => {
  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 border-0 overflow-hidden bg-card">
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: `2px solid ${card.color}40` }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{card.icon}</span>
              <div>
                <DialogTitle className="text-xl font-display font-bold text-foreground">
                  {card.title}
                </DialogTitle>
                <DialogDescription>
                  <span
                    className="inline-block text-xs font-mono px-2 py-0.5 rounded-full mt-1"
                    style={{ background: `${card.color}20`, color: card.color }}
                  >
                    {card.subcategory}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[65vh]">
          <div className="px-6 pb-6 space-y-6">
            {/* Summary */}
            <div>
              <p className="text-sm text-foreground/80 leading-relaxed">{card.summary}</p>
            </div>

            {/* Sub-Products */}
            {card.subProducts.length > 0 && (
              <div>
                <h4 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: card.color }} />
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
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <span className="text-lg shrink-0">{sp.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{sp.name}</p>
                          {sp.releaseDate && (
                            <span className="text-[10px] font-mono text-muted-foreground">
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
                <h4 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: card.color }} />
                  Timeline
                </h4>
                <div className="relative pl-6 space-y-3">
                  {/* Vertical line */}
                  <div
                    className="absolute left-2 top-1 bottom-1 w-px"
                    style={{ background: `${card.color}30` }}
                  />
                  {[...card.timeline].sort((a, b) => a.date.localeCompare(b.date)).map((entry, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div
                        className="absolute -left-4 top-1.5 w-2 h-2 rounded-full border-2"
                        style={{ borderColor: card.color, background: `${card.color}40` }}
                      />
                      <span
                        className="text-xs font-mono font-semibold shrink-0 min-w-[60px]"
                        style={{ color: card.color }}
                      >
                        {entry.date}
                      </span>
                      <span className="text-sm shrink-0">{typeIcons[entry.type] || "📌"}</span>
                      <p className="text-xs text-foreground/70">{entry.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {card.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-display font-semibold text-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-1 rounded-full"
                      style={{ background: `${card.color}15`, color: card.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
