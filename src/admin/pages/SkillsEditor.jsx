import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function SkillsEditor() {
  const { t } = useLanguage();
  const { skills, refresh } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    setItems(skills.map(p => ({ ...p, _id: Date.now() + Math.random() })));
    setExpanded(new Set());
  }, [skills]);

  const addItem = () => {
    const id = Date.now() + Math.random();
    setItems((prev) => [{ _id: id, name: '', level: 50 }, ...prev]);
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
      level: item.level || 50,
    }));

    const { error: delError } = await supabase.from('skills').delete().neq('id', 0);
    if (delError) {
      setError(delError.message);
      setSaving(false);
      return;
    }

    if (rows.length > 0) {
      const { error: insError } = await supabase.from('skills').insert(rows);
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
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('admin.skills')}</h1>
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
                {item.name || <span className="text-slate-400 italic">Skill baru</span>}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 sm:w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.level}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-7 text-right font-medium">{item.level}%</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Hapus skill ini?')) removeItem(item._id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <FaTrash size={12} />
              </button>
            </div>

            {isOpen && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center gap-3 border-t border-slate-100 dark:border-slate-700">
              <div className="mt-3 flex-1 flex items-center gap-3">
                <input
                  data-autofocus
                  value={item.name}
                  onChange={(e) => updateItem(item._id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  placeholder="Nama Skill"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={item.level}
                    onChange={(e) => updateItem(item._id, 'level', Number(e.target.value))}
                    className="w-20 sm:w-28 h-1.5 accent-primary-500"
                  />
                  <span className="text-xs text-slate-500 w-7 text-right font-medium">{item.level}%</span>
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
