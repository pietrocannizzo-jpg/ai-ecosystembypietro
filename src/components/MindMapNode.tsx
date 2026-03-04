import { motion, AnimatePresence } from "framer-motion";
import type { AICategory } from "@/data/aiTools";

const colorMap = {
  cyan: {
    bg: "bg-neon-cyan/10",
    border: "border-neon-cyan/40",
    text: "text-neon-cyan",
    glow: "glow-cyan",
    hoverBg: "hover:bg-neon-cyan/20",
    dot: "bg-neon-cyan",
  },
  purple: {
    bg: "bg-neon-purple/10",
    border: "border-neon-purple/40",
    text: "text-neon-purple",
    glow: "glow-purple",
    hoverBg: "hover:bg-neon-purple/20",
    dot: "bg-neon-purple",
  },
  amber: {
    bg: "bg-neon-amber/10",
    border: "border-neon-amber/40",
    text: "text-neon-amber",
    glow: "glow-amber",
    hoverBg: "hover:bg-neon-amber/20",
    dot: "bg-neon-amber",
  },
  rose: {
    bg: "bg-neon-rose/10",
    border: "border-neon-rose/40",
    text: "text-neon-rose",
    glow: "glow-rose",
    hoverBg: "hover:bg-neon-rose/20",
    dot: "bg-neon-rose",
  },
  green: {
    bg: "bg-neon-green/10",
    border: "border-neon-green/40",
    text: "text-neon-green",
    glow: "glow-green",
    hoverBg: "hover:bg-neon-green/20",
    dot: "bg-neon-green",
  },
  blue: {
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/40",
    text: "text-neon-blue",
    glow: "glow-blue",
    hoverBg: "hover:bg-neon-blue/20",
    dot: "bg-neon-blue",
  },
};

interface MindMapNodeProps {
  category: AICategory;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const MindMapNode = ({ category, isExpanded, onToggle, index }: MindMapNodeProps) => {
  const colors = colorMap[category.color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      className="flex flex-col items-center"
    >
      {/* Category Node */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`
          relative flex items-center gap-3 px-6 py-4 rounded-2xl border-2 cursor-pointer
          transition-all duration-300 backdrop-blur-sm
          ${colors.bg} ${colors.border} ${colors.hoverBg}
          ${isExpanded ? colors.glow : ""}
        `}
      >
        <span className="text-2xl">{category.icon}</span>
        <span className={`font-display font-semibold text-lg ${colors.text}`}>
          {category.label}
        </span>
        <span className={`font-mono text-xs ${colors.text} opacity-60`}>
          {category.tools.length}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className={`text-sm ${colors.text}`}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Tool List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden mt-3 w-full"
          >
            <div className={`rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm p-3 space-y-1`}>
              {category.tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${colors.hoverBg} transition-colors group cursor-default`}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.dot} mt-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity`} />
                  <div className="min-w-0">
                    <p className={`font-medium text-sm ${colors.text}`}>{tool.name}</p>
                    {tool.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
