import { motion } from "framer-motion";
import { categories, cards as defaultCards } from "@/data/cardData";
import { SolarSystem3D } from "./SolarSystem3D";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-16 sm:pt-24 pb-0 px-4 sm:px-6 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-10"
          style={{ background: "radial-gradient(circle, hsl(38 70% 48% / 0.3), transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/60 border border-border mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
              Live · March 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-4">
            <span className="metal-text">The AI Ecosystem</span>
            <br />
            <motion.span
              className="inline-block text-neon-cyan text-glow-cyan font-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Explorer
            </motion.span>
          </h1>

          <motion.p
            className="text-[11px] font-mono tracking-wider text-primary/50 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            by Pietro Cannizzo · Beta Version
          </motion.p>

          <motion.p
            className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Navigate the fast-moving world of AI — from LLMs to video generators, coding agents to automation tools.
          </motion.p>
        </motion.div>
      </div>

      {/* 3D Solar System */}
      <motion.div
        className="relative w-full mt-4 sm:mt-6 rounded-2xl overflow-hidden"
        style={{ height: "clamp(350px, 50vw, 550px)", background: "linear-gradient(180deg, #0a0e1e, #0d1225)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <SolarSystem3D />

        {/* Edge fades — blend into the dark container */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 80, background: "linear-gradient(to bottom, #0a0e1e, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 80, background: "linear-gradient(to top, #0d1225, transparent)" }}
        />
      </motion.div>

      {/* Stats row — placed below the dark container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center mt-8 sm:mt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-8 sm:gap-12 md:gap-16"
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
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-6 mb-8 text-[10px] font-mono tracking-wider text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          by Pietro Cannizzo
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </section>
  );
};
