import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const SYMBOLS = ['🎮', '🎨', '🚀', '⭐', '🔥', '💎', '🎯', '🌟'];
const COLORS = ['#06b6d4', '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316'];

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.max(0, 1.2 - aspect);
    camera.position.z = 8 + t * 6;
    camera.fov = 50 + t * 25;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Card3D({ position, symbol, color, isFlipped, isMatched, onClick, index, cardScale }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const targetRotation = useRef(0);

  useEffect(() => {
    targetRotation.current = isFlipped || isMatched ? Math.PI : 0;
  }, [isFlipped, isMatched]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.current,
        0.12
      );
    }
  });

  const showingFront = isFlipped || isMatched;

  return (
    <group position={position} scale={cardScale}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1.1, 1.4, 0.08]} />
        <meshStandardMaterial
          color={isMatched ? color : '#1a1a35'}
          emissive={isMatched ? color : (isFlipped ? color : '#000000')}
          emissiveIntensity={isMatched ? 0.5 : (isFlipped ? 0.3 : 0)}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      {/* Symbol text rendered as 3D text mesh instead of Html to avoid click issues */}
      {showingFront && (
        <mesh position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial
            color={color}
            emissive={color}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      {!showingFront && (
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      )}
      {isMatched && (
        <pointLight color={color} intensity={2} distance={3} decay={2} />
      )}
    </group>
  );
}

function MemoryScene({ cards, onCardClick }) {
  const { size } = useThree();
  const aspect = size.width / size.height;

  const { positions, cardScale } = useMemo(() => {
    const result = [];
    const s = Math.min(1, Math.max(0.6, aspect / 1.5));
    const gapX = 1.4 * s;
    const gapY = 1.7 * s;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result.push([
          (col - 1.5) * gapX,
          (1.5 - row) * gapY,
          0,
        ]);
      }
    }
    return { positions: result, cardScale: s };
  }, [aspect]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} color="#FFD700" intensity={1} distance={15} />

      <AdaptiveCamera />

      {cards.map((card, i) => (
        <Card3D
          key={card.id}
          index={i}
          position={positions[i]}
          symbol={card.symbol}
          color={COLORS[SYMBOLS.indexOf(card.symbol)]}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          onClick={onCardClick}
          cardScale={cardScale}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-0.3}
        maxAzimuthAngle={0.3}
      />
    </>
  );
}

export default function Memory3D({ onExit }) {
  const createCards = useCallback(() => {
    return [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, i) => ({ id: i, symbol, isFlipped: false, isMatched: false }));
  }, []);

  const [cards, setCards] = useState(createCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);
  const [bestScore] = useState(() => parseInt(localStorage.getItem('memory3d-best') || '0'));

  useEffect(() => {
    if (flipped.length !== 2) return;
    setMoves((m) => m + 1);
    const [a, b] = flipped;
    if (cards[a].symbol === cards[b].symbol) {
      setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, isMatched: true } : c)));
      setMatches((m) => m + 1);
      setFlipped([]);
    } else {
      const timer = setTimeout(() => {
        setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, isFlipped: false } : c)));
        setFlipped([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matches === SYMBOLS.length && matches > 0) {
      setWon(true);
      const finalMoves = moves + 1;
      if (bestScore === 0 || finalMoves < bestScore) {
        localStorage.setItem('memory3d-best', String(finalMoves));
      }
    }
  }, [matches, moves, bestScore]);

  const handleCardClick = useCallback((index) => {
    if (flipped.length >= 2 || cards[index].isFlipped || cards[index].isMatched) return;
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)));
    setFlipped((prev) => [...prev, index]);
  }, [flipped, cards]);

  const reset = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setWon(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <color attach="background" args={['#050510']} />
          <MemoryScene cards={cards} onCardClick={handleCardClick} />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between">
        <button onClick={onExit} className="game-button text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2">EXIT</button>
        <div className="flex gap-2 sm:gap-3">
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className="game-heading text-[9px] sm:text-[10px] text-yellow-400">MOVES: {moves}</span>
          </div>
          <div className="game-card px-2.5 py-1.5 sm:px-4 sm:py-2">
            <span className="game-heading text-[9px] sm:text-[10px] text-cyan-400">MATCHES: {matches}/{SYMBOLS.length}</span>
          </div>
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="game-card p-6 sm:p-8 text-center w-full max-w-sm">
            <div className="text-4xl sm:text-5xl mb-3">🎉</div>
            <h2 className="game-heading text-lg sm:text-xl text-yellow-400 mb-2">YOU WON!</h2>
            <p className="text-gray-300 text-sm mb-4">{moves} moves</p>
            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3">PLAY AGAIN</button>
              <button onClick={onExit} className="game-button text-xs px-5 py-2.5 sm:px-6 sm:py-3 opacity-70">EXIT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
