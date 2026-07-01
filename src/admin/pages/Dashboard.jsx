import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { FaUser, FaProjectDiagram, FaBriefcase, FaCode, FaGraduationCap } from 'react-icons/fa';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { personalData, projects, workExperience, skills, education } = usePortfolio();

  const stats = [
    { label: 'Personal Info', count: 1, icon: FaUser, color: 'bg-blue-500' },
    { label: 'Projects', count: projects.length, icon: FaProjectDiagram, color: 'bg-purple-500' },
    { label: 'Experience', count: workExperience.length, icon: FaBriefcase, color: 'bg-emerald-500' },
    { label: 'Skills', count: skills.length, icon: FaCode, color: 'bg-amber-500' },
    { label: 'Education', count: education.length, icon: FaGraduationCap, color: 'bg-rose-500' },
  ];

  return (
    <div>
      <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-5 sm:p-6">
        <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-3">
          {isSupabaseConfigured() ? '✓ Terhubung ke Supabase' : 'Supabase Setup'}
        </h2>
        {isSupabaseConfigured() ? (
          <p className="text-xs sm:text-sm text-emerald-500 dark:text-emerald-400 leading-relaxed">
            Data portfolio tersimpan di Supabase. Edit data melalui form di sidebar.
          </p>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Buat file <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-primary-500 text-xs">.env</code> di root proyek dan tambahkan:
            </p>
            <pre className="mt-3 p-3 sm:p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-200 text-xs sm:text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tanpa file .env, aplikasi tetap berjalan dengan data statis (mode demo).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
