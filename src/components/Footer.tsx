import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Shawava<span className="text-blue-400 dark:text-blue-300">Tritya</span>
            </h3>
            <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
              Pelajar SMK Teknik Komputer dan Jaringan yang passionate dalam bidang teknologi, 
              Arduino, IoT, dan pengolahan data dengan fokus pada kualitas dan ketelitian.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:text-center"
          >
            <h4 className="text-lg font-semibold mb-4">Navigasi Cepat</h4>
            <div className="space-y-2">
              <a
                href="/about"
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              >
                Tentang
              </a>
              <a
                href="/experience"
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              >
                Pengalaman
              </a>
              <a
                href="/projects"
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              >
                Proyek
              </a>
              <a
                href="/education"
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              >
                Pendidikan
              </a>
              <a
                href="/contact"
                className="block text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              >
                Kontak
              </a>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:text-right"
          >
            <h4 className="text-lg font-semibold mb-4">Terhubung dengan Saya</h4>
            <div className="flex md:justify-end space-x-4">
              <motion.a
                href="https://github.com/CyXd404"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub profile"
              >
                <Github size={24} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/shawava-tritya"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-400 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 focus:outline-none focus-visible:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin size={24} />
              </motion.a>
              <motion.a
                href="mailto:shawavatritya@gmail.com"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-gray-400 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-300 focus:outline-none focus-visible:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                aria-label="Send email"
              >
                <Mail size={24} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center"
        >
          <p className="text-gray-400 dark:text-gray-300 flex items-center justify-center space-x-1">
            <span>© {currentYear} Shawava Tritya. Made with</span>
            <Heart size={16} className="text-red-500" />
            <span>and lots of coffee</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
