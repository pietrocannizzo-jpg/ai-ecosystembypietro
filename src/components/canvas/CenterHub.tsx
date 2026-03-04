import { motion } from "framer-motion";
import { categories } from "@/data/cardData";

interface CenterHubProps {
  centerX: number;
  centerY: number;
}

export const CenterHub = ({ centerX, centerY }: CenterHubProps) => {
  // Orbital ring radii — one per category, evenly spaced
  const ringStart = 800;
  const ringSpacing = 550;

  return (
    <>
      {/* Orbital rings */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: 12000, height: 12000 }}
      >
        {categories.map((cat, i) => {
          const r = ringStart + i * ringSpacing;
          return (
            <circle
              key={cat.id}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke={cat.color}
              strokeWidth={1}
              strokeOpacity={0.08}
              strokeDasharray="6 8"
            />
          );
        })}
      </svg>

      {/* Category labels on each ring */}
      {categories.map((cat, i) => {
        const r = ringStart + i * ringSpacing;
        // Place label at top of ring
        const labelAngle = -Math.PI / 2 - 0.3; // slightly offset from top
        const lx = centerX + Math.cos(labelAngle) * r;
        const ly = centerY + Math.sin(labelAngle) * r;

        return (
          <div
            key={`label-${cat.id}`}
            className="absolute pointer-events-none"
            style={{ left: lx - 130, top: ly - 22, width: 260 }}
          >
            <div
              className="text-center rounded-full backdrop-blur-md px-5 py-2"
              style={{
                background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)`,
                border: `1px solid ${cat.color}35`,
                boxShadow: `0 2px 16px ${cat.color}15`,
              }}
            >
              <span
                className="font-display font-bold text-sm tracking-wide"
                style={{ color: cat.color }}
              >
                {cat.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Center hub — minimal animated icon */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          left: centerX - 70,
          top: centerY - 70,
          width: 140,
          height: 140,
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 40px 8px hsl(230 60% 50% / 0.15)",
              "0 0 70px 16px hsl(230 60% 50% / 0.25)",
              "0 0 40px 8px hsl(230 60% 50% / 0.15)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            borderImage: "linear-gradient(135deg, hsl(230 60% 50% / 0.4), transparent, hsl(280 60% 50% / 0.3), transparent) 1",
          }}
        />
        {/* Core */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 40% 35%, hsl(230 25% 18%), hsl(230 20% 10%))",
            border: "1px solid hsl(230 30% 25% / 0.6)",
          }}
        >
          <motion.span
            className="text-5xl select-none"
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 8px hsl(230 80% 60% / 0.3))",
                "drop-shadow(0 0 16px hsl(230 80% 60% / 0.5))",
                "drop-shadow(0 0 8px hsl(230 80% 60% / 0.3))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🧠
          </motion.span>
        </div>
      </motion.div>
    </>
  );
};
