export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300',
    primary: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1
        text-[11px] sm:text-xs font-medium rounded-full whitespace-nowrap
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
