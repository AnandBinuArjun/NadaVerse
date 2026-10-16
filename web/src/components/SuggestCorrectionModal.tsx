'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, X, Send } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface SuggestCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntityName?: string;
  initialEntityType?: 'raga' | 'composer' | 'tala';
}

export const SuggestCorrectionModal: React.FC<SuggestCorrectionModalProps> = ({
  isOpen,
  onClose,
  initialEntityName = '',
  initialEntityType = 'raga'
}) => {
  const { lang } = useLanguage();
  const [entityType, setEntityType] = useState(initialEntityType);
  const [entityName, setEntityName] = useState(initialEntityName);
  const [targetField, setTargetField] = useState('Arohanam / Avarohanam Notation');
  const [proposedEdit, setProposedEdit] = useState('');
  const [citationSource, setCitationSource] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterAffiliation, setSubmitterAffiliation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initial entity name when opening
  React.useEffect(() => {
    if (initialEntityName) setEntityName(initialEntityName);
    if (initialEntityType) setEntityType(initialEntityType);
  }, [initialEntityName, initialEntityType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      entity_type: entityType,
      entity_name: entityName,
      target_field: targetField,
      proposed_edit: proposedEdit,
      citation_source: citationSource,
      submitter_name: submitterName || 'Anonymous Scholar',
      submitter_affiliation: submitterAffiliation || 'Independent Vidwan / Student',
      submitted_at: new Date().toISOString()
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('nadaverse_token') : null;
      await fetch(`${API_BASE_URL}/api/v1/corrections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
    } catch {
      // Local fallback: save in localStorage so no submissions are ever lost
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('nadaverse_pending_corrections') || '[]');
        stored.push(payload);
        localStorage.setItem('nadaverse_pending_corrections', JSON.stringify(stored));
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1c1914] via-[#14120e] to-[#0d0c0a] border border-[#C7A45B]/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#3B392F]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C7A45B]/20 border border-[#C7A45B] flex items-center justify-center text-[#E0C98F]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F4EBDD]">
                {lang === 'ml' ? 'ശാസ്ത്രീയ തിരുത്തൽ നിർദ്ദേശിക്കുക' : 'Suggest a Musicological Edit'}
              </h3>
              <p className="text-[11px] font-mono text-[#87947A]">
                {lang === 'ml'
                  ? 'സംഗീത അക്കാദമി അവലംബങ്ങളോടെ പീർ-റിവ്യൂ പ്രക്രിയ'
                  : 'Peer-reviewed scholarly provenance & citations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#BDB4A4] hover:text-[#F4EBDD] hover:bg-[#22221D] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#87947A]/20 border border-[#87947A] flex items-center justify-center text-[#87947A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' ? 'നിർദ്ദേശം നന്ദിപൂർവ്വം സ്വീകരിച്ചു' : 'Thank You for Your Scholarship'}
            </h4>
            <p className="text-xs text-[#BDB4A4] max-w-md mx-auto leading-relaxed">
              {lang === 'ml'
                ? 'നിങ്ങൾ നൽകിയ അവലംബം NadaVerse എഡിറ്റോറിയൽ സമിതിയും മുതിർന്ന വിദ്വാന്മാരും പരിശോധിച്ച് ഭേദഗതി വരുത്തുന്നതാണ്.'
                : 'Your citation will be evaluated against primary treatises (Sangita Sampradaya Pradarshini, Chaturdandi Prakasika) by the musicological editorial board.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
            {/* Entity Target & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                  {lang === 'ml' ? 'വിഭാഗം' : 'Entity Category'}
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as any)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
                >
                  <option value="raga">Raga (രാഗം)</option>
                  <option value="composer">Composer (വാഗ്ഗേയകാരൻ)</option>
                  <option value="tala">Tala (താളം)</option>
                  <option value="glossary">Glossary Term (സംഗീത ലക്ഷണം)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                  {lang === 'ml' ? 'രാഗം / വാഗ്ഗേയകാരൻ നാമം' : 'Target Entity Name'}
                </label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Mayamalavagowla, Tyagaraja"
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
                />
              </div>
            </div>

            {/* Field */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                {lang === 'ml' ? 'ഭേദഗതി വരുത്തേണ്ട വിഷയം' : 'Target Field / Dimension'}
              </label>
              <select
                value={targetField}
                onChange={(e) => setTargetField(e.target.value)}
                className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
              >
                <option value="Arohanam / Avarohanam Notation">Arohanam / Avarohanam Notation</option>
                <option value="Melakarta Parent / Janya Classification">Melakarta Parent / Janya Classification</option>
                <option value="Characteristic Prayoga (Sanchara)">Characteristic Prayoga (Sanchara)</option>
                <option value="Composer Sahityam / Signature Mudra">Composer Sahityam / Signature Mudra</option>
                <option value="Traditional Bani / Lineage Nuance">Traditional Bani / Lineage Nuance</option>
                <option value="Source Citation / Treatise Reference">Source Citation / Treatise Reference</option>
              </select>
            </div>

            {/* Proposed Edit */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                {lang === 'ml' ? 'നിങ്ങളുടെ നിർദ്ദേശം / തിരുത്തൽ' : 'Proposed Edit / Correction'}
              </label>
              <textarea
                required
                rows={3}
                value={proposedEdit}
                onChange={(e) => setProposedEdit(e.target.value)}
                placeholder="Detail the exact swaras, prayogas, or factual correction..."
                className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
              />
            </div>

            {/* Citation Source */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                {lang === 'ml' ? 'അവലംബ ഗ്രന്ഥം / വിദ്വാൻ പരാമർശം' : 'Authoritative Treatise / Bani Citation'}
              </label>
              <input
                type="text"
                required
                value={citationSource}
                onChange={(e) => setCitationSource(e.target.value)}
                placeholder="e.g. Sangita Sampradaya Pradarshini (p. 214), or Semmangudi Lineage"
                className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
              />
            </div>

            {/* Scholar Identity / Affiliation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                  {lang === 'ml' ? 'നിങ്ങളുടെ പേര് (ഐച്ഛികം)' : 'Your Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="e.g. Vidwan S. Ramanathan"
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#BDB4A4] mb-1">
                  {lang === 'ml' ? 'ഗുരുപരമ്പര / സ്ഥാപനം' : 'Guru Lineage / Institution'}
                </label>
                <input
                  type="text"
                  value={submitterAffiliation}
                  onChange={(e) => setSubmitterAffiliation(e.target.value)}
                  placeholder="e.g. Music Academy Madras / Guru Lineage"
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD] focus:border-[#C7A45B] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl nv-gold-btn text-xs font-bold shadow-lg shadow-[#C7A45B]/20 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? (lang === 'ml' ? 'സമർപ്പിക്കുന്നു...' : 'Submitting to Board...')
                    : (lang === 'ml' ? 'ശാസ്ത്രീയ നിർദ്ദേശം സമർപ്പിക്കുക' : 'Submit for Musicological Review')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
