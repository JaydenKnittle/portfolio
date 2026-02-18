import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Crystals({ color }) {
  const positions = useMemo(() => [
    { pos: [1.5, 0.9, 0.8], rot: [0, 0, 0.2], scale: [0.14, 0.7, 0.14] },
    { pos: [-1.2, 0.9, 1.1], rot: [0.1, 0.5, -0.15], scale: [0.12, 0.55, 0.12] },
    { pos: [0.8, 0.9, -1.3], rot: [-0.1, 0.3, 0.1], scale: [0.1, 0.45, 0.1] },
    { pos: [-0.5, 0.9, -1.6], rot: [0, 0, -0.25], scale: [0.16, 0.65, 0.16] },
  ], []);

  return (
    <group>
      {positions.map((c, i) => (
        <group key={i}>
          <mesh position={c.pos} rotation={c.rot} scale={c.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2.5}
              transparent
              opacity={0.85}
              roughness={0.05}
              metalness={0.95}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={c.pos} color={color} intensity={2} distance={5} decay={2} />
        </group>
      ))}
    </group>
  );
}

function FantasyTrees({ color }) {
  const treeData = useMemo(() => [
    { pos: [1.8, 0.9, -0.5], h: 1.2 },
    { pos: [-1.5, 0.9, -1.0], h: 0.9 },
    { pos: [0.3, 0.9, 1.6], h: 1.0 },
  ], []);

  return (
    <group>
      {treeData.map((t, i) => (
        <group key={i} position={t.pos}>
          <mesh position={[0, t.h * 0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.08, t.h * 0.6, 5]} />
            <meshStandardMaterial color="#5a3d20" roughness={0.9} />
          </mesh>
          <mesh position={[0, t.h * 0.7, 0]}>
            <coneGeometry args={[0.4, t.h * 0.5, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, t.h * 0.95, 0]}>
            <coneGeometry args={[0.28, t.h * 0.35, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.8}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, t.h * 0.8, 0]} color={color} intensity={1.5} distance={4} decay={2} />
        </group>
      ))}
    </group>
  );
}

function GlowMushrooms({ color }) {
  const shrooms = useMemo(() => [
    [1.6, 0.9, 1.0], [-1.8, 0.9, 0.3], [0.5, 0.9, -1.8],
    [-0.8, 0.9, 1.5], [1.0, 0.9, -0.9],
  ], []);

  return (
    <group>
      {shrooms.map((pos, i) => (
        <group key={i} position={pos} scale={0.5 + Math.random() * 0.3}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.3, 6]} />
            <meshStandardMaterial color="#e8dcc8" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={3}
              transparent
              opacity={0.9}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, 0.35, 0]} color={color} intensity={1.5} distance={4} decay={2} />
        </group>
      ))}
    </group>
  );
}

function FloatingRunes({ color }) {
  const runeRef = useRef([]);
  const positions = useMemo(() => [
    [2.0, 1.5, 0], [-1.5, 1.8, 1.0], [0, 2.0, -1.5], [1.2, 1.3, 1.2],
  ], []);

  useFrame(({ clock }) => {
    runeRef.current.forEach((m, i) => {
      if (m) {
        m.position.y = positions[i][1] + Math.sin(clock.elapsedTime * 1.5 + i * 1.5) * 0.3;
        m.rotation.y = clock.elapsedTime * 0.8 + i;
        m.rotation.x = clock.elapsedTime * 0.4;
      }
    });
  });

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i}>
          <mesh ref={(el) => { runeRef.current[i] = el; }} position={pos}>
            <tetrahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={4}
              transparent
              opacity={0.85}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RockScatter() {
  const rocks = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      pos: [
        (Math.random() - 0.5) * 5,
        -0.5 - Math.random() * 1.5,
        (Math.random() - 0.5) * 5,
      ],
      scale: 0.15 + Math.random() * 0.3,
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    })),
  []);

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={r.rot} scale={r.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#1a2030" roughness={0.85} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function GrassTufts({ color }) {
  const tufts = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      pos: [
        (Math.random() - 0.5) * 4.5,
        0.9,
        (Math.random() - 0.5) * 4.5,
      ],
      rot: [0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3],
      h: 0.15 + Math.random() * 0.2,
    })).filter(t => {
      const d = Math.sqrt(t.pos[0] ** 2 + t.pos[2] ** 2);
      return d < 2.5 && d > 0.5;
    }),
  []);

  return (
    <group>
      {tufts.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={t.rot}>
          <coneGeometry args={[0.05, t.h, 3]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

const DECORATION_MAP = {
  about: ({ color }) => (
    <>
      <Crystals color={color} />
      <FloatingRunes color={color} />
      <GrassTufts color="#10b981" />
    </>
  ),
  skills: ({ color }) => (
    <>
      <FantasyTrees color={color} />
      <GlowMushrooms color="#34d399" />
      <GrassTufts color={color} />
    </>
  ),
  projects: ({ color }) => (
    <>
      <Crystals color={color} />
      <GlowMushrooms color={color} />
      <GrassTufts color="#10b981" />
    </>
  ),
  games: ({ color }) => (
    <>
      <GlowMushrooms color={color} />
      <FloatingRunes color={color} />
      <GrassTufts color="#34d399" />
    </>
  ),
  contact: ({ color }) => (
    <>
      <FantasyTrees color="#34d399" />
      <Crystals color={color} />
      <GrassTufts color="#10b981" />
    </>
  ),
};

export default function FloatingIsland({ position, color, id, children }) {
  const groupRef = useRef();
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.6 + timeOffset) * 0.3;
    }
  });

  const Decorations = DECORATION_MAP[id] || (() => null);

  return (
    <group ref={groupRef} position={position}>
      {/* Rock base — lighter colored so it's visible */}
      <mesh castShadow>
        <cylinderGeometry args={[2.8, 1.6, 2.2, 7, 1]} />
        <meshStandardMaterial
          color="#1e2a38"
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Secondary rock layer */}
      <mesh position={[0.3, -0.8, 0.2]} rotation={[0.1, 0.5, 0]}>
        <cylinderGeometry args={[1.8, 0.8, 1.5, 6, 1]} />
        <meshStandardMaterial
          color="#162030"
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Top surface with emerald tint */}
      <mesh position={[0, 1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 7]} />
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.25).addScalar(0.1)}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Glow ring at base — brighter */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 3.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} toneMapped={false} />
      </mesh>

      {/* Strong glow lights */}
      <pointLight position={[0, -2, 0]} color={color} intensity={8} distance={18} decay={2} />
      <pointLight position={[0, 3, 0]} color={color} intensity={4} distance={12} decay={2} />

      <RockScatter />
      <Decorations color={color} />
      {children}
    </group>
  );
}
