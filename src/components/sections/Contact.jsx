import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolio } from '../../context/PortfolioContext';

function FadeUp({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: 'easeOut', delay }} className={className}>
      {children}
    </motion.div>
  );
}

const contactInfo = [
  { icon: FaMapMarkerAlt, label: 'location', valueKey: 'location' },
  { icon: FaPhone, label: 'phone', valueKey: 'phone' },
  { icon: FaEnvelope, label: 'email', valueKey: 'email' },
  { icon: FaClock, label: 'workingHours', valueKey: 'workingHours' },
];

export default function Contact() {
  const { t } = useLanguage();
  const { personalData } = usePortfolio();
  const personalMap = {
    location: personalData.location,
    phone: personalData.phone,
    email: personalData.email,
    workingHours: personalData.workingHours,
  };
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="section-spacing">
      <div className="section-container">
        <FadeUp className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          <FadeUp className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card p-5 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.name')}</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder={t('contact.name')} />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.email')}</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.subject')}</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="Project Collaboration" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.message')}</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none" placeholder="Tell me about your project..." />
                </div>
                <Button type="submit" variant="primary" size="md" loading={loading} fullWidth>
                  {submitted ? t('contact.sent') : t('contact.send')}
                </Button>
                {submitted && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-emerald-500 text-xs sm:text-sm font-medium">
                    {t('contact.sentDesc')}
                  </motion.p>
                )}
              </div>
            </form>
          </FadeUp>

          <FadeUp className="lg:col-span-2" delay={0.1}>
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="card flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                    <info.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t(`contact.${info.label}`)}</p>
                    <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium truncate">{personalMap[info.valueKey]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 h-48 sm:h-52 lg:h-56">
              <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126914.08325354069!2d106.77387097721487!3d-6.229616932219435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e0d4f9f6e7%3A0xb1b3e1b1b1b1b1b1!2sJakarta!5e0!3m2!1sid!2sid!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
