import { motion } from "framer-motion";
import { categories, cards as defaultCards } from "@/data/cardData";
import heroCircuit from "@/assets/hero-circuit.jpg";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Circuit board background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroCircuit}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.25]"
          style={{
            maskImage: "radial-gradient(ellipse 70% 80% at 50% 40%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 40%, black 20%, transparent 70%)",
          }}
        />
        {/* Warm glow from the chip center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-40"
          style={{ background: "radial-gradient(circle, hsl(45 90% 55% / 0.3), hsl(170 80% 50% / 0.1), transparent)" }}
        />
        {/* Secondary glow */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ background: "hsl(260 70% 60% / 0.3)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/60 border border-border mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">Live · March 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight leading-[1.05] mb-5">
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
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Navigate the fast-moving world of AI — from LLMs to video generators, coding agents to automation tools.
            <br className="hidden sm:block" />
            <span className="text-foreground/70 font-medium">{totalTools} tools</span> across{" "}
            <span className="text-foreground/70 font-medium">{totalCategories} categories</span>, explained simply.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-8 sm:gap-12 md:gap-16"
        >
          {[
            { value: totalTools + "+", label: "AI Tools", glow: "text-glow-cyan" },
            { value: totalCategories, label: "Categories", glow: "text-glow-purple" },
            { value: "2026", label: "Updated", glow: "text-glow-amber" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
            >
              <div className={`text-2xl sm:text-3xl md:text-4xl font-display font-bold metal-text ${stat.glow}`}>{stat.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative line with glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </section>
  );
};
