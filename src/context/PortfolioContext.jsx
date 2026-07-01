import { createContext, useContext } from 'react';
import usePortfolioData from '../hooks/usePortfolioData';
import { isSupabaseConfigured } from '../lib/supabase';

const PortfolioContext = createContext(null);

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-slate-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Loading...</p>
    </div>
  );
}

export function PortfolioProvider({ children }) {
  const portfolio = usePortfolioData();

  if (portfolio.loading && isSupabaseConfigured()) {
    return <LoadingScreen />;
  }

  return (
    <PortfolioContext.Provider value={portfolio}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
