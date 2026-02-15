import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const SIZE = 4;

function TwentyFortyEight() {
  const createEmptyGrid = () => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

  const addRandomTile = (grid) => {
    const newGrid = grid.map(row => [...row]);
    const empty = [];
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE; j++)
        if (newGrid[i][j] === 0) empty.push({ i, j });
    if (empty.length > 0) {
      const { i, j } = empty[Math.floor(Math.random() * empty.length)];
      newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
    return newGrid;
  };

  const initializeGrid = () => {
    let g = createEmptyGrid();
    g = addRandomTile(g);
    g = addRandomTile(g);
    return g;
  };

  const [grid, setGrid] = useState(initializeGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('2048-best') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const moveLeft = (grid) => {
    const newGrid = grid.map(row => [...row]);
    let gained = 0; let moved = false;
    for (let i = 0; i < SIZE; i++) {
      let row = newGrid[i].filter(c => c !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2; gained += row[j];
          row.splice(j + 1, 1); moved = true;
        }
      }
      while (row.length < SIZE) row.push(0);
      if (JSON.stringify(row) !== JSON.stringify(newGrid[i])) moved = true;
      newGrid[i] = row;
    }
    return { grid: newGrid, scoreGained: gained, moved };
  };

  const rotateGrid = (grid) => {
    const n = createEmptyGrid();
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE; j++)
        n[j][SIZE - 1 - i] = grid[i][j];
    return n;
  };

  const canMove = (grid) => {
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 0) return true;
        if (i < SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
        if (j < SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
      }
    return false;
  };

  const move = useCallback((direction) => {
    if (gameOver) return;
    let current = grid.map(row => [...row]);
    const rotations = { up: 3, right: 2, down: 1, left: 0 };
    const rot = rotations[direction] ?? 0;

    for (let i = 0; i < rot; i++) current = rotateGrid(current);
    const { grid: moved, scoreGained, moved: didMove } = moveLeft(current);

    // Fix: unwind correctly
    let result = moved;
    for (let i = 0; i < 4 - rot; i++) result = rotateGrid(result);

    if (didMove) {
      const next = addRandomTile(result);
      setGrid(next);
      setScore(prev => {
        const ns = prev + scoreGained;
        if (ns > bestScore) { setBestScore(ns); localStorage.setItem('2048-best', String(ns)); }
        return ns;
      });
      if (!canMove(next)) setGameOver(true);
      if (next.some(row => row.some(c => c === 2048))) setWon(true);
    }
  }, [grid, gameOver, bestScore]);

  const handleKey = useCallback((e) => {
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
  }, [move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Touch swipe
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const getTileStyle = (value) => {
    const styles = {
      2:    { bg: 'rgba(255,215,0,0.12)', color: '#FFD700',  shadow: 'none' },
      4:    { bg: 'rgba(255,215,0,0.2)',  color: '#FFD700',  shadow: 'none' },
      8:    { bg: 'rgba(212,175,55,0.3)', color: '#FFD700',  shadow: '0 0 10px rgba(212,175,55,0.3)' },
      16:   { bg: 'rgba(212,175,55,0.4)', color: '#fff',     shadow: '0 0 12px rgba(212,175,55,0.4)' },
      32:   { bg: 'rgba(200,160,40,0.5)', color: '#fff',     shadow: '0 0 14px rgba(200,160,40,0.5)' },
      64:   { bg: 'rgba(184,134,11,0.6)', color: '#fff',     shadow: '0 0 18px rgba(184,134,11,0.5)' },
      128:  { bg: 'linear-gradient(135deg, #B8860B, #D4AF37)', color: '#000', shadow: '0 0 20px rgba(212,175,55,0.6)' },
      256:  { bg: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000', shadow: '0 0 24px rgba(255,215,0,0.6)' },
      512:  { bg: 'linear-gradient(135deg, #FFD700, #FFF176)', color: '#000', shadow: '0 0 28px rgba(255,215,0,0.7)' },
      1024: { bg: 'linear-gradient(135deg, #FFF176, #FFD700)', color: '#000', shadow: '0 0 32px rgba(255,215,0,0.8)' },
      2048: { bg: 'linear-gradient(135deg, #FFD700, #fff, #FFD700)', color: '#000', shadow: '0 0 40px rgba(255,215,0,1)' },
    };
    return styles[value] || { bg: 'rgba(212,175,55,0.7)', color: '#000', shadow: '0 0 30px rgba(212,175,55,0.8)' };
  };

  const getFontSize = (value) => {
    if (value >= 1024) return 'text-xl';
    if (value >= 100) return 'text-2xl';
    return 'text-3xl';
  };

  return (
    <div className="max-w-lg mx-auto" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-8">
        {/* Score */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <div className="text-center bg-black/30 border border-amber-500/20 rounded-xl px-5 py-3">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Score</div>
              <motion.div key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                className="text-2xl font-black text-white">{score}</motion.div>
            </div>
            <div className="text-center bg-black/30 border border-amber-500/10 rounded-xl px-5 py-3">
              <div className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">Best</div>
              <div className="text-2xl font-black text-white/70">{bestScore}</div>
            </div>
          </div>
          <div className="text-right text-white/30 text-xs space-y-1">
            <div>Arrow Keys / Swipe</div>
            <div>Reach 2048!</div>
          </div>
        </div>

        {/* Grid */}
        <div
          className="rounded-2xl p-3 mb-6 mx-auto"
          style={{
            width: 'fit-content',
            background: 'rgba(0,0,0,0.6)',
            border: '2px solid rgba(212,175,55,0.15)',
          }}
        >
          <div className="grid grid-cols-4 gap-2">
            {grid.map((row, i) =>
              row.map((cell, j) => {
                const style = cell > 0 ? getTileStyle(cell) : null;
                return (
                  <AnimatePresence key={`${i}-${j}`} mode="wait">
                    <motion.div
                      key={`${i}-${j}-${cell}`}
                      initial={cell > 0 ? { scale: 0.5, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center font-black ${cell > 0 ? getFontSize(cell) : ''}`}
                      style={{
                        background: cell > 0 ? style.bg : 'rgba(255,255,255,0.03)',
                        color: cell > 0 ? style.color : 'transparent',
                        boxShadow: cell > 0 ? style.shadow : 'none',
                        border: cell > 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {cell !== 0 && cell}
                    </motion.div>
                  </AnimatePresence>
                );
              })
            )}
          </div>
        </div>

        {/* Win / Game Over */}
        <AnimatePresence>
          {(won || gameOver) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center mb-4"
            >
              <h3 className="text-3xl font-black gradient-text mb-1">
                {won ? '🏆 You reached 2048!' : 'Game Over!'}
              </h3>
              <p className="text-white/50 text-sm">Score: {score}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <motion.button onClick={resetGame}
            className="px-8 py-4 gold-shimmer text-black font-black rounded-xl text-lg"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            New Game
          </motion.button>
        </div>

        {/* Mobile swipe buttons */}
        <div className="mt-6 flex flex-col items-center gap-2 md:hidden">
          <button className="w-12 h-12 glass rounded-xl text-amber-400 text-xl flex items-center justify-center" onClick={() => move('up')}>▲</button>
          <div className="flex gap-2">
            <button className="w-12 h-12 glass rounded-xl text-amber-400 text-xl flex items-center justify-center" onClick={() => move('left')}>◀</button>
            <button className="w-12 h-12 glass rounded-xl text-amber-400 text-xl flex items-center justify-center" onClick={() => move('down')}>▼</button>
            <button className="w-12 h-12 glass rounded-xl text-amber-400 text-xl flex items-center justify-center" onClick={() => move('right')}>▶</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TwentyFortyEight;
