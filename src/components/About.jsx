import { motion } from 'framer-motion';
import { Code2, Heart, Rocket, Zap } from 'lucide-react';
import { fadeIn, slideIn } from '../utils/animations';

function About() {
  const highlights = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and well-documented code',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Fast Learner',
      description: 'Quickly adapting to new technologies and frameworks',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-Time Expert',
      description: 'Building live, collaborative applications with WebSocket',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passionate',
      description: 'Genuinely excited about building impactful products',
    },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
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
            About Me
          </motion.h2>
          <motion.p
            className="text-xl text-white/60 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            I'm a Computer Science student from Namibia who loves turning complex
            problems into elegant solutions. Whether it's building real-time trading
            platforms or collaborative tools, I focus on creating applications that
            are both powerful and delightful to use.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass rounded-2xl p-8 text-center hover:border-amber-500/40 transition-colors duration-300"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-black"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/50">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
