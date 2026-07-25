import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function HoloPanel({
  position,
  rotation,
  children,
  color = '#0c1020',
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  children?: React.ReactNode;
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[2.45, 1.55, 0.07]} radius={0.07} smoothness={4}>
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.18}
          transparent
          opacity={0.9}
          emissive="#1a1040"
          emissiveIntensity={0.35}
        />
      </RoundedBox>
      {/* Inner glow plane */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[2.28, 1.38]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* Edge highlight */}
      <RoundedBox args={[2.48, 1.58, 0.02]} radius={0.07} smoothness={4} position={[0, 0, -0.02]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
      </RoundedBox>
      {children}
    </group>
  );
}

function SignalBars() {
  const group = useRef<THREE.Group>(null);
  const heights = useMemo(
    () => [0.25, 0.4, 0.55, 0.35, 0.7, 0.5, 0.85, 0.45, 0.6, 0.3, 0.75, 0.5],
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const base = heights[i];
      const h = base * (0.75 + 0.35 * Math.sin(t * 2.2 + i * 0.55));
      mesh.scale.y = h / base;
      mesh.position.y = h / 2 - 0.1;
    });
  });

  return (
    <group ref={group} position={[0, -0.38, 0.05]}>
      {heights.map((h, i) => {
        const color = h > 0.55 ? '#34d399' : h > 0.35 ? '#f5c451' : '#22d3ee';
        return (
          <mesh key={i} position={[-0.92 + i * 0.16, h / 2 - 0.1, 0]}>
            <boxGeometry args={[0.1, h, 0.05]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.75}
              metalness={0.55}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function OrbitRing({ radius, speed, color, tilt = 0.2 }: { radius: number; speed: number; color: string; tilt?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.35, tilt, 0]}>
      <torusGeometry args={[radius, 0.01, 12, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, 0, -1.2]} scale={0.55}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#1a1040"
        emissive="#7c3aed"
        emissiveIntensity={0.6}
        metalness={0.85}
        roughness={0.2}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.22) * 0.38 + 0.2;
      group.current.rotation.x = Math.sin(t * 0.16) * 0.1;
      group.current.position.y = Math.sin(t * 0.55) * 0.1;
    }
    if (glow.current) {
      const mat = glow.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(t * 1.8) * 0.04;
    }
  });

  const particles = useMemo(() => {
    const pts = new Float32Array(240);
    for (let i = 0; i < 80; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 9;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pts;
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 4, 5]} intensity={1.4} color="#f5c451" />
      <pointLight position={[-5, -2, 4]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[0, 4, -2]} intensity={0.9} color="#a78bfa" />
      <pointLight position={[2, -3, 2]} intensity={0.5} color="#e879f9" />
      <spotLight position={[0, 6, 2]} angle={0.4} penumbra={0.6} intensity={0.8} color="#ffffff" />

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.028} color="#a78bfa" transparent opacity={0.7} sizeAttenuation />
      </points>

      <group ref={group}>
        <OrbitRing radius={2.7} speed={0.18} color="#f5c451" />
        <OrbitRing radius={3.15} speed={-0.12} color="#22d3ee" tilt={-0.15} />
        <OrbitRing radius={3.55} speed={0.09} color="#a78bfa" tilt={0.35} />
        <OrbitRing radius={3.95} speed={-0.06} color="#e879f9" tilt={0.1} />

        <CoreOrb />

        <Float speed={1.15} rotationIntensity={0.12} floatIntensity={0.35}>
          <HoloPanel position={[0, 0.15, 0.2]}>
            <Text position={[-0.88, 0.52, 0.06]} fontSize={0.095} color="#f5c451" anchorX="left">
              BLACKBOXFX v3.0
            </Text>
            <Text position={[-0.88, 0.3, 0.06]} fontSize={0.145} color="#34d399" anchorX="left">
              BUY  ·  CONF 8.7
            </Text>
            <Text position={[-0.88, 0.12, 0.06]} fontSize={0.068} color="#9494a8" anchorX="left">
              XAUUSD  ·  H1  ·  TREND BULL
            </Text>
            <Text position={[0.52, 0.3, 0.06]} fontSize={0.078} color="#22d3ee" anchorX="left">
              TP1 2385.2
            </Text>
            <Text position={[0.52, 0.16, 0.06]} fontSize={0.078} color="#22d3ee" anchorX="left">
              TP2 2392.8
            </Text>
            <Text position={[0.52, 0.02, 0.06]} fontSize={0.078} color="#a78bfa" anchorX="left">
              TP3 2405.0
            </Text>
            <Text position={[0.52, -0.14, 0.06]} fontSize={0.078} color="#fb7185" anchorX="left">
              SL  2368.4
            </Text>
            <SignalBars />
          </HoloPanel>

          <HoloPanel position={[2.15, 0.6, -0.55]} rotation={[0, -0.48, 0.04]} color="#0e0a1a">
            <Text position={[0, 0.48, 0.06]} fontSize={0.085} color="#a78bfa" anchorX="center">
              CURRENCY STRENGTH
            </Text>
            {['USD', 'EUR', 'GBP', 'JPY', 'XAU'].map((p, i) => (
              <group key={p} position={[-0.72, 0.22 - i * 0.18, 0.06]}>
                <Text fontSize={0.075} color="#c8c8d8" anchorX="left">
                  {p}
                </Text>
                <mesh position={[0.88, 0, 0]}>
                  <boxGeometry args={[(0.95 * ((i % 3) + 2)) / 5, 0.055, 0.02]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? '#34d399' : '#22d3ee'}
                    emissive={i % 2 === 0 ? '#34d399' : '#22d3ee'}
                    emissiveIntensity={0.55}
                  />
                </mesh>
              </group>
            ))}
          </HoloPanel>

          <HoloPanel position={[-2.1, -0.3, -0.45]} rotation={[0, 0.52, -0.03]} color="#0a1218">
            <Text position={[0, 0.48, 0.06]} fontSize={0.085} color="#22d3ee" anchorX="center">
              WIN RATE STATS
            </Text>
            <Text position={[0, 0.08, 0.06]} fontSize={0.34} color="#34d399" anchorX="center">
              78.4%
            </Text>
            <Text position={[0, -0.28, 0.06]} fontSize={0.068} color="#9494a8" anchorX="center">
              TREND ANALYSIS · AI LOCKED
            </Text>
            <Text position={[0, -0.45, 0.06]} fontSize={0.078} color="#f5c451" anchorX="center">
              SELL FILTER ACTIVE
            </Text>
          </HoloPanel>

          <Float speed={2.2} floatIntensity={0.9}>
            <RoundedBox args={[1.15, 0.42, 0.06]} radius={0.06} position={[0.25, 1.5, 0.45]}>
              <meshStandardMaterial
                color="#062018"
                emissive="#34d399"
                emissiveIntensity={0.45}
                metalness={0.65}
                roughness={0.25}
              />
            </RoundedBox>
            <Text position={[0.25, 1.5, 0.5]} fontSize={0.12} color="#34d399" anchorX="center">
              BUY SIGNAL
            </Text>
          </Float>

          <Float speed={1.6} floatIntensity={0.7}>
            <RoundedBox args={[1.4, 0.38, 0.06]} radius={0.06} position={[-0.35, -1.25, 0.35]}>
              <meshStandardMaterial
                color="#1a1408"
                emissive="#f5c451"
                emissiveIntensity={0.4}
                metalness={0.65}
                roughness={0.25}
              />
            </RoundedBox>
            <Text position={[-0.35, -1.25, 0.4]} fontSize={0.1} color="#ffe08a" anchorX="center">
              CONFIDENCE 9.1
            </Text>
          </Float>
        </Float>

        <mesh ref={glow} position={[0, 0, -0.4]}>
          <sphereGeometry args={[2.4, 32, 32]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.12} />
        </mesh>
      </group>
    </>
  );
}

export default function HeroTerminal() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0.2, 0.15, 6.8]} fov={40} />
        <Scene />
      </Canvas>
    </div>
  );
}
