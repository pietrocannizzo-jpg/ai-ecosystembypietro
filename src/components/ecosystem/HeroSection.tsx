import { motion } from "framer-motion";
import { categories, cards as defaultCards } from "@/data/cardData";
import { SolarSystem } from "./SolarSystem";

export const HeroSection = () => {
  const totalTools = defaultCards.length;
  const totalCategories = categories.length;

  return (
    <section className="relative pt-16 sm:pt-24 pb-0 px-4 sm:px-6 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(180 80% 50% / 0.2), transparent)" }}
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
            className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Navigate the fast-moving world of AI — from LLMs to video generators, coding agents to automation tools.
          </motion.p>
        </motion.div>
      </div>

      {/* Spline 3D scene + orbiting logos layered on top */}
      <motion.div
        className="relative w-full mt-4 sm:mt-6"
        style={{ height: "clamp(350px, 50vw, 550px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        {/* Spline background — 3D character + rings */}
        <iframe
          src="https://my.spline.design/aidatamodelinteraction-v0VxG82TxlqsZUtdViIz43Vd/"
          frameBorder="0"
          width="100%"
          height="100%"
          title="AI Ecosystem 3D Scene"
          style={{ border: "none", display: "block", position: "absolute", inset: 0 }}
          allow="autoplay"
        />

        {/* Logo orbits layered over the Spline scene */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SolarSystem />
        </div>

        {/* Edge fades to blend into page */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 80, background: "linear-gradient(to bottom, hsl(222 47% 7%), transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 100, background: "linear-gradient(to top, hsl(222 47% 7%), transparent)" }}
        />
        <div
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{ width: 80, background: "linear-gradient(to right, hsl(222 47% 7%), transparent)" }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 pointer-events-none"
          style={{ width: 80, background: "linear-gradient(to left, hsl(222 47% 7%), transparent)" }}
        />
        {/* Hide Spline badge */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{ width: 200, height: 50, background: "hsl(222 47% 7%)" }}
        />
      </motion.div>

      {/* Stats row */}
      <div className="relative z-10 max-w-5xl mx-auto text-center" style={{ marginTop: -30 }}>
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
              <div className={`text-2xl sm:text-3xl md:text-4xl font-display font-bold metal-text ${stat.glow}`}>
                {stat.value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-6 mb-8 text-[10px] font-mono tracking-wider text-muted-foreground/40"
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
