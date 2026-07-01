import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight, FaStar } from 'react-icons/fa';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=7c3aed';

export default function TestimonialsEditor() {
  const { t } = useLanguage();
  const { testimonials, refresh } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    setItems(testimonials.map(p => ({ ...p, _id: Date.now() + Math.random() })));
    setExpanded(new Set());
  }, [testimonials]);

  const addItem = () => {
    const id = Date.now() + Math.random();
    setItems((prev) => [{ _id: id, name: '', role: '', company: '', text: '', textEn: '', avatar: DEFAULT_AVATAR, rating: 5 }, ...prev]);
    setExpanded(prev => new Set(prev).add(id));
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-item-id="${id}"] [data-autofocus]`);
      if (el) el.focus();
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const updateItem = (id, field, value) => setItems((prev) => prev.map((i) => (i._id === id ? { ...i, [field]: value } : i)));

  const handleSave = async () => {
    setSaving(true);
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi. Buat file .env terlebih dahulu.');
      setSaving(false);
      return;
    }

    const rows = items.map(item => ({
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      content: item.text || '',
      content_id: item.textEn || '',
      avatar: item.avatar || DEFAULT_AVATAR,
      rating: item.rating ?? 5,
    }));

    const { error: delError } = await supabase.from('testimonials').delete().neq('id', 0);
    if (delError) {
      setError(delError.message);
      setSaving(false);
      return;
    }

    if (rows.length > 0) {
      const { error: insError } = await supabase.from('testimonials').insert(rows);
      if (insError) {
        setError(insError.message);
        setSaving(false);
        return;
      }
    }

    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('admin.testimonials')}</h1>
        <div className="flex gap-2">
          <button onClick={addItem} className="px-4 py-2 rounded-xl border border-primary-500 text-primary-500 text-sm font-semibold hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-1.5">
            <FaPlus size={12} /> {t('admin.add')}
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50">
            {saving ? t('admin.saving') : saved ? t('admin.saved') : t('admin.save')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm text-slate-400">{t('admin.noData')}</p>
          </div>
        )}

        {items.map((item) => {
          const isOpen = expanded.has(item._id);
          const summary = [item.name, item.company].filter(Boolean).join(' - ') || 'Testimoni baru';
          return (
          <div key={item._id} data-item-id={item._id} className="card overflow-hidden">
            <div
              onClick={() => setExpanded(prev => {
                const next = new Set(prev);
                isOpen ? next.delete(item._id) : next.add(item._id);
                return next;
              })}
              className="flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
            >
              <div className="w-5 h-5 shrink-0 flex items-center justify-center text-slate-400">
                {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
              </div>
              <img
                src={item.avatar || DEFAULT_AVATAR}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
              />
              <span className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate">
                {summary}
              </span>
              <div className="flex items-center gap-0.5 mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < item.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'} size={10} />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Hapus testimoni ini?')) removeItem(item._id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <FaTrash size={12} />
              </button>
            </div>

            {isOpen && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  data-autofocus
                  value={item.name}
                  onChange={(e) => updateItem(item._id, 'name', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium"
                  placeholder="Nama"
                />
                <input
                  value={item.company}
                  onChange={(e) => updateItem(item._id, 'company', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  placeholder="Perusahaan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={item.role}
                  onChange={(e) => updateItem(item._id, 'role', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  placeholder="Jabatan (contoh: CEO)"
                />
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => updateItem(item._id, 'rating', i + 1)}>
                        <FaStar className={i < item.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Testimoni (Indonesia)</label>
                <textarea
                  value={item.text}
                  onChange={(e) => updateItem(item._id, 'text', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm resize-none"
                  placeholder="Tulis testimoni dalam Bahasa Indonesia..."
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Testimoni (English)</label>
                <textarea
                  value={item.textEn}
                  onChange={(e) => updateItem(item._id, 'textEn', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm resize-none"
                  placeholder="Write testimonial in English..."
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Avatar URL</label>
                <div className="flex gap-2 items-start">
                  <img
                    src={item.avatar || DEFAULT_AVATAR}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                  <input
                    value={item.avatar || ''}
                    onChange={(e) => updateItem(item._id, 'avatar', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                    placeholder="https://api.dicebear.com/..."
                  />
                </div>
              </div>
            </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
