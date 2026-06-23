import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ImageUpload from '../../components/ui/ImageUpload';

const defaultSocial = { name: 'LinkedIn', url: '' };
const defaultStat = { label: '', value: '' };

export default function PersonalEditor() {
  const { t } = useLanguage();
  const { personalData, refresh } = usePortfolio();
  const [data, setData] = useState(personalData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (personalData && personalData.name) {
      setData(personalData);
    }
  }, [personalData]);

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const addParagraph = () => update('aboutParagraphs', [...data.aboutParagraphs, '']);
  const removeParagraph = (i) => update('aboutParagraphs', data.aboutParagraphs.filter((_, idx) => idx !== i));
  const updateParagraph = (i, val) => {
    const next = [...data.aboutParagraphs];
    next[i] = val;
    update('aboutParagraphs', next);
  };

  const addStat = () => update('stats', [...(data.stats || []), { ...defaultStat }]);
  const removeStat = (i) => update('stats', (data.stats || []).filter((_, idx) => idx !== i));
  const updateStat = (i, field, val) => {
    const next = [...(data.stats || [])];
    next[i] = { ...next[i], [field]: val };
    update('stats', next);
  };

  const addSocial = () => update('socialLinks', [...(data.socialLinks || []), { ...defaultSocial }]);
  const removeSocial = (i) => update('socialLinks', (data.socialLinks || []).filter((_, idx) => idx !== i));
  const updateSocial = (i, field, val) => {
    const next = [...(data.socialLinks || [])];
    next[i] = { ...next[i], [field]: val };
    update('socialLinks', next);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi. Buat file .env terlebih dahulu.');
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase.from('profiles').upsert({
      id: 1,
      full_name: data.name,
      initials: data.initials,
      email: data.email,
      phone: data.phone,
      title: data.title,
      location: data.location,
      working_hours: data.workingHours || '',
      avatar_url: data.avatarUrl,
      resume_url: data.cvUrl || '',
      about: data.aboutParagraphs,
      social_links: (data.socialLinks || []).map(s => ({ name: s.name, url: s.url })),
      stats: (data.stats || []).map(s => ({ label: s.label, value: s.value })),
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('admin.personalInfo')}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {saving ? t('admin.saving') : saved ? t('admin.saved') : t('admin.save')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama</label>
              <input
                value={data.name}
                onChange={(e) => setData((p) => ({ ...p, name: e.target.value, initials: e.target.value.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Inisial</label>
              <input value={data.initials} readOnly className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input value={data.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telepon</label>
              <input value={data.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul Pekerjaan</label>
              <input value={data.title} onChange={(e) => update('title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lokasi</label>
              <input value={data.location} onChange={(e) => update('location', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jam Kerja</label>
              <input value={data.workingHours || ''} onChange={(e) => update('workingHours', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" placeholder="Senin - Jumat, 09:00 - 17:00" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CV URL</label>
              <input value={data.cvUrl || ''} onChange={(e) => update('cvUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm" placeholder="/cv" />
            </div>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Foto / Avatar</h2>
          <ImageUpload
            currentUrl={data.avatarUrl}
            onUpload={(url) => update('avatarUrl', url)}
            folder="avatars"
          />
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Bio</h2>
            <button onClick={addParagraph} className="text-xs px-3 py-1.5 rounded-lg border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-1">
              <FaPlus size={10} /> Tambah
            </button>
          </div>
          {data.aboutParagraphs.map((p, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm resize-none" />
              <button onClick={() => removeParagraph(i)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors self-start mt-1">
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Statistik</h2>
            <button onClick={addStat} className="text-xs px-3 py-1.5 rounded-lg border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-1">
              <FaPlus size={10} /> Tambah
            </button>
          </div>
          <div className="space-y-3">
            {(data.stats || []).map((stat, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" placeholder="Label" />
                <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className="w-28 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" placeholder="Value" />
                <button onClick={() => removeStat(i)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Social Media</h2>
            <button onClick={addSocial} className="text-xs px-3 py-1.5 rounded-lg border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors flex items-center gap-1">
              <FaPlus size={10} /> Tambah
            </button>
          </div>
          <div className="space-y-3">
            {(data.socialLinks || []).map((social, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <input value={social.name} onChange={(e) => updateSocial(i, 'name', e.target.value)} className="w-28 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" placeholder="Nama" />
                <input value={social.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" placeholder="https://..." />
                <button onClick={() => removeSocial(i)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
