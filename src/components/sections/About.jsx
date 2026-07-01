import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut', delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function About() {
  const { lang, t } = useLanguage();
  const { personalData, skills } = usePortfolio();
  const [skillTab, setSkillTab] = useState('tech');

  const techSkills = skills.filter(s => s.category === 'tech');
  const marketingSkills = skills.filter(s => s.category === 'marketing');
  const activeSkills = skillTab === 'tech' ? techSkills : marketingSkills;

  return (
    <section id="about" className="section-spacing relative">
      <div className="section-container">
        <FadeUp className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
          <FadeUp className="order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              {(lang === 'en' && personalData.aboutParagraphsEn ? personalData.aboutParagraphsEn : personalData.aboutParagraphs).map((p, i) => (
                <p key={i} className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-[1.7] sm:leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="flex gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => setSkillTab('tech')}
                  className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${skillTab === 'tech' ? 'bg-primary-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-primary-500'}`}
                >
                  {t('about.techStack')}
                </button>
                <button
                  onClick={() => setSkillTab('marketing')}
                  className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${skillTab === 'marketing' ? 'bg-primary-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-primary-500'}`}
                >
                  {t('about.marketingTools')}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {activeSkills.map((skill) => (
                  <Badge key={skill.name} variant="primary">
                    {skill.icon && <skill.icon size={12} />}
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8">
              {personalData.stats.map((stat) => (
                <div key={stat.label} className="card text-center p-3 sm:p-4 lg:p-5">
                  <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-primary-500 leading-none">
                    {lang === 'en' ? stat.valueEn : stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 sm:mt-1.5 font-medium uppercase tracking-wider">
                    {lang === 'en' ? stat.labelEn : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp className="order-1 lg:order-2" delay={0.1}>
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 dark:border-white/10">
                <img src={personalData.avatarUrl} alt={personalData.name} className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-3 sm:-bottom-5 -right-3 sm:-right-5 w-20 h-20 sm:w-28 sm:h-28 bg-primary-500/5 rounded-2xl -z-10" />
              <div className="absolute -top-3 sm:-top-5 -left-3 sm:-left-5 w-16 h-16 sm:w-24 sm:h-24 bg-purple-500/5 rounded-2xl -z-10" />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
