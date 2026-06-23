import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function ExperienceEditor() {
  const { t } = useLanguage();
  const { workExperience, refresh } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    setItems(workExperience.map(p => ({ ...p, _id: Date.now() + Math.random() })));
    setExpanded(new Set());
  }, [workExperience]);

  const addItem = () => {
    const id = Date.now() + Math.random();
    setItems((prev) => [{ _id: id, role: '', company: '', location: '', period: '', description: '', technologies: [] }, ...prev]);
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
      company: item.company || '',
      role: item.role || '',
      location: item.location || '',
      period: item.period || '',
      description: [item.description || ''],
      tech_stack: item.technologies || [],
    }));

    const { error: delError } = await supabase.from('experience').delete().neq('id', 0);
    if (delError) {
      setError(delError.message);
      setSaving(false);
      return;
    }

    if (rows.length > 0) {
      const { error: insError } = await supabase.from('experience').insert(rows);
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
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('admin.experience')}</h1>
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
          const summary = [item.role, item.company].filter(Boolean).join(' @ ') || 'Item baru';
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
              <span className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate">
                {summary}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Hapus pengalaman ini?')) removeItem(item._id);
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
                  value={item.role}
                  onChange={(e) => updateItem(item._id, 'role', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium"
                  placeholder="Posisi"
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
                  value={item.location}
                  onChange={(e) => updateItem(item._id, 'location', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  placeholder="Lokasi"
                />
                <input
                  value={item.period}
                  onChange={(e) => updateItem(item._id, 'period', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  placeholder="Periode"
                />
              </div>

              <textarea
                value={item.description}
                onChange={(e) => updateItem(item._id, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm resize-none"
                placeholder="Deskripsi"
              />

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Tech Stack</label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                  {item.technologies.map((tech, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-medium">
                      {tech}
                      <button
                        type="button"
                        onClick={() => updateItem(item._id, 'technologies', item.technologies.filter((_, j) => j !== i))}
                        className="hover:text-red-500 leading-none"
                      >×</button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="Ketik lalu tekan Enter atau koma"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !item.technologies.includes(val)) {
                        updateItem(item._id, 'technologies', [...item.technologies, val]);
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                />
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
