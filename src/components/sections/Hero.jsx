import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Hero() {
  const { lang, t } = useLanguage();
  const { personalData } = usePortfolio();
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const titles = [t('hero.typing1'), t('hero.typing2'), t('hero.typing3')];

  useEffect(() => {
    const current = titles[titleIndex];
    let timeout;
    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((i) => (i + 1) % titles.length);
    } else {
      timeout = setTimeout(
        () => setDisplayText(
          isDeleting ? current.substring(0, displayText.length - 1) : current.substring(0, displayText.length + 1)
        ),
        isDeleting ? 40 : 80
      );
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex, titles]);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-14 sm:pt-16 lg:pt-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[15%] -left-[20%] w-[50vw] h-[50vw] max-w-md max-h-md bg-primary-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] -right-[20%] w-[50vw] h-[50vw] max-w-md max-h-md bg-purple-500/5 rounded-full blur-[80px]" />
      </div>
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">
          <motion.div variants={item} className="flex-shrink-0 order-1 lg:order-2">
            <div className="relative">
              <div className="w-44 h-44 xs:w-52 xs:h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10">
                <img src={personalData.avatarUrl} alt={personalData.name} className="w-full h-full object-contain" loading="eager" />
              </div>
              <motion.div className="absolute -inset-2 sm:-inset-3 rounded-full border border-dashed border-primary-500/20" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
            </div>
          </motion.div>
          <motion.div variants={item} className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.p variants={item} className="text-primary-500 font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">{t('hero.hello')}</motion.p>
            <motion.h1 variants={item} className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-3 sm:mb-4">{personalData.name}</motion.h1>
            <motion.div variants={item} className="text-lg xs:text-xl sm:text-2xl lg:text-3xl text-slate-500 dark:text-slate-400 mb-1 h-7 sm:h-8 lg:h-9">
              <span>{displayText}</span>
              <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-primary-500 animate-pulse align-middle" />
            </motion.div>
            <motion.p variants={item} className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">{t('hero.desc')}</motion.p>
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="contact" smooth duration={500} offset={-80}>
                <Button variant="primary" size="md">{t('hero.letsTalk')}</Button>
              </Link>
              <Link to="/cv" onClick={(e) => { e.preventDefault(); window.location.href = '/cv'; }}>
                <Button variant="outline" size="md">{t('hero.downloadCv')}</Button>
              </Link>
            </motion.div>
            <motion.div variants={item} className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
              {personalData.socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-500 dark:hover:bg-primary-500 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white transition-all duration-200"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={social.name}
                >
                  {social.icon ? <social.icon size={16} /> : null}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
