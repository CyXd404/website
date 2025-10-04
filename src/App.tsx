import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastProvider } from './components/ToastNotification';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import ScrollProgress from './components/ScrollProgress';
import ParticleBackground from './components/ParticleBackground';
import BackToTop from './components/BackToTop';
import VisitorCounter from './components/VisitorCounter';
import ThemeTransitionEffect from './components/ThemeTransitionEffect';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Contact = lazy(() => import('./components/Contact'));
const NotFound = lazy(() => import('./components/NotFound'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const SkillsRadarChart = lazy(() => import('./components/SkillsRadarChart'));
const InteractiveTimeline = lazy(() => import('./components/InteractiveTimeline'));
const AchievementBadges = lazy(() => import('./components/AchievementBadges'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));

function KeyboardShortcutsWrapper() {
  useKeyboardShortcuts();
  return null;
}

function App() {
  // Menentukan redirect_uri dengan aman untuk mencegah error saat reload
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <KeyboardShortcutsWrapper />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden w-full">
              <ThemeTransitionEffect />
              <ScrollProgress />
              <ParticleBackground />
              <Header />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                
                {/* ✅ Tidak lagi dikunci */}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
            <BackToTop />
            <VisitorCounter />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
    </Auth0Provider>
  );
}

function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Hero />
      <About />
      <Skills />
      <section className="py-20 bg-gray-50 dark:bg-gray-800"><div className="container-responsive"><SkillsRadarChart /></div></section>
      <Experience />
      <section className="py-20 bg-white dark:bg-gray-900"><div className="container-responsive"><InteractiveTimeline /></div></section>
      <Projects />
      <Testimonials />
      <section className="py-20 bg-gray-50 dark:bg-gray-800"><div className="container-responsive"><AchievementBadges /></div></section>
      <section className="py-20 bg-white dark:bg-gray-900"><div className="container-responsive"><AnalyticsDashboard /></div></section>
      <Education />
      <Contact />
    </motion.div>
  );
}

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20"
    >
      <div className="sr-only">
        <h1>Tentang Shawava Tritya</h1>
      </div>
      <About />
    </motion.div>
  );
}

function ExperiencePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20"
    >
      <div className="sr-only">
        <h1>Pengalaman Kerja Shawava Tritya</h1>
      </div>
      <Experience />
    </motion.div>
  );
}

function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20"
    >
      <div className="sr-only">
        <h1>Proyek Unggulan Shawava Tritya</h1>
      </div>
      <Projects />
    </motion.div>
  );
}

function EducationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20"
    >
      <div className="sr-only">
        <h1>Pendidikan dan Keahlian Shawava Tritya</h1>
      </div>
      <Education />
    </motion.div>
  );
}

function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-20"
    >
      <div className="sr-only">
        <h1>Kontak Shawava Tritya</h1>
      </div>
      <Contact />
    </motion.div>
  );
}

export default App;