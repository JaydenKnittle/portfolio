import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SkillBar({ name, level, icon, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-300">
          <span className="mr-2">{icon}</span>
          {name}
        </span>
        <motion.span
          className="text-xs text-emerald-400/70 font-mono"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
