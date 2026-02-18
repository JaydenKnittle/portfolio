import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section id="hero" className="page" style={{ background: 'transparent' }}>
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="text-center w-full max-w-5xl mx-auto">
          <motion.p
            className="text-emerald-400/80 text-[11px] font-semibold uppercase tracking-[6px] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Full-Stack Developer
          </motion.p>

          <motion.h1 className="heading text-[clamp(3rem,10vw,8rem)] text-white mb-8 leading-[0.95]">
            {'Jayden'.split('').map((char, i) => (
              <motion.span
                key={`f-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {char}
              </motion.span>
            ))}
            <br />
            {'Knittle'.split('').map((char, i) => (
              <motion.span
                key={`l-${i}`}
                className="inline-block gradient-text"
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            Building real-time applications with WebSocket & Socket.io — <span className="text-gray-500">from Windhoek, Namibia.</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <button
              onClick={() => scrollTo('projects')}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black text-sm font-semibold heading tracking-wider hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all hover:scale-105"
            >
              VIEW PROJECTS
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-10 py-4 rounded-full border border-white/10 text-gray-300 text-sm font-medium hover:border-emerald-400/30 hover:text-white transition-all hover:scale-105"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span className="text-[10px] text-emerald-400/40 uppercase tracking-[3px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-emerald-400/40" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
