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
    radius: 60,
    duration: 28,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 105,
    duration: 40,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#ffffff" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 155,
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
    radius: 210,
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

  const size = 500;

  return (
    <div
      className="relative"
      style={{ width: size, height: size, maxWidth: "100%" }}
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
        .solar-orb {
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .solar-orb:hover {
          transform: scale(1.4) !important;
          filter: brightness(1.3);
        }
        .solar-orb:hover .orb-tooltip {
          opacity: 1;
        }
      `}</style>

      {/* No center character — Spline provides the 3D one underneath */}

      {/* Orbiting tool logos */}
      {orbits.map((orbit, orbitIdx) =>
        orbit.tools.map((tool, toolIdx) => {
          const startAngle = (360 / orbit.tools.length) * toolIdx;
          const orbSize = orbitIdx <= 1 ? 38 : 32;

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
                  {/* Glossy orb */}
                  <div
                    className="solar-orb relative cursor-pointer pointer-events-auto"
                    style={{
                      width: orbSize,
                      height: orbSize,
                      marginLeft: -orbSize / 2,
                      marginTop: -orbSize / 2,
                      borderRadius: "50%",
                      background: `radial-gradient(ellipse at 35% 25%, ${tool.color}90 0%, ${tool.color}50 35%, rgba(10,10,20,0.85) 100%)`,
                      boxShadow: `
                        0 0 16px 4px ${tool.color}30,
                        inset 0 -4px 8px rgba(0,0,0,0.4),
                        inset 0 2px 4px ${tool.color}40
                      `,
                      border: `1px solid ${tool.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {/* Specular highlight */}
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        left: orbSize * 0.22,
                        width: orbSize * 0.3,
                        height: orbSize * 0.2,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.35)",
                        filter: "blur(2px)",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Logo */}
                    {tool.logo ? (
                      <img
                        src={tool.logo}
                        alt={tool.label}
                        style={{
                          width: orbSize * 0.52,
                          height: orbSize * 0.52,
                          objectFit: "contain",
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                          position: "relative",
                          zIndex: 1,
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="font-bold text-white/80"
                        style={{ fontSize: orbSize * 0.25, position: "relative", zIndex: 1 }}
                      >
                        {tool.label.slice(0, 2)}
                      </span>
                    )}
                    {/* Tooltip */}
                    <div
                      className="orb-tooltip absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[9px] font-mono whitespace-nowrap opacity-0 pointer-events-none transition-opacity"
                      style={{
                        background: "rgba(0,0,0,0.9)",
                        border: `1px solid ${tool.color}40`,
                        color: "#ddd",
                        zIndex: 10,
                      }}
                    >
                      {tool.label}
                    </div>
                  </div>
                  {/* Drop shadow under the orb */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -orbSize / 2 - 6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: orbSize * 0.6,
                      height: 4,
                      borderRadius: "50%",
                      background: `${tool.color}15`,
                      filter: "blur(3px)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
