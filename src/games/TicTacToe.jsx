import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [aiThinking, setAiThinking] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const result = calculateWinner(squares);
    if (result?.winner === 'O') return 10 - depth;
    if (result?.winner === 'X') return depth - 10;
    if (!squares.includes(null)) return 0;
    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const copy = [...squares]; copy[i] = 'O';
          best = Math.max(best, minimax(copy, depth + 1, false));
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const copy = [...squares]; copy[i] = 'X';
          best = Math.min(best, minimax(copy, depth + 1, true));
        }
      }
      return best;
    }
  };

  const getBestMove = (squares) => {
    let best = -Infinity; let move = null;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const copy = [...squares]; copy[i] = 'O';
        const s = minimax(copy, 0, false);
        if (s > best) { best = s; move = i; }
      }
    }
    return move;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext || aiThinking) return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner); setWinningLine(result.line);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      return;
    }
    if (!newBoard.includes(null)) {
      setWinner('draw'); setScores(prev => ({ ...prev, draws: prev.draws + 1 })); return;
    }
    setAiThinking(true);
    setTimeout(() => {
      const aiBoard = [...newBoard];
      const aiMove = getBestMove(aiBoard);
      if (aiMove !== null) {
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard); setIsXNext(true);
        const aiResult = calculateWinner(aiBoard);
        if (aiResult) {
          setWinner(aiResult.winner); setWinningLine(aiResult.line);
          setScores(prev => ({ ...prev, [aiResult.winner]: prev[aiResult.winner] + 1 }));
        } else if (!aiBoard.includes(null)) {
          setWinner('draw'); setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        }
      }
      setAiThinking(false);
    }, 400);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null)); setIsXNext(true);
    setWinner(null); setWinningLine([]);
  };

  const XMark = () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <motion.line x1="8" y1="8" x2="32" y2="32" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
      <motion.line x1="32" y1="8" x2="8" y2="32" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.1 }} />
    </svg>
  );

  const OMark = () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <motion.circle cx="20" cy="20" r="12" stroke="rgba(255,255,255,0.75)" strokeWidth="4" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} />
    </svg>
  );

  return (
    <div className="max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-8">
        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'You (X)', value: scores.X, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Draws', value: scores.draws, color: 'text-white/50', border: 'border-white/10' },
            { label: 'AI (O)', value: scores.O, color: 'text-white/80', border: 'border-white/10' },
          ].map((s) => (
            <div key={s.label} className={`bg-black/30 border ${s.border} rounded-xl p-4 text-center`}>
              <motion.div key={s.value} initial={{ scale: 1.5 }} animate={{ scale: 1 }}
                className={`text-3xl font-black ${s.color}`}>{s.value}</motion.div>
              <div className="text-white/30 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="text-center mb-6 h-9 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {winner ? (
              <motion.h3 key="winner"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="text-2xl font-black gradient-text">
                {winner === 'draw' ? "It's a Draw! 🤝" : winner === 'X' ? '🏆 You Win!' : '🤖 AI Wins!'}
              </motion.h3>
            ) : (
              <motion.p key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/50 font-semibold">
                {aiThinking
                  ? <span className="text-amber-400/60">AI is thinking<motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }}>...</motion.span></span>
                  : 'Your turn (X)'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Board */}
        <div className="rounded-2xl p-4 mb-6 mx-auto" style={{ width: 'fit-content', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => {
              const isWin = winningLine.includes(index);
              const canClick = !cell && !winner && isXNext && !aiThinking;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!canClick}
                  className="w-24 h-24 rounded-xl flex items-center justify-center"
                  style={{
                    background: isWin ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,215,0,0.1))' : cell ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: isWin ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isWin ? '0 0 20px rgba(212,175,55,0.25)' : 'none',
                    cursor: canClick ? 'pointer' : 'default',
                  }}
                  whileHover={canClick ? { scale: 1.06, borderColor: 'rgba(212,175,55,0.35)' } : {}}
                  whileTap={canClick ? { scale: 0.94 } : {}}
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      >
                        {cell === 'X' ? <XMark /> : <OMark />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <motion.button onClick={resetGame}
            className="px-6 py-3 gold-shimmer text-black font-black rounded-xl"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            New Game
          </motion.button>
          <motion.button onClick={() => { setScores({ X: 0, O: 0, draws: 0 }); resetGame(); }}
            className="px-6 py-3 glass hover:border-amber-500/30 text-white/50 font-bold rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Reset Scores
          </motion.button>
        </div>

        <p className="text-center text-white/20 text-xs mt-5">🤖 Minimax algorithm — unbeatable AI</p>
      </motion.div>
    </div>
  );
}

export default TicTacToe;
