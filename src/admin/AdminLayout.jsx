import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { FaHome, FaUser, FaCode, FaBriefcase, FaSignOutAlt, FaBars, FaTimes, FaProjectDiagram } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import useDarkMode from '../hooks/useDarkMode';

const navItems = [
  { path: '/admin/dashboard', labelKey: 'dashboard', icon: FaHome },
  { path: '/admin/personal', labelKey: 'personalInfo', icon: FaUser },
  { path: '/admin/projects', labelKey: 'projects', icon: FaProjectDiagram },
  { path: '/admin/experience', labelKey: 'experience', icon: FaBriefcase },
  { path: '/admin/skills', labelKey: 'skills', icon: FaCode },
];

export default function AdminLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const session = localStorage.getItem('admin_session');
  if (!session) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen overflow-hidden">
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-700">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">A</div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden touch-target flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <FaTimes size={16} />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon size={16} />
                  {t(`admin.${item.labelKey}`)}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-3 py-2">
              <ThemeToggle darkMode={darkMode} toggle={toggleDarkMode} />
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors">
                <FaSignOutAlt size={14} />
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden touch-target flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FaBars size={18} />
            </button>
            <Link to="/" className="text-xs sm:text-sm text-slate-400 hover:text-primary-500 transition-colors">
              ← {t('admin.logout') === 'Logout' ? 'View Portfolio' : 'Lihat Portfolio'}
            </Link>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
