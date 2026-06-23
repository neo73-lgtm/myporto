import { Link } from 'react-scroll';
import { useLanguage } from '../../context/LanguageContext';
import { footerLinks } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { personalData } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                {personalData.initials}
              </div>
              <span className="text-base sm:text-lg font-semibold text-white">{personalData.name}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">{t('footer.desc')}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    smooth
                    duration={500}
                    offset={-80}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    {lang === 'en' ? link.nameEn : link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-4">{t('footer.socialMedia')}</h3>
            <div className="flex flex-wrap gap-2.5">
              {personalData.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs sm:text-sm text-slate-500">
            &copy; {year} {personalData.name}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
