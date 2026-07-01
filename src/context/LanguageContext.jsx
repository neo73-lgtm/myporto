import { createContext, useContext, useCallback } from 'react';

const translations = {
  nav: { home: 'Beranda', about: 'Tentang', projects: 'Proyek', services: 'Layanan', testimonials: 'Testimoni', contact: 'Kontak' },
  hero: { hello: 'Halo, saya', typing1: 'Full-Stack Developer', typing2: 'Digital Growth Specialist', typing3: 'UI/UX Enthusiast', desc: 'Full-Stack Developer & Digital Marketing Specialist. Saya membangun produk digital yang tidak hanya berfungsi, tetapi juga tumbuh dan menghasilkan.', letsTalk: 'Hubungi Saya', downloadCv: 'Download CV' },
  about: { title: 'Tentang Saya', subtitle: 'Kenali saya lebih dekat', techStack: 'Tech Stack', marketingTools: 'Marketing Tools' },
  experience: { title: 'Pengalaman Kerja', subtitle: 'Perjalanan karir saya' },
  education: { title: 'Pendidikan', subtitle: 'Riwayat pendidikan saya' },
  projects: { title: 'Proyek Saya', subtitle: 'Beberapa karya terbaru saya', all: 'Semua', viewLive: 'Lihat Langsung', viewSource: 'Lihat Source' },
  services: { title: 'Layanan Saya', subtitle: 'Apa yang bisa saya lakukan untuk Anda' },
  testimonials: { title: 'Testimoni', subtitle: 'Apa kata orang tentang saya' },
  contact: { title: 'Hubungi Saya', subtitle: 'Punya proyek? Mari bicara', name: 'Nama Lengkap', email: 'Email', subject: 'Subjek', message: 'Pesan', send: 'Kirim Pesan', sent: 'Pesan Terkirim!', sentDesc: 'Terima kasih! Pesan Anda telah terkirim.', location: 'Lokasi', phone: 'Telepon', workingHours: 'Jam Kerja' },
  footer: { desc: 'Full-Stack Developer & Digital Growth Specialist. Membangun produk digital yang tidak hanya berfungsi, tetapi juga tumbuh dan menghasilkan.', quickLinks: 'Tautan Cepat', socialMedia: 'Media Sosial', copyright: 'Hak cipta dilindungi.' },
  cv: { title: 'Curriculum Vitae', download: 'Download CV', print: 'Cetak', experience: 'Pengalaman Kerja', education: 'Pendidikan', skills: 'Keahlian', languages: 'Bahasa' },
  admin: { login: 'Masuk Admin', email: 'Email', password: 'Kata Sandi', signIn: 'Masuk', dashboard: 'Dashboard', personalInfo: 'Data Pribadi', projects: 'Proyek', experience: 'Pengalaman', education: 'Pendidikan', skills: 'Keahlian', save: 'Simpan', saving: 'Menyimpan...', saved: 'Tersimpan!', logout: 'Keluar', add: 'Tambah', edit: 'Edit', delete: 'Hapus', cancel: 'Batal', confirm: 'Konfirmasi', noData: 'Tidak ada data', loading: 'Memuat...', projectUrl: 'URL Proyek', autoThumbnail: 'Thumbnail Otomatis', uploadImage: 'Upload Gambar' },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const lang = 'id';

  const t = useCallback((path) => {
    const keys = path.split('.');
    let val = translations;
    for (const k of keys) {
      if (val) val = val[k];
    }
    return val || path;
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
