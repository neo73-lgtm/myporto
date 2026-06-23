import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WorkExperience() {
  const { lang, t } = useLanguage();
  const { workExperience } = usePortfolio();

  return (
    <section id="experience" className="section-spacing relative">
      <div className="section-container">
        <FadeUp className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="section-title">{t('experience.title')}</h2>
          <p className="section-subtitle">{t('experience.subtitle')}</p>
        </FadeUp>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-5 lg:left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {workExperience.map((exp, i) => (
            <FadeUp key={exp.id} delay={i * 0.1}>
              <div className="relative pl-10 sm:pl-12 lg:pl-14 pb-8 sm:pb-10 last:pb-0">
                <div className="absolute left-[11px] sm:left-[15px] lg:left-[19px] top-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-primary-500 border-[3px] border-white dark:border-slate-900 shadow-sm" />

                <div className="card-hover p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-1 xs:gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0 mt-0.5">
                        <FaBriefcase size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white">{exp.role}</h3>
                        <p className="text-xs sm:text-sm text-primary-500 font-medium">{exp.company}</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1 xs:mt-0.5">
                      <FaCalendarAlt size={10} />
                      {lang === 'en' ? exp.periodEn : exp.period}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {lang === 'en' ? exp.descriptionEn : exp.description}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <FaMapMarkerAlt size={10} />
                      {exp.location}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
