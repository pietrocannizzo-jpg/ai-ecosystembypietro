import { useState } from "react";
import { motion } from "framer-motion";
import { aiCategories } from "@/data/aiTools";
import { MindMapNode } from "./MindMapNode";

export const MindMap = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const totalTools = aiCategories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-amber/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-3">
            AI Tools{" "}
            <span className="text-primary text-glow-cyan">Universe</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono">
            Tracking{" "}
            <span className="text-primary font-semibold">{totalTools}</span>{" "}
            tools across{" "}
            <span className="text-secondary font-semibold">
              {aiCategories.length}
            </span>{" "}
            categories
          </p>
        </motion.div>

        {/* Central Hub */}
        <div className="relative flex justify-center mb-12">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px hsl(170 80% 50% / 0.2)",
                "0 0 40px hsl(170 80% 50% / 0.3)",
                "0 0 20px hsl(170 80% 50% / 0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center"
          >
            <span className="text-3xl">🌐</span>
          </motion.div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCategories.map((category, i) => (
            <MindMapNode
              key={category.id}
              category={category}
              isExpanded={expanded === category.id}
              onToggle={() => toggle(category.id)}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-muted-foreground text-xs font-mono mt-16"
        >
          Click a category to explore tools • Last updated March 2026
        </motion.p>
      </div>
    </div>
  );
};
