import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // 3D tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      rotateX: (y - 0.5) * -12,
      rotateY: (x - 0.5) * 12,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const staggerDelay = (index % 4) * 0.08;
  const glowColor = cat?.color || card.color;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.94 }}
      transition={{
        delay: staggerDelay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-shadow duration-300 relative"
      style={{
        boxShadow: isHovered 
          ? `0 0 20px ${glowColor}10, 0 8px 25px hsl(30 10% 60% / 0.12)`
          : "var(--shadow-metal)",
        transform: `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: isHovered ? "box-shadow 0.3s ease" : "transform 0.4s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Mouse-following glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 150px at ${glowPos.x}% ${glowPos.y}%, ${glowColor}12, transparent 70%)`,
        }}
      />

      {/* Shine edge on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          border: `1px solid ${glowColor}25`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Top row: logo + category */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={`${card.title} logo`}
                className="w-10 h-10 rounded-lg object-contain bg-muted/50 p-1 border border-border/50"
                onError={() => setLogoError(true)}
                loading="lazy"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border border-border/50"
                style={{ background: `${card.color}10` }}
              >
                {card.icon}
              </div>
            )}
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                {card.title}
              </h3>
              <span
                className="text-[10px] font-mono transition-all duration-300"
                style={{ 
                  color: cat?.color || card.color,
                  textShadow: isHovered ? `0 0 8px ${glowColor}60` : "none",
                }}
              >
                {card.subcategory}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Badge */}
        {card.pricing && (
          <div className="mb-2">
            <span
              className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
              style={{
                background: card.pricing === 'free' ? 'hsl(142 71% 45% / 0.12)'
                  : card.pricing === 'freemium' ? 'hsl(180 70% 45% / 0.12)'
                  : card.pricing === 'paid' ? 'hsl(25 95% 53% / 0.12)'
                  : card.pricing === 'open-source' ? 'hsl(270 70% 60% / 0.12)'
                  : 'hsl(var(--muted) / 0.5)',
                color: card.pricing === 'free' ? 'hsl(142 71% 55%)'
                  : card.pricing === 'freemium' ? 'hsl(180 70% 55%)'
                  : card.pricing === 'paid' ? 'hsl(25 95% 63%)'
                  : card.pricing === 'open-source' ? 'hsl(270 70% 70%)'
                  : 'hsl(var(--muted-foreground))',
                borderColor: card.pricing === 'free' ? 'hsl(142 71% 45% / 0.25)'
                  : card.pricing === 'freemium' ? 'hsl(180 70% 45% / 0.25)'
                  : card.pricing === 'paid' ? 'hsl(25 95% 53% / 0.25)'
                  : card.pricing === 'open-source' ? 'hsl(270 70% 60% / 0.25)'
                  : 'hsl(var(--border))',
              }}
            >
              {card.price || card.pricing}
            </span>
          </div>
        )}

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {card.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40 transition-colors duration-300 group-hover:border-border"
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
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              {card.subProducts.length} product{card.subProducts.length !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] text-muted-foreground/40">·</span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {card.timeline.length} events
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
