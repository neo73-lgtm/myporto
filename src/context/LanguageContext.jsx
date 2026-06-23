import { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  id: {
    // Navbar
    nav: { home: 'Beranda', about: 'Tentang', projects: 'Proyek', services: 'Layanan', testimonials: 'Testimoni', contact: 'Kontak' },
    // Hero
    hero: { hello: 'Halo, saya', typing1: 'Full-Stack Developer', typing2: 'Digital Growth Specialist', typing3: 'UI/UX Enthusiast', desc: 'Full-Stack Developer & Digital Marketing Specialist. Saya membangun produk digital yang tidak hanya berfungsi, tetapi juga tumbuh dan menghasilkan.', letsTalk: 'Hubungi Saya', downloadCv: 'Download CV' },
    // About
    about: { title: 'Tentang Saya', subtitle: 'Kenali saya lebih dekat', techStack: 'Tech Stack', marketingTools: 'Marketing Tools' },
    // Experience
    experience: { title: 'Pengalaman Kerja', subtitle: 'Perjalanan karir saya' },
    // Projects
    projects: { title: 'Proyek Saya', subtitle: 'Beberapa karya terbaru saya', all: 'Semua', viewLive: 'Lihat Langsung', viewSource: 'Lihat Source' },
    // Services
    services: { title: 'Layanan Saya', subtitle: 'Apa yang bisa saya lakukan untuk Anda' },
    // Testimonials
    testimonials: { title: 'Testimoni', subtitle: 'Apa kata orang tentang saya' },
    // Contact
    contact: { title: 'Hubungi Saya', subtitle: 'Punya proyek? Mari bicara', name: 'Nama Lengkap', email: 'Email', subject: 'Subjek', message: 'Pesan', send: 'Kirim Pesan', sent: 'Pesan Terkirim!', sentDesc: 'Terima kasih! Pesan Anda telah terkirim.', location: 'Lokasi', phone: 'Telepon', workingHours: 'Jam Kerja' },
    // Footer
    footer: { desc: 'Full-Stack Developer & Digital Growth Specialist. Membangun produk digital yang tidak hanya berfungsi, tetapi juga tumbuh dan menghasilkan.', quickLinks: 'Tautan Cepat', socialMedia: 'Media Sosial', copyright: 'Hak cipta dilindungi.' },
    // CV
    cv: { title: 'Curriculum Vitae', download: 'Download CV', print: 'Cetak', experience: 'Pengalaman Kerja', education: 'Pendidikan', skills: 'Keahlian', languages: 'Bahasa' },
    // Admin
    admin: { login: 'Masuk Admin', email: 'Email', password: 'Kata Sandi', signIn: 'Masuk', dashboard: 'Dashboard', personalInfo: 'Data Pribadi', projects: 'Proyek', experience: 'Pengalaman', skills: 'Keahlian', save: 'Simpan', saving: 'Menyimpan...', saved: 'Tersimpan!', logout: 'Keluar', add: 'Tambah', edit: 'Edit', delete: 'Hapus', cancel: 'Batal', confirm: 'Konfirmasi', noData: 'Tidak ada data', loading: 'Memuat...', projectUrl: 'URL Proyek', autoThumbnail: 'Thumbnail Otomatis', uploadImage: 'Upload Gambar' },
  },
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', services: 'Services', testimonials: 'Testimonials', contact: 'Contact' },
    hero: { hello: "Hello, I'm", typing1: 'Full-Stack Developer', typing2: 'Digital Growth Specialist', typing3: 'UI/UX Enthusiast', desc: 'Full-Stack Developer & Digital Marketing Specialist. I build digital products that not only function, but grow and generate results.', letsTalk: "Let's Talk", downloadCv: 'Download CV' },
    about: { title: 'About Me', subtitle: 'Get to know me better', techStack: 'Tech Stack', marketingTools: 'Marketing Tools' },
    experience: { title: 'Work Experience', subtitle: 'My career journey' },
    projects: { title: 'My Projects', subtitle: 'Some of my recent works', all: 'All', viewLive: 'View Live', viewSource: 'View Source' },
    services: { title: 'My Services', subtitle: 'What I can do for you' },
    testimonials: { title: 'Testimonials', subtitle: 'What people say about me' },
    contact: { title: 'Get In Touch', subtitle: "Have a project in mind? Let's talk", name: 'Full Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Send Message', sent: 'Message Sent!', sentDesc: 'Thank you! Your message has been sent.', location: 'Location', phone: 'Phone', workingHours: 'Working Hours' },
    footer: { desc: 'Full-Stack Developer & Digital Growth Specialist. Building digital products that not only function, but grow and generate results.', quickLinks: 'Quick Links', socialMedia: 'Social Media', copyright: 'All rights reserved.' },
    cv: { title: 'Curriculum Vitae', download: 'Download CV', print: 'Print', experience: 'Work Experience', education: 'Education', skills: 'Skills', languages: 'Languages' },
    admin: { login: 'Admin Login', email: 'Email', password: 'Password', signIn: 'Sign In', dashboard: 'Dashboard', personalInfo: 'Personal Info', projects: 'Projects', experience: 'Experience', skills: 'Skills', save: 'Save', saving: 'Saving...', saved: 'Saved!', logout: 'Logout', add: 'Add', edit: 'Edit', delete: 'Delete', cancel: 'Cancel', confirm: 'Confirm', noData: 'No data', loading: 'Loading...', projectUrl: 'Project URL', autoThumbnail: 'Auto Thumbnail', uploadImage: 'Upload Image' },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('porto_lang') || 'id');

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('porto_lang', next);
      return next;
    });
  }, []);

  const t = useCallback((path) => {
    const keys = path.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (val) val = val[k];
    }
    return val || path;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
