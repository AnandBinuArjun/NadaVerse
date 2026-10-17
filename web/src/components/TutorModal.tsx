'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, BookOpen, AlertCircle, ShieldCheck } from 'lucide-react';
import { VERIFIED_RAGAS, VERIFIED_TALAS, VERIFIED_INSTRUMENTS } from '../data/carnaticData';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../lib/api';

interface Citation {
  sourceTitle: string;
  author: string;
  excerpt: string;
}

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  citations?: Citation[];
  confidence?: 'high' | 'moderate' | 'uncertain';
  provenance?: 'model_generated' | 'retrieval_only' | 'model_unavailable' | 'insufficient_evidence' | 'guardrail_blocked';
  uncertaintyNote?: string;
  timestamp: string;
}

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const TutorModal: React.FC<TutorModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState(
    initialTopic ? `Why is ${initialTopic} significant in Carnatic music?` : ''
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: lang === 'ml'
        ? 'നമസ്കാരം. ആധികാരിക കർണ്ണാടക സംഗീത ശാസ്ത്ര ഗ്രന്ഥങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള നാദവേഴ്സ് എഐ ട്യൂട്ടറാണ് ഞാൻ. രാഗ ഘടന, സ്വരസ്ഥാനങ്ങൾ, താള അംഗങ്ങൾ, വാദ്യ ചരിത്രം എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.'
        : 'Namaskaram. I am the NadaVerse AI Tutor, grounded exclusively in verified Carnatic musicology sources. Ask me about raga structures, swara intervals, tala angas, or instrument history.',
      confidence: 'high',
      timestamp: lang === 'ml' ? 'ഇപ്പോൾ' : 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? query).trim();
    if (!textToSend || isLoading) return;

    const userText = textToSend;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    const tutorMsgId = `tutor-${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Client-side grounded fallback function
    const runClientFallback = () => {
      const q = userText.toLowerCase();
      let answer = '';
      let citations: Citation[] = [];
      let provenance: 'model_generated' | 'retrieval_only' | 'model_unavailable' | 'insufficient_evidence' | 'guardrail_blocked' = 'retrieval_only';
      let confidence: 'high' | 'moderate' | 'uncertain' = 'moderate';
      let uncertaintyNote: string | undefined = undefined;

      if (q.includes('mayamalavagowla') || q.includes('purandara') || q.includes('sarali') || q.includes('മായാമാളവഗൗള')) {
        const raga = VERIFIED_RAGAS.find((r) => r.slug === 'mayamalavagowla')!;
        answer = lang === 'ml'
          ? `മായാമാളവഗൗള 15-ാമത് മേളകർത്താ രാഗമാണ് (S R₁ G₃ M₁ P D₁ N₃ Ṡ). പതിനഞ്ചാം നൂറ്റാണ്ടിൽ പുരന്ദര ദാസർ എല്ലാ സംഗീത വിദ്യാർത്ഥികളുടെയും അടിസ്ഥാന പാഠങ്ങൾക്കായി ഈ രാഗം തിരഞ്ഞെടുത്തു. ഇതിന്റെ പൂർവ്വാംഗവും (സ മുതൽ മ വരെ) ഉത്തരാംഗവും (പ മുതൽ താര സ വരെ) ഒരേപോലെയുള്ള കൃത്യമായ സ്വരസ്ഥാന അകലങ്ങൾ പാലിക്കുന്നതിനാൽ, തുടക്കക്കാർക്ക് സ്വരസ്ഥാനങ്ങൾ സംശയമില്ലാതെ ഹൃദിസ്ഥമാക്കാൻ ഇത് ഏറ്റവും അനുയോജ്യമാണ്.`
          : `Mayamalavagowla is the 15th Melakarta raga (S R₁ G₃ M₁ P D₁ N₃ Ṡ). Saint Purandara Dasa selected it in the 15th-16th century as the foundational training scale for all beginner exercises. Its defining genius is symmetrical geometry: both the lower tetrachord (Sa to Ma) and upper tetrachord (Pa to Tara Sa) consist of identical interval patterns (minor second, major second, minor second), allowing learners to develop exact pitch placement without acoustic confusion.`;
        citations = [
          {
            sourceTitle: raga.sources[0].title,
            author: raga.sources[0].authorOrCreator,
            excerpt: raga.sources[0].citation
          },
          {
            sourceTitle: 'South Indian Music (Book III)',
            author: 'Prof. P. Sambamoorthy',
            excerpt: 'Discussion of Purandara Dasa Abhyasa Gana codification in Mayamalavagowla.'
          }
        ];
      } else if (q.includes('shankarabharanam') || q.includes('major scale') || q.includes('ശങ്കരാഭരണം')) {
        const raga = VERIFIED_RAGAS.find((r) => r.slug === 'shankarabharanam')!;
        answer = lang === 'ml'
          ? `ധീരശങ്കരാഭരണം 29-ാമത് മേളകർത്താ രാഗമാണ് (S R₂ G₃ M₁ P D₂ N₃ Ṡ). പാശ്ചാത്യ സംഗീതത്തിലെ മേജർ സ്കെയിലിന് (C Major) സമാനമായ സ്വരസ്ഥാനങ്ങളാണ് ഇതിലുള്ളതെങ്കിലും, ഗാന്ധാരത്തിലും നിഷാദത്തിലും വരുന്ന മനോഹരമായ കംപിത ഗമകങ്ങളും ജാരു പ്രയോഗങ്ങളുമാണ് ഇതിനെ തനതായ കർണ്ണാടക ഭാവത്തിലേക്ക് ഉയർത്തുന്നത്.`
          : `Dheerasankarabharanam is the 29th Melakarta (S R₂ G₃ M₁ P D₂ N₃ Ṡ). While it shares pitch positions with the Western Major scale (C D E F G A B C), it is distinctively rendered with rich Carnatic gamakas—notably the kampita (oscillation) on Gandharam and Nishadam, and subtle jarus (glides) connecting notes.`;
        citations = [
          {
            sourceTitle: raga.sources[0].title,
            author: raga.sources[0].authorOrCreator,
            excerpt: raga.sources[0].citation
          }
        ];
      } else if (q.includes('adi tala') || q.includes('tala') || q.includes('laghu') || q.includes('ആദി താളം') || q.includes('താളം')) {
        const tala = VERIFIED_TALAS.find((t) => t.slug === 'adi-tala')!;
        answer = lang === 'ml'
          ? `ആദി താളം (ചതുശ്ര ജാതി ത്രിപുട താളം) 8 അക്ഷരങ്ങളുള്ള താളമാണ്: ഒരു ചതുശ്ര ലഘുവും (4 മാത്രകൾ) രണ്ട് ദ്രുതങ്ങളും (2+2 മാത്രകൾ): I₄ + O + O. കൈമുദ്രകൾ: അക്ഷരം 1 (തട്ട്), 2-4 (ചെറുവിരൽ, മോതിരവിരൽ, നടുവിരൽ എണ്ണൽ), അക്ഷരം 5 (തട്ട്), അക്ഷരം 6 (വീച്ചെടുക്കൽ), അക്ഷരം 7 (തട്ട്), അക്ഷരം 8 (വീച്ചെടുക്കൽ).`
          : `Adi Tala (Chatusra Jati Triputa Tala) has 8 aksharas structured as one Laghu (4 counts) followed by two Dhrutams (2 counts each): I₄ + O + O. The physical kriyas are: Beat 1 (Clap), Beats 2-4 (Pinky, Ring, Middle finger counts), Beat 5 (Clap), Beat 6 (Wave), Beat 7 (Clap), Beat 8 (Wave).`;
        citations = [
          {
            sourceTitle: tala.sources[0].title,
            author: tala.sources[0].authorOrCreator,
            excerpt: tala.sources[0].citation
          }
        ];
      } else if (q.includes('veena') || q.includes('saraswati') || q.includes('വീണ')) {
        const inst = VERIFIED_INSTRUMENTS.find((i) => i.slug === 'saraswati-veena')!;
        answer = lang === 'ml'
          ? `സരസ്വതി വീണ 24 മെഴുകുതട്ടുകളുള്ള പ്ലാവ് തടിയിൽ കടഞ്ഞെടുത്ത തന്ത്രി വാദ്യമാണ്. പതിനേഴാം നൂറ്റാണ്ടിൽ തഞ്ചാവൂരിലെ ഗോവിന്ദ ദീക്ഷിതരാണ് ഇതിന്റെ ഇപ്പോഴത്തെ ഘടന ചിട്ടപ്പെടുത്തിയത്. തന്ത്രികൾ വശങ്ങളിലേക്ക് നിരക്കി മീട്ടുന്നതിലൂടെ മനുഷ്യ ശബ്ദത്തിലെ എല്ലാ സൂക്ഷ്മ ഗമകങ്ങളും ഇതിൽ നിന്ന് ഉത്പാദിപ്പിക്കാം (ഗായകി ശൈലി).`
          : `The Saraswati Veena is a 24-fret plucked chordophone sculpted from seasoned jackwood. It was codified in Thanjavur during the 17th century by Govinda Dikshitar. Gamakas are produced through lateral string deflection across fixed brass frets set into wax, closely emulating the human voice (gayaki style).`;
        citations = [
          {
            sourceTitle: inst.sources[0].title,
            author: inst.sources[0].authorOrCreator,
            excerpt: inst.sources[0].citation
          }
        ];
      } else if (q.includes('mridangam') || q.includes('karanai') || q.includes('മൃദംഗം')) {
        const inst = VERIFIED_INSTRUMENTS.find((i) => i.slug === 'mridangam')!;
        answer = lang === 'ml'
          ? `മൃദംഗം കർണ്ണാടക കച്ചേരികളിലെ പ്രധാന ഇരട്ടമുഖ താളവാദ്യമാണ്. ഇതിന്റെ വലന്തലയിൽ ചേർത്തുവെച്ചിരിക്കുന്ന 'ചോറ്' (കരിമരുന്ന് / കിരണം) തികച്ചും സ്വാഭാവികമായ ഹാർമോണിക് അനുരണനങ്ങൾ നൽകുന്നുവെന്ന് നോബൽ സമ്മാന ജേതാവ് സർ സി.വി. രാമൻ ശാസ്ത്രീയമായി കണ്ടെത്തിയിട്ടുണ്ട്. ഇത് ഗായകന്റെ ആധാര ഷഡ്ജത്തിലേക്ക് കൃത്യമായി ശ്രുതി ചേർക്കാൻ സഹായിക്കുന്നു.`
          : `The Mridangam is the primary Carnatic double-ended barrel drum. Its right head (valanthalai) contains the "karanai" (a permanent circular paste of iron powder and boiled rice) discovered by Nobel laureate Sir C.V. Raman to generate true harmonic overtones, allowing the drum to be tuned precisely to the vocalist's tonic pitch (Sa).`;
        citations = [
          {
            sourceTitle: inst.sources[0].title,
            author: inst.sources[0].authorOrCreator,
            excerpt: inst.sources[0].citation
          }
        ];
      } else if (q.includes('shruti') || q.includes('tonic') || q.includes('drone') || q.includes('ശ്രുതി')) {
        answer = lang === 'ml'
          ? `ശ്രുതിക്ക് പ്രധാനമായും രണ്ട് അർത്ഥങ്ങളുണ്ട്: (1) തംബുരു നൽകുന്ന സ്ഥിരമായ ആധാര നാദം (ആധാര ഷഡ്ജം), (2) ഭാരതീയ സംഗീത ശാസ്ത്രത്തിൽ ഒരു സപ്തകത്തിൽ പറയുന്ന 22 സൂക്ഷ്മ ശ്രുതികൾ. കച്ചേരിയിലുടനീളം എല്ലാ കലാകാരന്മാരും ഈ ഒരു സ്ഥിര ശ്രുതിയിലേക്ക് ഐക്യപ്പെട്ടാണ് പാടുകയും വായിക്കുകയും ചെയ്യുന്നത്.`
          : `Shruti has two meanings: (1) The continuous reference pitch (Adhara Shadjam) provided by the Tambura, and (2) The 22 microtonal intervals within an octave in ancient Indian music theory. In Carnatic concerts, all artists synchronize strictly to one unchanging Shruti throughout the recital.`;
        citations = [
          {
            sourceTitle: 'Natya Shastra (Chapter 28)',
            author: 'Bharata Muni',
            excerpt: 'The 22 Shruti division and acoustic determination.'
          }
        ];
      } else {
        answer = lang === 'ml'
          ? `നാദവേഴ്സിന്റെ ആധികാരിക സംഗീത ഡാറ്റാബേസിൽ ഈ വിഷയത്തിൽ പൂർണ്ണ ശാസ്ത്രീയ വിവരങ്ങൾ കണ്ടെത്താനായില്ല. സംഗീത സത്യസന്ധത കാത്തുസൂക്ഷിക്കാൻ അനുമാനങ്ങൾ പറഞ്ഞുണ്ടാക്കുന്നില്ല. മായാമാളവഗൗള, ശങ്കരാഭരണം, കല്യാണി, ആദി താളം, വീണ, മൃദംഗം എന്നിവയെക്കുറിച്ച് ചോദിച്ചുനോക്കൂ.`
          : `I do not have sufficient verified musicology documents in the NadaVerse peer-reviewed database to answer this specific inquiry with high authority. To maintain scholarly integrity, I refrain from fabricating speculative details. You may explore our verified records on Mayamalavagowla, Shankarabharanam, Kalyani, Adi Tala, Veena, or Mridangam.`;
        confidence = 'uncertain';
        provenance = 'insufficient_evidence';
        uncertaintyNote = lang === 'ml'
          ? 'നാദവേഴ്സിന്റെ സംഗീത ബോർഡ് ഈ വിഷയത്തിൽ കൂടുതൽ ഗ്രന്ഥങ്ങൾ ചേർത്തുകൊണ്ടിരിക്കുന്നു.'
          : 'Question outside currently reviewed knowledge corpus. Verified fallback applied.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: tutorMsgId,
          sender: 'tutor',
          text: answer,
          citations,
          confidence,
          provenance,
          uncertaintyNote,
          timestamp: timestampStr
        }
      ]);
      setIsLoading(false);
    };

    // Attempt Server-Sent Events (SSE) streaming from backend AI gateway (POST preferred to avoid URL leakage)
    try {
      let response = await fetch(`${API_BASE_URL}/api/v1/tutor/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText })
      });

      if (!response.ok && response.status === 405) {
        // Fallback to GET streaming if POST is not accepted
        response = await fetch(`${API_BASE_URL}/api/v1/tutor/stream?query=${encodeURIComponent(userText)}`);
      }

      if (!response.ok || !response.body) {
        throw new Error('Streaming connection unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedAnswer = '';
      let receivedAnyChunk = false;

      // Add placeholder tutor message that will be populated token-by-token
      setMessages((prev) => [
        ...prev,
        {
          id: tutorMsgId,
          sender: 'tutor',
          text: '',
          confidence: 'high',
          provenance: 'model_generated',
          timestamp: timestampStr
        }
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                receivedAnyChunk = true;
                streamedAnswer += parsed.chunk;
                setMessages((prev) =>
                  prev.map((m) => (m.id === tutorMsgId ? { ...m, text: streamedAnswer } : m))
                );
              }
            } catch {
              // Raw text chunk fallback
              if (dataStr) {
                receivedAnyChunk = true;
                streamedAnswer += dataStr;
                setMessages((prev) =>
                  prev.map((m) => (m.id === tutorMsgId ? { ...m, text: streamedAnswer } : m))
                );
              }
            }
          }
        }
      }

      if (!receivedAnyChunk) {
        throw new Error('Empty stream received');
      }
      setIsLoading(false);
    } catch {
      // Graceful local grounded fallback if backend is offline or during offline PWA mode
      runClientFallback();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-dialog-title"
    >
      <div className="bg-[#141310]/95 border border-[#C7A45B]/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(199,164,91,0.15)] overflow-hidden backdrop-blur-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C7A45B]/20 flex items-center justify-between bg-[#0e0d0b]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#22221D] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="tutor-dialog-title" className="text-lg font-serif font-bold text-[#F4EBDD]">
                {t.tutorTitle}
              </h2>
              <span className="text-[11px] text-[#87947A] flex items-center space-x-1 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.tutorGroundingNotice}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#BDB4A4] hover:text-[#F4EBDD] rounded-lg hover:bg-[#22221D] transition-colors"
            aria-label="Close AI Tutor dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isTutor = msg.sender === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isTutor
                      ? 'bg-[#22221D] text-[#F4EBDD] border border-[#3B392F]'
                      : 'bg-[#C7A45B] text-[#11110F] font-medium shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Uncertainty Banner */}
                  {msg.uncertaintyNote && (
                    <div className="mt-3 flex items-start space-x-1.5 text-xs text-[#E17D73] bg-[#11110F] p-2.5 rounded-lg border border-[#E17D73]/30">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{msg.uncertaintyNote}</span>
                    </div>
                  )}

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#3B392F]/60 text-xs">
                      <div className="flex items-center space-x-1 text-[#C7A45B] font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                        <BookOpen className="w-3 h-3" />
                        <span>{lang === 'ml' ? 'ആധികാരിക സ്രോതസ്സുകൾ:' : 'Verified Citations:'}</span>
                      </div>
                      <div className="space-y-1">
                        {msg.citations.map((c, i) => (
                          <div
                            key={i}
                            className="bg-[#191916] p-2 rounded border border-[#3B392F]/40 text-[#BDB4A4]"
                          >
                            <span className="font-semibold text-[#F4EBDD]">{c.sourceTitle}</span>{' '}
                            ({c.author}) — <span className="italic">{c.excerpt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#BDB4A4] font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#C7A45B] font-mono p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{lang === 'ml' ? 'ആധികാരിക ഗ്രന്ഥങ്ങളിൽ പരിശോധിക്കുന്നു...' : 'Consulting verified Carnatic musicology sources...'}</span>
            </div>
          )}
        </div>

        {/* Pedagogical Disclaimer & Input Box */}
        <div className="p-4 border-t border-[#3B392F] bg-[#11110F]">
          <div className="text-[11px] text-[#BDB4A4] mb-3 px-1">
            <strong>{lang === 'ml' ? 'അധ്യാപന നിർദ്ദേശം:' : 'Pedagogical Notice:'}</strong>{' '}
            {lang === 'ml'
              ? 'നാദവേഴ്സ് എഐ ട്യൂട്ടർ ഒരു ശാസ്ത്രീയ പഠന സഹായി മാത്രമാണ്. ഒരു സദ്ഗുരുവിന്റെ പ്രായോഗിക ശിക്ഷണത്തിന് ഇത് പകരമാവില്ല.'
              : 'NadaVerse AI Tutor is an educational reference companion grounded in verified texts. It does not replace the experiential guidance of an authentic Guru.'}
          </div>

          {/* Quick Study Prompt Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              {
                en: 'Generate a 30-min beginner vocal practice plan',
                ml: 'തുടക്കക്കാർക്കായി 30 മിനിറ്റ് സാധക ക്രമം നിർദ്ദേശിക്കുക'
              },
              {
                en: 'Quiz me on the 72 Melakarta system',
                ml: '72 മേളകർത്താ പദ്ധതിയെക്കുറിച്ച് ഒരു ചോദ്യം ചോദിക്കുക'
              },
              {
                en: 'Explain the difference between Shankarabharanam and Kalyani',
                ml: 'ശങ്കരാഭരണവും കല്യാണിയും തമ്മിലുള്ള സ്വര വ്യത്യാസം എന്താണ്?'
              },
              {
                en: 'What is the role of Purandara Dasa in Abhyasa Gana?',
                ml: 'അഭ്യാസ ഗാനത്തിൽ പുരന്ദര ദാസരുടെ സംഭാവന എന്താണ്?'
              }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const txt = lang === 'ml' ? chip.ml : chip.en;
                  setQuery(txt);
                  handleSend(txt);
                }}
                disabled={isLoading}
                className="text-[11px] font-mono bg-[#191916] hover:bg-[#24211a] border border-[#C7A45B]/30 hover:border-[#C7A45B] text-[#E0C98F] px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-left"
              >
                {lang === 'ml' ? chip.ml : chip.en}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.tutorPlaceholder}
              className="flex-1 bg-[#22221D] border border-[#3B392F] rounded-xl px-4 py-2.5 text-sm text-[#F4EBDD] placeholder-[#BDB4A4]/60 focus:outline-none focus:border-[#C7A45B]"
              aria-label="Ask the AI Tutor a question"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-[#C7A45B] text-[#11110F] p-2.5 rounded-xl font-medium hover:bg-[#E0C98F] disabled:opacity-50 transition-colors"
              aria-label="Send inquiry to AI tutor"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
