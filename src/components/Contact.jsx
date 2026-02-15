import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { fadeIn, slideIn } from '../utils/animations';

function Contact() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-black gradient-text mb-6"
            variants={slideIn('down')}
          >
            Get In Touch
          </motion.h2>
          <motion.p className="text-xl text-white/60" variants={fadeIn}>
            Have a project in mind? Let's build something amazing together.
          </motion.p>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-4 mb-12">
          {[
            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'knittlejayden7@gmail.com', href: 'mailto:knittlejayden7@gmail.com' },
            { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', value: 'Jayden Knittle', href: 'https://linkedin.com/in/jayden-knittle-889038307' },
            { icon: <Github className="w-5 h-5" />, label: 'GitHub', value: 'JaydenKnittle', href: 'https://github.com/JaydenKnittle' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Windhoek, Namibia', href: null },
          ].map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 hover:border-amber-500/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-black flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-amber-400 transition-colors font-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-white/80 font-medium">{info.value}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social icon row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: <Github className="w-5 h-5" />, href: 'https://github.com/JaydenKnittle' },
            { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/in/jayden-knittle-889038307' },
            { icon: <Mail className="w-5 h-5" />, href: 'mailto:knittlejayden7@gmail.com' },
          ].map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-12 h-12 glass rounded-xl flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
