import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/cardData";
import { getLogoUrl } from "@/data/companyLogos";

interface MapCardProps {
  card: CardData;
  dimmed: boolean;
  onClick: () => void;
}

export const MapCard = ({ card, dimmed, onClick }: MapCardProps) => {
  const maxSummaryLen = 80;
  const truncatedSummary = card.summary.length > maxSummaryLen
    ? card.summary.slice(0, maxSummaryLen) + "…"
    : card.summary;

  const logoUrl = getLogoUrl(card.id);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [logoUrl, card.id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: dimmed ? 0.2 : 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute w-[300px] cursor-pointer group"
      style={{ left: card.positionX, top: card.positionY }}
    >
      <div
        className="rounded-xl backdrop-blur-md border transition-all duration-300 p-4 hover:translate-y-[-2px]"
        style={{
          background: `linear-gradient(135deg, ${card.color}10, ${card.color}05)`,
          borderColor: `${card.color}40`,
          borderLeftWidth: "4px",
          borderLeftColor: card.color,
          boxShadow: `0 4px 20px ${card.color}10`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 30px ${card.color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 4px 20px ${card.color}10`;
        }}
      >
        {/* Title row */}
        <div className="flex items-center gap-2 mb-2">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={`${card.title} logo`}
              className="w-6 h-6 rounded object-contain bg-white/10"
              onError={() => setLogoError(true)}
              loading="lazy"
            />
          ) : (
            <span className="text-xl">{card.icon}</span>
          )}
          <h3 className="font-display font-bold text-base text-white leading-tight truncate">
            {card.title}
          </h3>
        </div>
        
        {/* Subcategory badge */}
        <span
          className="inline-block text-xs font-mono px-2.5 py-1 rounded-full mb-2"
          style={{
            background: `${card.color}20`,
            color: card.color,
          }}
        >
          {card.subcategory}
        </span>
        
        {/* Summary */}
        <p className="text-xs text-white/70 leading-relaxed mb-3">
          {truncatedSummary}
        </p>
        
        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="text-[9px] font-mono text-white/60">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
