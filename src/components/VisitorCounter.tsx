import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp } from 'lucide-react';
import { supabase, getVisitorStats, trackVisitor, type VisitorStats } from '../lib/supabase';

const VisitorCounter = () => {
  const [stats, setStats] = useState<VisitorStats>({
    total_visitors: 0,
    total_page_views: 0,
    today_visitors: 0,
    today_page_views: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTracking = async () => {
      await trackVisitor();
      const initialStats = await getVisitorStats();
      setStats(initialStats);
      setIsLoading(false);
    };

    initializeTracking();

    const channel = supabase
      .channel('visitor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitors'
        },
        async () => {
          const updatedStats = await getVisitorStats();
          setStats(updatedStats);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_views'
        },
        async () => {
          const updatedStats = await getVisitorStats();
          setStats(updatedStats);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]"
    >
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 min-w-[180px] sm:min-w-[200px] max-w-full">
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
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 dark:text-gray-400">Visitors</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">Total</span>
              </div>
            </div>
            <motion.span
              key={stats.total_visitors}
              initial={{ scale: 1.2, color: '#3B82F6' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {isLoading ? '...' : stats.total_visitors.toLocaleString()}
            </motion.span>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-2">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 dark:text-gray-400">Views</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">Total</span>
              </div>
            </div>
            <motion.span
              key={stats.total_page_views}
              initial={{ scale: 1.2, color: '#10B981' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {isLoading ? '...' : stats.total_page_views.toLocaleString()}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;
