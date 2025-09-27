import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Shield, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // ✅ Tambahan untuk update waktu tiap detik
  const [, setCooldownTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const COOLDOWN_TIME = 60000;
  const MAX_SUBMISSIONS_PER_HOUR = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;

    if (timeSinceLastSubmit < COOLDOWN_TIME) {
      setSubmitStatus('error');
      return;
    }

    const hourlySubmissions = parseInt(localStorage.getItem('hourlySubmissions') || '0');
    const lastHourReset = parseInt(localStorage.getItem('lastHourReset') || '0');

    if (now - lastHourReset > 3600000) {
      localStorage.setItem('hourlySubmissions', '0');
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Pengiriman gagal');

      setLastSubmitTime(now);
      localStorage.setItem('hourlySubmissions', (hourlySubmissions + 1).toString());
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const hourlySubmissions = parseInt(localStorage.getItem('hourlySubmissions') || '0');
    return timeSinceLastSubmit >= COOLDOWN_TIME && hourlySubmissions < MAX_SUBMISSIONS_PER_HOUR;
  };

  const getRemainingCooldown = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const remaining = Math.ceil((COOLDOWN_TIME - timeSinceLastSubmit) / 1000);
    return remaining > 0 ? remaining : 0;
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
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      {/* ... SEMUA KONTEN SEBELUM BUTTON TETAP SAMA ... */}

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
            <span>Tunggu {getRemainingCooldown()}s</span>
          </>
        ) : (
          <>
            <Send size={18} className="sm:w-5 sm:h-5" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
          </>
        )}
      </motion.button>

      {/* ... penutup tag yang lain ... */}
    </section>
  );
};

export default Contact;