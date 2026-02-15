import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="glass rounded-3xl overflow-hidden group hover:border-amber-500/40 transition-colors duration-300"
    >
      {/* Project Image */}
      <div className="relative h-64 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-8xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {project.id === 1 ? '📈' : project.id === 2 ? '🏦' : project.id === 3 ? '🎨' : '🎮'}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-black text-white">{project.title}</h3>
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
        </div>

        <p className="text-white/60 mb-6 leading-relaxed">{project.description}</p>

        {/* Highlights */}
        <div className="space-y-2 mb-6">
          {project.highlights.map((highlight, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-sm text-white/50"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
              {highlight}
            </motion.div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass hover:border-amber-400/40 text-white font-semibold rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-4 h-4" />
            Code
          </motion.a>
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
