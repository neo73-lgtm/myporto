import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30',
  secondary:
    'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 text-slate-700 dark:text-slate-200',
  outline:
    'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 active:bg-primary-600 hover:text-white',
  ghost:
    'text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base',
  lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const classes = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    active:scale-[0.97]
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
}
