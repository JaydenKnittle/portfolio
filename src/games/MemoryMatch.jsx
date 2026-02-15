import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const EMOJIS = ['🎮', '🎨', '🚀', '⭐', '🔥', '💎', '🎯', '🌟'];

function MemoryMatch() {
  const createCards = () =>
    [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));

  const [cards, setCards] = useState(createCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('memory-best') || '0'));
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Match logic
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    const [first, second] = flippedCards;
    setMoves(m => m + 1);

    if (cards[first].emoji === cards[second].emoji) {
      setCards(prev => prev.map((c, i) =>
        i === first || i === second ? { ...c, isMatched: true } : c
      ));
      setMatches(m => m + 1);
      setFlippedCards([]);
    } else {
      const timer = setTimeout(() => {
        setCards(prev => prev.map((c, i) =>
          i === first || i === second ? { ...c, isFlipped: false } : c
        ));
        setFlippedCards([]);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);

  // Win check
  useEffect(() => {
    if (matches === EMOJIS.length && matches > 0) {
      setGameWon(true);
      setRunning(false);
      if (bestScore === 0 || moves + 1 < bestScore) {
        const newBest = moves + 1;
        setBestScore(newBest);
        localStorage.setItem('memory-best', String(newBest));
      }
    }
  }, [matches, moves, bestScore]);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    if (!running && !gameWon) setRunning(true);
    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));
    setFlippedCards(prev => [...prev, index]);
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setElapsed(0);
    setRunning(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-4 sm:p-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex gap-3 sm:gap-6">
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Moves</div>
              <motion.div key={moves} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-2xl font-black text-white">{moves}</motion.div>
            </div>
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Matches</div>
              <div className="text-2xl font-black text-white">{matches}<span className="text-white/30 text-lg">/{EMOJIS.length}</span></div>
            </div>
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Time</div>
              <div className="text-2xl font-black text-white font-mono">{formatTime(elapsed)}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {bestScore > 0 && <div className="text-white/30 text-xs">Best: {bestScore} moves</div>}
            <motion.button
              onClick={resetGame}
              className="px-5 py-2 gold-shimmer text-black font-bold rounded-xl text-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              New Game
            </motion.button>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {cards.map((card, index) => {
            const isVisible = card.isFlipped || card.isMatched;
            return (
              <div
                key={card.id}
                className="aspect-square cursor-pointer"
                style={{ perspective: '600px' }}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isVisible ? 0 : 180 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  {/* Front (emoji face) */}
                  <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: card.isMatched
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,215,0,0.1))'
                        : 'rgba(255,255,255,0.06)',
                      border: card.isMatched ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: card.isMatched ? '0 0 15px rgba(212,175,55,0.2)' : 'none',
                    }}
                  >
                    <AnimatePresence>
                      {isVisible && (
                        <motion.span
                          initial={{ scale: 0.5 }}
                          animate={{ scale: card.isMatched ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: card.isMatched ? 0.4 : 0.2 }}
                        >
                          {card.emoji}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Back (card back design) */}
                  <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(135deg, #1a1400, #0d0d00)',
                      border: '1px solid rgba(212,175,55,0.25)',
                    }}
                  >
                    {/* Gold pattern */}
                    <div className="w-8 h-8 rounded-lg" style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(255,215,0,0.15))',
                      border: '1px solid rgba(212,175,55,0.3)',
                    }} />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Win */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <h3 className="text-4xl font-black gradient-text mb-2">🎉 You Won!</h3>
              <p className="text-white/60">
                {moves} moves in {formatTime(elapsed)}
                {moves === bestScore && ' · 🏆 New Best!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default MemoryMatch;
