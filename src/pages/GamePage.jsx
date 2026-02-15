import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import MemoryMatch from '../games/MemoryMatch';
import Snake from '../games/Snake';
import TicTacToe from '../games/TicTacToe';
import TwentyFortyEight from '../games/TwentyFortyEight';

function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const games = {
    'snake': { component: Snake, title: 'Snake Game', emoji: '🐍' },
    '2048': { component: TwentyFortyEight, title: '2048', emoji: '🎯' },
    'memory': { component: MemoryMatch, title: 'Memory Match', emoji: '🧠' },
    'tictactoe': { component: TicTacToe, title: 'Tic-Tac-Toe', emoji: '⭕' },
  };

  const currentGame = games[gameId];
  const GameComponent = currentGame?.component;

  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Game Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 gold-shimmer text-black font-bold rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto mb-4 sm:mb-8">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-white/70 hover:text-amber-400 font-semibold mb-6 transition-colors"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{currentGame.emoji}</div>
            <h1 className="text-3xl sm:text-5xl font-black gradient-text">{currentGame.title}</h1>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {GameComponent && <GameComponent />}
        </motion.div>
      </div>
    </div>
  );
}

export default GamePage;
