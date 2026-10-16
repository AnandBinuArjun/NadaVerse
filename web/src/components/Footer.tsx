'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#11110F] border-t border-[#3B392F] text-[#BDB4A4] text-xs pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3B392F]">
          {/* Col 1: Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5 text-[#F4EBDD]">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C7A45B]/60 bg-[#191916] flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="NadaVerse Emblem"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-serif font-bold text-base tracking-wide">{t.brandName}</span>
            </div>
            <p className="leading-relaxed text-[13px]">
              {t.footerMission}
            </p>
          </div>

          {/* Col 2: Treatises & Provenance */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              {t.footerTreatises}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>{t.footerTreatise1}</li>
              <li>{t.footerTreatise2}</li>
              <li>{t.footerTreatise3}</li>
              <li>{t.footerTreatise4}</li>
            </ul>
          </div>

          {/* Col 3: Ethical AI & Privacy */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              {t.footerEthics}
            </h4>
            <p className="text-xs leading-relaxed">
              {t.footerEthicsDesc}
            </p>
          </div>

          {/* Col 4: Community & Corrections */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              {t.footerEditorial}
            </h4>
            <p className="text-xs leading-relaxed">
              {t.footerEditorialDesc}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 text-[#C7A45B] font-mono text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.footerWcag}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#BDB4A4]/80 gap-3">
          <div>
            <span>{t.footerCopyright}</span>
            {lang === 'ml'
              ? ' © 2026 നാദവേഴ്സ് ഫൗണ്ടേഷൻ. ശാസ്ത്രീയ സംഗീത പൈതൃക സംരക്ഷണം.'
              : ' © 2026 NadaVerse Foundation. Preserving and illuminating classical heritage.'}
          </div>
          <div className="flex items-center space-x-4">
            <span>{lang === 'ml' ? 'സ്വകാര്യത പ്രധാനം' : 'Privacy by Design'}</span>
            <span>·</span>
            <span>{lang === 'ml' ? 'ഏവർക്കും പ്രാപ്യം' : 'Accessibility First'}</span>
            <span>·</span>
            <span>{lang === 'ml' ? 'തികച്ചും സൗജന്യം' : 'Completely Free'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
