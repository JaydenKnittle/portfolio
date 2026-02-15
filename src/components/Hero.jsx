import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeIn, slideIn } from '../utils/animations';

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial="initial" animate="animate" variants={fadeIn}>
          {/* Greeting */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            variants={slideIn('down')}
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200/80 font-semibold tracking-wide uppercase text-sm">
              Hey there! I'm
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6"
            variants={slideIn('left', 0.2)}
          >
            <span className="gradient-text">Jayden Knittle</span>
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white mb-8"
            variants={slideIn('right', 0.4)}
          >
            Full-Stack Developer
          </motion.h2>

          {/* Gold divider */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 mx-auto mb-8 rounded-full"
            variants={fadeIn}
          />

          {/* Description */}
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
            variants={fadeIn}
          >
            Computer Science student at{' '}
            <span className="font-bold text-amber-400">NUST</span>, building
            innovative applications with real-time collaboration, live data processing, and
            sleek user experiences. From trading platforms to collaborative whiteboards,
            I turn ideas into polished products.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeIn}
          >
            <motion.a
              href="#projects"
              className="px-8 py-4 gold-shimmer text-black font-bold rounded-xl shadow-2xl shadow-amber-900/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-4 glass text-white font-bold rounded-xl hover:border-amber-400/40 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;
