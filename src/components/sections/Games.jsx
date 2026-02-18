import { motion } from 'framer-motion';
import { games } from '../../utils/gameConstants';

const ease = [0.16, 1, 0.3, 1];

export default function Games({ onPlayGame }) {
  return (
    <section id="games" className="page">
      <div className="h-full w-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20 max-w-5xl text-center">

        {/* Heading */}
        <motion.div
          className="text-center mb-10 w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[4px] block mb-4">
            Just for Fun
          </span>
          <h2 className="text-3xl md:text-5xl text-white font-light leading-tight">
            Mini <span className="gradient-text font-medium">Games</span>
          </h2>
        </motion.div>

        {/* Game cards — 2x2 grid */}
        <div className="grid sm:grid-cols-2 gap-5 w-full">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              className="group relative rounded-2xl border border-emerald-500/8 bg-emerald-500/[0.01] p-8 flex flex-col items-center text-center hover:border-emerald-400/20 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1 * i, ease }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <span className="absolute -right-4 -top-6 heading text-[7rem] text-emerald-500/[0.03] leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <span className="text-4xl mb-4 block">{game.icon}</span>
                <h3 className="heading text-lg text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-500 text-sm mb-2 leading-relaxed">{game.description}</p>
                <span className="text-[10px] text-emerald-400/30 uppercase tracking-[2px] block mb-5">
                  {game.difficulty}
                </span>
              </div>

              <button
                onClick={() => onPlayGame(game.id)}
                className="game-button text-[11px] px-6 py-2.5 mt-auto"
              >
                PLAY NOW
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
