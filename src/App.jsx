import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import WhatsAppButton from './components/ui/WhatsAppButton';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Services from './components/sections/Services';
import Testimonials from './components/sections/Testimonials';
import WorkExperience from './components/sections/WorkExperience';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';
import CV from './pages/CV';
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminLayout from './admin/AdminLayout';
import PersonalEditor from './admin/pages/PersonalEditor';
import ProjectsEditor from './admin/pages/ProjectsEditor';
import ExperienceEditor from './admin/pages/ExperienceEditor';
import EducationEditor from './admin/pages/EducationEditor';
import SkillsEditor from './admin/pages/SkillsEditor';
import useDarkMode from './hooks/useDarkMode';
import { PortfolioProvider } from './context/PortfolioContext';

function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 touch-target w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <FaArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Services />
      <Testimonials />
      <WorkExperience />
      <Education />
      <Contact />
    </>
  );
}

function PublicLayout({ darkMode, toggleDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopBtn />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen transition-colors duration-300">
      <PortfolioProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="personal" element={<PersonalEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="experience" element={<ExperienceEditor />} />
            <Route path="education" element={<EducationEditor />} />
            <Route path="skills" element={<SkillsEditor />} />
          </Route>
          <Route path="/cv" element={<CV />} />
          <Route path="/*" element={<PublicLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </PortfolioProvider>
    </div>
  );
}
