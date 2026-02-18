import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects } from '../../utils/gameConstants';
import { useState, useRef, useCallback, useEffect } from 'react';

const ease = [0.16, 1, 0.3, 1];

export default function Projects() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef(null);
  const isAnimating = useRef(false);
  const cooldown = useRef(false);
  const project = projects[current];
  const currentRef = useRef(current);
  currentRef.current = current;

  const go = useCallback((next, dir) => {
    if (isAnimating.current || cooldown.current) return;
    isAnimating.current = true;
    cooldown.current = true;
    setDirection(dir);
    setCurrent(next);
    setTimeout(() => { isAnimating.current = false; }, 600);
    setTimeout(() => { cooldown.current = false; }, 800);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Desktop: wheel scroll
    const handleWheel = (e) => {
      const cur = currentRef.current;
      if (e.deltaY > 0 && cur < projects.length - 1) {
        e.preventDefault();
        e.stopPropagation();
        go(cur + 1, 1);
      } else if (e.deltaY < 0 && cur > 0) {
        e.preventDefault();
        e.stopPropagation();
        go(cur - 1, -1);
      }
    };

    // Mobile: horizontal swipe
    let touchStartX = 0;
    let touchStartY = 0;
    let swiping = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiping = false;
    };

    const handleTouchMove = (e) => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      // Only count as horizontal swipe if mostly horizontal
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        swiping = true;
        const cur = currentRef.current;
        // Prevent vertical scroll while swiping horizontally within project bounds
        if ((dx < 0 && cur < projects.length - 1) || (dx > 0 && cur > 0)) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!swiping) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const cur = currentRef.current;
      const threshold = 50;
      if (dx < -threshold && cur < projects.length - 1) {
        go(cur + 1, 1);
      } else if (dx > threshold && cur > 0) {
        go(cur - 1, -1);
      }
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    section.addEventListener('touchstart', handleTouchStart, { passive: true });
    section.addEventListener('touchmove', handleTouchMove, { passive: false });
    section.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      section.removeEventListener('wheel', handleWheel);
      section.removeEventListener('touchstart', handleTouchStart);
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('touchend', handleTouchEnd);
    };
  }, [go]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? '80%' : '-80%', opacity: 0, filter: 'blur(12px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (d) => ({ x: d > 0 ? '-80%' : '80%', opacity: 0, filter: 'blur(12px)' }),
  };

  return (
    <section id="projects" className="page" ref={sectionRef}>
      <div className="h-full w-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20 max-w-5xl text-center">

        {/* Header */}
        <motion.div
          className="text-center mb-8 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[4px] block mb-3">
            Portfolio
          </span>
          <h2 className="heading text-3xl md:text-5xl text-white mb-2">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <span className="heading text-emerald-400/30 text-sm tracking-[3px]">
            {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Sliding project content */}
        <div className="relative w-full flex-1 max-h-[65vh] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={project.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-5xl block mb-4">{project.icon}</span>
              <h3 className="heading text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                {project.title}
              </h3>
              <p className="text-emerald-400/50 text-sm tracking-wider mb-4">{project.subtitle}</p>
              <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-xl">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-emerald-500/5 text-emerald-300/60 border border-emerald-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* GitHub button */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all group/link"
                >
                  <Github size={18} />
                  <span>View on GitHub</span>
                  <ArrowUpRight
                    size={16}
                    className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
                  />
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mt-4">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                if (i !== current) {
                  go(i, i > current ? 1 : -1);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-emerald-400' : 'w-3 bg-emerald-400/20 hover:bg-emerald-400/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
