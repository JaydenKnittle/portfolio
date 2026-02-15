import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeIn, slideIn } from '../utils/animations';
import { games } from '../utils/constants';

function Games() {
  const navigate = useNavigate();

  return (
    <section id="games" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            variants={slideIn('down')}
          >
            <Gamepad2 className="w-12 h-12 text-amber-400" />
            <h2 className="text-5xl md:text-6xl font-black gradient-text">
              Browser Games
            </h2>
          </motion.div>
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Take a break and play some games I built! All playable right here in your browser.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => navigate(`/game/${game.id}`)}
              className="glass rounded-2xl p-8 text-center cursor-pointer group hover:border-amber-500/40 transition-colors duration-300"
            >
              <motion.div
                className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {game.icon}
              </motion.div>
              <h3 className="text-xl font-black text-white mb-2">{game.title}</h3>
              <p className="text-white/50 text-sm mb-4">{game.description}</p>
              <motion.div
                className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 rounded-xl text-amber-400 font-semibold text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Play Now →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Games;
