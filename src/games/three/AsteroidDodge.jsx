import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.max(0, 1.2 - aspect);
    camera.fov = 55 + t * 25;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Ship({ positionRef }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, positionRef.current.x, 0.18);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, positionRef.current.y, 0.18);
      // Tilt based on movement
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -positionRef.current.vx * 0.3,
        0.1
      );
    }
  });

  return (
    <group ref={meshRef}>
      {/* Ship body — facing forward (toward -z) */}
      <mesh>
        <coneGeometry args={[0.4, 1.2, 4]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.5, -0.1, 0.2]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.5, -0.1, 0.2]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} metalness={0.9} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -0.7, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, -0.7, 0]} color="#06b6d4" intensity={4} distance={5} />
      <pointLight position={[0, 0, 0]} color="#FFD700" intensity={3} distance={4} />
    </group>
  );
}

// All game logic runs inside the Canvas in a single useFrame
function GameLogic({ shipPos, asteroidRefs, onCollision, onScore, gameOver, started, difficulty }) {
  const spawnTimer = useRef(0);
  const scoreTimer = useRef(0);
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!started || gameOver) return;
    const dt = Math.min(delta, 0.05);
    const BOUNDS = { x: 4, y: 3 };
    const MOVE_SPEED = 8;

    // Keyboard movement — smooth
    let mx = 0, my = 0;
    if (keys.current['a'] || keys.current['arrowleft']) mx -= 1;
    if (keys.current['d'] || keys.current['arrowright']) mx += 1;
    if (keys.current['w'] || keys.current['arrowup']) my += 1;
    if (keys.current['s'] || keys.current['arrowdown']) my -= 1;

    shipPos.current.x += mx * MOVE_SPEED * dt;
    shipPos.current.y += my * MOVE_SPEED * dt;
    shipPos.current.x = Math.max(-BOUNDS.x, Math.min(BOUNDS.x, shipPos.current.x));
    shipPos.current.y = Math.max(-BOUNDS.y, Math.min(BOUNDS.y, shipPos.current.y));
    shipPos.current.vx = mx * MOVE_SPEED;

    // Spawn asteroids
    const spawnRate = Math.max(0.2, 0.6 - difficulty.current * 0.02);
    spawnTimer.current += dt;
    if (spawnTimer.current > spawnRate) {
      spawnTimer.current = 0;
      // Find an empty slot
      for (let i = 0; i < asteroidRefs.current.length; i++) {
        if (!asteroidRefs.current[i].active) {
          const a = asteroidRefs.current[i];
          a.active = true;
          a.x = (Math.random() - 0.5) * BOUNDS.x * 2;
          a.y = (Math.random() - 0.5) * BOUNDS.y * 2;
          a.z = -50;
          a.speed = 15 + Math.random() * 10 + difficulty.current * 0.5;
          a.size = 0.3 + Math.random() * 0.5;
          break;
        }
      }
    }

    // Move asteroids + collision check
    const sx = shipPos.current.x;
    const sy = shipPos.current.y;
    for (let i = 0; i < asteroidRefs.current.length; i++) {
      const a = asteroidRefs.current[i];
      if (!a.active) continue;
      a.z += a.speed * dt;
      a.rotX += 2 * dt;
      a.rotY += 1.5 * dt;

      // Collision — check when asteroid is near the ship plane (z ≈ 0)
      if (a.z > -1.5 && a.z < 1.5) {
        const dist = Math.sqrt((a.x - sx) ** 2 + (a.y - sy) ** 2);
        if (dist < a.size + 0.5) {
          onCollision();
          return;
        }
      }

      // Remove when past camera
      if (a.z > 8) {
        a.active = false;
      }
    }

    // Score
    scoreTimer.current += dt;
    if (scoreTimer.current > 0.2) {
      scoreTimer.current = 0;
      onScore();
    }
  });

  return null;
}

function AsteroidMeshes({ asteroidRefs }) {
  const meshRefs = useRef([]);
  const MAX = 40;

  useFrame(() => {
    for (let i = 0; i < MAX; i++) {
      const mesh = meshRefs.current[i];
      const data = asteroidRefs.current[i];
      if (!mesh) continue;
      if (data.active) {
        mesh.visible = true;
        mesh.position.set(data.x, data.y, data.z);
        mesh.rotation.x = data.rotX;
        mesh.rotation.y = data.rotY;
        mesh.scale.setScalar(data.size);
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} visible={false}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6b4423" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = -Math.random() * 100 - 10;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={300} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.1} sizeAttenuation />
    </points>
  );
}

function GameScene({ shipPos, asteroidRefs, onCollision, onScore, gameOver, started, difficulty }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <fog attach="fog" args={['#050510', 8, 55]} />

      <AdaptiveCamera />
      <Ship positionRef={shipPos} />
      <AsteroidMeshes asteroidRefs={asteroidRefs} />
      <Stars />

      <GameLogic
        shipPos={shipPos}
        asteroidRefs={asteroidRefs}
        onCollision={onCollision}
        onScore={onScore}
        gameOver={gameOver}
        started={started}
        difficulty={difficulty}
      />
    </>
  );
}

export default function AsteroidDodge({ onExit }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const shipPos = useRef({ x: 0, y: 0, vx: 0 });
  const difficulty = useRef(0);
  const scoreRef = useRef(0);

  // Pre-allocate asteroid pool
  const asteroidRefs = useRef(
    Array.from({ length: 40 }, () => ({
      active: false, x: 0, y: 0, z: -50, speed: 15, size: 0.4,
      rotX: Math.random() * Math.PI, rotY: Math.random() * Math.PI,
    }))
  );

  // Touch/mouse — absolute position mapping (finger position = ship position)
  const onPointerMove = useCallback((e) => {
    if (!started || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const nx = ((e.clientX - rect.left) - cx) / cx;
    const ny = -((e.clientY - rect.top) - cy) / cy;
    shipPos.current.x = nx * 4;
    shipPos.current.y = ny * 3;
  }, [started, gameOver]);

  const onCollision = useCallback(() => {
    setGameOver(true);
    const best = parseInt(localStorage.getItem('asteroid-best') || '0');
    if (scoreRef.current > best) localStorage.setItem('asteroid-best', String(scoreRef.current));
  }, []);

  const onScore = useCallback(() => {
    setScore((s) => {
      const next = s + 1;
      scoreRef.current = next;
      difficulty.current = next;
      return next;
    });
  }, []);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    difficulty.current = 0;
    shipPos.current = { x: 0, y: 0, vx: 0 };
    // Reset all asteroids
    asteroidRefs.current.forEach((a) => { a.active = false; });
  };

  const best = parseInt(localStorage.getItem('asteroid-best') || '0');

  return (
    <div
      className="fixed inset-0 z-50"
      onPointerMove={onPointerMove}
      style={{ touchAction: 'none' }}
    >
      <Canvas camera={{ position: [0, 2, 8], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050510']} />
          <GameScene
            shipPos={shipPos}
            asteroidRefs={asteroidRefs}
            onCollision={onCollision}
            onScore={onScore}
            gameOver={gameOver}
            started={started}
            difficulty={difficulty}
          />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between">
        <button onClick={onExit} className="game-button text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">EXIT</button>
        <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
          <span className="game-heading text-[10px] sm:text-sm text-yellow-400">SCORE: {score}</span>
        </div>
      </div>

      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">🚀</div>
            <h2 className="game-heading text-lg sm:text-xl text-white mb-2">ASTEROID DODGE</h2>
            <p className="text-gray-400 text-sm mb-2">
              Dodge the incoming asteroids!
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Desktop: WASD / Arrow keys<br />
              Mobile: Move finger to steer
            </p>
            {best > 0 && (
              <p className="text-cyan-400 text-xs mb-4">Best: {best}</p>
            )}
            <button onClick={startGame} className="game-button text-sm px-8 py-4">START</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">💥</div>
            <h2 className="game-heading text-lg sm:text-xl text-red-400 mb-2">GAME OVER</h2>
            <p className="game-heading text-base sm:text-lg text-yellow-400 mb-1">SCORE: {score}</p>
            {score >= best && score > 0 && (
              <p className="text-cyan-400 text-xs mb-3">NEW BEST!</p>
            )}
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={startGame} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3">RETRY</button>
              <button onClick={onExit} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3 opacity-70">EXIT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
