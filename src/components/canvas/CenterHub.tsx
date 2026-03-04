import { motion } from "framer-motion";
import { categories } from "@/data/cardData";

interface CenterHubProps {
  centerX: number;
  centerY: number;
}

export const CenterHub = ({ centerX, centerY }: CenterHubProps) => {
  return (
    <>
      {/* Central node */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ left: centerX - 60, top: centerY - 60, width: 120, height: 120 }}
        animate={{
          boxShadow: [
            "0 0 30px hsl(210 90% 55% / 0.3)",
            "0 0 60px hsl(210 90% 55% / 0.5)",
            "0 0 30px hsl(210 90% 55% / 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-full h-full rounded-full border-2 border-foreground/20 backdrop-blur-sm flex flex-col items-center justify-center" style={{ background: "hsl(230 20% 11% / 0.9)" }}>
          <span className="text-3xl">🧠</span>
          <span className="text-[10px] font-display font-bold text-foreground mt-1">Knowledge Map</span>
        </div>
      </motion.div>

      {/* Branch lines to category clusters */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: 5000, height: 4000 }}>
        {categories.map(cat => {
          const leftCats = categories.filter(c => c.side === "left");
          const rightCats = categories.filter(c => c.side === "right");
          
          let catAngle: number;
          if (cat.side === "left") {
            const idx = leftCats.findIndex(c => c.id === cat.id);
            catAngle = (150 + (idx + 1) * (120 / (leftCats.length + 1))) * (Math.PI / 180);
          } else {
            const idx = rightCats.findIndex(c => c.id === cat.id);
            catAngle = (-60 + (idx + 1) * (120 / (rightCats.length + 1))) * (Math.PI / 180);
          }
          
          const radius = 800;
          const endX = centerX + Math.cos(catAngle) * radius;
          const endY = centerY + Math.sin(catAngle) * radius;
          
          return (
            <line
              key={cat.id}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke={cat.color}
              strokeWidth={1.5}
              strokeOpacity={0.15}
              strokeDasharray="8 4"
            />
          );
        })}
      </svg>

      {/* Category labels at cluster centers */}
      {categories.map(cat => {
        const leftCats = categories.filter(c => c.side === "left");
        const rightCats = categories.filter(c => c.side === "right");
        
        let catAngle: number;
        if (cat.side === "left") {
          const idx = leftCats.findIndex(c => c.id === cat.id);
          catAngle = (150 + (idx + 1) * (120 / (leftCats.length + 1))) * (Math.PI / 180);
        } else {
          const idx = rightCats.findIndex(c => c.id === cat.id);
          catAngle = (-60 + (idx + 1) * (120 / (rightCats.length + 1))) * (Math.PI / 180);
        }
        
        const radius = 800;
        const x = centerX + Math.cos(catAngle) * radius;
        const y = centerY + Math.sin(catAngle) * radius;
        
        return (
          <div
            key={cat.id}
            className="absolute flex items-center gap-2 pointer-events-none"
            style={{ left: x - 80, top: y - 50, width: 160 }}
          >
            <div
              className="w-full text-center font-display font-bold text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm"
              style={{
                color: cat.color,
                background: `${cat.color}10`,
                border: `1px solid ${cat.color}30`,
              }}
            >
              {cat.label}
            </div>
          </div>
        );
      })}
    </>
  );
};
