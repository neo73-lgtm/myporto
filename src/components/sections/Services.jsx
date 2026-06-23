import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCode, FaPaintBrush, FaHeadset } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

const iconMap = { FaCode: FaCode, FaPaintBrush: FaPaintBrush, FaHeadset: FaHeadset };

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut', delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Services() {
  const { lang, t } = useLanguage();
  const { services } = usePortfolio();

  return (
    <section id="services" className="section-spacing">
      <div className="section-container">
        <FadeUp className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || FaCode;
            return (
              <FadeUp key={service.id} delay={i * 0.1}>
                <div className="card-hover p-5 sm:p-6 lg:p-8 h-full flex flex-col">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 transition-all duration-300 mb-4 sm:mb-5 lg:mb-6">
                    <Icon size={22} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-5 leading-relaxed flex-1">
                    {lang === 'en' && service.descriptionEn ? service.descriptionEn : service.description}
                  </p>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {(lang === 'en' && service.pointsEn ? service.pointsEn : service.points).map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-[5px] shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
