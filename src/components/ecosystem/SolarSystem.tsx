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
      style={{ width: size, height: size, maxWidth: "100%", perspective: 800 }}
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
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes card-glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .solar-card {
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .solar-card:hover {
          transform: scale(1.3) rotateX(0deg) rotateY(0deg) !important;
          filter: brightness(1.4);
          z-index: 20;
        }
        .solar-card:hover .card-tooltip {
          opacity: 1;
        }
        .solar-card:hover .card-glow {
          opacity: 1 !important;
        }
      `}</style>

      {orbits.map((orbit, orbitIdx) =>
        orbit.tools.map((tool, toolIdx) => {
          const startAngle = (360 / orbit.tools.length) * toolIdx;
          // 3D card sizes — inner orbits slightly larger
          const cardSize = orbitIdx <= 1 ? 42 : 36;
          // Each card gets a unique tilt for 3D variety
          const tiltX = 25 + (toolIdx * 7) % 15;
          const tiltY = -15 + (toolIdx * 11) % 30;

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
                  {/* 3D tilted card */}
                  <div
                    className="solar-card relative cursor-pointer pointer-events-auto"
                    style={{
                      width: cardSize,
                      height: cardSize,
                      marginLeft: -cardSize / 2,
                      marginTop: -cardSize / 2,
                      borderRadius: 8,
                      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                      transformStyle: "preserve-3d",
                      animation: `card-float ${3 + toolIdx * 0.4}s ease-in-out infinite`,
                      animationDelay: `${toolIdx * -0.7}s`,
                      background: `linear-gradient(135deg, ${tool.color}30 0%, rgba(15,15,25,0.9) 50%, ${tool.color}15 100%)`,
                      border: `1px solid ${tool.color}35`,
                      boxShadow: `
                        0 4px 20px -4px ${tool.color}40,
                        0 0 1px ${tool.color}50,
                        inset 0 1px 0 ${tool.color}20,
                        inset 0 -1px 0 rgba(0,0,0,0.3)
                      `,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Glow aura behind card */}
                    <div
                      className="card-glow absolute -inset-2 rounded-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${tool.color}25, transparent 70%)`,
                        opacity: 0.4,
                        animation: `card-glow-pulse ${4 + toolIdx * 0.3}s ease-in-out infinite`,
                        animationDelay: `${toolIdx * -0.5}s`,
                        filter: "blur(6px)",
                        zIndex: -1,
                      }}
                    />

                    {/* Glossy top-edge shine */}
                    <div
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{
                        height: "40%",
                        borderRadius: "8px 8px 0 0",
                        background: `linear-gradient(180deg, ${tool.color}18, transparent)`,
                      }}
                    />

                    {/* Logo */}
                    {tool.logo ? (
                      <img
                        src={tool.logo}
                        alt={tool.label}
                        style={{
                          width: cardSize * 0.55,
                          height: cardSize * 0.55,
                          objectFit: "contain",
                          filter: `drop-shadow(0 0 4px ${tool.color}60)`,
                          position: "relative",
                          zIndex: 1,
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="font-bold"
                        style={{
                          fontSize: cardSize * 0.28,
                          position: "relative",
                          zIndex: 1,
                          color: tool.color,
                          textShadow: `0 0 8px ${tool.color}60`,
                        }}
                      >
                        {tool.label.slice(0, 2)}
                      </span>
                    )}

                    {/* Tooltip */}
                    <div
                      className="card-tooltip absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[9px] font-mono whitespace-nowrap opacity-0 pointer-events-none transition-opacity"
                      style={{
                        background: "rgba(0,0,0,0.92)",
                        border: `1px solid ${tool.color}40`,
                        color: "#ddd",
                        zIndex: 10,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tool.label}
                    </div>
                  </div>

                  {/* Reflected glow beneath */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -cardSize / 2 - 8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: cardSize * 0.7,
                      height: 6,
                      borderRadius: "50%",
                      background: `${tool.color}18`,
                      filter: "blur(4px)",
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
