import { motion } from "framer-motion";
import { categories, defaultCards } from "@/data/cardData";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Subtle metallic gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[hsl(220_14%_88%)] to-transparent blur-[150px] opacity-60" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[hsl(220_10%_85%)] to-transparent blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/60 border border-border mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--metal-steel))] animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">Live · March 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight leading-[1.05] mb-5">
            <span className="metal-text">The AI Ecosystem</span>
            <br />
            <span className="text-muted-foreground font-light">Explorer</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
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
          className="flex justify-center gap-8 sm:gap-12 md:gap-16"
        >
          {[
            { value: totalTools + "+", label: "AI Tools" },
            { value: totalCategories, label: "Categories" },
            { value: "2026", label: "Updated" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold metal-text">{stat.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};
