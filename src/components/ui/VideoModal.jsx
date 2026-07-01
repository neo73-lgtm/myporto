import { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';

export default function VideoModal({ url, onClose }) {
  const [directUrl, setDirectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUI, setShowUI] = useState(true);
  const [useProxy, setUseProxy] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/video?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (!cancelled && data.videoUrl) {
          setDirectUrl(data.videoUrl);
        }
      } catch {
        setError('Direct video unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideo();
    return () => { cancelled = true; };
  }, [url]);

  const handleVideoError = useCallback(() => {
    if (!useProxy && directUrl) {
      setUseProxy(true);
      setError(null);
    } else {
      setError('Gagal memuat video');
    }
  }, [useProxy, directUrl]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    let timer;
    const handleMove = () => {
      setShowUI(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowUI(false), 3000);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchstart', handleMove);
    handleMove();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchstart', handleMove);
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const videoSrc = useProxy && directUrl
    ? `/api/video-proxy?url=${encodeURIComponent(directUrl)}`
    : directUrl;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none"
      onClick={onClose}
    >
      {loading && (
        <div className="flex flex-col items-center gap-3 text-white/60">
          <FaSpinner size={24} className="animate-spin" />
          <span className="text-xs">Memuat video...</span>
        </div>
      )}

      {!loading && videoSrc && !error && (
        <video
          ref={videoRef}
          key={useProxy ? 'proxy' : 'direct'}
          src={videoSrc}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
          onClick={(e) => e.stopPropagation()}
          onError={handleVideoError}
        />
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-4 text-white/60" onClick={(e) => e.stopPropagation()}>
          <span className="text-sm">{error}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          >
            <FaExternalLinkAlt size={12} />
            Buka di tab baru
          </a>
        </div>
      )}

      <div className={`fixed top-0 right-0 p-4 flex gap-2 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
        {videoSrc && !error && (
          <a
            href={videoSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            title="Download video"
            onClick={(e) => e.stopPropagation()}
          >
            <FaDownload size={14} />
          </a>
        )}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          title="Tutup"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
}
