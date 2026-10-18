'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
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
                <Image
                  src="/logo.png"
                  alt="NadaVerse Emblem"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-wide bg-gradient-to-r from-[#F4EBDD] to-[#C7A45B] bg-clip-text text-transparent">
                {t.brandName}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded bg-[#C7A45B]/15 text-[#E0C98F] border border-[#C7A45B]/30">
                Public Beta
              </span>
            </div>
            <p className="leading-relaxed text-[13px] text-[#BDB4A4]/90">
              {t.footerMission}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href="https://abarjun.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-mono text-[#C7A45B] hover:text-[#E0C98F] bg-[#22221D] px-3 py-1.5 rounded-lg border border-[#3B392F] hover:border-[#C7A45B]/60 transition-all shadow-sm group"
              >
                <span className="text-[#BDB4A4]">{lang === 'ml' ? 'സ്രഷ്ടാവ്:' : 'Creator:'}</span>
                <span className="font-semibold text-[#F4EBDD] group-hover:underline decoration-[#C7A45B]/50">Anand Binu Arjun</span>
                <span className="text-[#87947A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
              <a
                href="https://buymeacoffee.com/anandbinuarjun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#FFDD00] hover:text-[#FFE766] bg-[#22221D] hover:bg-[#FFDD00]/10 px-3 py-1.5 rounded-lg border border-[#FFDD00]/30 hover:border-[#FFDD00]/70 transition-all shadow-sm group"
                title={lang === 'ml' ? 'പദ്ധതിയെ പിന്തുണയ്ക്കാം' : 'Support NadaVerse on Buy Me a Coffee'}
              >
                <span>☕</span>
                <span className="font-semibold text-[#F4EBDD] group-hover:text-[#FFF]">{lang === 'ml' ? 'കോഫി നൽകാം' : 'Buy Me a Coffee'}</span>
                <span className="text-[#FFDD00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            </div>
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
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span>
              {lang === 'ml'
                ? '© 2026 നാദവേഴ്സ്. ശാസ്ത്രീയ സംഗീത പൈതൃക സംരക്ഷണം.'
                : '© 2026 NadaVerse. Preserving and illuminating classical heritage.'}
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              {lang === 'ml' ? 'സങ്കൽപ്പവും നിർമ്മാണവും: ' : 'Conceived & Crafted by '}
              <a
                href="https://abarjun.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C7A45B] hover:text-[#E0C98F] font-medium transition-colors underline decoration-[#C7A45B]/40 hover:decoration-[#E0C98F]"
              >
                Anand Binu Arjun
              </a>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://abarjun.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C7A45B] hover:text-[#E0C98F] transition-colors font-medium inline-flex items-center space-x-1"
            >
              <span>{lang === 'ml' ? 'പോർട്ട്ഫോളിയോ' : 'Portfolio'}</span>
              <span>↗</span>
            </a>
            <span>·</span>
            <a
              href="https://buymeacoffee.com/anandbinuarjun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFDD00] hover:text-[#FFE766] transition-colors font-medium inline-flex items-center space-x-1"
              title={lang === 'ml' ? 'പദ്ധതിയെ പിന്തുണയ്ക്കാം' : 'Support NadaVerse on Buy Me a Coffee'}
            >
              <span>☕</span>
              <span>{lang === 'ml' ? 'കോഫി നൽകാം' : 'Buy Me a Coffee'}</span>
              <span>↗</span>
            </a>
            <span>·</span>
            <Link
              href="/privacy"
              className="text-[#C7A45B] hover:text-[#E0C98F] transition-colors"
            >
              {lang === 'ml' ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
            </Link>
            <span>·</span>
            <Link
              href="/terms"
              className="text-[#C7A45B] hover:text-[#E0C98F] transition-colors"
            >
              {lang === 'ml' ? 'ഉപയോഗ നിബന്ധനകൾ' : 'Terms of Use'}
            </Link>
            <span>·</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#F4EBDD] transition-colors cursor-pointer"
            >
              {lang === 'ml' ? 'ഓഡിയോ സുരക്ഷ' : 'Audio Privacy'}
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
            <span>·</span>
            <span className="font-mono text-[#C7A45B] font-semibold">Public Beta v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
