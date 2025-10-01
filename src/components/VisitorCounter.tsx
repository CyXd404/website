import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp } from 'lucide-react';

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState(0);
  const [views, setViews] = useState(0);
  const targetVisitors = 1247;
  const targetViews = 3892;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const visitorIncrement = targetVisitors / steps;
    const viewIncrement = targetViews / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setVisitors(Math.min(Math.floor(visitorIncrement * currentStep), targetVisitors));
      setViews(Math.min(Math.floor(viewIncrement * currentStep), targetViews));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Statistik</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Visitors</span>
            </div>
            <motion.span
              key={visitors}
              initial={{ scale: 1.2, color: '#3B82F6' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {visitors.toLocaleString()}
            </motion.span>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-2">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Views</span>
            </div>
            <motion.span
              key={views}
              initial={{ scale: 1.2, color: '#10B981' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {views.toLocaleString()}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;
