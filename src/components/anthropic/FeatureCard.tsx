import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { AnthropicFeature } from "@/data/anthropicData";
import { statusConfig } from "@/data/anthropicData";

interface FeatureCardProps {
  feature: AnthropicFeature;
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const status = statusConfig[feature.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: index * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="group relative rounded-lg border border-border/80 bg-card p-5 hover:border-foreground/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <h3 className="text-[15px] font-display font-semibold text-foreground leading-snug">
          {feature.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: status.dotColor }}
          />
          <span className="text-[11px] font-mono text-muted-foreground">
            {status.label}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
        {feature.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {feature.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-muted-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-muted-foreground">
            {new Date(feature.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          {feature.link && (
            <a
              href={feature.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
