import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaPlay, FaSearchPlus } from 'react-icons/fa';
import Badge from '../ui/Badge';
import VideoModal from '../ui/VideoModal';
import ImageLightbox from '../ui/ImageLightbox';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { categories } from '../../data/portfolioData';
import { fetchThumbnail, isGenericPlaceholder } from '../../utils/oembed';

function FadeUp({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

function CampaignImage({ project }) {
  const [thumb, setThumb] = useState(project.image);
  const [failed, setFailed] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (project.videoUrl && isGenericPlaceholder(project.image) && !fetched.current) {
      fetched.current = true;
      fetchThumbnail(project.videoUrl).then(url => {
        if (url) setThumb(url);
      });
    }
  }, [project.videoUrl, project.image]);

  const handleError = () => {
    if (!fetched.current && project.videoUrl) {
      fetched.current = true;
      fetchThumbnail(project.videoUrl).then(url => {
        if (url) { setThumb(url); return; }
        setFailed(true);
      });
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">No thumbnail</span>
      </div>
    );
  }

  return (
    <img
      src={thumb}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
      loading="lazy"
      onError={handleError}
    />
  );
}

export default function Projects() {
  const { lang, t } = useLanguage();
  const { projects } = usePortfolio();
  const cats = categories;
  const [active, setActive] = useState(cats[0]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => { setActive(cats[0]); }, [cats[0]]);

  const filtered = active === cats[0] ? projects : projects.filter((p) => p.category === active);

  const isCampaign = (p) => p.category === 'Campaign';
  const isVideo = (p) => isCampaign(p) && p.videoUrl;

  return (
    <section id="projects" className="section-spacing bg-slate-50/50 dark:bg-slate-900/50">
      <div className="section-container">
        <FadeUp className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="section-title">{t('projects.title')}</h2>
          <p className="section-subtitle">{t('projects.subtitle')}</p>
        </FadeUp>

        <FadeUp>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 lg:mb-10">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`touch-target px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  active === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'card text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
              {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-hover group overflow-hidden"
              >
                <div className={`relative overflow-hidden ${isCampaign(project) ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
                  {isCampaign(project) ? (
                    <CampaignImage project={project} />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  {isCampaign(project) ? (
                    <>
                      {isVideo(project) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/30" />
                          <button
                            onClick={() => setVideoUrl(project.videoUrl)}
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                            aria-label="Putar video"
                          >
                            <FaPlay size={20} className="ml-1" />
                          </button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-4">
                          <button
                            onClick={() => setLightboxImage(project.image)}
                            className="touch-target w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                            aria-label="Lihat foto"
                          >
                            <FaSearchPlus size={12} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-4">
                      <div className="flex gap-2">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="touch-target w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors" aria-label={t('projects.viewLive')}>
                          <FaExternalLinkAlt size={12} />
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="touch-target w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-colors" aria-label={t('projects.viewSource')}>
                          <FaGithub size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">{project.title}</h3>
                    <span className="text-[10px] sm:text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full shrink-0">{project.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                    {project.techStack.map((tech) => <Badge key={tech}>{tech}</Badge>)}
                  </div>
                  {!isCampaign(project) && project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <FaExternalLinkAlt size={11} />
                      {lang === 'en' ? 'Visit Website' : 'Kunjungi Web'}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {videoUrl && <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />}
        {lightboxImage && <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />}
      </div>
    </section>
  );
}
