import { useState } from "react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/cardData";
import { getLogoUrl } from "@/data/companyLogos";
import { categories } from "@/data/cardData";

interface ToolCardProps {
  card: CardData;
  index: number;
  onClick: () => void;
}

export const ToolCard = ({ card, index, onClick }: ToolCardProps) => {
  const logoUrl = getLogoUrl(card.id);
  const [logoError, setLogoError] = useState(false);
  const cat = categories.find((c) => c.id === card.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35 }}
      layout
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
    >
      {/* Top row: logo + category */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={`${card.title} logo`}
              className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1"
              onError={() => setLogoError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: `${card.color}15` }}
            >
              {card.icon}
            </div>
          )}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
              {card.title}
            </h3>
            <span
              className="text-[10px] font-mono"
              style={{ color: cat?.color || card.color }}
            >
              {card.subcategory}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {card.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {card.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {card.tags.length > 3 && (
          <span className="text-[10px] font-mono text-muted-foreground/50">
            +{card.tags.length - 3}
          </span>
        )}
      </div>

      {/* Sub-products count */}
      {card.subProducts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">
            {card.subProducts.length} product{card.subProducts.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] text-muted-foreground/40">·</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {card.timeline.length} events
          </span>
        </div>
      )}
    </motion.div>
  );
};
