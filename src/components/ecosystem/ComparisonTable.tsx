import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, DollarSign, Target, Cpu, Rocket } from "lucide-react";
import type { CardData } from "@/data/cardData";
import type { CategoryDef } from "@/data/cardData";

interface ComparisonTableProps {
  category: CategoryDef;
  cards: CardData[];
}

export const ComparisonTable = ({ category, cards }: ComparisonTableProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.title.localeCompare(b.title)),
    [cards]
  );

  if (cards.length < 2) return null;

  const pricingColor = (pricing?: string) => {
    switch (pricing) {
      case "free": return "hsl(142 71% 55%)";
      case "freemium": return "hsl(180 70% 55%)";
      case "paid": return "hsl(25 95% 63%)";
      case "open-source": return "hsl(270 70% 70%)";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  const pricingBg = (pricing?: string) => {
    switch (pricing) {
      case "free": return "hsl(142 71% 45% / 0.1)";
      case "freemium": return "hsl(180 70% 45% / 0.1)";
      case "paid": return "hsl(25 95% 53% / 0.1)";
      case "open-source": return "hsl(270 70% 60% / 0.1)";
      default: return "transparent";
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group ml-5"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
        <span className="uppercase tracking-wider">Compare {cards.length} tools</span>
        <div
          className="h-px flex-1 max-w-[100px] transition-all"
          style={{ background: `linear-gradient(90deg, ${category.color}30, transparent)` }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 ml-5 rounded-xl border border-border/50 bg-card/50 overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-[180px]">Tool</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" />Pricing</div>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Target className="w-3 h-3" />Best For</div>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Cpu className="w-3 h-3" />Model</div>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-[80px]">
                      <div className="flex items-center gap-1.5"><Rocket className="w-3 h-3" />Try It</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCards.map((card, i) => (
                    <tr
                      key={card.id}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{card.icon}</span>
                          <div>
                            <span className="text-xs font-semibold text-foreground block">{card.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{card.subcategory}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {card.pricing ? (
                          <span
                            className="inline-flex text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
                            style={{
                              background: pricingBg(card.pricing),
                              color: pricingColor(card.pricing),
                              borderColor: `${pricingColor(card.pricing)}40`,
                            }}
                          >
                            {card.price || card.pricing}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 font-mono">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-foreground/70 line-clamp-1">
                          {card.bestFor || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-foreground/70">
                          {card.modelUsed || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {card.quickstart ? (
                          <a
                            href={card.quickstart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md border border-border/50 text-primary hover:bg-muted/60 transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            Go
                          </a>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
