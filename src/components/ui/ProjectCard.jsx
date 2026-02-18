import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="card p-8 flex flex-col"
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="text-3xl mr-3">{project.icon}</span>
          <h3 className="heading text-xl text-white inline">{project.title}</h3>
          <p className="text-emerald-400/60 text-xs mt-2 tracking-wide">{project.subtitle}</p>
        </div>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-emerald-400 transition-colors p-2"
          >
            <Github size={20} />
          </a>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-5 leading-relaxed">{project.description}</p>

      <ul className="text-gray-500 text-xs space-y-2 mb-6 flex-1">
        {project.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-400/50 mt-0.5">▸</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-emerald-500/5 text-emerald-300/60 border border-emerald-500/10"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
