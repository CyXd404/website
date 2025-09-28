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
      // Gunakan timeout yang lebih pendek dan requestAnimationFrame
      setTimeout(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        });
      }, 50);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, [location.pathname, navigate]);

  // Tutup menu mobile ketika resize ke desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll ketika menu mobile terbuka
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

  const getNavItemClasses = (item: NavItem) => {
    const isActive = (location.pathname === '/' && activeSection === item.id) ||
                    (location.pathname === item.route && item.route !== '/');
    
    return `px-3 py-2 text-sm font-medium transition-colors relative ${
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    }`;
  };

  const getMobileNavItemClasses = (item: NavItem) => {
    const isActive = (location.pathname === '/' && activeSection === item.id) ||
                    (location.pathname === item.route && item.route !== '/');
    
    return `block w-full text-left px-3 py-3 text-base font-medium rounded-md transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
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
              aria-label="Go to homepage"
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
                className={getNavItemClasses(item)}
                aria-current={
                  (location.pathname === '/' && activeSection === item.id) ||
                  (location.pathname === item.route && item.route !== '/')
                    ? 'page'
                    : undefined
                }
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
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation dengan AnimatePresence */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden absolute left-0 right-0 top-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-2 space-y-0">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href, item.route)}
                    className={getMobileNavItemClasses(item)}
                    aria-current={
                      (location.pathname === '/' && activeSection === item.id) ||
                      (location.pathname === item.route && item.route !== '/')
                        ? 'page'
                        : undefined
                    }
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
