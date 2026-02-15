import { motion } from 'framer-motion';
import { slideIn } from '../utils/animations';
import { projects } from '../utils/constants';
import ProjectCard from './ProjectCard';

function Projects() {
  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-black gradient-text mb-6"
            variants={slideIn('down')}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto"
            variants={slideIn('up')}
          >
            Real-world applications built with modern technologies,
            focusing on performance, scalability, and user experience.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
