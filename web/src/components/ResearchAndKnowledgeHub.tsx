'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
  Globe,
  Award,
  Code,
  Volume2,
  Printer,
  Info,
  BookOpen,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine, TonicNote } from '../lib/audioEngine';

interface KnowledgeNode {
  id: string;
  label: string;
  type: 'raga' | 'composer' | 'composition' | 'tala' | 'instrument' | 'treatise';
  provenance: string;
  connections: { targetLabel: string; relation: string; explanation: string }[];
}

const KNOWLEDGE_GRAPH_NODES: KnowledgeNode[] = [
  {
    id: 'raga:mayamalavagowla',
    label: 'Mayamalavagowla (15th Melakarta)',
    type: 'raga',
    provenance: 'Chaturdandi Prakasika (Venkatamakhin, c. 1620 CE)',
    connections: [
      { targetLabel: 'Purandara Dasa', relation: 'Codified Pedagogy', explanation: 'Selected for Sarali, Jantai, and Alankara foundational exercises due to symmetrical R1-G3 and D1-N3 intervals.' },
      { targetLabel: 'Malahari Raga', relation: 'Parent (Janaka) Of', explanation: 'Parent scale of Malahari (Sri Gananatha Pillari Geetham).' },
      { targetLabel: 'Kamavardhini (#51)', relation: 'Prati Madhyama Pair', explanation: 'Shares identical Ri, Ga, Dha, Ni with M2 replacing M1.' },
    ],
  },
  {
    id: 'raga:hamsadhwani',
    label: 'Hamsadhwani (Audava Janya)',
    type: 'raga',
    provenance: 'Ramaswami Dikshitar (1735–1817) & SSP (1904)',
    connections: [
      { targetLabel: 'Dheerashankarabharanam (#29)', relation: 'Janya Affiliated With', explanation: 'Takes S R2 G3 P N3 S omitting Madhyamam and Dhaivatam.' },
      { targetLabel: 'Vatapi Ganapatim Bhajeham', relation: 'Cornerstone Kriti', explanation: 'Immortalized by Muthuswami Dikshitar in Adi Tala.' },
    ],
  },
  {
    id: 'treatise:ssp-1904',
    label: 'Sangita Sampradaya Pradarsini (1904)',
    type: 'treatise',
    provenance: 'Subbarama Dikshitar (Ettayapuram Press, 1904)',
    connections: [
      { targetLabel: 'Dasavidha & 15 Gamakas', relation: 'Codifies Signs For', explanation: 'First printed treatise using explicit graphic symbols for Kampita, Jaru, Nokku, and Spurita.' },
      { targetLabel: 'Muthuswami Dikshitar Kritis', relation: 'Primary Archival Source', explanation: 'Preserves authentic notation of 229 Dikshitar compositions.' },
    ],
  },
  {
    id: 'inst:saraswati-veena',
    label: 'Saraswati Veena (24-Fret Melam)',
    type: 'instrument',
    provenance: 'Raghunatha Nayak & Venkatamakhin (Thanjavur)',
    connections: [
      { targetLabel: '72 Melakarta System', relation: 'Empirical Tuning Basis', explanation: 'Fixed 24-fret brass melam established the 12 swarasthana positions per octave.' },
    ],
  },
];

const PHRASE_SEARCH_CORPUS = [
  {
    id: 'ps-1',
    title: 'Ninnukori (Mohanam Tana Varnam)',
    raga: 'Mohanam',
    tala: 'Adi Tala',
    composer: 'Poochi Srinivasa Iyengar',
    swaraSequence: 'G3 G3 R2 S R2 G3 P D2 S D2 P G3 R2 S',
    ratios: [5 / 4, 5 / 4, 9 / 8, 1.0, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2.0],
    explanation: 'Signature Mohanam opening highlighting Antara Gandhara and Panchama-Dhaivata ascent.',
  },
  {
    id: 'ps-2',
    title: 'Vatapi Ganapatim Bhajeham',
    raga: 'Hamsadhwani',
    tala: 'Adi Tala',
    composer: 'Muthuswami Dikshitar',
    swaraSequence: 'G3 P N3 S N3 P G3 R2 S',
    ratios: [5 / 4, 3 / 2, 15 / 8, 2.0, 15 / 8, 3 / 2, 5 / 4, 9 / 8, 1.0],
    explanation: 'Characteristic Hamsadhwani prayoga soaring from G3 through P and N3 to Tara Sa.',
  },
  {
    id: 'ps-3',
    title: 'Sri Gananatha (Malahari Geetham)',
    raga: 'Malahari',
    tala: 'Rupaka Tala',
    composer: 'Purandara Dasa',
    swaraSequence: 'M1 P D1 S D1 P M1 G3 R1 S',
    ratios: [4 / 3, 3 / 2, 8 / 5, 2.0, 8 / 5, 3 / 2, 4 / 3, 5 / 4, 16 / 15, 1.0],
    explanation: 'First Pillari Geetham phrase opening on Shuddha Madhyamam (M1).',
  },
  {
    id: 'ps-4',
    title: 'Samaja Vara Gamana',
    raga: 'Hindolam',
    tala: 'Adi Tala',
    composer: 'Saint Tyagaraja',
    swaraSequence: 'S G2 M1 D1 N2 S N2 D1 M1 G2 S',
    ratios: [1.0, 6 / 5, 4 / 3, 8 / 5, 9 / 5, 2.0, 9 / 5, 8 / 5, 4 / 3, 6 / 5, 1.0],
    explanation: 'Panchama-varjya Audava prayoga centering on G2, M1, D1, and N2.',
  },
];

const MULTILINGUAL_DICTIONARY_ENTRIES = [
  {
    term: 'Shruti (ശ്രുതി)',
    pronunciation: 'śru-ti',
    en: 'The microtonal pitch foundation and finest audible pitch distinction (22 Shrutis per octave); also refers to the reference tonic drone (Adhara Shadjam).',
    ml: 'ശ്രവിക്കപ്പെടുന്നത്. സംഗീതത്തിന്റെ മാതാവായി കരുതപ്പെടുന്ന ആധാര സ്വരസ്ഥാനവും 22 സൂക്ഷ്മ ശ്രുതി ഭേദങ്ങളും.',
    ta: 'சுരുதி — இசையின் ஆதார சுரம் மற்றும் நுட்பமான 22 சுருதி வேறுபாடுகள் (சுருதி மாதா லய பிதா).',
    te: 'శ్రుతి — సంగీతానికి ఆధారమైన మూల స్వరస్థానము మరియు 22 సూక్ష్మ నాద భేదములు.',
    kn: 'ಶ್ರುತಿ — ಸಂಗീತದ ಮೂಲ ಆಧಾರ ಸ್ವರ ಮತ್ತು 22 ಸೂಕ್ಷ್ಮ ನಾದ ಪ್ರಭೇದಗಳು.',
    sa: 'श्रुतिः — श्रूयते इति श्रुतिः (सङ्गीतरत्नाकरः, द्वादशस्वर-द्वाविंशतिश्रुतिव्यवस्था).',
    citation: 'Natya Shastra (Ch. 28) & Sangita Ratnakara',
  },
  {
    term: 'Gamaka (ഗമകം)',
    pronunciation: 'ga-ma-ka',
    en: 'Essential microtonal oscillation, glide, or ornament that bestows living raga identity (Raga Bhava) upon a swarasthana.',
    ml: 'സ്വരങ്ങൾക്ക് ജീവനും രാഗഭാവവും നൽകുന്ന സൂക്ഷ്മമായ ആന്ദോളനങ്ങളും സ്വരചലനങ്ങളും (ദശവിധ ഗമകങ്ങൾ).',
    ta: 'கமகம் — இராக பாவத்தை வெளிப்படுத்தும் சுர அசைவுகள் மற்றும் நுட்பமான ஊசல்கள்.',
    te: 'గమకము — రాగ భావమును ప్రకాశింపజేయు స్వర కంపనములు మరియు జారు ప్రయోగములు.',
    kn: 'ಗಮಕ — ರಾಗ ಭಾವವನ್ನು ಬೆಳಗಿಸುವ ಸ್ವರಗಳ ಸೂಕ್ಷ್ಮ ಕಂಪನ ಮತ್ತು ಚಲನೆ.',
    sa: 'गमकः — स्वरस्य कम्पो गमकः श्रोतृचित्तसुखावहः (सङ्गीतरत्नाकरः).',
    citation: 'Sangita Ratnakara & Sangita Sampradaya Pradarsini (1904)',
  },
  {
    term: 'Manodharma (മനോധർമ്മം)',
    pronunciation: 'ma-nō-dhar-ma',
    en: 'Structured classical improvisation governed by raga lakshana and tala grammar, encompassing Raga Alapana, Tanam, Neraval, Kalpana Swaram, and Pallavi.',
    ml: 'രാഗ-താള നിയമങ്ങൾക്ക് വിധേയമായി കലാകാരന്റെ ഭാവനയ്ക്കനുസരിച്ച് തത്സമയം ആവിഷ്കരിക്കുന്ന സംഗീതം (ആലാപനം, താനം, നിരവൽ, കല്പനാസ്വരം).',
    ta: 'மனோதர்ம சங்கீதம் — இராக ஆலாபனை, தானம், நிரவல், கற்பனைச் சுரம் ஆகிய படைப்பாற்றல் இசை.',
    te: 'మనోధర్మ సంగీతము — రాగాలాపన, తానము, నేరవల్, కల్పనా స్వరములతో కూడిన సృజనాత్మక గానము.',
    kn: 'ಮನೋಧರ್ಮ ಸಂಗೀತ — ರಾಗಾಲಾಪನೆ, ತಾನ, ನೇರವಲ್ ಮತ್ತು ಕಲ್ಪನಾ ಸ್ವರಗಳ ಸೃಜನಶೀಲ ಪ್ರಸ್ತುತಿ.',
    sa: 'मनोधर्मसङ्गीतम् — रागताललक्षणानुसारि तात्कालिकं कल्पनासङ्गीतम्.',
    citation: 'Sangita Sampradaya Pradarsini',
  },
];

const COMPARATIVE_THEORY_ROWS = [
  {
    concept: 'Tonic & Reference System',
    carnatic: 'Relative Adhara Shadjam (Sa chosen by vocalist/instrumentalist; 1 to 7 Kattai)',
    hindustani: 'Relative Sa (Safed / Kali scale designations)',
    western: 'Absolute Concert Pitch Standard (A4 = 440 Hz fixed key signatures)',
    scholarlyNote: 'Carnatic and Hindustani systems fix Sa to the performer’s natural vocal or instrumental range rather than transposing written key signatures.',
  },
  {
    concept: 'Intonation & Microtones',
    carnatic: '22 Shrutis / Pure Just Intonation harmonic ratios + continuous Gamaka curves',
    hindustani: '22 Shrutis / Meend & Kan-swara microtonal consonance against Tanpura',
    western: '12-Tone Equal Temperament (12-TET, 100 cents/semitone) for triadic modulation',
    scholarlyNote: 'Carnatic Swarasthanas cannot be equated to fixed 12-TET piano semitones because gamaka envelopes define the note.',
  },
  {
    concept: 'Rhythmic Architecture',
    carnatic: 'Suladi Sapta Talas (35 Talas) & Chapu Talas with external hand Kriyas (Laghu, Dhrutam)',
    hindustani: 'Theka-based Talas (Teental, Jhaptaal, Ektaal) defined by Tabla bol cycles and Khali/Bhari',
    western: 'Time Signatures (Simple/Compound meters: 4/4, 3/4, 6/8) organized around harmonic downbeats',
    scholarlyNote: 'Carnatic Tala is kept visibly via deterministic hand Kriyas independent of percussion accompaniment.',
  },
];

interface ResearchAndKnowledgeHubProps {
  activeTonic: TonicNote;
}

export const ResearchAndKnowledgeHub: React.FC<ResearchAndKnowledgeHubProps> = ({ activeTonic }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'graph-search' | 'dictionary-theory' | 'certificates-api'>('graph-search');
  const [phraseQuery, setPhraseQuery] = useState<string>('G3 P');
  const [selectedLangCode, setSelectedLangCode] = useState<'en' | 'ml' | 'ta' | 'te' | 'kn' | 'sa'>('en');
  const [certRecipientName, setCertRecipientName] = useState<string>('Carnatic Music Learner');
  const [certCourseName, setCertCourseName] = useState<string>('Gāyana & Vādya Foundational Shruti & Tala Curriculum');

  const filteredPhrases = PHRASE_SEARCH_CORPUS.filter(
    (p) =>
      p.swaraSequence.toLowerCase().includes(phraseQuery.toLowerCase()) ||
      p.raga.toLowerCase().includes(phraseQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(phraseQuery.toLowerCase())
  );

  const handleAuditionPhrase = async (ratios: number[]) => {
    await audioEngine.unlockAudio();
    audioEngine.setTonic(activeTonic.frequency);
    audioEngine.playRagaScale(ratios, 360);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/30 p-5 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-[#E0C98F] text-xs font-mono uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>
                {lang === 'ml'
                  ? 'സംഗീത ഗവേഷണ കേന്ദ്രം, നോളജ് ഗ്രാഫ് & 6-ഭാഷാ നിഘണ്ടു'
                  : 'NadaVerse 2.0 • Knowledge Graph, Phrase Search, 6-Language Dictionary & Open API'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EBDD]">
              {lang === 'ml'
                ? 'കർണ്ണാടക സംഗീത വിജ്ഞാന ശൃംഖലയും ബഹുഭാഷാ നിഘണ്ടുവും'
                : 'Carnatic Knowledge Graph, Swara Phrase Search & Multilingual Research Hub'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'graph-search', labelEn: '1. Knowledge Graph & Phrase Search', labelMl: '1. നോളജ് ഗ്രാഫ് & സ്വര തിരച്ചിൽ' },
              { id: 'dictionary-theory', labelEn: '2. 6-Language Dictionary & Comparative Theory', labelMl: '2. 6-ഭാഷാ നിഘണ്ടു & താരതമ്യ പഠനം' },
              { id: 'certificates-api', labelEn: '3. Certificates, Open API & Widgets', labelMl: '3. സർട്ടിഫിക്കറ്റ് & ഓപ്പൺ API' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C7A45B] text-[#11110F] font-bold shadow-md'
                    : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD] border border-[#3B392F]'
                }`}
              >
                {lang === 'ml' ? tab.labelMl : tab.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: KNOWLEDGE GRAPH & MUSICAL PHRASE SEARCH ENGINE (Sec 18 & 20)
      ===================================================================== */}
      {activeTab === 'graph-search' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Cols: Musical Phrase Search Engine */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                <span>Musical Phrase Search Engine (Section 20)</span>
              </span>
              <span className="text-[11px] font-mono text-[#87947A]">Deterministic Swara Subsequence</span>
            </div>

            <input
              type="text"
              value={phraseQuery}
              onChange={(e) => setPhraseQuery(e.target.value)}
              placeholder="Search swara sequence (e.g. 'G3 P N3', 'M1 P D1', 'S G2 M1')..."
              className="w-full bg-[#14130f] border border-[#3B392F] rounded-xl px-4 py-2.5 text-xs font-mono text-[#F4EBDD]"
            />

            <div className="space-y-3">
              {filteredPhrases.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-serif font-bold text-[#F4EBDD]">{item.title}</div>
                      <span className="text-[11px] font-mono text-[#C7A45B]">
                        {item.raga} • {item.tala} • {item.composer}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAuditionPhrase(item.ratios)}
                      className="px-3 py-1.5 rounded-xl bg-[#22221D] hover:bg-[#C7A45B] text-[#E0C98F] hover:text-[#11110F] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Audition</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#22221D] text-xs font-mono text-[#E0C98F] font-bold">
                    {item.swaraSequence}
                  </div>
                  <p className="text-xs text-[#BDB4A4]">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 6 Cols: Provenance-Backed Carnatic Knowledge Graph */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span>Carnatic Knowledge Graph Explorer (Section 18)</span>
              </span>
              <span className="text-[11px] font-mono text-[#6EA887]">100% Treatise-Provenanced</span>
            </div>

            <div className="space-y-3">
              {KNOWLEDGE_GRAPH_NODES.map((node) => (
                <div key={node.id} className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-bold text-[#F4EBDD]">{node.label}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C7A45B]/15 text-[#E0C98F]">
                      {node.type}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#87947A]">Provenance: {node.provenance}</div>
                  <div className="space-y-1.5 pt-1 border-t border-[#3B392F]/60">
                    {node.connections.map((conn, idx) => (
                      <div key={idx} className="text-xs text-[#BDB4A4]">
                        <strong className="text-[#E0C98F]">→ [{conn.relation}] {conn.targetLabel}:</strong>{' '}
                        {conn.explanation}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: 6-LANGUAGE DICTIONARY & COMPARATIVE THEORY LAB (Sec 21 & 24)
      ===================================================================== */}
      {activeTab === 'dictionary-theory' && (
        <div className="space-y-6">
          {/* 6-Language Dictionary */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C7A45B]" />
                <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
                  Multilingual Carnatic Terminology Dictionary (6 Languages — Section 24)
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ml', label: 'മലയാളം (Malayalam)' },
                  { code: 'ta', label: 'தமிழ் (Tamil)' },
                  { code: 'te', label: 'తెలుగు (Telugu)' },
                  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                  { code: 'sa', label: 'संस्कृतम् (Sanskrit)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLangCode(l.code as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer ${
                      selectedLangCode === l.code
                        ? 'bg-[#C7A45B] text-[#11110F] font-bold'
                        : 'bg-[#22221D] text-[#BDB4A4] hover:text-[#F4EBDD]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MULTILINGUAL_DICTIONARY_ENTRIES.map((entry) => (
                <div key={entry.term} className="p-4 rounded-2xl bg-[#14130f] border border-[#3B392F] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-serif font-bold text-[#F4EBDD]">{entry.term}</span>
                    <span className="text-[11px] font-mono text-[#C7A45B]">/{entry.pronunciation}/</span>
                  </div>
                  <p className="text-xs text-[#F4EBDD] leading-relaxed">{entry[selectedLangCode]}</p>
                  <div className="text-[10px] font-mono text-[#87947A] pt-1 border-t border-[#3B392F]">
                    Source: {entry.citation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Music Theory Lab */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C7A45B]" />
              <h3 className="text-lg font-serif font-bold text-[#F4EBDD]">
                Comparative Music Theory Lab: Carnatic • Hindustani • Western Classical (Section 21)
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#14130f] border border-[#C7A45B]/25 text-xs text-[#BDB4A4] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#C7A45B] shrink-0 mt-0.5" />
              <span>
                <strong>Scholarly Non-Equivalence Notice:</strong> Concepts across Carnatic, Hindustani, and Western traditions evolved within distinct aesthetic and harmonic frameworks and must never be treated as 1:1 equivalents.
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#3B392F]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14130f] text-[#C7A45B] font-mono">
                  <tr>
                    <th className="p-3">Dimension</th>
                    <th className="p-3">Carnatic System</th>
                    <th className="p-3">Hindustani System</th>
                    <th className="p-3">Western Classical</th>
                    <th className="p-3">Scholarly Distinction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B392F] bg-[#191916]">
                  {COMPARATIVE_THEORY_ROWS.map((row) => (
                    <tr key={row.concept}>
                      <td className="p-3 font-serif font-bold text-[#E0C98F]">{row.concept}</td>
                      <td className="p-3 text-[#F4EBDD]">{row.carnatic}</td>
                      <td className="p-3 text-[#BDB4A4]">{row.hindustani}</td>
                      <td className="p-3 text-[#BDB4A4]">{row.western}</td>
                      <td className="p-3 text-[#87947A] font-mono text-[11px]">{row.scholarlyNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: COMPLETION CERTIFICATES, OPEN API & WIDGETS (Sec 27, 32, 33)
      ===================================================================== */}
      {activeTab === 'certificates-api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Cols: Non-Accredited Educational Completion Certificate */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#C7A45B]/40 p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Course Completion Certificate Generator (Sec 27)</span>
              </span>
              <button
                onClick={() => typeof window !== 'undefined' && window.print()}
                className="px-3 py-1.5 rounded-xl bg-[#22221D] border border-[#C7A45B]/40 text-xs font-mono text-[#E0C98F] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              <input
                type="text"
                value={certRecipientName}
                onChange={(e) => setCertRecipientName(e.target.value)}
                placeholder="Learner display name..."
                className="bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
              <input
                type="text"
                value={certCourseName}
                onChange={(e) => setCertCourseName(e.target.value)}
                placeholder="Course track..."
                className="bg-[#14130f] border border-[#3B392F] rounded-xl px-3 py-2 text-[#F4EBDD]"
              />
            </div>

            {/* Printable Certificate Preview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1e1b14] to-[#12110e] border-2 border-[#C7A45B] text-center space-y-3 shadow-inner">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#C7A45B]">
                NadaVerse Open Carnatic Sanctuary • Record of Self-Directed Study
              </div>
              <div className="text-xs text-[#BDB4A4]">This certifies that</div>
              <div className="text-2xl font-serif font-bold text-[#F4EBDD]">{certRecipientName}</div>
              <div className="text-xs text-[#BDB4A4]">has completed the curriculum modules for</div>
              <div className="text-base font-serif font-bold text-[#E0C98F]">{certCourseName}</div>
              <div className="text-[10px] font-mono text-[#87947A] pt-2 border-t border-[#C7A45B]/30">
                Non-Accredited Educational Completion Record • 100% Free Open-Source Cultural Initiative • Does not constitute an institutional degree or professional accreditation.
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Open Developer Public API & Embeddable Widget Snippet */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl bg-[#191916] border border-[#3B392F] p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#C7A45B] flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span>Open Developer API & Embeddable Widgets (Sec 32 & 33)</span>
              </span>
              <span className="text-[11px] font-mono text-[#6EA887]">CC-BY-SA 4.0 • Zero Private Data</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                'GET /api/v1/public/ragas?limit=25&offset=0',
                'GET /api/v1/public/talas',
                'GET /api/v1/public/composers',
                'GET /api/v1/public/instruments',
                'GET /api/v1/public/glossary?q=Shruti',
                'GET /api/v1/public/compositions',
                'GET /api/v1/public/relationships?entity_type=raga',
                'GET /api/v1/public/phrase-search?swaras=G3+P+N3',
              ].map((ep) => (
                <div key={ep} className="p-2.5 rounded-xl bg-[#14130f] border border-[#3B392F] text-[#E0C98F]">
                  {ep}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#3B392F] space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-[#C7A45B] block">
                Embeddable Shruti & Raga Widget (Click-to-Play, No Tracking):
              </span>
              <pre className="p-3 rounded-xl bg-[#11110F] border border-[#3B392F] text-[10px] font-mono text-[#BDB4A4] overflow-x-auto">
{`<iframe
  src="https://nadaverse.abarjun.online/?widget=shruti&tonic=${activeTonic.name}"
  title="NadaVerse Just Intonation Shruti Widget"
  width="100%" height="220" loading="lazy"
  sandbox="allow-scripts allow-same-origin"
></iframe>`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
