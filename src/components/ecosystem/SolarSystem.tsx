import { useMemo } from "react";
import { getLogoUrl } from "@/data/companyLogos";

interface OrbitTool {
  id: string;
  label: string;
  logo: string | null;
  color: string;
}

const orbitConfig: { radius: number; duration: number; tools: { id: string; label: string; color: string }[] }[] = [
  {
    radius: 72,
    duration: 28,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 120,
    duration: 40,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#ffffff" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 175,
    duration: 55,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#f0f0f0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#ffffff" },
      { id: "langchain", label: "LangChain", color: "#1c3c3c" },
    ],
  },
  {
    radius: 235,
    duration: 72,
    tools: [
      { id: "suno", label: "Suno", color: "#1db954" },
      { id: "deepseek", label: "DeepSeek", color: "#4d6bfe" },
      { id: "stable-diffusion", label: "Stability", color: "#bf5af2" },
      { id: "github-copilot", label: "Copilot", color: "#ffffff" },
      { id: "make", label: "Make", color: "#6d00cc" },
      { id: "sora", label: "Sora", color: "#ffffff" },
    ],
  },
];

export const SolarSystem = () => {
  const orbits = useMemo(
    () =>
      orbitConfig.map((orbit) => ({
        ...orbit,
        tools: orbit.tools.map((t) => ({
          ...t,
          logo: getLogoUrl(t.id),
        })) as OrbitTool[],
      })),
    []
  );

  const size = 540;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: size, aspectRatio: "1", perspective: "800px" }}
    >
      <style>{`
        ${orbits
          .map(
            (_, i) => `
          @keyframes orbit-spin-${i} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes orbit-unspin-${i} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(-360deg); }
          }
        `
          )
          .join("")}
        .solar-planet {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .solar-planet:hover {
          transform: scale(1.35) translateZ(10px) !important;
        }
        .solar-planet:hover .planet-tooltip {
          opacity: 1;
        }
      `}</style>

      {/* Orbit rings as SVG */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 w-full h-full"
      >
        {orbits.map((orbit, i) => (
          <ellipse
            key={`ring-${i}`}
            cx={cx}
            cy={cy}
            rx={orbit.radius}
            ry={orbit.radius * 0.42}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}
      </svg>

      {/* Center character — glowing sphere with face */}
      <div
        className="absolute z-10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 90,
            height: 90,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsl(190 100% 65% / 0.25), transparent 70%)",
            filter: "blur(15px)",
          }}
        />
        {/* Sphere body */}
        <div
          className="relative rounded-full"
          style={{
            width: 52,
            height: 52,
            background: "radial-gradient(circle at 35% 30%, #e8f4f8 0%, #8ecae6 40%, #4aa8c7 70%, #2b7a99 100%)",
            boxShadow: "0 0 30px 8px hsl(190 80% 55% / 0.3), inset 0 -6px 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(255,255,255,0.4)",
          }}
        >
          {/* Face — two eyes */}
          <div className="absolute flex gap-2.5" style={{ top: "42%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <div className="w-2 h-2.5 rounded-full bg-gray-800" style={{ borderRadius: "40% 40% 50% 50%" }} />
            <div className="w-2 h-2.5 rounded-full bg-gray-800" style={{ borderRadius: "40% 40% 50% 50%" }} />
          </div>
          {/* Subtle highlight */}
          <div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 6,
              top: 8,
              left: 14,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
        </div>
      </div>

      {/* Orbiting tools */}
      {orbits.map((orbit, orbitIdx) =>
        orbit.tools.map((tool, toolIdx) => {
          const startAngle = (360 / orbit.tools.length) * toolIdx;
          const planetSize = orbitIdx <= 1 ? 36 : 32;

          return (
            <div
              key={tool.id}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                animation: `orbit-spin-${orbitIdx} ${orbit.duration}s linear infinite`,
                animationDelay: `-${(orbit.duration / orbit.tools.length) * toolIdx}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  transform: `rotate(${startAngle}deg) translateX(${orbit.radius}px) scaleY(0.42)`,
                  transformOrigin: "0 0",
                }}
              >
                <div
                  style={{
                    animation: `orbit-unspin-${orbitIdx} ${orbit.duration}s linear infinite`,
                    animationDelay: `-${(orbit.duration / orbit.tools.length) * toolIdx}s`,
                    transform: `rotate(-${startAngle}deg) scaleY(${1 / 0.42})`,
                  }}
                >
                  <div
                    className="solar-planet relative cursor-pointer"
                    style={{
                      width: planetSize,
                      height: planetSize,
                      marginLeft: -planetSize / 2,
                      marginTop: -planetSize / 2,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 30%, ${tool.color}40 0%, ${tool.color}18 50%, rgba(0,0,0,0.6) 100%)`,
                      boxShadow: `
                        0 0 14px 3px ${tool.color}25,
                        inset 0 -3px 6px rgba(0,0,0,0.3),
                        inset 0 2px 4px ${tool.color}30
                      `,
                      border: `1px solid ${tool.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {tool.logo ? (
                      <img
                        src={tool.logo}
                        alt={tool.label}
                        className="w-5 h-5 object-contain"
                        style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))" }}
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[8px] font-bold text-white/70">
                        {tool.label.slice(0, 2)}
                      </span>
                    )}
                    {/* Tooltip */}
                    <div
                      className="planet-tooltip absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[9px] font-mono whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200"
                      style={{
                        background: "rgba(0,0,0,0.85)",
                        border: `1px solid ${tool.color}40`,
                        color: tool.color === "#000" || tool.color === "#1c3c3c" ? "#ccc" : tool.color,
                        boxShadow: `0 0 8px ${tool.color}20`,
                      }}
                    >
                      {tool.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
