'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Search,
  Filter,
  BookOpen,
  Calendar,
  User,
  ShieldCheck,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeritageEntry {
  id: string;
  slug: string;
  title: string;
  category: string;
  historical_period: string;
  summary: string;
  content: string;
  primary_contributor: string;
  source_citations: string;
  licensing_info: string;
  editorial_status: string;
  created_at: string;
}

const CATEGORIES = [
  { id: 'all', labelEn: 'All Categories', labelMl: 'എല്ലാ വിഭാഗങ്ങളും' },
  { id: 'instrument_craft', labelEn: 'Instrument Crafting', labelMl: 'വാദ്യ നിർമ്മാണ പാരമ്പര്യം' },
  { id: 'biography', labelEn: 'Composer Biographies', labelMl: 'സംഗീതജ്ഞ ജീവചരിത്രങ്ങൾ' },
  { id: 'treatise_history', labelEn: 'Treatises & Texts', labelMl: 'സംഗീത ശാസ്ത്ര ഗ്രന്ഥങ്ങൾ' },
  { id: 'regional_tradition', labelEn: 'Regional Traditions', labelMl: 'പ്രാദേശിക ശൈലികൾ' },
];

export const HeritageArchive: React.FC = () => {
  const { lang } = useLanguage();
  const [entries, setEntries] = useState<HeritageEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<HeritageEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);

  // Submission Form State
  const [subTitle, setSubTitle] = useState('');
  const [subCategory, setSubCategory] = useState('biography');
  const [subPeriod, setSubPeriod] = useState('18th Century CE');
  const [subSummary, setSubSummary] = useState('');
  const [subContent, setSubContent] = useState('');
  const [subContributor, setSubContributor] = useState('');
  const [subCitations, setSubCitations] = useState('');
  const [subLicensing, setSubLicensing] = useState('Creative Commons Attribution 4.0 International');
  const [submitNotice, setSubmitNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      let url = '/api/v1/heritage';
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntries();
  };

  const handleContributorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitNotice(null);
    if (!subTitle.trim() || !subSummary.trim() || !subContent.trim() || !subCitations.trim()) {
      setSubmitNotice({ type: 'error', message: 'Please fill in all mandatory fields including source citations.' });
      return;
    }

    try {
      const res = await fetch('/api/v1/heritage/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subTitle,
          category: subCategory,
          historical_period: subPeriod,
          summary: subSummary,
          content: subContent,
          primary_contributor: subContributor,
          source_citations: subCitations,
          licensing_info: subLicensing,
        }),
      });

      if (res.ok) {
        setSubmitNotice({
          type: 'success',
          message: 'Heritage entry successfully submitted for editorial peer-review! It will be verified before publishing.',
        });
        setSubTitle('');
        setSubSummary('');
        setSubContent('');
        setSubCitations('');
        setSubContributor('');
      } else {
        const err = await res.json();
        setSubmitNotice({ type: 'error', message: err.detail || 'Submission failed.' });
      }
    } catch {
      setSubmitNotice({ type: 'error', message: 'Network error submitting record.' });
    }
  };

  return (
    <div className="bg-[#14130f] border border-[#C7A45B]/20 rounded-3xl p-6 sm:p-8 shadow-xl text-[#F4EBDD]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3B392F]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#C7A45B]/10 text-[#C7A45B] rounded-xl border border-[#C7A45B]/20">
              <Landmark className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml' ? 'കർണ്ണാടക പൈതൃക ശേഖരം' : 'Carnatic Heritage Archive'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C7A45B] font-medium">
              Source-Attributed
            </span>
          </div>
          <p className="text-xs text-[#BDB4A4] mt-1 max-w-2xl">
            {lang === 'ml'
              ? 'സംഗീത ചരിത്രം, പ്രാചീന ശാസ്ത്ര ഗ്രന്ഥങ്ങൾ, വാദ്യ നിർമ്മാണ കലകൾ, മഹാന്മാരുടെ ജീവിത രേഖകൾ.'
              : 'Curated digital repository of classical musicology history, temple epigraphy, instrument crafting traditions, and treatise lineages.'}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-4 py-2 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ml' ? 'രേഖ സമർപ്പിക്കുക' : 'Submit Archive Record'}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="mt-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'ml' ? 'പൈതൃക രേഖകളിൽ തിരയുക...' : 'Search by composer, epigraphy, treatise, instrument craft...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#191916] border border-[#3B392F] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#C7A45B]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#C7A45B]/15 hover:bg-[#C7A45B]/25 border border-[#C7A45B]/30 rounded-xl text-xs font-semibold text-[#C7A45B] transition-colors"
          >
            {lang === 'ml' ? 'തിരയുക' : 'Search'}
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow'
                  : 'bg-[#191916] hover:bg-[#23231f] text-[#BDB4A4] border border-[#3B392F]'
              }`}
            >
              {lang === 'ml' ? cat.labelMl : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Archive Entries Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#191916] border border-[#3B392F] rounded-2xl p-5 hover:border-[#C7A45B]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#C7A45B]/10 text-[#C7A45B] border border-[#C7A45B]/20">
                  {entry.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> {entry.historical_period}
                </span>
              </div>

              <h4 className="text-base font-bold font-serif text-[#F4EBDD] leading-snug">{entry.title}</h4>
              <p className="text-xs text-[#BDB4A4] mt-2 line-clamp-3 leading-relaxed">{entry.summary}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#3B392F] flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                By {entry.primary_contributor}
              </span>
              <button
                onClick={() => setSelectedEntry(entry)}
                className="text-xs font-semibold text-[#C7A45B] hover:text-[#E0C98F] flex items-center gap-1 transition-colors"
              >
                Read Article <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && !isLoading && (
        <div className="text-center py-12 text-slate-400 text-xs italic">
          No heritage records found matching your filters.
        </div>
      )}

      {/* Reader Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14130f] border border-[#C7A45B]/30 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-[#F4EBDD] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#3B392F]">
              <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded bg-[#C7A45B]/10 text-[#C7A45B] border border-[#C7A45B]/20">
                {selectedEntry.category.replace('_', ' ')}
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-[#191916] border border-[#3B392F]"
              >
                Close
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD] mt-4">{selectedEntry.title}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
              <span>{selectedEntry.historical_period}</span>
              <span>•</span>
              <span>Curated by {selectedEntry.primary_contributor}</span>
            </div>

            <div className="mt-6 text-sm text-[#F4EBDD]/90 leading-relaxed space-y-4">
              <p className="italic bg-[#191916] p-3.5 rounded-xl border border-[#3B392F] text-xs text-[#BDB4A4]">
                {selectedEntry.summary}
              </p>
              <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                {selectedEntry.content}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#3B392F] space-y-2 text-xs">
              <div className="text-slate-400">
                <strong className="text-slate-300">Sources & Provenance:</strong> {selectedEntry.source_citations}
              </div>
              <div className="text-slate-400">
                <strong className="text-slate-300">Licensing:</strong> {selectedEntry.licensing_info}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contributor Submit Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14130f] border border-[#C7A45B]/30 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 text-[#F4EBDD] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#3B392F]">
              <h3 className="text-lg font-bold font-serif text-[#F4EBDD] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C7A45B]" /> Submit Heritage Record
              </h3>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-[#191916] border border-[#3B392F]"
              >
                Close
              </button>
            </div>

            {submitNotice && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  submitNotice.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/25 text-rose-300'
                }`}
              >
                {submitNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{submitNotice.message}</span>
              </div>
            )}

            <form onSubmit={handleContributorSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="Record Title (e.g. History of the Travancore Swathi Music Academy)"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                  >
                    <option value="biography">Composer Biography</option>
                    <option value="instrument_craft">Instrument Crafting</option>
                    <option value="treatise_history">Treatise History</option>
                    <option value="regional_tradition">Regional Tradition</option>
                    <option value="oral_history">Oral History</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Historical Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 19th Century CE"
                    value={subPeriod}
                    onChange={(e) => setSubPeriod(e.target.value)}
                    className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Executive Summary *</label>
                <textarea
                  placeholder="A concise 2-sentence summary of the historical significance..."
                  value={subSummary}
                  onChange={(e) => setSubSummary(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl p-2.5 text-xs text-[#F4EBDD] h-16"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Article / Structured Content *</label>
                <textarea
                  placeholder="Detailed article body documenting historical accounts, lutherie techniques, or musical notations..."
                  value={subContent}
                  onChange={(e) => setSubContent(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl p-2.5 text-xs text-[#F4EBDD] h-28"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Contributor / Author</label>
                <input
                  type="text"
                  placeholder="Your Name or Research Group"
                  value={subContributor}
                  onChange={(e) => setSubContributor(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl px-3 py-2 text-xs text-[#F4EBDD]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Exact Sources & Academic Citations *</label>
                <textarea
                  placeholder="Treatises, journal papers, archives, epigraphy publications, or verified oral interviews..."
                  value={subCitations}
                  onChange={(e) => setSubCitations(e.target.value)}
                  className="w-full bg-[#191916] border border-[#3B392F] rounded-xl p-2.5 text-xs text-[#F4EBDD] h-16"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold rounded-xl text-xs transition-colors"
                >
                  Submit for Editorial Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
