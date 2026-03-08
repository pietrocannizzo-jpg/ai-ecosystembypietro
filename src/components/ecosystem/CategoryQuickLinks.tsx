import { motion } from "framer-motion";
import { categories } from "@/data/cardData";
import { 
  MessageSquare, Code, Image, Video, Music, Bot, Zap, AppWindow, TrendingUp 
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "llm-chatbots": MessageSquare,
  "coding-tools": Code,
  "image-generation": Image,
  "video-generation": Video,
  "audio-music": Music,
  "agents-infrastructure": Bot,
  "automations": Zap,
  "ai-powered-apps": AppWindow,
  "ai-market-overview": TrendingUp,
};

interface CategoryQuickLinksProps {
  onSelect: (categoryId: string) => void;
  activeCategory: string | null;
}

export const CategoryQuickLinks = ({ onSelect, activeCategory }: CategoryQuickLinksProps) => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mb-4"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
          Browse by category
        </span>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((cat, i) => {
          const Icon = categoryIcons[cat.id] || Bot;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onSelect(isActive ? null as any : cat.id);
                // Smooth scroll to results
                setTimeout(() => {
                  document.getElementById("tool-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-primary/40 shadow-md"
                  : "border-border/60 bg-card/60 hover:border-primary/25 hover:bg-card"
              }`}
              style={
                isActive
                  ? {
                      background: `${cat.color}12`,
                      borderColor: `${cat.color}40`,
                      boxShadow: `0 0 15px ${cat.color}15`,
                    }
                  : undefined
              }
            >
              <Icon
                className="w-3.5 h-3.5 shrink-0 transition-colors"
                style={{ color: isActive ? cat.color : undefined }}
              />
              <span
                className={`text-[11px] font-mono whitespace-nowrap transition-colors ${
                  isActive ? "" : "text-muted-foreground"
                }`}
                style={isActive ? { color: cat.color } : undefined}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
