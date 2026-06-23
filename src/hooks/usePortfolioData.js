import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  personalData as fallbackPersonal,
  skills as fallbackSkills,
  projects as fallbackProjects,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  workExperience as fallbackExperience,
} from '../data/portfolioData';
import {
  FaReact, FaNodeJs, FaFigma, FaGithub, FaHtml5, FaCss3Alt, FaJsSquare, FaDatabase,
  FaCode, FaChartLine, FaHeadset, FaVideo, FaBullhorn, FaPenFancy,
} from 'react-icons/fa';
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiFirebase, SiMeta, SiGoogleads, SiShopee, SiTiktok } from 'react-icons/si';

const skillIconMap = {
  'React.js': FaReact,
  'TailwindCSS': SiTailwindcss,
  'Node.js': FaNodeJs,
  'JavaScript': FaJsSquare,
  'TypeScript': SiTypescript,
  'Next.js': SiNextdotjs,
  'Firebase': SiFirebase,
  'Figma': FaFigma,
  'HTML5': FaHtml5,
  'CSS3': FaCss3Alt,
  'Database': FaDatabase,
  'Git/GitHub': FaGithub,
  'Meta Ads': SiMeta,
  'Google Ads': SiGoogleads,
  'Shopee Seller': SiShopee,
  'TikTok Shop': SiTiktok,
  'Live Hosting': FaVideo,
  'Content Strategy': FaBullhorn,
  'Copywriting': FaPenFancy,
  'Analytics': FaChartLine,
};

const serviceIconMap = {
  FaCode, FaChartLine, FaHeadset,
};

const defaultData = {
  personalData: fallbackPersonal,
  skills: fallbackSkills,
  projects: fallbackProjects,
  services: fallbackServices,
  testimonials: fallbackTestimonials,
  workExperience: fallbackExperience,
};

function mapProfile(row) {
  if (!row) return null;
  const dbSocials = row.social_links || [];
  const fallbackSocials = fallbackPersonal.socialLinks || [];
  return {
    name: row.full_name || '',
    initials: row.initials || '',
    title: row.title || '',
    titleEn: row.title_id || '',
    titles: [row.title || '', row.title_id || ''],
    email: row.email || '',
    phone: row.phone || '',
    location: row.location || '',
    workingHours: row.working_hours || '',
    aboutParagraphs: row.about || [],
    aboutParagraphsEn: row.about_id || [],
    avatarUrl: row.avatar_url || '',
    cvUrl: row.cv_url || '/cv',
    stats: (row.stats && row.stats.length > 0) ? row.stats : fallbackPersonal.stats,
    socialLinks: dbSocials.length > 0
      ? dbSocials.map(s => {
          const match = fallbackSocials.find(f => f.name === s.name);
          return { ...s, icon: match ? match.icon : null };
        })
      : fallbackSocials,
  };
}

function mapSkill(row) {
  return {
    name: row.name,
    level: row.level,
    icon: skillIconMap[row.name] || null,
    category: row.category || 'tech',
  };
}

function mapExperience(row) {
  const desc = Array.isArray(row.description) ? row.description : (row.description ? [row.description] : []);
  const descEn = Array.isArray(row.description_id) ? row.description_id : (row.description_id ? [row.description_id] : []);
  return {
    id: row.id,
    role: row.role || '',
    roleEn: row.role_id || '',
    company: row.company || '',
    location: row.location || '',
    period: row.period || '',
    periodEn: row.period_id || '',
    description: desc.join('\n'),
    descriptionEn: descEn.join('\n'),
    technologies: row.tech_stack || [],
  };
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title || '',
    titleEn: row.title_id || '',
    category: row.category || '',
    description: row.description || '',
    descriptionEn: row.description_id || '',
    image: row.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    techStack: row.tech_stack || [],
    liveUrl: row.live_url || '',
    githubUrl: row.source_url || '',
  };
}

function mapService(row) {
  return {
    id: row.id,
    icon: row.icon || 'FaCode',
    title: row.title || '',
    titleEn: row.title_id || '',
    description: row.description || '',
    descriptionEn: row.description_id || '',
    points: row.features || [],
    pointsEn: row.features || [],
  };
}

function mapTestimonial(row) {
  return {
    id: row.id,
    name: row.name || '',
    role: row.role || '',
    roleEn: row.role_id || '',
    company: '',
    text: row.content || '',
    textEn: row.content_id || '',
    avatar: row.avatar || '',
    rating: row.rating || 5,
  };
}

export default function usePortfolioData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchFromSupabase() {
      try {
        const [profileRes, skillsRes, projectsRes, servicesRes, testimonialsRes, experienceRes] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('skills').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('services').select('*'),
          supabase.from('testimonials').select('*'),
          supabase.from('experience').select('*'),
        ]);

        if (cancelled) return;

        setData({
          personalData: (profileRes.data && profileRes.data.full_name) ? mapProfile(profileRes.data) : fallbackPersonal,
          skills: skillsRes.data?.length ? skillsRes.data.map(mapSkill) : fallbackSkills,
          projects: projectsRes.data?.length ? projectsRes.data.map(mapProject) : fallbackProjects,
          services: servicesRes.data?.length ? servicesRes.data.map(mapService) : fallbackServices,
          testimonials: testimonialsRes.data?.length ? testimonialsRes.data.map(mapTestimonial) : fallbackTestimonials,
          workExperience: experienceRes.data?.length ? experienceRes.data.map(mapExperience) : fallbackExperience,
        });
      } catch (err) {
        if (!cancelled) console.warn('Supabase fetch failed, using local data:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFromSupabase();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { ...data, loading, error, refresh };
}
