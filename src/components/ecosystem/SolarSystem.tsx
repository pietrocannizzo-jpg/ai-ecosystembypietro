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
      style={{ width: size, height: size, maxWidth: "100%", perspective: 900 }}
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
        @keyframes card-hover-float {
          0%, 100% { transform: translateY(0px) rotate3d(1, 1, 0, 0deg); }
          25% { transform: translateY(-4px) rotate3d(1, 0.5, 0, 3deg); }
          50% { transform: translateY(-2px) rotate3d(0.5, 1, 0, -2deg); }
          75% { transform: translateY(-5px) rotate3d(1, 0.5, 0, 2deg); }
        }
        .solar-3d-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .solar-3d-card:hover {
          transform: scale(1.35) rotateX(5deg) rotateY(-5deg) rotateZ(0deg) !important;
          z-index: 20;
        }
        .solar-3d-card:hover .card-label {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .solar-3d-card:hover .card-shine {
          opacity: 0.6;
        }
      `}</style>

      {orbits.map((orbit, orbitIdx) =>
        orbit.tools.map((tool, toolIdx) => {
          const startAngle = (360 / orbit.tools.length) * toolIdx;
          // Diamond-shaped 3D cards like in the Spline scene
          const cardW = orbitIdx <= 1 ? 48 : 40;
          const cardH = cardW * 1.15;
          // Each card tilted like a floating diamond
          const baseRotZ = 45; // diamond orientation
          const tiltX = 15 + (toolIdx * 5) % 10;
          const tiltY = -10 + (toolIdx * 7) % 20;

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
                  {/* Floating 3D diamond card */}
                  <div
                    style={{
                      animation: `card-hover-float ${4 + toolIdx * 0.5}s ease-in-out infinite`,
                      animationDelay: `${toolIdx * -0.8}s`,
                    }}
                  >
                    <div
                      className="solar-3d-card relative cursor-pointer pointer-events-auto"
                      style={{
                        width: cardW,
                        height: cardH,
                        marginLeft: -cardW / 2,
                        marginTop: -cardH / 2,
                        borderRadius: 6,
                        transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${baseRotZ}deg)`,
                        transformStyle: "preserve-3d",
                        background: `linear-gradient(145deg, ${tool.color}22 0%, rgba(8,8,18,0.92) 40%, ${tool.color}10 100%)`,
                        border: `1px solid ${tool.color}30`,
                        boxShadow: `
                          0 8px 32px -8px ${tool.color}35,
                          0 2px 8px rgba(0,0,0,0.6),
                          inset 0 1px 0 ${tool.color}15
                        `,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "visible",
                      }}
                    >
                      {/* Glass shine effect across card */}
                      <div
                        className="card-shine absolute inset-0 pointer-events-none"
                        style={{
                          borderRadius: 6,
                          background: `linear-gradient(125deg, transparent 30%, ${tool.color}15 45%, transparent 55%)`,
                          opacity: 0.3,
                          transition: "opacity 0.3s",
                        }}
                      />

                      {/* Top edge highlight */}
                      <div
                        className="absolute top-0 left-0 right-0 pointer-events-none"
                        style={{
                          height: "1px",
                          background: `linear-gradient(90deg, transparent, ${tool.color}40, transparent)`,
                        }}
                      />

                      {/* Logo — counter-rotated so it stays upright */}
                      <div
                        style={{
                          transform: `rotateZ(-${baseRotZ}deg)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {tool.logo ? (
                          <img
                            src={tool.logo}
                            alt={tool.label}
                            style={{
                              width: cardW * 0.5,
                              height: cardW * 0.5,
                              objectFit: "contain",
                              filter: `drop-shadow(0 0 6px ${tool.color}50) brightness(1.1)`,
                              position: "relative",
                              zIndex: 1,
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className="font-bold"
                            style={{
                              fontSize: cardW * 0.28,
                              color: tool.color,
                              textShadow: `0 0 10px ${tool.color}50`,
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            {tool.label.slice(0, 2)}
                          </span>
                        )}
                      </div>

                      {/* Colored glow beneath card */}
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          bottom: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: cardW * 0.8,
                          height: 10,
                          borderRadius: "50%",
                          background: `${tool.color}20`,
                          filter: "blur(6px)",
                        }}
                      />

                      {/* Tooltip label */}
                      <div
                        className="card-label absolute whitespace-nowrap pointer-events-none"
                        style={{
                          bottom: -28,
                          left: "50%",
                          transform: `translateX(-50%) translateY(4px) rotateZ(-${baseRotZ}deg)`,
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 9,
                          fontFamily: "monospace",
                          background: "rgba(0,0,0,0.9)",
                          border: `1px solid ${tool.color}30`,
                          color: "#ccc",
                          opacity: 0,
                          transition: "opacity 0.2s, transform 0.2s",
                          zIndex: 10,
                        }}
                      >
                        {tool.label}
                      </div>
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
