import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastProvider } from './components/ToastNotification';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Skills from './components/Skills';
import ScrollProgress from './components/ScrollProgress';
import ParticleBackground from './components/ParticleBackground';
import BackToTop from './components/BackToTop';
import ThemeTransitionEffect from './components/ThemeTransitionEffect';

// Retry logic untuk lazy loading
const retryLazyLoad = (importFunc: () => Promise<any>, retries = 3, delay = 1000) => {
  return new Promise<any>((resolve, reject) => {
    importFunc()
      .then(resolve)
      .catch((error) => {
        if (retries === 1) {
          console.error('Failed to load module after retries:', error);
          reject(error);
          return;
        }
        console.warn(`Retrying module load... (${retries - 1} attempts left)`);
        setTimeout(() => {
          retryLazyLoad(importFunc, retries - 1, delay).then(resolve, reject);
        }, delay);
      });
  });
};

// Lazy load components dengan retry logic
const Hero = lazy(() => retryLazyLoad(() => import('./components/Hero')));
const About = lazy(() => retryLazyLoad(() => import('./components/About')));
const Experience = lazy(() => retryLazyLoad(() => import('./components/Experience')));
const Projects = lazy(() => retryLazyLoad(() => import('./components/Projects')));
const Education = lazy(() => retryLazyLoad(() => import('./components/Education')));
const Contact = lazy(() => retryLazyLoad(() => import('./components/Contact')));
const NotFound = lazy(() => retryLazyLoad(() => import('./components/NotFound')));
const SkillsRadarChart = lazy(() => retryLazyLoad(() => import('./components/SkillsRadarChart')));
const InteractiveTimeline = lazy(() => retryLazyLoad(() => import('./components/InteractiveTimeline')));
const AchievementBadges = lazy(() => retryLazyLoad(() => import('./components/AchievementBadges')));
const AnalyticsDashboard = lazy(() => retryLazyLoad(() => import('./components/AnalyticsDashboard')));

function KeyboardShortcutsWrapper() {
  useKeyboardShortcuts();
  return null;
}

function App() {
  const [appKey, setAppKey] = useState(0);
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const handleModuleError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('Failed to fetch dynamically imported module') ||
        event.message.includes('Importing a module script failed')
      )) {
        console.warn('Module loading error detected, forcing re-render...');
        setAppKey(prev => prev + 1);
      }
    };

    window.addEventListener('error', handleModuleError);
    return () => window.removeEventListener('error', handleModuleError);
  }, []);

  return (
    <Auth0Provider
      key={appKey}
      domain={import.meta.env.VITE_AUTH0_DOMAIN || ''}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ''}
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
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
            <BackToTop />
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