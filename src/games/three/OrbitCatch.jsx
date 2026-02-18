import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.max(0, 1.2 - aspect);
    camera.position.set(0, 5 + t * 3, 8 + t * 6);
    camera.fov = 50 + t * 20;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

const ORB_COLORS = ['#06b6d4', '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];

function OrbTarget({ orb, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * orb.speed + orb.phase;
    meshRef.current.position.x = Math.cos(t) * orb.radius;
    meshRef.current.position.y = Math.sin(t * 0.7) * orb.radius * 0.5 + orb.yOffset;
    meshRef.current.position.z = Math.sin(t) * orb.radius;
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick(orb.id);
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[orb.size, 16, 16]} />
      <meshStandardMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={hovered ? 3 : 1}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
      <pointLight color={orb.color} intensity={hovered ? 4 : 1.5} distance={4} />
    </mesh>
  );
}

function CatchParticle({ position, color }) {
  const meshRef = useRef();
  const scale = useRef(1);

  useFrame((_, delta) => {
    if (meshRef.current) {
      scale.current *= 0.92;
      meshRef.current.scale.setScalar(scale.current);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function GameScene({ orbs, onCatchOrb, particles }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} />

      <AdaptiveCamera />

      {/* Central anchor */}
      <mesh>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight color="#FFD700" intensity={3} distance={10} />

      {/* Orbit rings */}
      {[2, 3.5, 5].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.01, r + 0.01, 64]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
        </mesh>
      ))}

      {orbs.map((orb) => (
        <OrbTarget key={orb.id} orb={orb} onClick={onCatchOrb} />
      ))}

      {particles.map((p) => (
        <CatchParticle key={p.id} position={p.position} color={p.color} />
      ))}
    </>
  );
}

export default function OrbitCatch({ onExit }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [orbs, setOrbs] = useState([]);
  const [particles, setParticles] = useState([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const spawnTimer = useRef(null);
  const missTimer = useRef(null);

  const spawnOrb = useCallback(() => {
    const id = nextId.current++;
    const orbData = {
      id,
      radius: 2 + Math.random() * 3,
      speed: 0.8 + Math.random() * 1.5 + score * 0.02,
      phase: Math.random() * Math.PI * 2,
      yOffset: (Math.random() - 0.5) * 2,
      size: 0.2 + Math.random() * 0.15,
      color: ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)],
      spawnTime: Date.now(),
    };
    setOrbs((prev) => [...prev, orbData]);
  }, [score]);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setOrbs([]);
    setParticles([]);
  };

  useEffect(() => {
    if (!started || gameOver) return;
    const rate = Math.max(600, 1500 - score * 15);
    spawnTimer.current = setInterval(spawnOrb, rate);
    return () => clearInterval(spawnTimer.current);
  }, [started, gameOver, spawnOrb, score]);

  // Remove orbs that are too old (missed)
  useEffect(() => {
    if (!started || gameOver) return;
    missTimer.current = setInterval(() => {
      const now = Date.now();
      setOrbs((prev) => {
        const expired = prev.filter((o) => now - o.spawnTime > 5000);
        if (expired.length > 0) {
          setLives((l) => {
            const next = l - expired.length;
            if (next <= 0) setGameOver(true);
            return Math.max(0, next);
          });
          return prev.filter((o) => now - o.spawnTime <= 5000);
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(missTimer.current);
  }, [started, gameOver]);

  const onCatchOrb = useCallback((id) => {
    setOrbs((prev) => {
      const orb = prev.find((o) => o.id === id);
      if (orb) {
        setScore((s) => s + 10);
        setParticles((p) => [...p, {
          id: Date.now(),
          position: [Math.cos(Date.now() * orb.speed) * orb.radius, orb.yOffset, Math.sin(Date.now() * orb.speed) * orb.radius],
          color: orb.color,
        }]);
        setTimeout(() => setParticles((p) => p.slice(1)), 500);
      }
      return prev.filter((o) => o.id !== id);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050510']} />
          <GameScene orbs={orbs} onCatchOrb={onCatchOrb} particles={particles} />
        </Suspense>
      </Canvas>

      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between">
        <button onClick={onExit} className="game-button text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">EXIT</button>
        <div className="flex gap-2 sm:gap-3">
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className="game-heading text-[9px] sm:text-[10px] text-yellow-400">SCORE: {score}</span>
          </div>
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className="game-heading text-[9px] sm:text-[10px] text-red-400">
              {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
            </span>
          </div>
        </div>
      </div>

      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">🌀</div>
            <h2 className="game-heading text-lg sm:text-xl text-white mb-2">ORBIT CATCH</h2>
            <p className="text-gray-400 text-sm mb-4">Tap orbiting objects before they vanish!</p>
            <button onClick={startGame} className="game-button text-sm px-8 py-4">START</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">💫</div>
            <h2 className="game-heading text-lg sm:text-xl text-yellow-400 mb-2">GAME OVER</h2>
            <p className="game-heading text-base sm:text-lg text-cyan-400 mb-4">SCORE: {score}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3">RETRY</button>
              <button onClick={onExit} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3 opacity-70">EXIT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
