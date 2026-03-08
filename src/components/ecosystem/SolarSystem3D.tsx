// @ts-nocheck
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { getLogoUrl } from "@/data/companyLogos";

/* ── orbit data ── */
const orbitConfig = [
  {
    radius: 2.2,
    speed: 0.3,
    tilt: 0.15,
    tools: [
      { id: "chatgpt-openai", label: "ChatGPT", color: "#10a37f" },
      { id: "claude-anthropic", label: "Claude", color: "#d4a574" },
      { id: "gemini-google", label: "Gemini", color: "#4285f4" },
    ],
  },
  {
    radius: 3.6,
    speed: 0.2,
    tilt: -0.1,
    tools: [
      { id: "cursor", label: "Cursor", color: "#00d4ff" },
      { id: "midjourney", label: "Midjourney", color: "#ffffff" },
      { id: "perplexity", label: "Perplexity", color: "#22c5c0" },
      { id: "runway", label: "Runway", color: "#c084fc" },
    ],
  },
  {
    radius: 5.2,
    speed: 0.13,
    tilt: 0.08,
    tools: [
      { id: "elevenlabs", label: "ElevenLabs", color: "#f0f0f0" },
      { id: "lovable", label: "Lovable", color: "#ff6b8a" },
      { id: "zapier", label: "Zapier", color: "#ff4a00" },
      { id: "notion-ai", label: "Notion AI", color: "#ffffff" },
      { id: "langchain", label: "LangChain", color: "#1c3c3c" },
    ],
  },
  {
    radius: 7.0,
    speed: 0.08,
    tilt: -0.05,
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

/* ── Orbit ring (ellipse) ── */
function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([
        Math.cos(angle) * radius,
        Math.sin(angle) * tilt * radius * 0.3,
        Math.sin(angle) * radius * 0.45,
      ]);
    }
    return pts;
  }, [radius, tilt]);

  return (
    <Line
      points={points}
      color="#334155"
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  );
}

/* ── Single orbiting logo card ── */
function LogoCard({
  radius,
  speed,
  tilt,
  angleOffset,
  toolId,
  color,
}: {
  radius: number;
  speed: number;
  tilt: number;
  angleOffset: number;
  toolId: string;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  // Load the logo as a texture
  const logoUrl = getLogoUrl(toolId);
  const texture = useLoader(THREE.TextureLoader, logoUrl || "");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.45;
    const y = Math.sin(t) * tilt * radius * 0.3;

    if (meshRef.current) {
      meshRef.current.position.set(x, y + Math.sin(t * 2) * 0.08, z);
      // Tilt card to face slightly toward camera and add gentle rotation
      meshRef.current.rotation.set(
        -0.3,
        -t + Math.PI * 0.5,
        Math.sin(t * 1.5) * 0.15
      );
    }
    if (glowRef.current) {
      glowRef.current.position.set(x, y + Math.sin(t * 2) * 0.08, z);
    }
  });

  const col = new THREE.Color(color);

  return (
    <>
      {/* Glow sprite behind */}
      <mesh ref={glowRef}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial
          color={col}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Card with logo texture */}
      <mesh ref={meshRef}>
        <planeGeometry args={[0.65, 0.65]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          emissive={col}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </>
  );
}

/* ── Fallback card when texture fails ── */
function FallbackCard({
  radius,
  speed,
  tilt,
  angleOffset,
  color,
  label,
}: {
  radius: number;
  speed: number;
  tilt: number;
  angleOffset: number;
  color: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const col = new THREE.Color(color);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + angleOffset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.45;
    const y = Math.sin(t) * tilt * radius * 0.3;

    if (meshRef.current) {
      meshRef.current.position.set(x, y + Math.sin(t * 2) * 0.08, z);
      meshRef.current.rotation.set(-0.3, -t + Math.PI * 0.5, Math.sin(t * 1.5) * 0.15);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.5, 0.06]} />
      <meshStandardMaterial
        color={col}
        emissive={col}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

/* ── Wrapper that tries logo, falls back gracefully ── */
function ToolOrb(props: {
  radius: number;
  speed: number;
  tilt: number;
  angleOffset: number;
  toolId: string;
  color: string;
  label: string;
}) {
  const logoUrl = getLogoUrl(props.toolId);
  if (!logoUrl) {
    return <FallbackCard {...props} />;
  }
  return (
    <Suspense
      fallback={<FallbackCard {...props} />}
    >
      <LogoCard
        radius={props.radius}
        speed={props.speed}
        tilt={props.tilt}
        angleOffset={props.angleOffset}
        toolId={props.toolId}
        color={props.color}
      />
    </Suspense>
  );
}

/* ── Central glowing sphere ── */
function CenterGlobe() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
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

/* ── Scene contents ── */
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
            <ToolOrb
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

/* ── Exported component ── */
export const SolarSystem3D = () => {
  return (
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
};
