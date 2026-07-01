import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function Education() {
  const { lang, t } = useLanguage();
  const { education } = usePortfolio();
  const sectionRef = useRef(null);
  const headlineInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="education" className="py-14 sm:py-20 lg:py-28 bg-slate-50/50 dark:bg-slate-800/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="section-title">{t('education.title')}</h2>
          <p className="section-subtitle">{t('education.subtitle')}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/40 via-primary-500/20 to-transparent" />

          <div className="space-y-8 sm:space-y-10">
            {education.map((edu, i) => (
              <FadeUp key={edu.id} delay={i * 0.12}>
                <div className="relative pl-12 sm:pl-16">
                  <div className="absolute left-2 sm:left-3.5 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-500 flex items-center justify-center">
                    <FaGraduationCap size={10} className="text-primary-500" />
                  </div>

                  <div className="card p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white">
                          {lang === 'en' && edu.degreeEn ? edu.degreeEn : edu.degree}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                          {edu.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 shrink-0">
                        {edu.location && (
                          <span className="inline-flex items-center gap-1">
                            <FaMapMarkerAlt size={10} className="text-slate-400" />
                            {edu.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <FaCalendarAlt size={10} className="text-slate-400" />
                          {lang === 'en' && edu.periodEn ? edu.periodEn : edu.period}
                        </span>
                      </div>
                    </div>

                    {edu.gpa && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium mb-2">
                        <FaStar size={9} />
                        GPA: {edu.gpa}
                      </div>
                    )}

                    {(lang === 'en' && edu.descriptionEn ? edu.descriptionEn : edu.description) && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                        {lang === 'en' && edu.descriptionEn ? edu.descriptionEn : edu.description}
                      </p>
                    )}

                    {edu.technologies && edu.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {edu.technologies.map((tech) => (
                          <Badge key={tech}>{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
