import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const BASE_SPEED = 150;

function Snake() {
  const [cellSize, setCellSize] = useState(20);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake-high') || '0'));
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState([]);
  const directionRef = useRef(INITIAL_DIRECTION);

  // Responsive cell size — recalculates on resize
  useEffect(() => {
    const update = () => {
      // 88px accounts for GamePage padding + component padding + board inner padding
      const available = Math.min(window.innerWidth - 88, GRID_SIZE * 20);
      setCellSize(Math.max(12, Math.floor(available / GRID_SIZE)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const generateFood = useCallback((currentSnake) => {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = () => {
    const initSnake = [{ x: 10, y: 10 }];
    setSnake(initSnake);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(initSnake));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
    setParticles([]);
  };

  const handleKeyPress = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    if (e.key === ' ') { setIsPaused(prev => !prev); return; }
    const d = directionRef.current;
    const keyMap = {
      ArrowUp:    d.y === 0 ? { x: 0, y: -1 } : null,
      ArrowDown:  d.y === 0 ? { x: 0, y: 1 }  : null,
      ArrowLeft:  d.x === 0 ? { x: -1, y: 0 } : null,
      ArrowRight: d.x === 0 ? { x: 1, y: 0 }  : null,
    };
    const next = keyMap[e.key];
    if (next) { directionRef.current = next; setDirection(next); e.preventDefault(); }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    const speed = Math.max(60, BASE_SPEED - Math.floor(score / 50) * 10);

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const dir = directionRef.current;
        const newHead = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true); return prevSnake;
        }
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => {
            const next = prev + 10;
            if (next > highScore) { setHighScore(next); localStorage.setItem('snake-high', String(next)); }
            return next;
          });
          setFood(generateFood(newSnake));
          setParticles(prev => [...prev, { id: Date.now(), x: newHead.x * cellSize, y: newHead.y * cellSize }]);
          setTimeout(() => setParticles(prev => prev.slice(1)), 600);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, gameStarted, generateFood, score, highScore, cellSize]);

  // Touch swipe — prevent default to stop page scroll
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    e.preventDefault();
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const d = directionRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && d.x === 0)  { const nd = { x: 1, y: 0 };  directionRef.current = nd; setDirection(nd); }
      if (dx < -20 && d.x === 0) { const nd = { x: -1, y: 0 }; directionRef.current = nd; setDirection(nd); }
    } else {
      if (dy > 20 && d.y === 0)  { const nd = { x: 0, y: 1 };  directionRef.current = nd; setDirection(nd); }
      if (dy < -20 && d.y === 0) { const nd = { x: 0, y: -1 }; directionRef.current = nd; setDirection(nd); }
    }
  };

  const snakeLength = snake.length;
  const boardPx = GRID_SIZE * cellSize;

  return (
    <div
      className="max-w-4xl mx-auto"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-4 sm:p-8">
        {/* Score bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="text-2xl sm:text-4xl font-black gradient-text">Score: {score}</div>
            <div className="text-amber-400/60 text-xs sm:text-sm mt-1">Best: {highScore}</div>
          </div>
          <div className="text-right text-white/40 text-xs space-y-1">
            <div>Length: {snakeLength}</div>
            <div className="hidden sm:block">Arrow Keys / Swipe</div>
            <div className="sm:hidden">Swipe to steer</div>
            <div className="hidden sm:block">Space to pause</div>
          </div>
        </div>

        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center text-amber-400 font-black text-xl mb-4 tracking-widest"
            >
              ⏸ PAUSED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div
            className="rounded-2xl p-2 relative"
            style={{
              width: boardPx + 16,
              height: boardPx + 16,
              background: 'rgba(0,0,0,0.7)',
              border: '2px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 40px rgba(212,175,55,0.05) inset',
            }}
          >
            {/* Subtle grid lines */}
            <div
              className="absolute inset-2 opacity-5"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
                backgroundSize: `${cellSize}px ${cellSize}px`,
              }}
            />

            <div className="relative" style={{ width: boardPx, height: boardPx }}>
              {/* Eat particles */}
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: p.x, top: p.y, width: cellSize, height: cellSize,
                    background: 'radial-gradient(circle, #FFD700, transparent)',
                  }}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              ))}

              {/* Snake body — rounded segments for smooth look */}
              {snake.map((segment, index) => {
                const isHead = index === 0;
                const ratio = snakeLength > 1 ? index / (snakeLength - 1) : 0;
                const eyeSize = Math.max(2, Math.round(cellSize * 0.13));
                return (
                  <motion.div
                    key={index}
                    initial={isHead ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.08 }}
                    className="absolute"
                    style={{
                      left: segment.x * cellSize + 1,
                      top: segment.y * cellSize + 1,
                      width: cellSize - 2,
                      height: cellSize - 2,
                      borderRadius: isHead ? '35%' : '50%',
                      background: isHead
                        ? 'linear-gradient(135deg, #FFD700, #B8860B)'
                        : `rgba(${Math.round(200 - ratio * 80)}, ${Math.round(160 - ratio * 80)}, ${Math.round(40 - ratio * 20)}, ${0.9 - ratio * 0.35})`,
                      boxShadow: isHead ? `0 0 ${cellSize * 0.6}px rgba(255,215,0,0.6)` : 'none',
                      zIndex: snake.length - index,
                    }}
                  >
                    {isHead && (
                      <>
                        <div className="absolute rounded-full bg-black" style={{
                          width: eyeSize, height: eyeSize,
                          top: direction.y < 0 ? '18%' : direction.y > 0 ? '65%' : '22%',
                          left: direction.x > 0 ? '60%' : direction.x < 0 ? '12%' : '20%',
                        }} />
                        <div className="absolute rounded-full bg-black" style={{
                          width: eyeSize, height: eyeSize,
                          top: direction.y < 0 ? '18%' : direction.y > 0 ? '65%' : '22%',
                          left: direction.x > 0 ? '78%' : direction.x < 0 ? '30%' : '56%',
                        }} />
                      </>
                    )}
                  </motion.div>
                );
              })}

              {/* Food */}
              <motion.div
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute rounded-full"
                style={{
                  left: food.x * cellSize + Math.round(cellSize * 0.1),
                  top: food.y * cellSize + Math.round(cellSize * 0.1),
                  width: cellSize - Math.round(cellSize * 0.2),
                  height: cellSize - Math.round(cellSize * 0.2),
                  background: 'radial-gradient(circle at 35% 35%, #ff8080, #c0392b)',
                  boxShadow: '0 0 12px rgba(255, 80, 80, 0.8)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Game Over / Start overlay */}
        <AnimatePresence>
          {(gameOver || !gameStarted) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              {gameOver && (
                <div className="mb-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">Game Over!</h3>
                  <p className="text-amber-400">Score: {score} {score > 0 && score >= highScore ? '🏆 New Best!' : ''}</p>
                </div>
              )}
              <motion.button
                onClick={resetGame}
                className="px-8 py-4 gold-shimmer text-black font-black rounded-xl text-lg"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {gameStarted ? 'Play Again' : 'Start Game'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Snake;
