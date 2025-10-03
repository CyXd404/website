import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const ThemeTransitionEffect: React.FC = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showEffect, setShowEffect] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);

  useEffect(() => {
    if (theme !== prevTheme) {
      setShowEffect(true);
      generateParticles();
      setPrevTheme(theme);

      const timer = setTimeout(() => {
        setShowEffect(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [theme]);

  const generateParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 0.3
      });
    }

    setParticles(newParticles);
  };

  if (!showEffect) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeOut'
            }}
            className={`absolute rounded-full ${
              theme === 'dark'
                ? 'bg-blue-400'
                : 'bg-amber-400'
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              boxShadow: theme === 'dark'
                ? '0 0 20px rgba(96, 165, 250, 0.8)'
                : '0 0 20px rgba(251, 191, 36, 0.8)'
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-gradient-to-r from-amber-400 to-orange-500'
          }`}
          style={{ filter: 'blur(40px)' }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeTransitionEffect;
