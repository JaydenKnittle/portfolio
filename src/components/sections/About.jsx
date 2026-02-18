import { motion } from 'framer-motion';
import { GraduationCap, Layers, MapPin, Zap } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];

const stats = [
  { number: '4+', label: 'Projects' },
  { number: '3+', label: 'Years Coding' },
  { number: '5+', label: 'Technologies' },
  { number: '∞', label: 'Curiosity' },
];

const details = [
  { icon: MapPin, value: 'Windhoek, Namibia' },
  { icon: GraduationCap, value: 'CS at NUST' },
  { icon: Layers, value: 'Full-Stack Dev' },
  { icon: Zap, value: 'Seeking Internship' },
];

export default function About() {
  return (
    <section id="about" className="page">
      <div className="h-full w-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20 max-w-5xl text-center">

        {/* Statement */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[4px] block mb-4">
            About Me
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-white font-light leading-[1.2]">
            I'm a Computer Science student whose love for gaming
            sparked a desire to{' '}
            <span className="gradient-text font-medium">create software</span>{' '}
            — from websites and apps to{' '}
            <span className="text-emerald-400">full-scale systems</span>.
          </h2>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 w-full">
          {stats.map(({ number, label }, i) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease }}
            >
              <div className="stat-number text-[clamp(2.5rem,6vw,5rem)] mb-1">{number}</div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Details chips — centered */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          {details.map(({ icon: Icon, value }, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <Icon className="text-emerald-400/60" size={20} />
              <span className="text-gray-300 text-sm">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Bio — centered */}
        <motion.p
          className="text-gray-400 text-base leading-relaxed text-center max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          What started as a love for playing games grew into wanting to
          make them — and that curiosity kept expanding. Now I build whatever
          excites me: websites, mobile apps, full-stack platforms, you name it.
          From banking systems to collaborative whiteboards, I'm driven by
          the challenge of turning ideas into working software.
        </motion.p>
      </div>
    </section>
  );
}
