import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Line } from "@react-three/drei";
import * as THREE from "three";

// Orbit data: tool name, icon/emoji, orbit radius, speed, color
const orbitTools = [
  // Inner ring
  { id: "chatgpt-openai", label: "ChatGPT", icon: "💬", radius: 2.2, speed: 0.25, color: "#6366f1", domain: "openai.com" },
  { id: "claude-anthropic", label: "Claude", icon: "🧠", radius: 2.2, speed: 0.25, color: "#d4a574", domain: "anthropic.com", offsetAngle: Math.PI },
  
  // Second ring
  { id: "cursor", label: "Cursor", icon: "💻", radius: 3.2, speed: 0.18, color: "#06b6d4", domain: "cursor.com", offsetAngle: 0 },
  { id: "midjourney", label: "Midjourney", icon: "🎨", radius: 3.2, speed: 0.18, color: "#d946ef", domain: "midjourney.com", offsetAngle: Math.PI * 0.66 },
  { id: "elevenlabs", label: "ElevenLabs", icon: "🎵", radius: 3.2, speed: 0.18, color: "#ec4899", domain: "elevenlabs.io", offsetAngle: Math.PI * 1.33 },
  
  // Third ring
  { id: "runway", label: "Runway", icon: "🎬", radius: 4.3, speed: 0.12, color: "#10b981", domain: "runwayml.com", offsetAngle: 0.5 },
  { id: "gemini-google", label: "Gemini", icon: "✨", radius: 4.3, speed: 0.12, color: "#4285f4", domain: "deepmind.google", offsetAngle: Math.PI * 0.5 + 0.5 },
  { id: "perplexity", label: "Perplexity", icon: "🔍", radius: 4.3, speed: 0.12, color: "#20b2aa", domain: "perplexity.ai", offsetAngle: Math.PI + 0.5 },
  { id: "lovable", label: "Lovable", icon: "❤️", radius: 4.3, speed: 0.12, color: "#f472b6", domain: "lovable.dev", offsetAngle: Math.PI * 1.5 + 0.5 },
  
  // Outer ring
  { id: "zapier", label: "Zapier", icon: "⚡", radius: 5.5, speed: 0.08, color: "#f97316", domain: "zapier.com", offsetAngle: 0.3 },
  { id: "langchain", label: "LangChain", icon: "🔗", radius: 5.5, speed: 0.08, color: "#f43f5e", domain: "langchain.com", offsetAngle: Math.PI * 0.5 + 0.3 },
  { id: "notion-ai", label: "Notion AI", icon: "📝", radius: 5.5, speed: 0.08, color: "#14b8a6", domain: "notion.so", offsetAngle: Math.PI + 0.3 },
  { id: "deepseek", label: "DeepSeek", icon: "🐋", radius: 5.5, speed: 0.08, color: "#4f6df5", domain: "deepseek.com", offsetAngle: Math.PI * 1.5 + 0.3 },
  { id: "stable-diffusion", label: "Stability", icon: "🖼️", radius: 5.5, speed: 0.08, color: "#a855f7", domain: "stability.ai", offsetAngle: Math.PI * 0.25 + 0.3 },
];

const orbitRadii = [2.2, 3.2, 4.3, 5.5];

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <Line points={points} color="#ffffff" opacity={0.07} transparent lineWidth={0.5} />
  );
}

function LogoSphere({ tool, time }: { tool: typeof orbitTools[0]; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const angle = time * tool.speed + (tool.offsetAngle || 0);
  const x = Math.cos(angle) * tool.radius;
  const z = Math.sin(angle) * tool.radius;
  // Slight vertical bob
  const y = Math.sin(time * 0.5 + tool.radius) * 0.15;

  const scale = hovered ? 1.4 : 1;
  const logoUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${tool.domain}&size=128`;

  // Load texture
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(logoUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [logoUrl]);

  return (
    <group position={[x, y, z]}>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={tool.color} transparent opacity={hovered ? 0.25 : 0.08} />
      </mesh>
      {/* Logo sphere */}
      <mesh
        ref={meshRef}
        scale={[scale, scale, scale]}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          emissive={tool.color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* Label on hover */}
      {hovered && (
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="bottom"
          font="/fonts/Inter-Medium.woff"
        >
          {tool.label}
        </Text>
      )}
    </group>
  );
}

function CenterGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.04} />
        </mesh>
        {/* Core */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <meshStandardMaterial
            color="#e2e8f0"
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Eyes (dark spots for character like the reference) */}
        <mesh position={[-0.18, 0.08, 0.55]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.18, 0.08, 0.55]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    setTime(timeRef.current);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#0ea5e9" />
      <pointLight position={[5, 2, -3]} intensity={0.5} color="#d946ef" />
      <pointLight position={[-5, 2, 3]} intensity={0.5} color="#6366f1" />

      {/* Orbit rings */}
      {orbitRadii.map((r) => (
        <OrbitRing key={r} radius={r} />
      ))}

      {/* Center character */}
      <CenterGlobe />

      {/* Orbiting logos */}
      {orbitTools.map((tool) => (
        <LogoSphere key={tool.id} tool={tool} time={time} />
      ))}
    </>
  );
}

export const SolarSystem3D = () => {
  return (
    <div className="w-full h-[420px] sm:h-[500px] -mt-4">
      <Canvas
        camera={{ position: [0, 6, 9], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
