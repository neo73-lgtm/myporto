import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

function FadeUp({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Testimonials() {
  const { lang, t } = useLanguage();
  const { testimonials } = usePortfolio();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const startAuto = () => { intervalRef.current = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000); };
  useEffect(() => { startAuto(); return () => clearInterval(intervalRef.current); }, []);
  const go = (i) => { setCurrent(i); clearInterval(intervalRef.current); startAuto(); };
  const next = () => go((current + 1) % testimonials.length);
  const prev = () => go((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="section-spacing bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="section-title">{t('testimonials.title')}</h2>
          <p className="section-subtitle">{t('testimonials.subtitle')}</p>
        </FadeUp>

        <FadeUp>
          <div className="relative px-0 sm:px-8 lg:px-12">
            <div className="hidden sm:block">
              <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 touch-target w-9 h-9 lg:w-10 lg:h-10 rounded-full card flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-200 z-10 shadow-sm" aria-label="Previous"><FaChevronLeft size={14} /></button>
              <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 touch-target w-9 h-9 lg:w-10 lg:h-10 rounded-full card flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-200 z-10 shadow-sm" aria-label="Next"><FaChevronRight size={14} /></button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="card text-center p-6 sm:p-8 lg:p-10"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4 border-[3px] border-primary-500/15 shadow-md">
                  <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < testimonials[current].rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'} size={16} />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 italic leading-relaxed mb-4 sm:mb-6 max-w-xl mx-auto">
                  &ldquo;{lang === 'en' && testimonials[current].textEn ? testimonials[current].textEn : testimonials[current].text}&rdquo;
                </p>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{testimonials[current].name}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">{testimonials[current].role} at {testimonials[current].company}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
              <button onClick={prev} className="sm:hidden touch-target w-9 h-9 rounded-full card flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors"><FaChevronLeft size={12} /></button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-300 ${i === current ? 'bg-primary-500 w-6 sm:w-8 h-2 sm:h-2.5' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 w-2 h-2 sm:w-2.5 sm:h-2.5'}`} aria-label={`Go to testimonial ${i + 1}`} />
                ))}
              </div>
              <button onClick={next} className="sm:hidden touch-target w-9 h-9 rounded-full card flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors"><FaChevronRight size={12} /></button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
