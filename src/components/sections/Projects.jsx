import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { categories, categoriesEn } from '../../data/portfolioData';

function FadeUp({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const { lang, t } = useLanguage();
  const { projects } = usePortfolio();
  const cats = lang === 'en' ? categoriesEn : categories;
  const [active, setActive] = useState(cats[0]);

  const filtered = active === cats[0] ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="section-spacing bg-slate-50/50 dark:bg-slate-900/50">
      <div className="section-container">
        <FadeUp className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="section-title">{t('projects.title')}</h2>
          <p className="section-subtitle">{t('projects.subtitle')}</p>
        </FadeUp>

        <FadeUp>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 lg:mb-10">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`touch-target px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  active === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'card text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-hover group overflow-hidden"
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-4">
                    <div className="flex gap-2">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="touch-target w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors" aria-label={t('projects.viewLive')}>
                        <FaExternalLinkAlt size={12} />
                      </a>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="touch-target w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors" aria-label={t('projects.viewSource')}>
                        <FaGithub size={12} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">{project.title}</h3>
                    <span className="text-[10px] sm:text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full shrink-0">{project.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {lang === 'en' && project.descriptionEn ? project.descriptionEn : project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                    {project.techStack.map((tech) => <Badge key={tech}>{tech}</Badge>)}
                  </div>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <FaExternalLinkAlt size={11} />
                      Kunjungi Web
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
