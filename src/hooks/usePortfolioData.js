import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  personalData as fallbackPersonal,
  skills as fallbackSkills,
  projects as fallbackProjects,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  workExperience as fallbackExperience,
  education as fallbackEducation,
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

const skillCategoryMap = {
  'React.js': 'tech',
  'TailwindCSS': 'tech',
  'Node.js': 'tech',
  'JavaScript': 'tech',
  'TypeScript': 'tech',
  'Next.js': 'tech',
  'Firebase': 'tech',
  'Figma': 'tech',
  'HTML5': 'tech',
  'CSS3': 'tech',
  'Database': 'tech',
  'Git/GitHub': 'tech',
  'Meta Ads': 'marketing',
  'Google Ads': 'marketing',
  'Shopee Seller': 'marketing',
  'TikTok Shop': 'marketing',
  'Live Hosting': 'marketing',
  'Content Strategy': 'marketing',
  'Copywriting': 'marketing',
  'Analytics': 'marketing',
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
  education: fallbackEducation,
};

function mapProfile(row) {
  if (!row) return null;
  const dbSocials = row.social_links || [];
  const fallbackSocials = fallbackPersonal.socialLinks || [];
  return {
    name: row.full_name || fallbackPersonal.name,
    initials: row.initials || fallbackPersonal.initials,
    title: row.title || fallbackPersonal.title,
    titleEn: row.title_id || fallbackPersonal.titleEn || fallbackPersonal.title,
    titles: [row.title || fallbackPersonal.title, row.title_id || fallbackPersonal.title],
    email: row.email || fallbackPersonal.email,
    phone: row.phone || fallbackPersonal.phone,
    location: row.location || fallbackPersonal.location,
    workingHours: row.working_hours || fallbackPersonal.workingHours,
    workingHoursEn: row.working_hours_id || fallbackPersonal.workingHoursEn || '',
    aboutParagraphs: row.about || fallbackPersonal.aboutParagraphs,
    aboutParagraphsEn: row.about_id || fallbackPersonal.aboutParagraphsEn || [],
    avatarUrl: row.avatar_url || fallbackPersonal.avatarUrl,
    cvUrl: row.cv_url || '/cv',
    stats: (row.stats && row.stats.length > 0)
      ? row.stats.map(s => {
          const fb = fallbackPersonal.stats.find(f => f.label === s.label);
          return { ...s, labelEn: s.labelEn || fb?.labelEn || '', valueEn: s.valueEn || fb?.valueEn || '' };
        })
      : fallbackPersonal.stats,
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
    category: row.category || skillCategoryMap[row.name] || 'tech',
  };
}

function mapExperience(row) {
  const desc = Array.isArray(row.description) ? row.description : (row.description ? [row.description] : []);
  const descEn = Array.isArray(row.description_id) ? row.description_id : (row.description_id ? [row.description_id] : []);
  const fb = fallbackExperience.find(e => e.id === row.id);
  return {
    id: row.id,
    role: row.role || fb?.role || '',
    roleEn: row.role_id || fb?.roleEn || fb?.role || '',
    company: row.company || fb?.company || '',
    location: row.location || fb?.location || '',
    period: row.period || fb?.period || '',
    periodEn: row.period_id || fb?.periodEn || fb?.period || '',
    description: desc.length ? desc.join('\n') : (fb?.description || ''),
    descriptionEn: descEn.length ? descEn.join('\n') : (fb?.descriptionEn || fb?.description || ''),
    technologies: row.tech_stack || fb?.technologies || [],
  };
}

function mapProject(row) {
  const fb = fallbackProjects.find(p => p.id === row.id);
  return {
    id: row.id,
    title: row.title || fb?.title || '',
    titleEn: row.title_id || fb?.titleEn || fb?.title || '',
    category: row.category || fb?.category || '',
    description: row.description || fb?.description || '',
    descriptionEn: row.description_id || fb?.descriptionEn || fb?.description || '',
    image: row.image || fb?.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    techStack: row.tech_stack || fb?.techStack || [],
    liveUrl: row.live_url || fb?.liveUrl || '',
    githubUrl: row.source_url || fb?.githubUrl || '',
    videoUrl: row.video_url || fb?.videoUrl || '',
  };
}

function mapService(row) {
  const fb = fallbackServices.find(s => s.id === row.id);
  return {
    id: row.id,
    icon: row.icon || fb?.icon || 'FaCode',
    title: row.title || fb?.title || '',
    titleEn: row.title_id || fb?.titleEn || fb?.title || '',
    description: row.description || fb?.description || '',
    descriptionEn: row.description_id || fb?.descriptionEn || fb?.description || '',
    points: row.features || fb?.points || [],
    pointsEn: row.features || fb?.pointsEn || fb?.points || [],
  };
}

function mapTestimonial(row) {
  const fb = fallbackTestimonials.find(t => t.id === row.id);
  return {
    id: row.id,
    name: row.name || fb?.name || '',
    role: row.role || fb?.role || '',
    roleEn: row.role_id || fb?.roleEn || fb?.role || '',
    company: fb?.company || '',
    text: row.content || fb?.text || '',
    textEn: row.content_id || fb?.textEn || fb?.text || '',
    avatar: row.avatar || fb?.avatar || '',
    rating: row.rating ?? fb?.rating ?? 5,
  };
}

function mapEducation(row) {
  const fb = fallbackEducation.find(e => e.id === row.id);
  return {
    id: row.id,
    degree: row.degree || fb?.degree || '',
    degreeEn: row.degree_id || fb?.degreeEn || fb?.degree || '',
    institution: row.institution || fb?.institution || '',
    location: row.location || fb?.location || '',
    period: row.period || fb?.period || '',
    periodEn: row.period_id || fb?.periodEn || fb?.period || '',
    description: row.description || fb?.description || '',
    descriptionEn: row.description_id || fb?.descriptionEn || fb?.description || '',
    gpa: row.gpa || fb?.gpa || '',
    technologies: row.tech_stack || fb?.technologies || [],
  };
}

export default function usePortfolioData() {
  const supabaseAvailable = isSupabaseConfigured();
  const [data, setData] = useState(supabaseAvailable ? null : defaultData);
  const [loading, setLoading] = useState(supabaseAvailable);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    if (!supabaseAvailable) return;

    let cancelled = false;

    async function fetchFromSupabase() {
      try {
        const [profileRes, skillsRes, projectsRes, servicesRes, testimonialsRes, experienceRes, educationRes] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('skills').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('services').select('*'),
          supabase.from('testimonials').select('*'),
          supabase.from('experience').select('*'),
          supabase.from('education').select('*'),
        ]);

        if (cancelled) return;

        setData({
          personalData: (profileRes.data && profileRes.data.full_name) ? mapProfile(profileRes.data) : fallbackPersonal,
          skills: skillsRes.data?.length ? skillsRes.data.map(mapSkill) : fallbackSkills,
          projects: projectsRes.data?.length ? projectsRes.data.map(mapProject) : fallbackProjects,
          services: servicesRes.data?.length ? servicesRes.data.map(mapService) : fallbackServices,
          testimonials: testimonialsRes.data?.length ? testimonialsRes.data.map(mapTestimonial) : fallbackTestimonials,
          workExperience: experienceRes.data?.length ? experienceRes.data.map(mapExperience) : fallbackExperience,
          education: educationRes.data?.length ? educationRes.data.map(mapEducation) : fallbackEducation,
        });
      } catch (err) {
        if (!cancelled) {
          setData(defaultData);
          console.warn('Supabase fetch failed, using local data:', err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFromSupabase();
    return () => { cancelled = true; };
  }, [supabaseAvailable, refreshKey]);

  return { ...(data || {}), loading, error, refresh };
}
