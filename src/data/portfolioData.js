import {
  FaReact, FaNodeJs, FaFigma, FaGithub, FaLinkedin, FaTwitter, FaInstagram,
  FaHtml5, FaCss3Alt, FaJsSquare, FaDatabase, FaCode, FaChartLine, FaShoppingCart,
  FaVideo, FaBullhorn, FaPenFancy, FaHeadset,
} from 'react-icons/fa';
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiFirebase, SiMeta, SiGoogleads, SiShopee, SiTiktok } from 'react-icons/si';

export const personalData = {
  name: 'Ahmad Fauzi',
  initials: 'AF',
  title: 'Full-Stack Developer & Digital Growth Specialist',
  titles: ['Full-Stack Developer', 'Digital Growth Specialist', 'UI/UX Enthusiast'],
  email: 'ahmad.fauzi@email.com',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  workingHours: 'Senin - Jumat, 09:00 - 17:00 WIB',
  aboutParagraphs: [
    'Saya adalah jembatan antara dua dunia: teknologi dan pemasaran. Sebagai Full-Stack Developer, saya membangun produk digital yang solid. Sebagai Digital Growth Specialist, saya memastikan produk itu dikenal, dikunjungi, dan dibeli. Bukan sekadar coding — saya bicara soal hasil.',
    'Portofolio saya bukan hanya baris kode, tapi campaign yang menghasilkan ROAS 4.8x, toko online yang naik 3x lipat dalam 2 bulan, dan live hosting yang mengubah penonton menjadi pembeli. Saya menguasai React.js hingga Meta Ads, Node.js hingga Shopee Seller Center, TailwindCSS hingga TikTok Shop.',
    'Saya percaya: produk terbaik pun tidak akan berarti tanpa strategi distribusi yang tepat. Dan strategi terbaik pun akan kandas tanpa eksekusi teknis yang kuat. Saya ada di titik temu keduanya. Siap membangun dan menumbuhkan produk Anda?',
  ],
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=2563eb',
  cvUrl: '/cv',
  stats: [
    { label: 'Pengalaman', value: '3+ Tahun', labelEn: 'Experience', valueEn: '3+ Years' },
    { label: 'Proyek Selesai', value: '25+', labelEn: 'Projects Done', valueEn: '25+' },
    { label: 'ROAS Rata-rata', value: '4.5x', labelEn: 'Avg ROAS', valueEn: '4.5x' },
  ],
  socialLinks: [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/ahmadfauzi', icon: FaLinkedin },
    { name: 'GitHub', url: 'https://github.com/ahmadfauzi', icon: FaGithub },
    { name: 'Twitter', url: 'https://twitter.com/ahmadfauzi', icon: FaTwitter },
    { name: 'Instagram', url: 'https://instagram.com/ahmadfauzi', icon: FaInstagram },
  ],
};

export const skills = [
  // Tech
  { name: 'React.js', icon: FaReact, level: 90, category: 'tech' },
  { name: 'TailwindCSS', icon: SiTailwindcss, level: 88, category: 'tech' },
  { name: 'Node.js', icon: FaNodeJs, level: 80, category: 'tech' },
  { name: 'JavaScript', icon: FaJsSquare, level: 85, category: 'tech' },
  { name: 'TypeScript', icon: SiTypescript, level: 78, category: 'tech' },
  { name: 'Next.js', icon: SiNextdotjs, level: 75, category: 'tech' },
  { name: 'Firebase', icon: SiFirebase, level: 72, category: 'tech' },
  { name: 'Figma', icon: FaFigma, level: 82, category: 'tech' },
  { name: 'HTML5', icon: FaHtml5, level: 95, category: 'tech' },
  { name: 'CSS3', icon: FaCss3Alt, level: 92, category: 'tech' },
  { name: 'Database', icon: FaDatabase, level: 70, category: 'tech' },
  { name: 'Git/GitHub', icon: FaGithub, level: 85, category: 'tech' },
  // Marketing
  { name: 'Meta Ads', icon: SiMeta, level: 88, category: 'marketing' },
  { name: 'Google Ads', icon: SiGoogleads, level: 78, category: 'marketing' },
  { name: 'Shopee Seller', icon: SiShopee, level: 90, category: 'marketing' },
  { name: 'TikTok Shop', icon: SiTiktok, level: 85, category: 'marketing' },
  { name: 'Live Hosting', icon: FaVideo, level: 82, category: 'marketing' },
  { name: 'Content Strategy', icon: FaBullhorn, level: 80, category: 'marketing' },
  { name: 'Copywriting', icon: FaPenFancy, level: 75, category: 'marketing' },
  { name: 'Analytics', icon: FaChartLine, level: 78, category: 'marketing' },
];

export const workExperience = [
  {
    id: 1,
    role: 'Frontend Developer',
    company: 'TechCorp Indonesia',
    location: 'Jakarta',
    period: '2022 - Sekarang',
    periodEn: '2022 - Present',
    description: 'Mengembangkan dan memelihara aplikasi web menggunakan React.js dan TypeScript. Berkolaborasi dengan tim desain untuk mengimplementasikan UI/UX yang responsif.',
    descriptionEn: 'Developing and maintaining web applications using React.js and TypeScript. Collaborating with design team to implement responsive UI/UX.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'GraphQL'],
  },
  {
    id: 2,
    role: 'Junior Web Developer',
    company: 'Digital Agency XYZ',
    location: 'Jakarta',
    period: '2021 - 2022',
    periodEn: '2021 - 2022',
    description: 'Membangun website company profile dan landing page untuk berbagai klien. Mengoptimalkan performa website dan SEO.',
    descriptionEn: 'Building company profile websites and landing pages for various clients. Optimizing website performance and SEO.',
    technologies: ['JavaScript', 'React', 'Bootstrap', 'PHP'],
  },
  {
    id: 3,
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    location: 'Remote',
    period: '2020 - 2021',
    periodEn: '2020 - 2021',
    description: 'Mengerjakan berbagai proyek freelance mulai dari toko online, sistem manajemen, hingga website portofolio.',
    descriptionEn: 'Worked on various freelance projects from online stores, management systems, to portfolio websites.',
    technologies: ['HTML/CSS', 'JavaScript', 'WordPress', 'MySQL'],
  },
];

export const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web App',
    description: 'Platform belanja online modern dengan fitur keranjang, checkout, dan pembayaran terintegrasi.',
    descriptionEn: 'Modern online shopping platform with cart, checkout, and integrated payment features.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/ecommerce',
  },
  {
    id: 2,
    title: 'Task Management App',
    category: 'Web App',
    description: 'Aplikasi manajemen tugas kolaboratif dengan fitur real-time update, drag-and-drop, dan notifikasi push.',
    descriptionEn: 'Collaborative task management app with real-time updates, drag-and-drop, and push notifications.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    techStack: ['React', 'Firebase', 'TailwindCSS', 'DnD'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/taskmanager',
  },
  {
    id: 3,
    title: 'Healthcare Mobile App',
    category: 'Mobile',
    description: 'Aplikasi mobile konsultasi dokter online dengan fitur booking janji, telemedicine, dan resep digital.',
    descriptionEn: 'Mobile app for online doctor consultation with appointment booking, telemedicine, and digital prescriptions.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    techStack: ['React Native', 'Firebase', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/healthapp',
  },
  {
    id: 4,
    title: 'Company Profile Website',
    category: 'UI/UX',
    description: 'Desain ulang website profil perusahaan dengan fokus pada pengalaman pengguna dan konversi lead.',
    descriptionEn: 'Redesign of company profile website focusing on user experience and lead conversion.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    techStack: ['Figma', 'Next.js', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/companyprofile',
  },
  {
    id: 5,
    title: 'Food Delivery App',
    category: 'Mobile',
    description: 'Aplikasi pemesanan makanan dengan fitur tracking real-time, rekomendasi AI, dan sistem review.',
    descriptionEn: 'Food ordering app with real-time tracking, AI recommendations, and review system.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    techStack: ['Flutter', 'Firebase', 'Google Maps'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/foodapp',
  },
  {
    id: 6,
    title: 'Dashboard Analytics',
    category: 'UI/UX',
    description: 'Dashboard analitik dengan visualisasi data interaktif, export report, dan filtering data real-time.',
    descriptionEn: 'Analytics dashboard with interactive data visualization, report export, and real-time filtering.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    techStack: ['React', 'D3.js', 'TailwindCSS', 'Node.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/ahmadfauzi/dashboard',
  },
  {
    id: 7,
    title: 'Toko Fashion Meta Ads Campaign',
    category: 'Campaign',
    description: 'Menjalankan campaign Meta Ads untuk toko fashion lokal. Meningkatkan penjualan 3x lipat dalam 2 bulan dengan ROAS 4.8x.',
    descriptionEn: 'Ran Meta Ads campaign for a local fashion store. Increased sales 3x in 2 months with 4.8x ROAS.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    techStack: ['Meta Ads', 'Shopee', 'Canva', 'CapCut'],
    liveUrl: '',
    githubUrl: '',
  },
];

export const categories = ['Semua', 'Web App', 'Mobile', 'UI/UX', 'Campaign'];
export const categoriesEn = ['All', 'Web App', 'Mobile', 'UI/UX', 'Campaign'];

export const services = [
  {
    id: 1,
    icon: 'FaCode',
    title: 'Web Development',
    description: 'Membangun aplikasi web modern, responsif, dan performa tinggi menggunakan teknologi terkini.',
    descriptionEn: 'Building modern, responsive, high-performance web applications using the latest technologies.',
    points: ['Single Page Application (SPA)', 'Progressive Web App (PWA)', 'API Integration', 'Performance Optimization'],
    pointsEn: ['Single Page Application (SPA)', 'Progressive Web App (PWA)', 'API Integration', 'Performance Optimization'],
  },
  {
    id: 2,
    icon: 'FaChartLine',
    title: 'Digital Marketing',
    description: 'Mengelola campaign iklan, marketplace, dan konten untuk meningkatkan penjualan dan brand awareness.',
    descriptionEn: 'Managing ad campaigns, marketplaces, and content to boost sales and brand awareness.',
    points: ['Meta Ads & Google Ads', 'Shopee/Tokopedia/TikTok Shop', 'Live Hosting & Konten', 'Analytics & Reporting'],
    pointsEn: ['Meta Ads & Google Ads', 'Shopee/Tokopedia/TikTok Shop', 'Live Hosting & Content', 'Analytics & Reporting'],
  },
  {
    id: 3,
    icon: 'FaHeadset',
    title: 'Digital Consulting',
    description: 'Konsultasi end-to-end dari pembangunan produk digital hingga strategi pemasaran dan pertumbuhan.',
    descriptionEn: 'End-to-end consulting from building digital products to marketing strategy and growth.',
    points: ['Tech & Marketing Strategy', 'Digital Transformation', 'Growth Advisory', 'Team Mentoring'],
    pointsEn: ['Tech & Marketing Strategy', 'Digital Transformation', 'Growth Advisory', 'Team Mentoring'],
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Wijaya',
    role: 'CEO',
    company: 'TechInnovate',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=7c3aed',
    text: 'Bekerja dengan Ahmad adalah pengalaman yang luar biasa. Dia mampu menerjemahkan visi kami menjadi produk digital yang melebihi ekspektasi.',
    textEn: 'Working with Ahmad was an amazing experience. He was able to translate our vision into a digital product that exceeded expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Budi Hartono',
    role: 'Product Manager',
    company: 'StartupXYZ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=2563eb',
    text: 'Ahmad adalah developer yang sangat berbakat dengan perhatian luar biasa terhadap detail. Dia selalu memberikan solusi kreatif.',
    textEn: 'Ahmad is a very talented developer with exceptional attention to detail. He always provides creative solutions.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dian Permata',
    role: 'Founder',
    company: 'DigitalSolutions',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian&backgroundColor=059669',
    text: 'Kami sangat puas dengan hasil kerja Ahmad. Aplikasi yang dibangunnya sangat responsif, cepat, dan user-friendly.',
    textEn: 'We are very satisfied with Ahmad\'s work. The application he built is very responsive, fast, and user-friendly.',
    rating: 4,
  },
];

export const navLinks = [
  { name: 'Home', nameEn: 'Home', href: 'hero' },
  { name: 'About', nameEn: 'About', href: 'about' },
  { name: 'Projects', nameEn: 'Projects', href: 'projects' },
  { name: 'Services', nameEn: 'Services', href: 'services' },
  { name: 'Testimonials', nameEn: 'Testimonials', href: 'testimonials' },
  { name: 'Experience', nameEn: 'Experience', href: 'experience' },
  { name: 'Contact', nameEn: 'Contact', href: 'contact' },
];

export const footerLinks = [
  { name: 'About', nameEn: 'About', href: 'about' },
  { name: 'Projects', nameEn: 'Projects', href: 'projects' },
  { name: 'Services', nameEn: 'Services', href: 'services' },
  { name: 'Contact', nameEn: 'Contact', href: 'contact' },
];
