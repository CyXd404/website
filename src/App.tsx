import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Auth0Provider } from '@auth0/auth0-react';

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import ScrollProgress from './components/ScrollProgress';
import ParticleBackground from './components/ParticleBackground';
import BackToTop from './components/BackToTop';
import VisitorCounter from './components/VisitorCounter';

// ⛔ ProtectedRoute DIHAPUS

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Contact = lazy(() => import('./components/Contact'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
      <Experience />
      <Timeline />
      <Projects />
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