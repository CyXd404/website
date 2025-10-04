import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Github, Linkedin, Mail, User, Briefcase, 
  FolderOpen, GraduationCap, MessageCircle, FileText 
} from 'lucide-react';
import { useGreeting } from '../hooks/useGreeting';
import { useTypingEffect } from '../hooks/useTypingEffect';
import ResumeModal from './ResumeModal';

const Hero = () => {
  const greeting = useGreeting();
  const [isResumeModalOpen, setIsResumeModalOpen] = React.useState(false);

  const typingText = useTypingEffect(
    [
      'Project Developer',
      'Data Enthusiast',
      'Arduino Expert',
      'IoT Developer',
      'Network Specialist',
    ],
    100,
    50,
    2000
  );

  const navigationFlow = [
    { path: '/about', label: 'About Me', icon: User, description: 'Learn about me' },
    { path: '/experience', label: 'Experience', icon: Briefcase, description: 'My career journey' },
    { path: '/projects', label: 'Projects', icon: FolderOpen, description: 'View my work' },
    { path: '/education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
    { path: '/contact', label: 'Contact', icon: MessageCircle, description: 'Contact me' },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden pt-20 transition-colors duration-300"
    >
      <h1 className="sr-only">
        Shawava Tritya - Portfolio Pelajar SMK Teknik Komputer dan Jaringan
      </h1>

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200/30 dark:bg-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-emerald-200/30 dark:bg-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-float animation-delay-2000"></div>
      </div>

      <div className="container-responsive relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
            {greeting}, I’m
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3">
            Shawava Tritya
          </h2>
          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 mb-6 font-medium">
            {typingText}
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://github.com/ShawavaTritya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Github size={22} />
            </a>
            <a
              href="https://linkedin.com/in/ShawavaTritya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Linkedin size={22} />
            </a>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="hover-lift p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all"
              aria-label="View Resume"
            >
              <FileText size={22} />
            </button>
            <a
              href="mailto:shawavatritya@gmail.com"
              className="hover-lift p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Mail size={22} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
            {navigationFlow.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="glass-card p-4 w-full text-center rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon className="mx-auto text-blue-600 dark:text-blue-400 mb-2" size={24} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition-all hover-lift"
            >
              Explore My Work <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </motion.div>
      </div>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </section>
  );
};

export default Hero;