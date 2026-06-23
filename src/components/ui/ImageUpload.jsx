import { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FaUpload, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function ImageUpload({ currentUrl, onUpload, folder = 'avatars' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured()) {
      setStatus('no-supabase');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStatus('too-large');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setUploading(true);
    setStatus('idle');

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolios')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      setStatus('error');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolios')
      .getPublicUrl(filePath);

    onUpload(publicUrl);
    setUploading(false);
    setStatus('done');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const statusIcon = () => {
    if (uploading) return <FaSpinner className="animate-spin" />;
    if (status === 'done') return <FaCheck className="text-emerald-500" />;
    if (status === 'error' || status === 'too-large') return <FaExclamationTriangle className="text-red-500" />;
    return <FaUpload className="text-slate-400" />;
  };

  const statusText = () => {
    if (uploading) return 'Mengupload...';
    if (status === 'done') return 'Berhasil!';
    if (status === 'error') return 'Upload gagal';
    if (status === 'too-large') return 'Maks 2MB';
    if (status === 'no-supabase') return 'Supabase belum diatur';
    return '';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={currentUrl || 'https://via.placeholder.com/64'}
          alt=""
          className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-600"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors disabled:opacity-50"
        >
          {statusIcon()}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      <div className="flex flex-col gap-1">
        <input
          value={currentUrl}
          onChange={(e) => onUpload(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm w-64"
          placeholder="URL Gambar"
        />
        {statusText() && (
          <span className={`text-[10px] ${status === 'done' ? 'text-emerald-500' : status === 'error' || status === 'too-large' ? 'text-red-500' : 'text-slate-400'}`}>
            {statusText()}
          </span>
        )}
      </div>
    </div>
  );
}
