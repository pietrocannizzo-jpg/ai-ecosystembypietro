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

/* ── Neon orbit ring with trailing glow ── */
function OrbitRing({ radius, color = "#c8a050", speed = 0.2 }: { radius: number; color?: string; speed?: number }) {
  const trailRef = useRef<THREE.Mesh>(null!);

  // Full static ring (dim base)
  const basePoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  // Animated neon trail — a tube segment that moves around the orbit
  const trailGeo = useMemo(() => {
    const segments = 40;
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: segments + 1 }, (_, i) => {
        const a = (i / segments) * Math.PI * 0.6; // ~108° arc
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }),
    );
    return new THREE.TubeGeometry(curve, segments, 0.008 + radius * 0.002, 6, false);
  }, [radius]);

  // Gradient opacity along trail
  const trailMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float alpha = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.6, vUv.x);
          alpha *= 0.8;
          vec3 bright = uColor + vec3(0.3);
          vec3 col = mix(uColor, bright, smoothstep(0.3, 0.7, vUv.x));
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    return mat;
  }, [color]);

  useFrame(({ clock }) => {
    if (trailRef.current) {
      trailRef.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });

  return (
    <group>
      {/* Dim static base ring */}
      <Line points={basePoints} color={color} lineWidth={0.5} transparent opacity={0.12} />
      {/* Animated neon trail */}
      <mesh ref={trailRef} geometry={trailGeo} material={trailMat} />
    </group>
  );
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

/* ── Fresnel atmosphere shader ── */
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    uniform vec3 glowColor;
    uniform float intensity;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = 1.0 - dot(viewDir, vNormal);
      fresnel = pow(fresnel, 3.0) * intensity;
      gl_FragColor = vec4(glowColor, fresnel);
    }
  `,
};

/* ── Textured Earth ── */
function Earth() {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, "/earth-texture.jpg");
  const atmoRef = useRef<THREE.Mesh>(null!);

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.06;
    if (atmoRef.current) atmoRef.current.rotation.y = t * 0.03;
  });

  const atmoUniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color("#4da6ff") },
      intensity: { value: 0.6 },
    }),
    [],
  );

  return (
    <group>
      {/* Core Earth — brighter material */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0.15}
          emissiveMap={texture}
          emissive="#223344"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Subtle Fresnel rim — just a thin edge glow, not a shield */}
      <mesh ref={atmoRef}>
        <sphereGeometry args={[0.41, 48, 48]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={atmoUniforms}
          transparent
          side={THREE.FrontSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light from Earth itself — gives nearby orbits a blue tint */}
      <pointLight position={[0, 0, 0]} color="#4488bb" intensity={0.6} distance={3} />
    </group>
  );
}

/* ── Stars ── */
function Stars({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stars = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 30,
      s: 0.015 + Math.random() * 0.025,
    })), [count]);

  useMemo(() => {
    // Will set matrices on first render via useFrame
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    stars.forEach((star, i) => {
      dummy.position.set(star.x, star.y, star.z);
      const flicker = 0.7 + Math.sin(t * 2 + i * 1.3) * 0.3;
      dummy.scale.setScalar(star.s * flicker);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#fffdf0" transparent opacity={1} />
    </instancedMesh>
  );
}

/* ── Shooting Stars ── */
function ShootingStars() {
  const maxStars = 3;
  const linesRef = useRef<THREE.Group>(null!);
  const stars = useRef(
    Array.from({ length: maxStars }, () => ({
      active: false,
      progress: 0,
      speed: 0,
      start: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      length: 0,
      cooldown: 4 + Math.random() * 10,
    }))
  );

  useFrame((_, delta) => {
    stars.current.forEach((s) => {
      if (!s.active) {
        s.cooldown -= delta;
        if (s.cooldown <= 0) {
          s.active = true;
          s.progress = 0;
          s.speed = 8 + Math.random() * 12;
          s.length = 1.5 + Math.random() * 2;
          // Random start position in upper hemisphere
          s.start.set(
            (Math.random() - 0.5) * 20,
            4 + Math.random() * 8,
            (Math.random() - 0.5) * 16
          );
          // Downward diagonal direction
          s.dir.set(
            (Math.random() - 0.5) * 2,
            -1 - Math.random(),
            (Math.random() - 0.5)
          ).normalize();
        }
        return;
      }

      s.progress += delta * s.speed;
      if (s.progress > 6) {
        s.active = false;
        s.cooldown = 5 + Math.random() * 12;
      }
    });
  });

  return (
    <group ref={linesRef}>
      {stars.current.map((_, i) => (
        <ShootingStar key={i} starRef={stars} index={i} />
      ))}
    </group>
  );
}

function ShootingStar({ starRef, index }: { starRef: React.MutableRefObject<any[]>; index: number }) {
  const lineRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const s = starRef.current[index];
    if (!lineRef.current) return;

    if (!s.active) {
      lineRef.current.visible = false;
      if (glowRef.current) glowRef.current.intensity = 0;
      return;
    }

    lineRef.current.visible = true;
    const head = s.start.clone().addScaledVector(s.dir, s.progress);
    const tail = s.start.clone().addScaledVector(s.dir, Math.max(0, s.progress - s.length));
    const mid = head.clone().add(tail).multiplyScalar(0.5);
    const len = head.distanceTo(tail);

    lineRef.current.position.copy(mid);
    lineRef.current.lookAt(head);
    lineRef.current.scale.set(0.008, 0.008, len);

    // Fade out near end
    const fade = Math.min(1, (6 - s.progress) * 0.5);
    (lineRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.9;

    if (glowRef.current) {
      glowRef.current.position.copy(head);
      glowRef.current.intensity = fade * 1.5;
    }
  });

  return (
    <>
      <mesh ref={lineRef} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#fffbe6" transparent opacity={0.9} />
      </mesh>
      <pointLight ref={glowRef} color="#ffe8a0" intensity={0} distance={0.8} />
    </>
  );
}

/* ── Spaceship 🚀 ── */
function Rocket() {
  const groupRef = useRef<THREE.Group>(null!);
  const flameRef = useRef<THREE.Mesh>(null!);
  const flame2Ref = useRef<THREE.Mesh>(null!);
  const [visible, setVisible] = useState(false);
  const progress = useRef(0);
  const cooldown = useRef(Math.random() * 6 + 5);

  useFrame(({ clock }, delta) => {
    if (!visible) {
      cooldown.current -= delta;
      if (cooldown.current <= 0) {
        setVisible(true);
        progress.current = 0;
      }
      return;
    }

    // Slow graceful arc — takes ~8 seconds to cross
    progress.current += delta * 0.12;
    const t = progress.current;

    // Horizontal arc across the scene, gentle rise over the rings
    const x = -9 + t * 18;
    const y = 1.2 + Math.sin(t * Math.PI) * 2.8; // arcs up over center
    const z = 2 - Math.sin(t * Math.PI) * 1.5;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);

      // Point ship in direction of travel (nose forward along X)
      const nextX = -9 + (t + 0.01) * 18;
      const nextY = 1.2 + Math.sin((t + 0.01) * Math.PI) * 2.8;
      const dx = nextX - x;
      const dy = nextY - y;
      groupRef.current.rotation.z = Math.atan2(dy, dx);
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = 0;
    }

    // Flickering flame
    const flicker = 0.85 + Math.sin(clock.getElapsedTime() * 25) * 0.15;
    if (flameRef.current) flameRef.current.scale.set(1, flicker, 1);
    if (flame2Ref.current) flame2Ref.current.scale.set(1, flicker * 0.9, 1);

    if (t > 1) {
      setVisible(false);
      cooldown.current = 15 + Math.random() * 20;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} scale={[0.12, 0.12, 0.12]}>
      {/* Main fuselage — horizontal, nose points +X */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.3, 1.4, 8, 16]} />
          <meshStandardMaterial color="#c8c0b0" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Nose cone */}
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[0.3, 0.7, 12]} />
          <meshStandardMaterial color="#e8e0d0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Cockpit window */}
        <mesh position={[0, 0.5, 0.28]}>
          <sphereGeometry args={[0.12, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#66ccff" emissive="#3399ff" emissiveIntensity={0.6} metalness={0.9} roughness={0.05} />
        </mesh>

        {/* Side engine pods */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.45, -0.4, 0]}>
            <mesh>
              <capsuleGeometry args={[0.1, 0.6, 6, 8]} />
              <meshStandardMaterial color="#8a8070" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Pod exhaust */}
            <mesh position={[0, -0.5, 0]}>
              <coneGeometry args={[0.08, 0.3, 6]} />
              <meshBasicMaterial color="#ff8833" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}

        {/* Tail fins — swept back */}
        {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.sin(angle) * 0.28, -0.85, Math.cos(angle) * 0.28]} rotation={[0.15 * Math.cos(angle), angle, 0.15 * Math.sin(angle)]}>
            <boxGeometry args={[0.04, 0.4, 0.25]} />
            <meshStandardMaterial color="#9a4040" metalness={0.5} roughness={0.35} />
          </mesh>
        ))}

        {/* Main engine exhaust */}
        <mesh ref={flameRef} position={[0, -1.0, 0]}>
          <coneGeometry args={[0.22, 1.0, 8]} />
          <meshBasicMaterial color="#ff7722" transparent opacity={0.75} />
        </mesh>
        <mesh ref={flame2Ref} position={[0, -1.3, 0]}>
          <coneGeometry args={[0.12, 0.6, 8]} />
          <meshBasicMaterial color="#ffcc44" transparent opacity={0.55} />
        </mesh>

        {/* Engine glow */}
        <pointLight position={[0, -1.2, 0]} color="#ff8822" intensity={3} distance={4} />
      </group>
    </group>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={1.8} />
      <pointLight position={[5, 5, 5]} intensity={1.8} color="#ffe8c0" distance={20} />
      <pointLight position={[-4, 3, -3]} intensity={0.8} color="#88bbff" distance={15} />
      <pointLight position={[0, -3, 4]} intensity={0.6} color="#ffffff" distance={15} />
      {/* Directional "sun" to illuminate the Earth face */}
      <directionalLight position={[3, 2, 4]} intensity={1.2} color="#fff5e0" />

      <Stars count={300} />
      <Earth />
      <Rocket />
      <ShootingStars />

      {orbitConfig.map((orbit, i) => (
        <group key={i}>
          <OrbitRing radius={orbit.radius} color={["#d4a050", "#4da6ff", "#22c5c0", "#c084fc"][i] || "#c8a050"} speed={orbit.speed * 1.2} />
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
      style={{ background: "#0a0e1e" }}
      gl={{ alpha: false, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  </div>
);
