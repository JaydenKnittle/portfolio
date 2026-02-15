import { motion } from 'framer-motion';
import { Github, Heart, Linkedin, Mail } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 hover:border-amber-500/30 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <motion.h3
                className="text-2xl font-black gradient-text mb-2"
                whileHover={{ scale: 1.05 }}
              >
                Jayden Knittle
              </motion.h3>
              <p className="text-white/50 flex items-center gap-2 justify-center md:justify-start text-sm">
                Made with <Heart className="w-4 h-4 text-amber-400 fill-amber-400" /> in Namibia
              </p>
              <p className="text-white/30 text-xs mt-1">© {currentYear} All rights reserved</p>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: <Github className="w-5 h-5" />, href: 'https://github.com/JaydenKnittle', rotate: 5 },
                { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/in/jayden-knittle-889038307', rotate: -5 },
                { icon: <Mail className="w-5 h-5" />, href: 'mailto:knittlejayden7@gmail.com', rotate: 5 },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                  whileHover={{ scale: 1.1, rotate: social.rotate }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-amber-500/10">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {['about', 'projects', 'skills', 'games', 'contact'].map((item) => (
                <a key={item} href={`#${item}`} className="text-white/40 hover:text-amber-400 transition-colors capitalize">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
