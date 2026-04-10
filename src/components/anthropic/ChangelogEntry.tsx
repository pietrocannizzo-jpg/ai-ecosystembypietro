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
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0"
    >
      <span className="text-[11px] font-mono text-muted-foreground w-20 shrink-0 pt-0.5">
        {new Date(feature.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </span>
      <div
        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ background: status.dotColor }}
      />
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-display font-medium text-foreground">
          {feature.title}
        </span>
        <span className="text-[13px] text-muted-foreground ml-2">
          — {feature.description.slice(0, 80)}{feature.description.length > 80 ? "…" : ""}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: status.dotColor }}
        />
        <span className="text-[10px] font-mono text-muted-foreground">
          {status.label}
        </span>
      </div>
    </motion.div>
  );
};
