'use client';

import React from 'react';
import { X, BookOpen, Scroll, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttributionModal: React.FC<AttributionModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  const treatises = [
    {
      title: 'Chaturdandi Prakasika',
      author: 'Venkatamakhin',
      era: '17th Century CE',
      significance:
        'Foundational treatise codifying the 72 Melakarta Raga classification scheme using mathematical swara permutations, defining the purvanga and uttaranga structure of modern Carnatic musicology.',
    },
    {
      title: 'Sangita Ratnakara',
      author: 'Sarangadeva',
      era: '13th Century CE',
      significance:
        'Monumental pan-Indian musicological text outlining swara sthanas, 22 shruti intervals, gramas, murchanas, and tala lakshanas that established classical melodic theory.',
    },
    {
      title: 'Sangita Sampradaya Pradarsini',
      author: 'Subbarama Dikshitar',
      era: '1904 CE',
      significance:
        'The definitive musicological encyclopedia published at Ettayapuram documenting authentic notations, gamaka symbols, and compositions of the Muthuswami Dikshitar lineage.',
    },
    {
      title: 'Natya Shastra',
      author: 'Bharata Muni',
      era: 'c. 200 BCE – 200 CE',
      significance:
        'Earliest surviving Sanskrit treatise detailing the 22 Shrutis (Sarana-Chatushtayi acoustic demonstration) and foundational aesthetic theory (Nava Rasas).',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attribution-dialog-title"
    >
      <div className="bg-[#141310]/98 border border-[#C7A45B]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C7A45B]/20 flex items-center justify-between bg-[#0e0d0b]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#22221D] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B]">
              <BookOpen className="w-4 h-4 text-[#C7A45B]" />
            </div>
            <div>
              <h2 id="attribution-dialog-title" className="text-lg font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'ആധികാരിക ഗ്രന്ഥങ്ങളും അവലംബങ്ങളും' : 'Canonical Treatises & Open Attribution'}
              </h2>
              <span className="text-[11px] text-[#87947A] font-mono">
                {lang === 'ml' ? 'ശാസ്ത്രീയ സംഗീത പൈതൃക അവലംബങ്ങൾ' : 'Scholarly Lineage & Treatises of Carnatic Heritage'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#BDB4A4] hover:text-[#F4EBDD] rounded-lg hover:bg-[#22221D] transition-colors"
            aria-label="Close attribution dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#BDB4A4] leading-relaxed">
          <p className="text-xs text-[#F4EBDD]">
            {lang === 'ml'
              ? 'നാദവേഴ്സിലെ ഓരോ രാഗ ലക്ഷണങ്ങളും, സ്വരസ്ഥാനങ്ങളും, താള അംഗങ്ങളും താഴെ പറയുന്ന ആധികാരിക സംഗീത ശാസ്ത്ര ഗ്രന്ഥങ്ങളെ ആധാരമാക്കി കർശനമായി ഒത്തുനോക്കിയതാണ്:'
              : 'Every raga scale, swara interval ratio, tala kriya, and composer biography within NadaVerse is rigorously cross-referenced against historical treatises and vetted musicological scholarship:'}
          </p>

          <div className="space-y-3">
            {treatises.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#191916] border border-[#3B392F] hover:border-[#C7A45B]/40 transition-colors space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-serif font-bold text-[#F4EBDD] text-sm flex items-center space-x-2">
                    <Scroll className="w-3.5 h-3.5 text-[#C7A45B] shrink-0" />
                    <span>{t.title}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-[#C7A45B]">
                    {t.author} · {t.era}
                  </span>
                </div>
                <p className="text-xs text-[#BDB4A4] leading-relaxed pt-1">{t.significance}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#0e0d0b] p-4 rounded-2xl border border-[#C7A45B]/20 text-[11px] font-mono text-[#87947A] flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#6EA887] shrink-0" />
            <span>Public Domain Heritage / Creative Commons Attribution under Classical Musicology Protocol</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#C7A45B]/20 bg-[#0e0d0b] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {lang === 'ml' ? 'ശരി' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
