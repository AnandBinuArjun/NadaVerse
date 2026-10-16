'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Music,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sliders,
  Volume2
} from 'lucide-react';
import { audioEngine, NoteName } from '../lib/audioEngine';
import { useLanguage } from '../context/LanguageContext';

export interface MusicianProfile {
  instrument: string;
  tonic: NoteName;
  kattaiNumber: string;
  stage: string;
}

const KATTAI_OPTIONS: { note: NoteName; label: string; desc: string }[] = [
  { note: 'C', label: 'C (1 Kattai)', desc: 'Standard Male Vocal, Veena' },
  { note: 'C#', label: 'C# (1.5 Kattai)', desc: 'Low Male Vocal' },
  { note: 'D', label: 'D (2 Kattai)', desc: 'Male High / Violin' },
  { note: 'D#', label: 'D# (2.5 Kattai)', desc: 'Violin / Mandolin' },
  { note: 'E', label: 'E (3 Kattai)', desc: 'Mid-range Instrumental' },
  { note: 'F', label: 'F (4 Kattai)', desc: 'Low Female Vocal / Flute' },
  { note: 'F#', label: 'F# (4.5 Kattai)', desc: 'Female Vocal' },
  { note: 'G', label: 'G (5 Kattai)', desc: 'Standard Female Vocal' },
  { note: 'G#', label: 'G# (5.5 Kattai)', desc: 'High Female Vocal' },
  { note: 'A', label: 'A (6 Kattai)', desc: 'Concert Flute Pitch' },
  { note: 'A#', label: 'A# (6.5 Kattai)', desc: 'High Flute' },
  { note: 'B', label: 'B (7 Kattai)', desc: 'Children Vocal' }
];

const INSTRUMENT_OPTIONS = [
  { id: 'vocal', name: 'Vocal (കർണ്ണാടക സംഗീതം)', icon: '🎤', desc: 'Gayaka / Singer' },
  { id: 'violin', name: 'Violin (വയലിൻ)', icon: '🎻', desc: 'Bowed string accompaniment' },
  { id: 'veena', name: 'Saraswati Veena (വീണ)', icon: '🪕', desc: 'Ancient fretwork tradition' },
  { id: 'flute', name: 'Carnatic Flute (പുല്ലാങ്കുഴൽ)', icon: '🪈', desc: 'Venu flute melodies' },
  { id: 'mridangam', name: 'Mridangam (മൃദംഗം)', icon: '🥁', desc: 'Percussive laya' },
  { id: 'rasika', name: 'Rasika / Connoisseur (രസികൻ)', icon: '🎼', desc: 'Passionate classical listener' }
];

const STAGE_OPTIONS = [
  { id: 'beginner', title: 'Abhyasa Gana (Beginner)', desc: 'Sarali Varisai, Jantai, Geetham' },
  { id: 'intermediate', title: 'Sabha Gana (Intermediate)', desc: 'Varnams, Classic Krithis, Laya control' },
  { id: 'advanced', title: 'Vidwan / Concert (Advanced)', desc: 'Ragam Tanam Pallavi, Neraval, Kalpanaswara' },
  { id: 'connoisseur', title: 'Classical Connoisseur', desc: 'Deep musicological study & appreciation' }
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (profile: MusicianProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { lang } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('vocal');
  const [selectedTonic, setSelectedTonic] = useState<NoteName>('C');
  const [selectedStage, setSelectedStage] = useState<string>('beginner');

  if (!isOpen) return null;

  const handlePlayTone = (note: NoteName) => {
    setSelectedTonic(note);
    audioEngine.setTonic(note);
    // Play a brief preview note of the new Sa tonic
    audioEngine.playSwaraNote(1.0, 1.0);
  };

  const handleFinish = () => {
    const matchedKattai = KATTAI_OPTIONS.find((k) => k.note === selectedTonic);
    const profile: MusicianProfile = {
      instrument: selectedInstrument,
      tonic: selectedTonic,
      kattaiNumber: matchedKattai ? matchedKattai.label : 'C (1 Kattai)',
      stage: selectedStage
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('nadaverse_musician_profile', JSON.stringify(profile));
      localStorage.setItem('nadaverse_onboarding_completed', 'true');
    }

    // Pre-tune engine
    audioEngine.setTonic(selectedTonic);

    if (onComplete) {
      onComplete(profile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1c1914] via-[#14120e] to-[#0d0c0a] border border-[#C7A45B]/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden">
        {/* Decorative lighting */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#3B392F]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C7A45B]/20 border border-[#C7A45B] flex items-center justify-center text-[#E0C98F]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'സംഗീത സാധക പ്രവേശം' : 'Musician Orientation'}
              </h3>
              <p className="text-[11px] font-mono text-[#C7A45B]">
                {lang === 'ml' ? `ഘട്ടം ${step} / 3` : `Step ${step} of 3`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#22221D] transition-colors"
            aria-label="Close setup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Instrument Focus */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base sm:text-lg font-serif font-semibold text-[#F4EBDD]">
                  {lang === 'ml'
                    ? 'നിങ്ങളുടെ പ്രധാന സംഗീത മാധ്യമം ഏതാണ്?'
                    : 'What is your primary musical focus?'}
                </h4>
                <p className="text-xs text-[#BDB4A4] mt-1">
                  {lang === 'ml'
                    ? 'നിങ്ങളുടെ ഉപകരണത്തിനും അഭ്യസന ശൈലിക്കും അനുയോജ്യമായ രീതിയിൽ കളരി ക്രമീകരിക്കാം.'
                    : 'Tailors the practice suite, fretboard diagrams, and notation for your tradition.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INSTRUMENT_OPTIONS.map((opt) => {
                  const isSelected = selectedInstrument === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedInstrument(opt.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD] shadow-md'
                          : 'bg-[#191916] border-[#3B392F] text-[#BDB4A4] hover:border-[#C7A45B]/40 hover:text-[#F4EBDD]'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold">{opt.name}</div>
                        <div className="text-[10px] opacity-75">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Natural Pitch / Kattai */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base sm:text-lg font-serif font-semibold text-[#F4EBDD]">
                  {lang === 'ml'
                    ? 'നിങ്ങളുടെ സ്വാഭാവിക ആധാര ഷഡ്ജം (കട്ട) ഏതാണ്?'
                    : 'What is your natural Adhara Sa (Kattai)?'}
                </h4>
                <p className="text-xs text-[#BDB4A4] mt-1">
                  {lang === 'ml'
                    ? 'തംബുരു, ട്യൂണർ, സ്വരസ്ഥാനങ്ങൾ എന്നിവ ഈ ആവൃത്തിയിലേക്ക് തത്സമയം ക്രമീകരിക്കും.'
                    : 'Pre-tunes the Tanpura drone, microphone pitch tuner, and keyboard to your pitch.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KATTAI_OPTIONS.map((k) => {
                  const isSelected = selectedTonic === k.note;
                  return (
                    <button
                      key={k.note}
                      onClick={() => handlePlayTone(k.note)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#C7A45B] text-[#11110F] border-[#E0C98F] font-bold shadow-lg scale-102'
                          : 'bg-[#191916] text-[#F4EBDD] border-[#3B392F] hover:border-[#C7A45B]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold">{k.label}</span>
                        <Volume2 className="w-3.5 h-3.5 opacity-60" />
                      </div>
                      <div className="text-[9px] opacity-75 truncate mt-0.5">{k.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Experience Stage */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base sm:text-lg font-serif font-semibold text-[#F4EBDD]">
                  {lang === 'ml'
                    ? 'നിങ്ങളുടെ അഭ്യസന ഘട്ടം ഏതാണ്?'
                    : 'What is your current sadhana level?'}
                </h4>
                <p className="text-xs text-[#BDB4A4] mt-1">
                  {lang === 'ml'
                    ? 'നിങ്ങൾക്ക് ഏറ്റവും പ്രയോജനപ്രദമായ പാഠങ്ങളും നിർദ്ദേശങ്ങളും മുൻഗണനാടിസ്ഥാനത്തിൽ നൽകും.'
                    : 'Helps customize AI Tutor responses, practice tips, and exercise difficulty.'}
                </p>
              </div>

              <div className="space-y-2">
                {STAGE_OPTIONS.map((stg) => {
                  const isSelected = selectedStage === stg.id;
                  return (
                    <button
                      key={stg.id}
                      onClick={() => setSelectedStage(stg.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#C7A45B]/20 border-[#C7A45B] text-[#F4EBDD] shadow-md'
                          : 'bg-[#191916] border-[#3B392F] text-[#BDB4A4] hover:border-[#C7A45B]/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-semibold">{stg.title}</div>
                        <div className="text-[11px] opacity-75">{stg.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C7A45B] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-[#3B392F] flex items-center justify-between gap-3 bg-[#11100d]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-[#191916] hover:bg-[#22221D] text-xs font-mono text-[#BDB4A4] border border-[#3B392F] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'ml' ? 'മുൻപിലേക്ക്' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 px-5 py-2.5 rounded-xl nv-gold-btn text-xs font-semibold shadow-md"
            >
              <span>{lang === 'ml' ? 'അടുത്ത ഘട്ടം' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl nv-gold-btn text-xs font-bold shadow-lg shadow-[#C7A45B]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ml' ? 'കളരിയിലേക്ക് പ്രവേശിക്കുക' : 'Enter Practice Studio'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
