import { motion } from "framer-motion";
import type { AnthropicFeature } from "@/data/anthropicData";
import { statusConfig } from "@/data/anthropicData";

interface ChangelogEntryProps {
  feature: AnthropicFeature;
  index: number;
}

export const ChangelogEntry = ({ feature, index }: ChangelogEntryProps) => {
  const status = statusConfig[feature.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0"
    >
      <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0 pt-0.5">
        {new Date(feature.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </span>
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
        style={{ background: status.color }}
      />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-display font-medium text-foreground">
          {feature.title}
        </span>
        <span className="text-xs text-muted-foreground ml-2">
          — {feature.description.slice(0, 80)}{feature.description.length > 80 ? "…" : ""}
        </span>
      </div>
      <span
        className="text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
        style={{ color: status.color, background: status.bg }}
      >
        {status.label}
      </span>
    </motion.div>
  );
};
