import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, DollarSign, Target, Cpu } from "lucide-react";
import { getLogoUrl } from "@/data/companyLogos";
import { cardData } from "@/data/cardData";
import type { CardData } from "@/data/cardData";

const pricingColorMap: Record<string, { bg: string; text: string; border: string }> = {
  free:          { bg: "hsl(142 71% 45% / 0.12)", text: "hsl(142 71% 55%)", border: "hsl(142 71% 45% / 0.25)" },
  freemium:      { bg: "hsl(180 70% 45% / 0.12)", text: "hsl(180 70% 55%)", border: "hsl(180 70% 45% / 0.25)" },
  paid:          { bg: "hsl(25 95% 53% / 0.12)",  text: "hsl(25 95% 63%)",  border: "hsl(25 95% 53% / 0.25)" },
  "open-source": { bg: "hsl(270 70% 60% / 0.12)", text: "hsl(270 70% 70%)", border: "hsl(270 70% 60% / 0.25)" },
};

interface ToolCardProps {
  tool: CardData;
  isCurrent: boolean;
  currentColor: string;
}

const CompetitorCard = ({ tool, isCurrent, currentColor }: ToolCardProps) => {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getLogoUrl(tool.id);
  const pricingStyle = tool.pricing ? pricingColorMap[tool.pricing] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isCurrent ? {} : { scale: 1.01 }}
      onClick={() => !isCurrent && navigate(`/tool/${tool.id}`)}
      className="relative rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200"
      style={{
        borderColor: isCurrent ? currentColor : "hsl(var(--border) / 0.5)",
        background: isCurrent ? `${currentColor}08` : "hsl(var(--card) / 0.5)",
        boxShadow: isCurrent ? `0 0 18px -4px ${currentColor}50, 0 0 1px 0px ${currentColor}80` : "none",
        cursor: isCurrent ? "default" : "pointer",
      }}
    >
      {isCurrent && (
        <span
          className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{ color: currentColor, borderColor: `${currentColor}40`, background: `${currentColor}15` }}
        >
          This tool
        </span>
      )}

      {/* Logo + name */}
      <div className="flex items-center gap-2.5">
        {logoUrl && !logoError ? (
          <img
            src={logoUrl}
            alt={`${tool.title} logo`}
            className="w-8 h-8 rounded-lg object-contain border border-border/40 bg-muted/40 p-1 shrink-0"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base border border-border/40 shrink-0"
            style={{ background: `${tool.color}15` }}
          >
            {tool.icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground font-display truncate">{tool.title}</p>
          <p className="text-[10px] font-mono text-muted-foreground truncate">{tool.subcategory}</p>
        </div>
      </div>

      {/* Pricing */}
      {pricingStyle && (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border self-start"
          style={{ background: pricingStyle.bg, borderColor: pricingStyle.border }}
        >
          <DollarSign className="w-3 h-3" style={{ color: pricingStyle.text }} />
          <span className="text-[10px] font-mono font-semibold" style={{ color: pricingStyle.text }}>
            {tool.price || tool.pricing}
          </span>
        </div>
      )}

      {/* Best For */}
      {tool.bestFor && (
        <div className="flex items-start gap-1.5">
          <Target className="w-3 h-3 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">Best For</span>
            <span className="text-xs text-foreground leading-snug">{tool.bestFor}</span>
          </div>
        </div>
      )}

      {/* Model */}
      {tool.modelUsed && (
        <div className="flex items-start gap-1.5">
          <Cpu className="w-3 h-3 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">Model</span>
            <span className="text-xs text-foreground leading-snug">{tool.modelUsed}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface Props {
  card: CardData;
}

import { useState } from "react";

export const HowItCompares = ({ card }: Props) => {
  const competitors = cardData
    .filter((c) => c.category === card.category && c.id !== card.id)
    .slice(0, 2);

  if (competitors.length === 0) return null;

  const allTools = [card, ...competitors];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.color }} />
        <Zap className="w-3.5 h-3.5" style={{ color: card.color }} />
        <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">
          How It Compares
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">{allTools.length} tools</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {allTools.map((tool) => (
          <CompetitorCard
            key={tool.id}
            tool={tool}
            isCurrent={tool.id === card.id}
            currentColor={card.color}
          />
        ))}
      </div>
    </motion.div>
  );
};
