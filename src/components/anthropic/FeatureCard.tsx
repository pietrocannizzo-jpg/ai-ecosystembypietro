import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { AnthropicFeature } from "@/data/anthropicData";
import { statusConfig } from "@/data/anthropicData";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  feature: AnthropicFeature;
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const status = statusConfig[feature.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.03, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="group relative rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-display font-semibold text-foreground leading-tight">
          {feature.title}
        </h3>
        <span
          className="shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
          style={{ color: status.color, background: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {feature.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {feature.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[9px] px-1.5 py-0 h-4 font-mono"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">
            {new Date(feature.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          {feature.link && (
            <a
              href={feature.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
