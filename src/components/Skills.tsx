import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Database, Network, Cpu, FileText, Monitor,
  Wifi, Server, Shield, Terminal, Cloud, Wrench
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming & Development',
      icon: Code2,
      color: 'blue',
      skills: [
        { name: 'Arduino', level: 85, icon: Cpu },
        { name: 'IoT Projects', level: 80, icon: Wifi },
        { name: 'Python', level: 70, icon: Terminal }
      ]
    },
    {
      title: 'Networking & Infrastructure',
      icon: Network,
      color: 'emerald',
      skills: [
        { name: 'Network Installation', level: 90, icon: Server },
        { name: 'LAN/WAN Setup', level: 85, icon: Network },
        { name: 'Troubleshooting', level: 88, icon: Wrench }
      ]
    },
    {
      title: 'Data & Office Tools',
      icon: Database,
      color: 'purple',
      skills: [
        { name: 'Data Entry', level: 95, icon: FileText },
        { name: 'Microsoft Office', level: 90, icon: Monitor },
        { name: 'Data Analysis', level: 75, icon: Database }
      ]
    },
    {
      title: 'Technical Skills',
      icon: Shield,
      color: 'orange',
      skills: [
        { name: 'System Monitoring', level: 82, icon: Monitor },
        { name: 'Hardware Assembly', level: 85, icon: Cpu },
        { name: 'Technical Support', level: 88, icon: Wrench }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        icon: 'bg-blue-600 dark:bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        progress: 'bg-blue-600 dark:bg-blue-500'
      },
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-700',
        icon: 'bg-emerald-600 dark:bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        progress: 'bg-emerald-600 dark:bg-emerald-500'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-700',
        icon: 'bg-purple-600 dark:bg-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
        progress: 'bg-purple-600 dark:bg-purple-500'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'bg-orange-600 dark:bg-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
        progress: 'bg-orange-600 dark:bg-orange-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Keahlian & Kompetensi
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Rangkaian keahlian teknis yang saya kuasai selama perjalanan belajar dan pengalaman kerja
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 px-4 md:px-0">
          {skillCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            const CategoryIcon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className={`${colors.icon} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4`}>
                    <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className={`text-base sm:text-lg md:text-xl font-bold ${colors.text}`}>
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {category.skills.map((skill, skillIndex) => {
                    const SkillIcon = skill.icon;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index * 0.1) + (skillIndex * 0.05) }}
                      >
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <div className="flex items-center">
                            <SkillIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.text} mr-1.5 sm:mr-2`} />
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {skill.name}
                            </span>
                          </div>
                          <span className={`text-xs sm:text-sm font-bold ${colors.text}`}>
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: (index * 0.1) + (skillIndex * 0.05) + 0.2, ease: "easeOut" }}
                            className={`h-full ${colors.progress} rounded-full relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-100 dark:border-blue-800">
            <Cloud className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
            <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Terus Berkembang
            </h4>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Saya selalu antusias mempelajari teknologi dan tools baru untuk meningkatkan kemampuan teknis
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
