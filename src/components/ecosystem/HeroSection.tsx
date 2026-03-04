import { motion } from "framer-motion";
import { categories, defaultCards } from "@/data/cardData";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-20 pb-16 px-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary">Live · March 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            The AI Ecosystem
            <br />
            <span className="text-primary text-glow-cyan">Explorer</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Navigate the fast-moving world of AI — from LLMs to video generators, coding agents to automation tools.
            <br className="hidden sm:block" />
            <span className="text-foreground/70 font-medium">{totalTools} tools</span> across{" "}
            <span className="text-foreground/70 font-medium">{totalCategories} categories</span>, explained simply.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center gap-8 md:gap-12"
        >
          {[
            { value: totalTools + "+", label: "AI Tools" },
            { value: totalCategories, label: "Categories" },
            { value: "2026", label: "Updated" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
