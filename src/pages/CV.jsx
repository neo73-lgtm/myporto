import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function CV() {
  const { lang, t } = useLanguage();
  const { personalData, skills, workExperience } = usePortfolio();
  const printRef = useRef(null);

  const handlePrint = () => window.print();

  return (
    <div className="bg-slate-50 print:bg-white min-h-screen">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[210mm] mx-auto px-6 py-3 sm:py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">CV — {personalData.name}</span>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors shadow-sm"
          >
            {t('cv.print')} / PDF
          </button>
        </div>
      </div>

      {/* A4-sized CV document */}
      <div className="max-w-[210mm] mx-auto my-0 sm:my-6 lg:my-8 print:my-0 bg-white shadow-sm sm:shadow-md print:shadow-none border-x border-slate-200 print:border-0" ref={printRef}>
        {/* HEADER */}
        <div className="px-7 sm:px-10 pt-8 sm:pt-12 pb-5 sm:pb-6 border-b-2 border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {personalData.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
            {personalData.title}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs sm:text-sm text-slate-500">
            <span>{personalData.location}</span>
            <span>{personalData.phone}</span>
            <span>{personalData.email}</span>
            <span>linkedin.com/in/{personalData.name.toLowerCase().replace(/\s+/g, '')}</span>
            <span>github.com/{personalData.name.toLowerCase().replace(/\s+/g, '')}</span>
          </div>
        </div>

        {/* PROFILE */}
        <div className="px-7 sm:px-10 py-5 sm:py-6 border-b border-slate-200">
          <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-2">
            {lang === 'id' ? 'PROFIL' : 'PROFILE'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {personalData.aboutParagraphs.join(' ')}
          </p>
        </div>

        {/* WORK EXPERIENCE */}
        <div className="px-7 sm:px-10 py-5 sm:py-6 border-b border-slate-200">
          <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-4">
            {lang === 'id' ? 'PENGALAMAN KERJA' : 'WORK EXPERIENCE'}
          </h2>
          <div className="space-y-5">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-0.5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{exp.role}</h3>
                    <p className="text-xs text-slate-600 font-medium">{exp.company} — {exp.location}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">
                    {lang === 'en' ? exp.periodEn : exp.period}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                  {lang === 'en' ? exp.descriptionEn : exp.description}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  <span className="font-medium text-slate-600">Tech:</span> {exp.technologies.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL SKILLS & LANGUAGES — side by side */}
        <div className="px-7 sm:px-10 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-3">
                {lang === 'id' ? 'KEAHLIAN TEKNIS' : 'TECHNICAL SKILLS'}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {skills.map((skill) => (
                  <span key={skill.name} className="text-xs sm:text-sm text-slate-700">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] mb-3">
                {lang === 'id' ? 'BAHASA' : 'LANGUAGES'}
              </h2>
              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm text-slate-700">
                  {lang === 'id' ? 'Bahasa Indonesia (Native)' : 'Indonesian (Native)'}
                </p>
                <p className="text-xs sm:text-sm text-slate-700">
                  {lang === 'id' ? 'Bahasa Inggris (Professional)' : 'English (Professional)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-7 sm:px-10 py-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            {personalData.name} — {personalData.email} — {personalData.phone}
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 5mm 15mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .max-w-\\[210mm\\] {
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
