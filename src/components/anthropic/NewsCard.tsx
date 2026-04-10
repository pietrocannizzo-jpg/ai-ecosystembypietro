import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { AnthropicNews, NewsType } from "@/data/anthropicData";

const typeLabels: Record<NewsType, string> = {
  release: "Release",
  research: "Research",
  policy: "Policy",
  partnership: "Partnership",
  pricing: "Pricing",
  announcement: "Announcement",
  product: "Product",
  enterprise: "Enterprise",
  "claude-code": "Claude Code",
};

interface NewsCardProps {
  item: AnthropicNews;
  index: number;
}

export const NewsCard = ({ item, index }: NewsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group py-5 border-b border-border/50 last:border-0"
    >
      <div className="flex items-start gap-4">
        <span className="text-[11px] font-mono text-muted-foreground w-24 shrink-0 pt-0.5">
          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
              {typeLabels[item.type]}
            </span>
          </div>

          <h3 className="text-[15px] font-display font-semibold text-foreground mb-1 leading-snug">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline decoration-foreground/30 underline-offset-2 inline-flex items-center gap-1.5"
              >
                {item.title}
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              item.title
            )}
          </h3>

          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {item.summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
