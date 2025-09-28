import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useActiveSection } from '../hooks/useActiveSection';

interface NavItem {
  name: string;
  href: string;
  route: string;
  id: string;
}

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection();

  const navItems: NavItem[] = React.useMemo(() => [
    { name: 'Home', href: '#home', route: '/', id: 'home' },
    { name: 'About', href: '#about', route: '/about', id: 'about' },
    { name: 'Experience', href: '#experience', route: '/experience', id: 'experience' },
    { name: 'Projects', href: '#projects', route: '/projects', id: 'projects' },
    { name: 'Education', href: '#education', route: '/education', id: 'education' },
    { name: 'Contact', href: '#contact', route: '/contact', id: 'contact' },
  ], []);

  const scrollToSection = React.useCallback((href: string, route: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, [location.pathname, navigate]);

  // Fix body scroll ketika menu terbuka
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Portfolio
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href, item.route)}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  (location.pathname === '/' && activeSection === item.id) ||
                  (location.pathname === item.route && item.route !== '/')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
                {((location.pathname === '/' && activeSection === item.id) ||
                  (location.pathname === item.route && item.route !== '/')) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - SOLUSI TANPA RONGGA */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel - TANPA BORDER & SHADOW yang bikin rongga */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 z-50"
            >
              {/* Container dengan padding yang ketat */}
              <div className="px-0 py-1">
                {navItems.map((item, index) => (
                  <div key={item.name} className="border-0">
                    <button
                      onClick={() => scrollToSection(item.href, item.route)}
                      className={`w-full text-left px-6 py-4 text-base font-medium transition-all border-0 ${
                        (location.pathname === '/' && activeSection === item.id) ||
                        (location.pathname === item.route && item.route !== '/')
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === navItems.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      {item.name}
                    </button>
                    
                    {/* Separator yang tidak bikin rongga */}
                    {index < navItems.length - 1 && (
                      <div className="mx-6 h-px bg-gray-100 dark:bg-gray-800" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
