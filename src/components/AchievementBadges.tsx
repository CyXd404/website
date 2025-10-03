import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Eye,
  Clock,
  Scroll,
  Star,
  Sparkles,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showUnlocked, setShowUnlocked] = useState<Achievement | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initializeAchievements();
    trackUserProgress();

    const interval = setInterval(() => {
      trackUserProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeAchievements = () => {
    const stored = localStorage.getItem('portfolio_achievements');
    if (stored) {
      setAchievements(JSON.parse(stored));
    } else {
      const initialAchievements: Achievement[] = [
        {
          id: 'first-visit',
          title: 'Welcome Explorer',
          description: 'Visit the portfolio for the first time',
          icon: Eye,
          color: '#3B82F6',
          requirement: 'Visit the site',
          unlocked: true,
          progress: 1,
          maxProgress: 1
        },
        {
          id: 'scroll-master',
          title: 'Scroll Master',
          description: 'Scroll through 5 sections',
          icon: Scroll,
          color: '#10B981',
          requirement: 'Scroll through sections',
          unlocked: false,
          progress: 0,
          maxProgress: 5
        },
        {
          id: 'time-invested',
          title: 'Time Traveler',
          description: 'Spend 2 minutes exploring',
          icon: Clock,
          color: '#F59E0B',
          requirement: 'Spend time on site',
          unlocked: false,
          progress: 0,
          maxProgress: 120
        },
        {
          id: 'project-viewer',
          title: 'Project Detective',
          description: 'View all project details',
          icon: Target,
          color: '#8B5CF6',
          requirement: 'View projects',
          unlocked: false,
          progress: 0,
          maxProgress: 2
        },
        {
          id: 'social-connector',
          title: 'Social Butterfly',
          description: 'Click on social media links',
          icon: Sparkles,
          color: '#EC4899',
          requirement: 'Click social links',
          unlocked: false,
          progress: 0,
          maxProgress: 3
        },
        {
          id: 'completionist',
          title: 'Completionist',
          description: 'Unlock all other achievements',
          icon: Trophy,
          color: '#EF4444',
          requirement: 'Unlock all badges',
          unlocked: false,
          progress: 1,
          maxProgress: 5
        }
      ];

      setAchievements(initialAchievements);
      localStorage.setItem('portfolio_achievements', JSON.stringify(initialAchievements));
    }
  };

  const trackUserProgress = () => {
    const scrollCount = parseInt(localStorage.getItem('scroll_count') || '0');
    const visitDuration = parseInt(localStorage.getItem('visit_duration') || '0');
    const projectViews = parseInt(localStorage.getItem('project_views') || '0');
    const socialClicks = parseInt(localStorage.getItem('social_clicks') || '0');

    const startTime = parseInt(sessionStorage.getItem('visit_start_time') || Date.now().toString());
    const currentDuration = Math.floor((Date.now() - startTime) / 1000);
    localStorage.setItem('visit_duration', currentDuration.toString());

    setAchievements(prev => {
      const updated = prev.map(achievement => {
        let newProgress = achievement.progress;
        let unlocked = achievement.unlocked;

        switch (achievement.id) {
          case 'scroll-master':
            newProgress = Math.min(scrollCount, achievement.maxProgress);
            unlocked = scrollCount >= achievement.maxProgress;
            break;
          case 'time-invested':
            newProgress = Math.min(currentDuration, achievement.maxProgress);
            unlocked = currentDuration >= achievement.maxProgress;
            break;
          case 'project-viewer':
            newProgress = Math.min(projectViews, achievement.maxProgress);
            unlocked = projectViews >= achievement.maxProgress;
            break;
          case 'social-connector':
            newProgress = Math.min(socialClicks, achievement.maxProgress);
            unlocked = socialClicks >= achievement.maxProgress;
            break;
          case 'completionist':
            const unlockedCount = prev.filter(a => a.unlocked && a.id !== 'completionist').length;
            newProgress = unlockedCount;
            unlocked = unlockedCount >= 5;
            break;
        }

        if (unlocked && !achievement.unlocked) {
          setShowUnlocked(achievement);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }

        return { ...achievement, progress: newProgress, unlocked };
      });

      localStorage.setItem('portfolio_achievements', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (!sessionStorage.getItem('visit_start_time')) {
      sessionStorage.setItem('visit_start_time', Date.now().toString());
    }

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollCount = parseInt(localStorage.getItem('scroll_count') || '0');
        localStorage.setItem('scroll_count', (scrollCount + 1).toString());
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      <AnimatePresence>
        {showToast && showUnlocked && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-yellow-400 p-4 max-w-sm"
          >
            <div className="flex items-start space-x-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: 3
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: showUnlocked.color }}
              >
                <showUnlocked.icon size={24} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  Achievement Unlocked!
                </p>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {showUnlocked.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {showUnlocked.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
            Achievements
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {unlockedCount}/{totalCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Unlocked</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 opacity-75'
              }`}
            >
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Star size={16} className="text-white fill-white" />
                </motion.div>
              )}

              <div className="flex items-start space-x-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.unlocked ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{
                    backgroundColor: achievement.unlocked ? achievement.color : '#D1D5DB'
                  }}
                >
                  <achievement.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${
                    achievement.unlocked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {!achievement.unlocked && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: achievement.color }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlocked && (
                <div className="mt-2 flex items-center justify-center">
                  <Zap size={14} className="text-yellow-600 mr-1" />
                  <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                    Unlocked!
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AchievementBadges;
