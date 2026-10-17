'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SuggestCorrectionModal } from './SuggestCorrectionModal';

export interface SourceProvenanceMetadata {
  entityId: string;
  entityName: string;
  entityType: 'raga' | 'tala' | 'instrument' | 'lesson' | 'heritage_treatise' | 'exercise';
  canonicalTreatise: string;
  authorOrCodifier: string;
  historicalPeriod: string;
  specificEditionOrManuscript: string;
  sampradayaTradition?: string;
  licensingStatus: string;
  editorialReviewStatus: 'peer_reviewed' | 'treatise_verified' | 'community_contributed' | 'heuristic_estimate';
  reviewerName?: string;
  lastReviewedDate?: string;
  verbatimExcerpt?: string;
}

interface SourceProvenanceModalProps {
  metadata: SourceProvenanceMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceProvenanceModal: React.FC<SourceProvenanceModalProps> = ({
  metadata,
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  if (!isOpen || !metadata) return null;

  const getStatusBadge = (status: SourceProvenanceMetadata['editorialReviewStatus']) => {
    switch (status) {
      case 'treatise_verified':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Treatise-Verified Primary Source
          </span>
        );
      case 'peer_reviewed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Music Academy Editorial Review
          </span>
        );
      case 'community_contributed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Community-Contributed (Pending Review)
          </span>
        );
      case 'heuristic_estimate':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-700/30 text-stone-300 border border-stone-600/40">
            Algorithmic Heuristic Estimate
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
        <div className="bg-stone-900 border border-amber-900/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge(metadata.editorialReviewStatus)}
                <span className="text-xs text-stone-500 uppercase font-mono">{metadata.entityType}</span>
              </div>
              <h2 className="text-xl font-bold text-amber-100">
                {metadata.entityName} — Source & Provenance
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg"
              aria-label="Close provenance modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
              <span className="text-stone-400 font-medium">Canonical Treatise:</span>
              <span className="col-span-2 text-stone-200 font-semibold">{metadata.canonicalTreatise}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
              <span className="text-stone-400 font-medium">Codifier / Author:</span>
              <span className="col-span-2 text-stone-200">{metadata.authorOrCodifier}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
              <span className="text-stone-400 font-medium">Historical Era:</span>
              <span className="col-span-2 text-stone-300 font-mono">{metadata.historicalPeriod}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
              <span className="text-stone-400 font-medium">Critical Edition / MS:</span>
              <span className="col-span-2 text-amber-200/90 font-mono text-[11px]">{metadata.specificEditionOrManuscript}</span>
            </div>

            {metadata.sampradayaTradition && (
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
                <span className="text-stone-400 font-medium">Sampradaya / Tradition:</span>
                <span className="col-span-2 text-stone-300">{metadata.sampradayaTradition}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
              <span className="text-stone-400 font-medium">Rights & License:</span>
              <span className="col-span-2 text-emerald-400 font-semibold">{metadata.licensingStatus}</span>
            </div>

            {metadata.reviewerName && (
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80">
                <span className="text-stone-400 font-medium">Last Reviewed By:</span>
                <span className="col-span-2 text-stone-400">
                  {metadata.reviewerName} ({metadata.lastReviewedDate || 'Archival Record'})
                </span>
              </div>
            )}

            {/* Verbatim Excerpt */}
            {metadata.verbatimExcerpt && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30">
                <div className="text-[11px] font-semibold text-amber-300 mb-1">
                  Treatise Excerpt / Original Shloka:
                </div>
                <blockquote className="font-mono text-[11px] text-amber-100/90 italic leading-relaxed">
                  "{metadata.verbatimExcerpt}"
                </blockquote>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 text-xs">
            <span className="text-stone-500">
              Disputed claim? Submit scholarly evidence.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSuggestModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors shadow-sm"
              >
                {isMl ? 'തിരുത്തൽ നിർദ്ദേശിക്കുക' : 'Suggest Correction'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSuggestModalOpen && (
        <SuggestCorrectionModal
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
          initialEntityName={metadata.entityName}
          initialEntityType={metadata.entityType === 'tala' ? 'tala' : 'raga'}
        />
      )}
    </>
  );
};
