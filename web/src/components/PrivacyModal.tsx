'use client';

import React from 'react';
import { X, ShieldCheck, Mic, HardDrive, Lock, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-dialog-title"
    >
      <div className="bg-[#141310]/98 border border-[#C7A45B]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C7A45B]/20 flex items-center justify-between bg-[#0e0d0b]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#22221D] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B]">
              <ShieldCheck className="w-4 h-4 text-[#C7A45B]" />
            </div>
            <div>
              <h2 id="privacy-dialog-title" className="text-lg font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'സ്വകാര്യതാ നയം & മൈക്രോഫോൺ അനുമതികൾ' : 'Privacy Policy & Microphone Permissions'}
              </h2>
              <span className="text-[11px] text-[#87947A] font-mono">
                {lang === 'ml' ? '100% ബ്രൗസർ ലോക്കൽ പ്രോസസ്സിംഗ് ഉറപ്പ്' : '100% Client-Side Local Processing Guarantee'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#BDB4A4] hover:text-[#F4EBDD] rounded-lg hover:bg-[#22221D] transition-colors"
            aria-label="Close privacy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#BDB4A4] leading-relaxed">
          <div className="bg-[#191916] border border-[#3B392F] p-4 rounded-2xl flex items-start space-x-3 text-[#F4EBDD]">
            <Lock className="w-5 h-5 text-[#C7A45B] shrink-0 mt-0.5" />
            <p>
              {lang === 'ml'
                ? 'നാദവേഴ്സ് നിങ്ങളുടെ സ്വകാര്യതയെ പരമപ്രധാനമായി കാണുന്നു. മൈക്രോഫോൺ ഉപയോഗിച്ചുള്ള പിച്ച് ട്യൂണിംഗും റിക്കോർഡിംഗും നിങ്ങളുടെ ഉപകരണത്തിൽ മാത്രമേ നടക്കൂ.'
                : 'NadaVerse is built on a foundational principle of digital sovereignty: your musical practice belongs solely to you. All acoustic analysis and audio recordings remain strictly inside your browser.'}
            </p>
          </div>

          {/* Key Privacy Guarantees */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#C7A45B] shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#F4EBDD] text-sm">
                  {lang === 'ml' ? '1. തത്സമയ പിച്ച് നിരീക്ഷണം മാത്രം' : '1. Local Autocorrelation Pitch Detection'}
                </h4>
                <p className="mt-1">
                  {lang === 'ml'
                    ? 'മൈക്രോഫോൺ ഡാറ്റ തത്സമയം സ്വരസ്ഥാനങ്ങൾ (Hz, Cents) നിർണ്ണയിക്കാൻ മാത്രമേ ഉപയോഗിക്കുന്നുള്ളൂ. ഒരു ശബ്ദശകലവും ഞങ്ങളുടെ സെർവറുകളിലേക്ക് അയക്കുന്നില്ല.'
                    : 'When you activate the Tuner, browser-native Web Audio API analyzes incoming sound waves locally via autocorrelation algorithms. Zero audio streams or audio data packets are ever transmitted over the network.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#C7A45B] shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#F4EBDD] text-sm">
                  {lang === 'ml' ? '2. സ്വകാര്യ സാധക റിക്കോർഡിംഗ്' : '2. Private In-Browser Practice Recorder'}
                </h4>
                <p className="mt-1">
                  {lang === 'ml'
                    ? 'സാധകം റിക്കോർഡ് ചെയ്യുമ്പോൾ ഉണ്ടാകുന്ന ഓഡിയോ ഫയൽ നിങ്ങളുടെ കമ്പ്യൂട്ടറിലെ/ഫോണിലെ മെമ്മറിയിൽ (Blob URL) മാത്രമാണ് സൂക്ഷിക്കുന്നത്. നിങ്ങൾക്ക് ഡൗൺലോഡ് ചെയ്യാം അല്ലെങ്കിൽ ഡിലീറ്റ് ചെയ്യാം.'
                    : 'The Practice Recorder creates temporary audio objects stored exclusively in your browser memory. You have complete control to download, review, or permanently purge these recordings.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-[#22221D] border border-[#3B392F] text-[#C7A45B] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#F4EBDD] text-sm">
                  {lang === 'ml' ? '3. പരസ്യങ്ങളോ കുക്കികളോ ഇല്ല' : '3. Zero Third-Party Advertising & Surveillance'}
                </h4>
                <p className="mt-1">
                  {lang === 'ml'
                    ? 'നാദവേഴ്സിൽ പരസ്യ ട്രാക്കിംഗോ സ്വകാര്യ വിവരങ്ങൾ വിൽക്കുന്ന ഏർപ്പാടോ ഇല്ല. ഇതൊരു സൗജന്യ ശാസ്ത്രീയ സംഗീത സേവനമാണ്.'
                    : 'We do not monetize your practice data, run invasive advertising trackers, or fingerprint your devices. NadaVerse is an open digital sanctuary for students, artists, and music lovers.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#C7A45B]/20 bg-[#0e0d0b] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {lang === 'ml' ? 'മനസ്സിലായി' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};
