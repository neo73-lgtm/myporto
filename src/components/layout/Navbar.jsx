import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import ThemeToggle from '../ui/ThemeToggle';
import useScrollSpy from '../../hooks/useScrollSpy';
import { useLanguage } from '../../context/LanguageContext';
import { navLinks } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';

const menuVariants = {
  closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const linkVariants = {
  closed: { x: 40, opacity: 0 },
  open: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.05, type: 'spring', stiffness: 200 } }),
};

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { lang, toggleLang, t } = useLanguage();
  const { personalData } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = navLinks.map((l) => l.href);
  const activeId = useScrollSpy(sectionIds, 120);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link to="hero" smooth duration={500} className="cursor-pointer">
              <motion.div
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px] xs:text-xs sm:text-sm lg:text-base shadow-lg shadow-primary-500/25 whitespace-nowrap"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                NEOSYMPHONY
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  smooth
                  duration={500}
                  offset={-80}
                  className={`
                    relative px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer
                    ${activeId === link.href
                      ? 'text-primary-500'
                      : 'text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {lang === 'en' ? link.nameEn : link.name}
                  {activeId === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-500/10 -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.button
                onClick={toggleLang}
                className="touch-target w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold gap-1"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle language"
              >
                <FaGlobe size={12} />
                {lang.toUpperCase()}
              </motion.button>

              <ThemeToggle darkMode={darkMode} toggle={toggleDarkMode} />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden touch-target flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={close}
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 z-50 h-full w-[280px] max-w-[80vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Menu</span>
                <button onClick={close} className="touch-target flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="p-4 space-y-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} variants={linkVariants} custom={i} initial="closed" animate="open">
                    <Link
                      to={link.href}
                      smooth
                      duration={500}
                      offset={-80}
                      onClick={close}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        activeId === link.href
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeId === link.href ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      {lang === 'en' ? link.nameEn : link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  <button
                    onClick={() => { toggleLang(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 w-full transition-colors"
                  >
                    <FaGlobe size={14} />
                    {lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
