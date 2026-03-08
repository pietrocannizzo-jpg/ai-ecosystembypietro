// @ts-nocheck
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
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
  return <Line points={points} color="#2a3450" lineWidth={0.5} transparent opacity={0.3} />;
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
      <meshBasicMaterial color="#c8a050" transparent opacity={0.25} />
    </instancedMesh>
  );
}

/* ── Floating logo — NO tile/box, just the logo via Html ── */
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
            width: logoSize + 16,
            height: logoSize + 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
            transition: "all 0.2s ease",
            transform: hovered ? "scale(1.2)" : "scale(1)",
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
                filter: hovered
                  ? `drop-shadow(0 0 8px ${color}80) brightness(1.2)`
                  : `drop-shadow(0 0 4px ${color}40)`,
                transition: "filter 0.2s ease",
              }}
              loading="lazy"
            />
          ) : (
            <span style={{
              fontSize: logoSize * 0.5,
              fontWeight: 700,
              color: color,
              textShadow: `0 0 8px ${color}50`,
            }}>
              {label.slice(0, 2)}
            </span>
          )}

          {/* Label on hover */}
          {hovered && (
            <div style={{
              position: "absolute",
              top: -26,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "3px 10px",
              borderRadius: 5,
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(12,16,30,0.95)",
              border: "1px solid rgba(200,160,80,0.15)",
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

/* ── Earth-like center sphere ── */
function EarthGlobe() {
  const ref = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.08;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.12;
    if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.02);
  });

  return (
    <group>
      {/* Earth body */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.35, 48, 48]} />
        <meshStandardMaterial
          color="#1a3a6a"
          emissive="#1040a0"
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Lighter land patches — second sphere slightly larger */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[0.352, 32, 32]} />
        <meshStandardMaterial
          color="#2a6a4a"
          emissive="#30a060"
          emissiveIntensity={0.08}
          roughness={0.7}
          metalness={0.2}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial
          color="#4488cc"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Bright atmospheric rim */}
      <mesh>
        <sphereGeometry args={[0.46, 24, 24]} />
        <meshBasicMaterial
          color="#88bbff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 5, 5]} intensity={0.8} color="#ffe8c0" distance={20} />
      <pointLight position={[-4, 3, -3]} intensity={0.3} color="#4488cc" distance={15} />
      <pointLight position={[4, -1, 2]} intensity={0.2} color="#c8a050" distance={12} />

      <EarthGlobe />

      {orbitConfig.map((orbit, i) => (
        <group key={i}>
          <OrbitRing radius={orbit.radius} />
          <RingDots radius={orbit.radius} count={5 + i * 2} />
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
