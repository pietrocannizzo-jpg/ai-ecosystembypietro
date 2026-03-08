// @ts-nocheck
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getLogoUrl } from "@/data/companyLogos";

const orbitConfig = [
  {
    radius: 2.2, speed: 0.3, tilt: 0.15,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 3.6, speed: 0.2, tilt: -0.1,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#ffffff" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 5.2, speed: 0.13, tilt: 0.08,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#f0f0f0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#ffffff" },
      { id: "langchain", label: "LangChain", color: "#1c3c3c" },
    ],
  },
  {
    radius: 7.0, speed: 0.08, tilt: -0.05,
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

/* ── Orbit ring ── */
function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, Math.sin(a) * tilt * radius * 0.3, Math.sin(a) * radius * 0.45]);
    }
    return pts;
  }, [radius, tilt]);

  return <Line points={points} color="#334155" lineWidth={0.5} transparent opacity={0.3} />;
}

/* ── Single orbiting card with Html logo ── */
function ToolCard({
  radius, speed, tilt, angleOffset, toolId, color, label,
}: {
  radius: number; speed: number; tilt: number; angleOffset: number;
  toolId: string; color: string; label: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const logoUrl = getLogoUrl(toolId);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.45;
    const y = Math.sin(t) * tilt * radius * 0.3 + Math.sin(t * 2) * 0.08;
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.set(-0.3, -t + Math.PI * 0.5, Math.sin(t * 1.5) * 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D card body — thin box with emissive glow */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.7, 0.7, 0.04]} />
        <meshStandardMaterial
          color={hovered ? color : "#111118"}
          emissive={col}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Edge highlight */}
      <mesh>
        <boxGeometry args={[0.72, 0.72, 0.01]} />
        <meshBasicMaterial color={col} transparent opacity={0.15} />
      </mesh>

      {/* Html logo overlay — rendered as real DOM on top of the 3D card */}
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: "none", userSelect: "none" }}
        zIndexRange={[0, 0]}
      >
        <div
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={label}
              style={{
                width: 28,
                height: 28,
                objectFit: "contain",
                filter: `drop-shadow(0 0 6px ${color}80)`,
              }}
              loading="lazy"
            />
          ) : (
            <span
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: color,
                textShadow: `0 0 8px ${color}60`,
              }}
            >
              {label.slice(0, 2)}
            </span>
          )}
          {hovered && (
            <div
              style={{
                position: "absolute",
                top: -24,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 9,
                fontFamily: "monospace",
                background: "rgba(0,0,0,0.9)",
                border: `1px solid ${color}40`,
                color: "#ccc",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ── Central glowing sphere ── */
function CenterGlobe() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color="#0ff"
        emissive="#0ff"
        emissiveIntensity={0.3}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#0ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#c084fc" />
      <pointLight position={[5, -2, 3]} intensity={0.4} color="#10a37f" />

      <CenterGlobe />

      {orbitConfig.map((orbit, orbitIdx) => (
        <group key={orbitIdx}>
          <OrbitRing radius={orbit.radius} tilt={orbit.tilt} />
          {orbit.tools.map((tool, toolIdx) => (
            <ToolCard
              key={tool.id}
              radius={orbit.radius}
              speed={orbit.speed}
              tilt={orbit.tilt}
              angleOffset={(Math.PI * 2 * toolIdx) / orbit.tools.length}
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
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </>
  );
}

/* ── Export ── */
export const SolarSystem3D = () => (
  <div style={{ width: "100%", height: "100%" }}>
    <Canvas
      camera={{ position: [0, 4, 10], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene />
    </Canvas>
  </div>
);
