import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaPlus, FaTrash, FaExternalLinkAlt, FaChevronDown, FaChevronRight, FaSave } from 'react-icons/fa';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';

function fetchThumbnail(url) {
  if (!url) return DEFAULT_THUMBNAIL;
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

function toRow(item) {
  return {
    title: item.title || '',
    category: item.category || '',
    description: item.description || '',
    image: item.image || DEFAULT_THUMBNAIL,
    live_url: item.liveUrl || '',
    source_url: item.githubUrl || '',
    tech_stack: item.techStack || [],
  };
}

export default function ProjectsEditor() {
  const { t } = useLanguage();
  const { projects, refresh } = usePortfolio();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    setItems(projects.map(p => ({ ...p, _id: Date.now() + Math.random() })));
    setExpanded(new Set());
  }, [projects]);

  const addItem = () => {
    const id = Date.now() + Math.random();
    setItems((prev) => [{
      _id: id,
      title: '',
      category: 'Web App',
      description: '',
      image: DEFAULT_THUMBNAIL,
      techStack: [],
      liveUrl: '',
      githubUrl: '',
    }, ...prev]);
    setExpanded(prev => new Set(prev).add(id));
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-item-id="${id}"] [data-autofocus]`);
      if (el) el.focus();
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const updateItem = (id, field, value) => setItems((prev) => prev.map((i) => (i._id === id ? { ...i, [field]: value } : i)));

  const handleUrlChange = (id, url) => {
    updateItem(id, 'liveUrl', url);
    if (url) updateItem(id, 'image', fetchThumbnail(url));
  };

  const saveItem = async (id) => {
    if (!isSupabaseConfigured()) return;
    const item = items.find(i => i._id === id);
    if (!item) return;
    setSavingId(id);
    setError('');

    if (item.id) {
      const { error: updError } = await supabase.from('projects').update(toRow(item)).eq('id', item.id);
      if (updError) { setError(updError.message); setSavingId(null); return; }
    } else {
      const { error: insError } = await supabase.from('projects').insert(toRow(item));
      if (insError) { setError(insError.message); setSavingId(null); return; }
    }

    setSavingId(null);
    refresh();
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Hapus proyek ini dari database?')) return;
    if (!isSupabaseConfigured()) { removeItem(id); return; }
    setError('');

    const item = items.find(i => i._id === id);
    if (item && item.id) {
      const { error: delError } = await supabase.from('projects').delete().eq('id', item.id);
      if (delError) { setError(delError.message); return; }
    }
    removeItem(id);
    refresh();
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi. Buat file .env terlebih dahulu.');
      setSaving(false);
      return;
    }

    const rows = items.map(toRow);

    const { error: delError } = await supabase.from('projects').delete().neq('id', 0);
    if (delError) { setError(delError.message); setSaving(false); return; }

    if (rows.length > 0) {
      const { error: insError } = await supabase.from('projects').insert(rows);
      if (insError) { setError(insError.message); setSaving(false); return; }
    }

    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('admin.projects')}</h1>
        <div className="flex gap-2">
          <button onClick={addItem} className="px-4 py-2 rounded-xl border border-primary-500 text-primary-500 text-sm font-semibold hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-1.5">
            <FaPlus size={12} /> {t('admin.add')}
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50">
            {saving ? t('admin.saving') : saved ? t('admin.saved') : `${t('admin.save')} All`}
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
          <div key={item._id} data-item-id={item._id} className="card overflow-hidden group">
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
                src={item.image || DEFAULT_THUMBNAIL}
                alt=""
                className="w-10 h-7 sm:w-14 sm:h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                onError={(e) => { e.target.src = DEFAULT_THUMBNAIL; }}
              />
              <span className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-white truncate">
                {item.title || <span className="text-slate-400 italic">Proyek baru</span>}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item._id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTrash size={12} />
              </button>
            </div>

            {isOpen && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input
                    data-autofocus
                    value={item.title}
                    onChange={(e) => updateItem(item._id, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium"
                    placeholder="Nama Proyek"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Kategori</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item._id, 'category', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  >
                    <option>Web App</option>
                    <option>Mobile</option>
                    <option>UI/UX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">{t('admin.projectUrl')}</label>
                  <div className="flex gap-2">
                    <input
                      value={item.liveUrl}
                      onChange={(e) => handleUrlChange(item._id, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                      placeholder="https://..."
                    />
                    {item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-primary-500 transition-colors">
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Deskripsi</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(item._id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Tech Stack</label>
                  <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                    {item.techStack.map((tech, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-medium">
                        {tech}
                        <button
                          type="button"
                          onClick={() => updateItem(item._id, 'techStack', item.techStack.filter((_, j) => j !== i))}
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
                        if (val && !item.techStack.includes(val)) {
                          updateItem(item._id, 'techStack', [...item.techStack, val]);
                        }
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Github URL</label>
                  <input
                    value={item.githubUrl || ''}
                    onChange={(e) => updateItem(item._id, 'githubUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1">Thumbnail URL (ganti jika hasil screenshot tidak sesuai)</label>
                <div className="flex gap-2 items-start">
                  <img
                    src={item.image || DEFAULT_THUMBNAIL}
                    alt=""
                    className="w-14 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    onError={(e) => { e.target.src = DEFAULT_THUMBNAIL; }}
                  />
                  <input
                    value={item.image || ''}
                    onChange={(e) => updateItem(item._id, 'image', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => saveItem(item._id)}
                  disabled={savingId === item._id}
                  className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FaSave size={11} />
                  {savingId === item._id ? t('admin.saving') : t('admin.save')}
                </button>
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
