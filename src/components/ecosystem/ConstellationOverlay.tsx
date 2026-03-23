import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CardData, Connection } from "@/data/cardData";
import { categories } from "@/data/cardData";

interface ConstellationOverlayProps {
  cards: CardData[];
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  label: string;
  sourceId: string;
  targetId: string;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  "uses-model": "uses model",
  "built-by": "built by",
  "competes-with": "competes with",
  "integrates": "integrates",
  "acquired-by": "acquired by",
  "powers": "powers",
  "built-on": "built on",
};

export const ConstellationOverlay = ({ cards, enabled, containerRef }: ConstellationOverlayProps) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const computeLines = useCallback(() => {
    if (!containerRef.current || !enabled) {
      setLines([]);
      return;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLines: Line[] = [];
    const seen = new Set<string>();

    cards.forEach((card) => {
      if (!card.connections) return;
      const sourceEl = container.querySelector(`[data-card-id="${card.id}"]`);
      if (!sourceEl) return;

      const cat = categories.find((c) => c.id === card.category);

      card.connections.forEach((conn) => {
        const pairKey = [card.id, conn.targetId].sort().join("--");
        if (seen.has(pairKey)) return;
        seen.add(pairKey);

        const targetEl = container.querySelector(`[data-card-id="${conn.targetId}"]`);
        if (!targetEl) return;

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        newLines.push({
          id: `${card.id}--${conn.targetId}`,
          x1: sourceRect.left + sourceRect.width / 2 - containerRect.left,
          y1: sourceRect.top + sourceRect.height / 2 - containerRect.top,
          x2: targetRect.left + targetRect.width / 2 - containerRect.left,
          y2: targetRect.top + targetRect.height / 2 - containerRect.top,
          color: cat?.color || card.color,
          label: RELATIONSHIP_LABELS[conn.relationship] || conn.relationship,
          sourceId: card.id,
          targetId: conn.targetId,
        });
      });
    });

    setLines(newLines);
  }, [cards, enabled, containerRef]);

  useEffect(() => {
    if (!enabled) {
      setLines([]);
      return;
    }
    // Compute after layout settles
    const timer = setTimeout(computeLines, 300);
    window.addEventListener("resize", computeLines);
    window.addEventListener("scroll", computeLines, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", computeLines);
      window.removeEventListener("scroll", computeLines, true);
    };
  }, [enabled, computeLines]);

  const handleLineMouseMove = useCallback((e: React.MouseEvent, lineId: string) => {
    setHoveredLine(lineId);
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  if (!enabled || lines.length === 0) return null;

  const hoveredLineData = lines.find((l) => l.id === hoveredLine);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: "visible" }}
    >
      <defs>
        {lines.map((line) => (
          <filter key={`glow-${line.id}`} id={`glow-${line.id}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {lines.map((line) => {
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2;
        // Offset control point perpendicular to the line
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const curvature = Math.min(len * 0.15, 60);
        const cx = midX + (-dy / len) * curvature;
        const cy = midY + (dx / len) * curvature;

        const path = `M ${line.x1} ${line.y1} Q ${cx} ${cy} ${line.x2} ${line.y2}`;
        const isHovered = hoveredLine === line.id;
        const pathLen = len * 1.1; // approx

        return (
          <g key={line.id}>
            {/* Invisible wider hit area */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              className="pointer-events-auto cursor-pointer"
              onMouseMove={(e) => handleLineMouseMove(e, line.id)}
              onMouseLeave={() => setHoveredLine(null)}
            />
            {/* Visible line */}
            <motion.path
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth={isHovered ? 2 : 1}
              strokeOpacity={isHovered ? 0.6 : 0.2}
              strokeLinecap="round"
              filter={isHovered ? `url(#glow-${line.id})` : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ strokeDasharray: pathLen, strokeDashoffset: 0 }}
            />
            {/* Small dots at endpoints */}
            <motion.circle
              cx={line.x1} cy={line.y1} r={isHovered ? 3 : 2}
              fill={line.color}
              fillOpacity={isHovered ? 0.7 : 0.3}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            />
            <motion.circle
              cx={line.x2} cy={line.y2} r={isHovered ? 3 : 2}
              fill={line.color}
              fillOpacity={isHovered ? 0.7 : 0.3}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            />
          </g>
        );
      })}

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredLineData && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <rect
              x={tooltipPos.x - 60}
              y={tooltipPos.y - 32}
              width={120}
              height={24}
              rx={6}
              fill="hsl(var(--popover))"
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={tooltipPos.x}
              y={tooltipPos.y - 16}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="11"
              fontFamily="var(--font-mono, monospace)"
            >
              {hoveredLineData.label}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
};
