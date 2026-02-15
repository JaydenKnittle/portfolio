import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { fadeIn, slideIn } from '../utils/animations';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:knittlejayden7@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${formData.message}`;
    setSent(true);
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'knittlejayden7@gmail.com', href: 'mailto:knittlejayden7@gmail.com' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Windhoek, Namibia', href: null },
            { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', value: 'jaydenknittle', href: 'https://linkedin.com/in/jayden-knittle-889038307' },
          ].map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 hover:border-amber-500/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-black flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-white/80 text-sm hover:text-amber-400 transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-white/80 text-sm">{info.value}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 hover:border-amber-500/30 transition-colors duration-300"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-amber-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-amber-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="knittlejayden7@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-amber-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-8 py-4 gold-shimmer text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-5 h-5" />
              {sent ? 'Message Sent!' : 'Send Message'}
            </motion.button>
          </div>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mt-10"
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
