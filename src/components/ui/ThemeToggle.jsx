import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle({ darkMode, toggle }) {
  return (
    <motion.button
      onClick={toggle}
      className={`
        relative w-12 sm:w-14 h-6 sm:h-7 rounded-full
        transition-colors duration-300
        focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
        ${darkMode ? 'bg-primary-500' : 'bg-slate-300'}
      `}
      whileTap={{ scale: 0.9 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className={`
          absolute top-0.5 sm:top-0.5
          w-5 h-5 sm:w-6 sm:h-6 rounded-full
          flex items-center justify-center
          shadow-md
          ${darkMode ? 'bg-slate-900' : 'bg-white'}
        `}
        animate={{ x: darkMode ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {darkMode ? (
          <FaMoon className="text-yellow-400 text-[10px] sm:text-xs" />
        ) : (
          <FaSun className="text-amber-500 text-[10px] sm:text-xs" />
        )}
      </motion.div>
    </motion.button>
  );
}
