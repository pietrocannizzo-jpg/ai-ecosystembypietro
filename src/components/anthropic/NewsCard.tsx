import { motion } from "framer-motion";
import { ExternalLink, Rocket, FlaskConical, Shield, Handshake, DollarSign } from "lucide-react";
import type { AnthropicNews, NewsType } from "@/data/anthropicData";

const typeIcons: Record<NewsType, typeof Rocket> = {
  release: Rocket,
  research: FlaskConical,
  policy: Shield,
  partnership: Handshake,
  pricing: DollarSign,
};

const typeColors: Record<NewsType, string> = {
  release: "hsl(168 30% 38%)",
  research: "hsl(260 18% 50%)",
  policy: "hsl(350 28% 50%)",
  partnership: "hsl(210 25% 48%)",
  pricing: "hsl(30 50% 50%)",
};

interface NewsCardProps {
  item: AnthropicNews;
  index: number;
}

export const NewsCard = ({ item, index }: NewsCardProps) => {
  const Icon = typeIcons[item.type];
  const color = typeColors[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group flex gap-4 py-4 border-b border-border/60 last:border-0"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-display font-semibold text-foreground">
            {item.title}
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0 pt-0.5">
            {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.summary}
        </p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-mono text-accent hover:underline"
          >
            Read more <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
