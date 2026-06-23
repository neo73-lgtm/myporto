import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured()) {
      localStorage.setItem('admin_session', 'demo');
      navigate('/admin/dashboard');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      localStorage.setItem('admin_session', 'authenticated');
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg">
              A
            </div>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.login')}</h1>
        </div>

        <form onSubmit={handleLogin} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('admin.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="admin@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('admin.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="••••••••" required />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 shadow-lg shadow-primary-500/20">
            {loading ? t('admin.loading') : t('admin.signIn')}
          </button>

          <div className="text-center space-y-1">
            {!isSupabaseConfigured() && (
              <p className="text-xs text-slate-400">Mode demo: klik login untuk masuk</p>
            )}
            <Link to="/" className="block text-xs text-primary-500 hover:text-primary-600 transition-colors">
              ← {t('admin.logout') === 'Logout' ? 'Back to Portfolio' : 'Kembali ke Portfolio'}
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
