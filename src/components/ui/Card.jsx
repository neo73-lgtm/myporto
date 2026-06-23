import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, padding = true }) {
  return (
    <motion.div
      className={`
        bg-white dark:bg-slate-800/90 rounded-2xl
        border border-slate-200/60 dark:border-slate-700/60
        shadow-sm hover:shadow-lg
        ${padding ? 'p-5 sm:p-6 lg:p-8' : ''}
        ${hover ? 'hover:-translate-y-0.5 hover:border-primary-500/20 dark:hover:border-primary-500/20' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? { y: -3 } : {}}
    >
      {children}
    </motion.div>
  );
}
