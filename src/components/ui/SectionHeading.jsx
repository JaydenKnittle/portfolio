import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SectionHeading({ label, title }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="mb-16 md:mb-20">
      <motion.span
        className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[3px] block mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {label}
      </motion.span>
      <motion.h2
        className="heading text-4xl md:text-5xl text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="h-[2px] mt-5 rounded-full origin-left max-w-xs"
        style={{ background: 'linear-gradient(90deg, #10b981, #34d399, transparent)' }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      />
    </div>
  );
}
