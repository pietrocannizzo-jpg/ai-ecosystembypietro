// @ts-nocheck
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { getLogoUrl } from "@/data/companyLogos";

const orbitConfig = [
  {
    radius: 1.6, speed: 0.35, yAmp: 0.05,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 2.7, speed: 0.22, yAmp: 0.07,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#b0b0b0" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 4.0, speed: 0.14, yAmp: 0.09,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#e0e0e0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#e0e0e0" },
      { id: "langchain", label: "LangChain", color: "#3c8c8c" },
    ],
  },
  {
    radius: 5.5, speed: 0.09, yAmp: 0.1,
    tools: [
      { id: "suno", label: "Suno", color: "#1db954" },
      { id: "deepseek", label: "DeepSeek", color: "#4d6bfe" },
      { id: "stable-diffusion", label: "Stability", color: "#bf5af2" },
      { id: "github-copilot", label: "Copilot", color: "#e0e0e0" },
      { id: "make", label: "Make", color: "#6d00cc" },
      { id: "sora", label: "Sora", color: "#e0e0e0" },
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
  return <Line points={points} color="#1a2030" lineWidth={0.5} transparent opacity={0.25} />;
}

/* ── Small dot particles ── */
function RingDots({ radius, count }: { radius: number; count: number }) {
  const dotsRef = useRef<THREE.InstancedMesh>(null!);
  const offsets = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: (Math.PI * 2 * i) / count + Math.random() * 0.4,
      speed: 0.015 + Math.random() * 0.025,
      yOff: (Math.random() - 0.5) * 0.1,
    })), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    offsets.forEach((dot, i) => {
      const a = dot.angle + t * dot.speed;
      dummy.position.set(Math.cos(a) * radius, dot.yOff, Math.sin(a) * radius);
      dummy.scale.setScalar(0.012);
      dummy.updateMatrix();
      dotsRef.current.setMatrixAt(i, dummy.matrix);
    });
    dotsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={dotsRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#384050" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ── 3D App Icon Tile — clean, no colored box ── */
function ToolTile({
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
      groupRef.current.rotation.set(
        0.08 + Math.sin(t * 1.3) * 0.04,
        -t + Math.PI * 0.5,
        Math.sin(t * 0.9) * 0.06
      );
    }
  });

  const onHover = useCallback(() => setHovered(true), []);
  const onUnhover = useCallback(() => setHovered(false), []);
  const tileSize = radius < 2 ? 0.5 : radius < 3.5 ? 0.44 : 0.38;

  return (
    <group ref={groupRef} scale={[tileSize, tileSize, tileSize]}>
      {/* Clean dark rounded box */}
      <RoundedBox
        args={[1, 1, 0.25]}
        radius={0.14}
        smoothness={4}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <meshStandardMaterial
          color="#1a1a22"
          roughness={0.4}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Logo on front face */}
      <Html
        position={[0, 0, 0.14]}
        center
        distanceFactor={4}
        style={{ pointerEvents: "none", userSelect: "none" }}
        zIndexRange={[0, 0]}
      >
        <div style={{
          width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={label}
              style={{
                width: 24, height: 24,
                objectFit: "contain",
                filter: "brightness(1.1)",
              }}
              loading="lazy"
            />
          ) : (
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#ccc",
            }}>
              {label.slice(0, 2)}
            </span>
          )}
        </div>
      </Html>

      {/* Hover label */}
      {hovered && (
        <Html center position={[0, 0.75, 0]} distanceFactor={4} style={{ pointerEvents: "none" }} zIndexRange={[10, 10]}>
          <div style={{
            padding: "3px 10px",
            borderRadius: 5,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            background: "rgba(8,8,16,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#ccc",
            whiteSpace: "nowrap",
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Center sphere ── */
function CenterGlobe() {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.15;
    if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color="#0a2a2a"
          emissive="#0affaa"
          emissiveIntensity={0.25}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.33, 24, 24]} />
        <meshBasicMaterial color="#0affaa" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 5, 5]} intensity={0.7} color="#e0e5ea" distance={20} />
      <pointLight position={[-3, 3, -4]} intensity={0.3} color="#0affaa" distance={15} />
      <pointLight position={[3, -1, 2]} intensity={0.2} color="#a78bfa" distance={12} />

      <CenterGlobe />

      {orbitConfig.map((orbit, i) => (
        <group key={i}>
          <OrbitRing radius={orbit.radius} />
          <RingDots radius={orbit.radius} count={5 + i * 2} />
          {orbit.tools.map((tool, j) => (
            <ToolTile
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
        autoRotateSpeed={0.35}
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
