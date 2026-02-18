import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

const links = [
  {
    icon: Mail,
    label: 'Email',
    value: 'knittlejayden7@gmail.com',
    href: 'mailto:knittlejayden7@gmail.com',
    cta: 'Send an email',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'JaydenKnittle',
    href: 'https://github.com/JaydenKnittle',
    cta: 'View repos',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Jayden Knittle',
    href: 'https://www.linkedin.com/in/jayden-knittle-889038307',
    cta: 'Connect',
  },
];

const ease = [0.16, 1, 0.3, 1];

export default function Contact() {
  return (
    <section id="contact" className="page">
      <div className="h-full w-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20 max-w-5xl text-center">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[4px] block mb-4">
            Get in Touch
          </span>
          <h2 className="heading text-4xl md:text-6xl lg:text-7xl text-white mb-4">
            Let's <span className="gradient-text">Work</span> Together
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Always open to new opportunities and collaborations.
          </p>
        </motion.div>

        {/* Contact links */}
        <div className="w-full divide-y divide-white/5">
          {links.map(({ icon: Icon, label, value, href, cta }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 py-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.1 * i, ease }}
            >
              <Icon className="text-emerald-400/50 group-hover:text-emerald-400 transition-colors" size={22} />
              <div>
                <p className="text-white text-lg group-hover:text-emerald-400 transition-colors">{value}</p>
                <p className="text-[11px] text-gray-600 uppercase tracking-wider">{label}</p>
              </div>
              <ArrowUpRight
                size={18}
                className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
              />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-600 text-xs mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          &copy; {new Date().getFullYear()} Jayden Knittle. Built with React, Three.js & Framer Motion.
        </motion.p>
      </div>
    </section>
  );
}
