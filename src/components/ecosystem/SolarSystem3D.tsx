// @ts-nocheck
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getLogoUrl } from "@/data/companyLogos";

const orbitConfig = [
  {
    radius: 1.6, speed: 0.3, yAmp: 0.04,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 2.7, speed: 0.2, yAmp: 0.05,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#b0b0b0" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 3.8, speed: 0.13, yAmp: 0.06,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#e0e0e0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#e0e0e0" },
      { id: "langchain", label: "LangChain", color: "#3c8c8c" },
    ],
  },
  {
    radius: 5.2, speed: 0.08, yAmp: 0.08,
    tools: [
      { id: "suno", label: "Suno", color: "#1db954" },
      { id: "deepseek", label: "DeepSeek", color: "#4d6bfe" },
      { id: "stable-diffusion", label: "Stability", color: "#bf5af2" },
      { id: "github-copilot", label: "Copilot", color: "#e0e0e0" },
      { id: "make", label: "Make", color: "#6d00cc" },
      { id: "grok-xai", label: "Grok", color: "#e0e0e0" },
    ],
  },
];

/* ── Orbit ring ── */
function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);
  return <Line points={points} color="#c8a05030" lineWidth={0.6} transparent opacity={0.25} />;
}

/* ── Floating logo ── */
function FloatingLogo({
  radius, speed, yAmp, angleOffset, toolId, color, label,
}: {
  radius: number; speed: number; yAmp: number; angleOffset: number;
  toolId: string; color: string; label: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const logoUrl = getLogoUrl(toolId);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 2.5) * yAmp;
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
  });

  const onHover = useCallback(() => setHovered(true), []);
  const onUnhover = useCallback(() => setHovered(false), []);
  const logoSize = radius < 2 ? 32 : radius < 3.5 ? 28 : 24;

  return (
    <group ref={groupRef}>
      <Html
        center
        distanceFactor={4.5}
        style={{ pointerEvents: "auto", userSelect: "none", cursor: "pointer" }}
        zIndexRange={[0, 0]}
      >
        <div
          onMouseEnter={onHover}
          onMouseLeave={onUnhover}
          style={{
            width: logoSize + 8,
            height: logoSize + 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "transparent",
            transition: "transform 0.2s ease",
            transform: hovered ? "scale(1.3)" : "scale(1)",
            position: "relative",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={label}
              style={{
                width: logoSize,
                height: logoSize,
                objectFit: "contain",
                borderRadius: "50%",
                filter: hovered
                  ? `drop-shadow(0 0 10px ${color}90) brightness(1.2)`
                  : `drop-shadow(0 0 4px ${color}40)`,
                transition: "filter 0.2s ease",
              }}
              loading="lazy"
            />
          ) : (
            <span style={{
              fontSize: logoSize * 0.45,
              fontWeight: 700,
              color,
              textShadow: `0 0 8px ${color}50`,
            }}>
              {label.slice(0, 2)}
            </span>
          )}

          {hovered && (
            <div style={{
              position: "absolute",
              top: -24,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(10,14,30,0.92)",
              border: "1px solid rgba(200,160,80,0.2)",
              color: "#d4b87a",
              whiteSpace: "nowrap",
            }}>
              {label}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ── Textured Earth ── */
function Earth() {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, "/earth-texture.jpg");
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.06;
    if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.015);
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.44, 32, 32]} />
        <meshBasicMaterial color="#4488cc" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color="#88bbff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#ffe8c0" distance={20} />
      <pointLight position={[-4, 3, -3]} intensity={0.6} color="#88bbff" distance={15} />
      <pointLight position={[0, -3, 4]} intensity={0.5} color="#ffffff" distance={15} />

      <Earth />

      {orbitConfig.map((orbit, i) => (
        <group key={i}>
          <OrbitRing radius={orbit.radius} />
          {orbit.tools.map((tool, j) => (
            <FloatingLogo
              key={tool.id}
              radius={orbit.radius}
              speed={orbit.speed}
              yAmp={orbit.yAmp}
              angleOffset={(Math.PI * 2 * j) / orbit.tools.length}
              toolId={tool.id}
              color={tool.color}
              label={tool.label}
            />
          ))}
        </group>
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.55}
        minPolarAngle={Math.PI * 0.32}
      />
    </>
  );
}

export const SolarSystem3D = () => (
  <div style={{ width: "100%", height: "100%" }}>
    <Canvas
      camera={{ position: [0, 4.5, 7], fov: 42 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  </div>
);
