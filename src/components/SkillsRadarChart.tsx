import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Code, Database, Network, Cpu, Zap, Settings } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillCategory {
  name: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  projects: string[];
}

const SkillsRadarChart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const skillCategories: SkillCategory[] = [
    {
      name: 'Programming',
      value: 85,
      icon: Code,
      color: '#3B82F6',
      projects: ['Smart Home Arduino', 'Web Development', 'IoT Solutions']
    },
    {
      name: 'Database',
      value: 75,
      icon: Database,
      color: '#10B981',
      projects: ['Data Entry Systems', 'SQL Management', 'Excel Analytics']
    },
    {
      name: 'Networking',
      value: 90,
      icon: Network,
      color: '#F59E0B',
      projects: ['ISP Installation', 'Router Configuration', 'Network Setup']
    },
    {
      name: 'Hardware',
      value: 88,
      icon: Cpu,
      color: '#EF4444',
      projects: ['Arduino Projects', 'IoT Devices', 'Sensor Integration']
    },
    {
      name: 'Problem Solving',
      value: 92,
      icon: Zap,
      color: '#8B5CF6',
      projects: ['Technical Support', 'System Optimization', 'Troubleshooting']
    },
    {
      name: 'System Config',
      value: 80,
      icon: Settings,
      color: '#EC4899',
      projects: ['Server Setup', 'System Administration', 'Automation']
    }
  ];

  const data = {
    labels: skillCategories.map(cat => cat.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skillCategories.map(cat => cat.value),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: skillCategories.map(cat => cat.color),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: skillCategories.map(cat => cat.color),
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: '#6B7280',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: (context: any) => {
            return `Skill Level: ${context.parsed.r}%`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Skills Overview
      </h3>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              rotateY: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-md"
          >
            <Radar data={data} options={options} />
          </motion.div>
        </div>

        <div className="space-y-4">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedCategory(
                selectedCategory?.name === category.name ? null : category
              )}
              className="group cursor-pointer"
            >
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-all duration-300 border-l-4"
                style={{ borderColor: category.color }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: category.color }}
                >
                  <category.icon size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <span className="text-sm font-bold" style={{ color: category.color }}>
                      {category.value}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${category.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
              </div>

              {selectedCategory?.name === category.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Related Projects:
                  </h5>
                  <ul className="space-y-1">
                    {category.projects.map((project, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                        {project}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
          Click on any skill category to see related projects and experience
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SkillsRadarChart;
