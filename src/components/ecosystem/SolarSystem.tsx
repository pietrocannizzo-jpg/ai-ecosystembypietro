import { useMemo } from "react";
import { getLogoUrl } from "@/data/companyLogos";

interface OrbitTool {
  id: string;
  label: string;
  logo: string | null;
  color: string;
}

// Pick a representative spread of tools across categories for each ring
const orbitConfig: { radius: number; duration: number; tools: { id: string; label: string; color: string }[] }[] = [
  {
    radius: 80,
    duration: 30,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 135,
    duration: 45,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#fff" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 195,
    duration: 60,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#f0f0f0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#fff" },
      { id: "langchain", label: "LangChain", color: "#1c3c3c" },
    ],
  },
  {
    radius: 260,
    duration: 80,
    tools: [
      { id: "suno", label: "Suno", color: "#000" },
      { id: "deepseek", label: "DeepSeek", color: "#4d6bfe" },
      { id: "stable-diffusion", label: "Stability", color: "#bf5af2" },
      { id: "github-copilot", label: "Copilot", color: "#fff" },
      { id: "make", label: "Make", color: "#6d00cc" },
      { id: "sora", label: "Sora", color: "#fff" },
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

  const size = 600;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: size, aspectRatio: "1" }}
    >
      {/* CSS keyframes for each orbit */}
      <style>{`
        ${orbits
          .map(
            (_, i) => `
          @keyframes orbit-${i} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes counter-orbit-${i} {
            from { transform: rotate(0deg); }
            to   { transform: rotate(-360deg); }
          }
        `
          )
          .join("")}
      `}</style>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Orbit rings */}
        {orbits.map((orbit, i) => (
          <ellipse
            key={`ring-${i}`}
            cx={cx}
            cy={cy}
            rx={orbit.radius}
            ry={orbit.radius * 0.45}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Center glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, hsl(180 90% 60% / 0.8), hsl(180 90% 60% / 0.15), transparent)",
          boxShadow: "0 0 30px 10px hsl(180 90% 60% / 0.2)",
        }}
      />

      {/* Orbiting tools */}
      {orbits.map((orbit, orbitIdx) =>
        orbit.tools.map((tool, toolIdx) => {
          const angle = (360 / orbit.tools.length) * toolIdx;
          // We use CSS rotation for the orbit, with an initial offset per tool
          return (
            <div
              key={tool.id}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                animation: `orbit-${orbitIdx} ${orbit.duration}s linear infinite`,
                animationDelay: `-${(orbit.duration / orbit.tools.length) * toolIdx}s`,
              }}
            >
              {/* Position tool at orbit radius with perspective squash */}
              <div
                style={{
                  position: "absolute",
                  transform: `rotate(${angle}deg) translateX(${orbit.radius}px) scaleY(0.45)`,
                  transformOrigin: "0 0",
                }}
              >
                {/* Counter-rotate so logos stay upright, un-squash */}
                <div
                  className="group relative"
                  style={{
                    animation: `counter-orbit-${orbitIdx} ${orbit.duration}s linear infinite`,
                    animationDelay: `-${(orbit.duration / orbit.tools.length) * toolIdx}s`,
                    transform: `rotate(-${angle}deg) scaleY(${1 / 0.45})`,
                  }}
                >
                  <div
                    className="rounded-full overflow-hidden border border-white/10 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-transform duration-200 hover:scale-125"
                    style={{
                      width: orbitIdx <= 1 ? 34 : 30,
                      height: orbitIdx <= 1 ? 34 : 30,
                      marginLeft: orbitIdx <= 1 ? -17 : -15,
                      marginTop: orbitIdx <= 1 ? -17 : -15,
                      boxShadow: `0 0 12px 2px ${tool.color}33`,
                    }}
                  >
                    {tool.logo ? (
                      <img
                        src={tool.logo}
                        alt={tool.label}
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[8px] font-bold text-white/70">
                        {tool.label.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {tool.label}
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
