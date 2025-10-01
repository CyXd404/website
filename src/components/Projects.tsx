import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import CaseStudy from './CaseStudy';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  const openCaseStudy = (project: any) => {
    setSelectedProject(project);
    setIsCaseStudyOpen(true);
  };

  const projects = [
    {
      title: 'Smart Home Berbasis Arduino Uno',
      description: 'Proyek merakit sistem yang dapat memonitor lampu dan suhu ruangan, serta mengontrol perangkat elektronik dari jarak jauh menggunakan mikrokontroler Arduino.',
      image: 'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
      tags: ['Arduino', 'IoT', 'Sensors', 'Remote Control'],
      liveLink: 'https://github.com/CyXd404',
      githubLink: 'https://github.com/CyXd404',
      caseStudy: {
        title: 'Smart Home Berbasis Arduino Uno',
        description: 'Sistem IoT untuk monitoring dan kontrol perangkat rumah menggunakan Arduino Uno dengan konektivitas WiFi.',
        problem: 'Kesulitan dalam memonitor kondisi rumah saat tidak berada di tempat, terutama suhu ruangan dan status lampu.',
        solution: 'Membangun sistem IoT menggunakan Arduino Uno, sensor DHT22, relay module, dan ESP8266 untuk konektivitas WiFi.',
        results: 'Berhasil menciptakan sistem yang dapat memonitor suhu real-time dan mengontrol lampu dari smartphone dengan response time < 2 detik.',
        beforeImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400',
        afterImage: 'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400',
        technologies: ['Arduino Uno', 'ESP8266', 'DHT22', 'Relay Module', 'Blynk App', 'C++'],
        duration: '2 bulan',
        impact: {
          users: 5,
          efficiency: 40,
          satisfaction: 95
        },
        timeline: [
          { phase: 'Research & Planning', duration: '7', description: 'Riset komponen dan perencanaan sistem' },
          { phase: 'Hardware Assembly', duration: '14', description: 'Perakitan hardware dan testing komponen' },
          { phase: 'Programming', duration: '21', description: 'Coding Arduino dan integrasi dengan Blynk' },
          { phase: 'Testing & Optimization', duration: '14', description: 'Testing sistem dan optimasi performa' }
        ]
      }
    },
    {
      title: 'Instalasi ISP hingga Router',
      description: 'Membuat pengaturan perangkat dan jaringan ISP secara teknis, dari sisi instalasi sampai konfigurasi router, dikerjakan dalam waktu 3 bulan.',
      image: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600',
      tags: ['Network', 'ISP', 'Router', 'Configuration'],
      liveLink: 'https://github.com/CyXd404',
      githubLink: 'https://github.com/CyXd404',
      caseStudy: {
        title: 'Instalasi ISP hingga Router',
        description: 'Proyek instalasi dan konfigurasi jaringan ISP dari infrastruktur hingga end-user dengan fokus pada stabilitas dan performa.',
        problem: 'Kompleksitas instalasi jaringan ISP yang membutuhkan pemahaman mendalam tentang topologi jaringan dan konfigurasi perangkat.',
        solution: 'Melakukan instalasi sistematis mulai dari perencanaan topologi, instalasi kabel, konfigurasi router, hingga testing konektivitas.',
        results: 'Berhasil menginstal 50+ titik jaringan dengan uptime 99.8% dan kecepatan sesuai spesifikasi ISP.',
        beforeImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400',
        afterImage: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400',
        technologies: ['Router Configuration', 'Network Topology', 'Cable Management', 'Mikrotik', 'VLAN', 'QoS'],
        duration: '3 bulan',
        impact: {
          users: 50,
          efficiency: 60,
          satisfaction: 92
        },
        timeline: [
          { phase: 'Site Survey', duration: '14', description: 'Survey lokasi dan perencanaan topologi' },
          { phase: 'Infrastructure Setup', duration: '30', description: 'Instalasi kabel dan perangkat jaringan' },
          { phase: 'Configuration', duration: '21', description: 'Konfigurasi router dan switch' },
          { phase: 'Testing & Handover', duration: '7', description: 'Testing performa dan serah terima' }
        ]
      }
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Proyek Unggulan</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Berikut adalah beberapa proyek terbaru saya yang menunjukkan kemampuan dan pengalaman
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={`Screenshot proyek ${project.title} - ${project.description.substring(0, 100)}...`}
                  width="600"
                  height="400"
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4" role="group" aria-label="Project actions">
                  <motion.button
                    onClick={() => openCaseStudy(project)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`View case study of ${project.title}`}
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.a
                    href={project.liveLink}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`View live demo of ${project.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={18} />
                  </motion.a>
                  <motion.a
                    href={project.githubLink}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`View source code of ${project.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={18} />
                  </motion.a>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2" role="heading" aria-level="3">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 sm:px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Modal */}
        {selectedProject && (
          <CaseStudy
            isOpen={isCaseStudyOpen}
            onClose={() => setIsCaseStudyOpen(false)}
            project={selectedProject.caseStudy}
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
