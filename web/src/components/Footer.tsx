'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenAttribution?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenAttribution }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#090807] border-t border-[#C7A45B]/20 text-[#BDB4A4] text-xs pt-16 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#C7A45B]/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#3B392F]/60">
          {/* Col 1: Mission */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center space-x-3 text-[#F4EBDD]">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C7A45B]/70 bg-[#161410] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(199,164,91,0.25)]">
                <img
                  src="/logo.png"
                  alt="NadaVerse Emblem"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-wide bg-gradient-to-r from-[#F4EBDD] to-[#C7A45B] bg-clip-text text-transparent">
                {t.brandName}
              </span>
            </div>
            <p className="leading-relaxed text-[13px] text-[#BDB4A4]/90">
              {t.footerMission}
            </p>
          </div>

          {/* Col 2: Treatises & Provenance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
                {t.footerTreatises}
              </h4>
              {onOpenAttribution && (
                <button
                  onClick={onOpenAttribution}
                  className="text-[11px] font-mono text-[#C7A45B] hover:text-[#E0C98F] transition-colors underline decoration-[#C7A45B]/40"
                >
                  View Citations
                </button>
              )}
            </div>
            <ul className="space-y-1.5 text-xs">
              <li
                onClick={onOpenAttribution}
                className="hover:text-[#F4EBDD] cursor-pointer transition-colors"
              >
                {t.footerTreatise1}
              </li>
              <li
                onClick={onOpenAttribution}
                className="hover:text-[#F4EBDD] cursor-pointer transition-colors"
              >
                {t.footerTreatise2}
              </li>
              <li
                onClick={onOpenAttribution}
                className="hover:text-[#F4EBDD] cursor-pointer transition-colors"
              >
                {t.footerTreatise3}
              </li>
              <li
                onClick={onOpenAttribution}
                className="hover:text-[#F4EBDD] cursor-pointer transition-colors"
              >
                {t.footerTreatise4}
              </li>
            </ul>
          </div>

          {/* Col 3: Ethical AI & Privacy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
                {t.footerEthics}
              </h4>
              {onOpenPrivacy && (
                <button
                  onClick={onOpenPrivacy}
                  className="text-[11px] font-mono text-[#C7A45B] hover:text-[#E0C98F] transition-colors underline decoration-[#C7A45B]/40"
                >
                  Privacy Policy
                </button>
              )}
            </div>
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#BDB4A4]/80 gap-3 text-center sm:text-left">
          <div>
            <span>{t.footerCopyright}</span>
            {lang === 'ml'
              ? ' © 2026 നാദവേഴ്സ് ഫൗണ്ടേഷൻ. ശാസ്ത്രീയ സംഗീത പൈതൃക സംരക്ഷണം.'
              : ' © 2026 NadaVerse Foundation. Preserving and illuminating classical heritage.'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#F4EBDD] transition-colors cursor-pointer"
            >
              {lang === 'ml' ? 'സ്വകാര്യത പ്രധാനം (ലോക്കൽ പ്രോസസ്സിംഗ്)' : 'Privacy Policy (100% Local Processing)'}
            </button>
            <span>·</span>
            <button
              onClick={onOpenAttribution}
              className="hover:text-[#F4EBDD] transition-colors cursor-pointer"
            >
              {lang === 'ml' ? 'ആധികാരിക ഗ്രന്ഥങ്ങൾ' : 'Treatises & Citations'}
            </button>
            <span>·</span>
            <span>{lang === 'ml' ? 'തികച്ചും സൗജന്യം' : 'Completely Free'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
