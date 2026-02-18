import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.max(0, 1.2 - aspect);
    camera.position.set(0, 10 + t * 6, 6 + t * 3);
    camera.fov = 45 + t * 20;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Platform({ tiltRef }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, tiltRef.current.y * 0.15, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -tiltRef.current.x * 0.15, 0.1);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[8, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a35" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.05} wireframe />
      </mesh>
      {[[-4, 0], [4, 0], [0, -4], [0, 4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <boxGeometry args={[x === 0 ? 8.2 : 0.1, 0.2, z === 0 ? 8.2 : 0.1]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Marble({ posRef }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = posRef.current.x;
      meshRef.current.position.z = posRef.current.z;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.25, 0]}>
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
      </mesh>
      <pointLight color="#FFD700" intensity={2} distance={4} />
    </group>
  );
}

// Orbs are now ref-driven — no React state updates on collection
function OrbField({ orbData, orbMeshRefs }) {
  useFrame(({ clock }) => {
    for (let i = 0; i < orbData.current.length; i++) {
      const mesh = orbMeshRefs.current[i];
      const orb = orbData.current[i];
      if (!mesh) continue;
      if (orb.collected) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
        mesh.position.y = 0.5 + Math.sin(clock.elapsedTime * 2 + orb.pos[0]) * 0.2;
        mesh.rotation.y = clock.elapsedTime * 2;
      }
    }
  });

  return (
    <>
      {orbData.current.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => { orbMeshRefs.current[i] = el; }}
          position={orb.pos}
        >
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} transparent opacity={0.9} />
          <pointLight color="#06b6d4" intensity={1.5} distance={3} />
        </mesh>
      ))}
    </>
  );
}

function GameLogic({ tiltRef, marblePos, orbData, gameOver, onCollect }) {
  const velocity = useRef({ x: 0, z: 0 });
  const GRAVITY = 15;
  const FRICTION = 0.97;
  const BOUNDS = 3.7;

  useFrame((_, delta) => {
    if (gameOver) return;
    const dt = Math.min(delta, 0.05);

    velocity.current.x += tiltRef.current.x * GRAVITY * dt;
    velocity.current.z += tiltRef.current.y * GRAVITY * dt;
    velocity.current.x *= FRICTION;
    velocity.current.z *= FRICTION;

    marblePos.current.x += velocity.current.x * dt;
    marblePos.current.z += velocity.current.z * dt;

    if (Math.abs(marblePos.current.x) > BOUNDS) {
      marblePos.current.x = Math.sign(marblePos.current.x) * BOUNDS;
      velocity.current.x *= -0.5;
    }
    if (Math.abs(marblePos.current.z) > BOUNDS) {
      marblePos.current.z = Math.sign(marblePos.current.z) * BOUNDS;
      velocity.current.z *= -0.5;
    }

    // Orb collection — pure ref check, no state
    for (let i = 0; i < orbData.current.length; i++) {
      const orb = orbData.current[i];
      if (orb.collected) continue;
      const dx = marblePos.current.x - orb.pos[0];
      const dz = marblePos.current.z - orb.pos[2];
      if (Math.sqrt(dx * dx + dz * dz) < 0.5) {
        orb.collected = true;
        onCollect();
      }
    }
  });

  return null;
}

const ORB_POSITIONS = [
  [2, 0.5, 2], [-2, 0.5, -2], [3, 0.5, -1], [-1, 0.5, 3],
  [0, 0.5, -3], [-3, 0.5, 0], [1.5, 0.5, -2.5], [-2.5, 0.5, 1.5],
  [0, 0.5, 0], [2.5, 0.5, 2.5], [-1.5, 0.5, -1.5], [3.5, 0.5, 0],
];

export default function MarbleRun({ onExit }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const tiltRef = useRef({ x: 0, y: 0 });
  const marblePos = useRef({ x: 0, z: 0 });
  const collected = useRef(0);
  const orbMeshRefs = useRef([]);

  // Ref-based orb data — no state updates on collection
  const orbData = useRef(ORB_POSITIONS.map((pos) => ({ pos, collected: false })));

  useEffect(() => {
    const keys = {};
    const handleKey = (e) => {
      keys[e.key] = true;
      const step = 0.3;
      if (e.key === 'ArrowLeft' || e.key === 'a') tiltRef.current.x = Math.max(tiltRef.current.x - step, -1);
      if (e.key === 'ArrowRight' || e.key === 'd') tiltRef.current.x = Math.min(tiltRef.current.x + step, 1);
      if (e.key === 'ArrowUp' || e.key === 'w') tiltRef.current.y = Math.max(tiltRef.current.y - step, -1);
      if (e.key === 'ArrowDown' || e.key === 's') tiltRef.current.y = Math.min(tiltRef.current.y + step, 1);
    };
    const handleKeyUp = (e) => {
      keys[e.key] = false;
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) tiltRef.current.x *= 0.3;
      if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) tiltRef.current.y *= 0.3;
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch/mouse tilt
  const onPointerMove = (e) => {
    if (!started || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    tiltRef.current.x = ((e.clientX - rect.left) - cx) / cx;
    tiltRef.current.y = ((e.clientY - rect.top) - cy) / cy;
  };

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  // Called from useFrame when orb is collected — lightweight
  const onCollect = useCallback(() => {
    collected.current += 1;
    const newScore = collected.current * 10;
    setScore(newScore);
    if (collected.current === ORB_POSITIONS.length) {
      setGameOver(true);
    }
  }, []);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    collected.current = 0;
    marblePos.current = { x: 0, z: 0 };
    tiltRef.current = { x: 0, y: 0 };
    orbData.current = ORB_POSITIONS.map((pos) => ({ pos, collected: false }));
  };

  return (
    <div className="fixed inset-0 z-50" onPointerMove={onPointerMove} style={{ touchAction: 'none' }}>
      <Canvas camera={{ position: [0, 10, 6], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 15, 5]} intensity={0.5} />
          <pointLight position={[0, 5, 0]} color="#FFD700" intensity={1} distance={20} />

          <AdaptiveCamera />
          <Platform tiltRef={tiltRef} />
          <Marble posRef={marblePos} />
          <OrbField orbData={orbData} orbMeshRefs={orbMeshRefs} />
          {started && !gameOver && (
            <GameLogic
              tiltRef={tiltRef}
              marblePos={marblePos}
              orbData={orbData}
              gameOver={gameOver}
              onCollect={onCollect}
            />
          )}
        </Suspense>
      </Canvas>

      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between">
        <button onClick={onExit} className="game-button text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">EXIT</button>
        <div className="flex gap-2 sm:gap-3">
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className="game-heading text-[9px] sm:text-[10px] text-yellow-400">
              GEMS: {score / 10}/{ORB_POSITIONS.length}
            </span>
          </div>
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className={`game-heading text-[9px] sm:text-[10px] ${timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400'}`}>
              TIME: {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">🔮</div>
            <h2 className="game-heading text-lg sm:text-xl text-white mb-2">MARBLE RUN</h2>
            <p className="text-gray-400 text-sm mb-2">Tilt the platform to collect all gems!</p>
            <p className="text-gray-500 text-xs mb-4">
              Desktop: Arrow keys / WASD<br />
              Mobile: Move finger to tilt
            </p>
            <button onClick={startGame} className="game-button text-sm px-8 py-4">START</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">{collected.current === ORB_POSITIONS.length ? '🏆' : '⏰'}</div>
            <h2 className="game-heading text-lg sm:text-xl text-yellow-400 mb-2">
              {collected.current === ORB_POSITIONS.length ? 'ALL COLLECTED!' : 'TIME UP!'}
            </h2>
            <p className="game-heading text-base sm:text-lg text-cyan-400 mb-4">
              {collected.current}/{ORB_POSITIONS.length} GEMS
            </p>
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
