import { motion } from "framer-motion";
import { categories, cards as defaultCards } from "@/data/cardData";
import { SolarSystem3D } from "./SolarSystem3D";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-20 sm:pt-28 pb-0 px-4 sm:px-6 overflow-hidden">
      {/* Light-mode hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary border border-border mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
              Live · March 2026
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.08] mb-5">
            <span className="text-foreground">The AI Ecosystem</span>
            <br />
            <motion.span
              className="inline-block text-accent font-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Explorer
            </motion.span>
          </h1>

          <motion.p
            className="text-[11px] font-mono tracking-wider text-muted-foreground/60 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            by Pietro Cannizzo · Beta
          </motion.p>

          <motion.p
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Navigate the fast-moving world of AI — from LLMs to video generators, coding agents to automation tools.
          </motion.p>
        </motion.div>
      </div>

      {/* 3D Solar System — dark zone fading into cream */}
      <div className="relative mt-10">
        {/* Top edge: cream blends into dark */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background via-background/60 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="relative w-full dark-zone"
          style={{ height: "clamp(350px, 50vw, 550px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <SolarSystem3D />
        </motion.div>

        {/* Bottom edge: dark fades smoothly into cream */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[hsl(220,15%,6%,0.4)] to-background z-10 pointer-events-none" />
      </div>

      {/* Stats row */}
      <div className="relative z-10 max-w-5xl mx-auto text-center -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-10 sm:gap-14 md:gap-20"
        >
          {[
            { value: totalTools + "+", label: "AI Tools" },
            { value: totalCategories, label: "Categories" },
            { value: "2026", label: "Updated" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-8 mb-10 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          by Pietro Cannizzo
        </motion.p>
      </div>
    </section>
  );
};
