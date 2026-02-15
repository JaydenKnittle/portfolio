import { motion } from 'framer-motion';
import { fadeIn, slideIn } from '../utils/animations';
import { skills } from '../utils/constants';

function Skills() {
  const skillCategories = [
    { title: 'Languages', items: skills.languages, color: 'from-amber-400 to-yellow-600' },
    { title: 'Frontend', items: skills.frontend, color: 'from-yellow-500 to-amber-500' },
    { title: 'Backend', items: skills.backend, color: 'from-amber-500 to-amber-700' },
    { title: 'Tools', items: skills.tools, color: 'from-amber-300 to-yellow-500' },
    { title: 'Real-Time', items: skills.realtime, color: 'from-yellow-400 to-amber-600' },
    { title: 'Other', items: skills.other, color: 'from-amber-600 to-yellow-700' },
  ];

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            Skills & Technologies
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            A diverse toolkit for building modern, scalable applications
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-amber-500/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <h3 className="text-2xl font-black text-white">{category.title}</h3>
              </div>

              <div className="space-y-3">
                {category.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className={`w-2 h-2 bg-gradient-to-r ${category.color} rounded-full`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: skillIndex * 0.2 }}
                    />
                    <span className="text-white/70 font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
