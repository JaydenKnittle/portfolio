import { motion } from 'framer-motion';
import { skills } from '../../utils/gameConstants';

const ease = [0.16, 1, 0.3, 1];

const allSkills = [
  ...skills.languages,
  ...skills.frontend,
  ...skills.backend,
  ...skills.realtime,
  ...skills.tools,
];

const categories = [
  { key: 'languages', title: 'Languages' },
  { key: 'frontend', title: 'Frontend' },
  { key: 'backend', title: 'Backend' },
  { key: 'realtime', title: 'Real-Time' },
  { key: 'tools', title: 'Tools' },
];

function SkillPill({ name, icon }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-emerald-500/10 bg-emerald-500/[0.02] hover:border-emerald-400/25 hover:bg-emerald-500/[0.06] transition-all group cursor-default shrink-0">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="page">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="px-6 sm:px-10 lg:px-20 max-w-5xl w-full mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="text-emerald-400/70 text-xs font-semibold uppercase tracking-[4px] block mb-4">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-5xl text-white font-light leading-tight">
              Skills & <span className="gradient-text font-medium">Tools</span>
            </h2>
          </motion.div>
        </div>

        {/* Marquee */}
        <motion.div
          className="overflow-hidden mb-8 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="marquee-track gap-4">
            {[...allSkills, ...allSkills].map((skill, i) => (
              <SkillPill key={`${skill.name}-${i}`} {...skill} />
            ))}
          </div>
        </motion.div>

        {/* Category rows */}
        <div className="px-6 sm:px-10 lg:px-20 max-w-5xl w-full space-y-5">
          {categories.map(({ key, title }, ci) => (
            <motion.div
              key={key}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: 0.06 * ci, duration: 0.6, ease }}
            >
              <div className="flex items-baseline gap-4 mb-3">
                <h3 className="heading text-sm text-white group-hover:text-emerald-400 transition-colors">
                  {title}
                </h3>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {skills[key].map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-400/20 transition-all"
                  >
                    <span className="text-base">{skill.icon}</span>
                    <span className="text-sm text-gray-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
