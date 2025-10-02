import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Shield, Clock, Download, User, MessageSquare } from 'lucide-react';
import { useToast } from './ToastNotification';
import CopyEmail from './CopyEmail';

const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // Anti-bot field (tidak ditampilkan ke user)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('lastSubmitTime') || '0');
  });
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [typingTimeout, setTypingTimeout] = useState<{[key: string]: NodeJS.Timeout | null}>({});

  const COOLDOWN_TIME = 60000; // 1 menit
  const MAX_SUBMISSIONS_PER_HOUR = 3;

  useEffect(() => {
    localStorage.setItem('lastSubmitTime', lastSubmitTime.toString());
  }, [lastSubmitTime]);

  useEffect(() => {
    if (!localStorage.getItem('lastHourReset')) {
      localStorage.setItem('lastHourReset', Date.now().toString());
      localStorage.setItem('hourlySubmissions', '0');
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name;
    setFormData({ ...formData, [fieldName]: e.target.value });

    // Set typing indicator
    setIsTyping({ ...isTyping, [fieldName]: true });

    // Clear previous timeout
    if (typingTimeout[fieldName]) {
      clearTimeout(typingTimeout[fieldName]);
    }

    // Set new timeout to remove typing indicator after 1 second
    const timeout = setTimeout(() => {
      setIsTyping({ ...isTyping, [fieldName]: false });
    }, 1000);

    setTypingTimeout({ ...typingTimeout, [fieldName]: timeout });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Jika bot isi honeypot → langsung tolak
    if (formData.honeypot.trim() !== '') {
      setSubmitStatus('error');
      return;
    }

    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;

    // Cek cooldown
    if (timeSinceLastSubmit < COOLDOWN_TIME) {
      setSubmitStatus('error');
      return;
    }

    const hourlySubmissions = parseInt(
      localStorage.getItem('hourlySubmissions') || '0'
    );
    const lastHourReset = parseInt(
      localStorage.getItem('lastHourReset') || '0'
    );

    // Reset per jam
    if (now - lastHourReset > 3600000) {
      localStorage.setItem('hourlySubissions', '0');
      localStorage.setItem('lastHourReset', now.toString());
    } else if (hourlySubmissions >= MAX_SUBMISSIONS_PER_HOUR) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Pengiriman gagal');

      setLastSubmitTime(now);
      localStorage.setItem(
        'hourlySubmissions',
        (hourlySubmissions + 1).toString()
      );
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const hourlySubmissions = parseInt(
      localStorage.getItem('hourlySubmissions') || '0'
    );
    return (
      timeSinceLastSubmit >= COOLDOWN_TIME &&
      hourlySubmissions < MAX_SUBMISSIONS_PER_HOUR
    );
  };

  const getRemainingCooldown = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const remaining = Math.ceil(
      (COOLDOWN_TIME - timeSinceLastSubmit) / 1000
    );
    return remaining > 0 ? remaining : 0;
  };

  const downloadVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:Shawava Tritya
TEL;TYPE=CELL:+6285187805786
EMAIL:shawavatritya@gmail.com
ADR;TYPE=HOME:;;Cileungsi;Bogor;Jawa Barat;;Indonesia
URL:https://github.com/CyXd404
URL:https://www.linkedin.com/in/shawava-tritya
TITLE:Pelajar SMK - Teknik Komputer dan Jaringan
ORG:SMK Negeri 1 Cileungsi
NOTE:Project Developer & Data Enthusiast | Arduino | IoT | Network Installation
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Shawava_Tritya.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'shawavatritya@gmail.com',
      link: 'mailto:shawavatritya@gmail.com'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '085187805786',
      link: 'https://wa.me/6285187805786'
    },
    {
      icon: MapPin,
      title: 'Domisili',
      value: 'Cileungsi, Kab. Bogor, Jawa Barat',
      link: 'https://maps.app.goo.gl/9UCcE1a2dkAqDWUq5'
    }
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hubungi Saya
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Punya proyek atau ingin berkolaborasi? Saya senang mendengar dari Anda!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-4 lg:px-0"
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Mari diskusikan proyek Anda
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Saya selalu tertarik dengan peluang baru dan proyek yang menarik.
                  Baik Anda membutuhkan bantuan dalam bidang teknologi, data entry,
                  atau instalasi jaringan, saya siap membantu dengan kemampuan terbaik saya.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-gray-100 dark:border-gray-700"
                    {...(info.link.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    })}
                  >
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 dark:group-hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-300">
                      <info.icon size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold">
                        {info.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}

                <motion.button
                  onClick={downloadVCard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-3 p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-500 dark:to-emerald-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-semibold text-sm sm:text-base">Download Contact Card (vCard)</span>
                </motion.button>

                <div className="rounded-xl overflow-hidden shadow-md mt-6">
                  <iframe
                    title="Domisili Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d993.1633390811642!2d106.9597323!3d-6.408152199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6994aa2aee1d2f%3A0x65a8f73c2e7c6f1e!2sCileungsi%2C%20Bogor%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE (FORM) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-4 lg:px-0"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg space-y-6 border border-gray-100 dark:border-gray-700"
            >
              {/* HONEYPOT FIELD (TERSEMBUNYI) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3"
                >
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                      Pesan berhasil dikirim!
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
                >
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                      Gagal mengirim!
                    </p>
                    <p className="text-red-700 dark:text-red-400 text-xs mt-1">
                      Pastikan semua data benar atau coba beberapa saat lagi.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 dark:text-blue-300 text-xs font-medium">
                      Proteksi Anti-Spam Aktif
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">
                      Maksimal 3 pesan per jam • Cooldown 1 menit antar pesan
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center justify-between"
                  >
                    <span>Nama</span>
                    <AnimatePresence>
                      {isTyping.name && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center text-xs text-blue-600 dark:text-blue-400"
                        >
                          <User className="w-3 h-3 mr-1 animate-pulse" />
                          mengetik...
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-Sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nama Anda"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center justify-between"
                  >
                    <span>Email</span>
                    <AnimatePresence>
                      {isTyping.email && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center text-xs text-blue-600 dark:text-blue-400"
                        >
                          <Mail className="w-3 h-3 mr-1 animate-pulse" />
                          mengetik...
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="email.anda@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center justify-between"
                >
                  <span>Subjek</span>
                  <AnimatePresence>
                    {isTyping.subject && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center text-xs text-blue-600 dark:text-blue-400"
                      >
                        <MessageSquare className="w-3 h-3 mr-1 animate-pulse" />
                        mengetik...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tentang apa ini?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center justify-between"
                >
                  <span>Pesan</span>
                  <AnimatePresence>
                    {isTyping.message && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center text-xs text-blue-600 dark:text-blue-400"
                      >
                        <MessageSquare className="w-3 h-3 mr-1 animate-pulse" />
                        mengetik...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ceritakan tentang proyek Anda..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || !canSubmit()}
                className={`w-full py-2 sm:py-3 px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  canSubmit() && !isSubmitting
                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-102'
                    : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed opacity-60'
                }`}
              >
                {!canSubmit() ? (
                  <>
                    <Clock size={18} className="sm:w-5 sm:h-5" />
                    <span>
                      Tunggu {getRemainingCooldown() > 0
                        ? `${getRemainingCooldown()}s`
                        : 'sebentar'}
                    </span>
                  </>
                ) : (
                  <>
                    <Send size={18} className="sm:w-5 sm:h-5" />
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;