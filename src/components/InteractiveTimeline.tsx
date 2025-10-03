import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Trophy,
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  month: string;
  title: string;
  description: string;
  category: 'education' | 'work' | 'project' | 'achievement';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  achievements: string[];
  media?: string;
  skills: string[];
}

const InteractiveTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      year: '2024',
      month: 'Jan',
      title: 'Started Advanced Arduino Projects',
      description: 'Began developing smart home automation systems using Arduino Uno with IoT integration.',
      category: 'project',
      icon: Zap,
      color: '#F59E0B',
      achievements: [
        'Completed 5 Arduino projects',
        'Integrated WiFi modules',
        'Real-time monitoring dashboard'
      ],
      skills: ['Arduino', 'C++', 'IoT', 'ESP8266']
    },
    {
      id: '2',
      year: '2023',
      month: 'Sep',
      title: 'Network Installation Certification',
      description: 'Completed comprehensive training in ISP installation and router configuration.',
      category: 'achievement',
      icon: Award,
      color: '#10B981',
      achievements: [
        'Installed 50+ network points',
        'Achieved 99.8% uptime',
        'Mikrotik certified'
      ],
      skills: ['Networking', 'Mikrotik', 'Router Config', 'Cable Management']
    },
    {
      id: '3',
      year: '2023',
      month: 'Jun',
      title: 'Data Entry Specialist',
      description: 'Worked as Data Entry operator with focus on accuracy and efficiency in data processing.',
      category: 'work',
      icon: Briefcase,
      color: '#3B82F6',
      achievements: [
        '99.5% accuracy rate',
        'Processed 1000+ records daily',
        'Reduced error rate by 30%'
      ],
      skills: ['Excel', 'Data Processing', 'Quality Control', 'Attention to Detail']
    },
    {
      id: '4',
      year: '2023',
      month: 'Mar',
      title: 'Production Team Member',
      description: 'Gained experience in manufacturing processes and quality assurance procedures.',
      category: 'work',
      icon: Target,
      color: '#8B5CF6',
      achievements: [
        'Maintained quality standards',
        'Improved efficiency by 15%',
        'Zero safety incidents'
      ],
      skills: ['Quality Assurance', 'Process Optimization', 'Teamwork', 'Safety Protocols']
    },
    {
      id: '5',
      year: '2022',
      month: 'Jul',
      title: 'Enrolled in SMK Computer Networking',
      description: 'Started vocational education specializing in Computer and Network Engineering.',
      category: 'education',
      icon: GraduationCap,
      color: '#EC4899',
      achievements: [
        'Top 10% of class',
        'Active in tech clubs',
        'Multiple project awards'
      ],
      skills: ['Computer Networks', 'Hardware', 'Software', 'Problem Solving']
    },
    {
      id: '6',
      year: '2024',
      month: 'Mar',
      title: 'First Smart Home Deployment',
      description: 'Successfully deployed first commercial smart home system for a client.',
      category: 'achievement',
      icon: Trophy,
      color: '#EF4444',
      achievements: [
        'Client satisfaction: 100%',
        'Response time < 2 seconds',
        'Featured in school showcase'
      ],
      skills: ['Project Management', 'Client Relations', 'IoT', 'System Integration']
    }
  ];

  const filteredEvents = filterCategory === 'all'
    ? timelineEvents
    : timelineEvents.filter(event => event.category === filterCategory);

  const categories = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'project', label: 'Projects', icon: Zap },
    { id: 'achievement', label: 'Awards', icon: Trophy }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Journey Timeline
      </h3>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filterCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <category.icon size={16} />
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-500 to-pink-500"></div>

        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-20"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="absolute left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
                style={{ backgroundColor: event.color }}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              >
                <event.icon size={16} />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                className={`cursor-pointer p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 transition-all duration-300 ${
                  selectedEvent?.id === event.id
                    ? 'border-blue-500 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-bold" style={{ color: event.color }}>
                    {event.month} {event.year}
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 capitalize">
                    {event.category}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {event.description}
                </p>

                <AnimatePresence>
                  {selectedEvent?.id === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <CheckCircle2 size={16} className="mr-2 text-green-600" />
                          Key Achievements:
                        </h5>
                        <ul className="space-y-1">
                          {event.achievements.map((achievement, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 mr-2 flex-shrink-0" />
                              {achievement}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Skills Gained:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {event.skills.map((skill, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center"
      >
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Click on any milestone to see detailed achievements and skills gained
        </p>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveTimeline;
