'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, BookOpen, AlertCircle, ShieldCheck } from 'lucide-react';
import { VERIFIED_RAGAS, VERIFIED_TALAS, VERIFIED_INSTRUMENTS } from '../data/carnaticData';

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
  uncertaintyNote?: string;
  timestamp: string;
}

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const TutorModal: React.FC<TutorModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const [query, setQuery] = useState(
    initialTopic ? `Why is ${initialTopic} significant in Carnatic music?` : ''
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: 'Namaskaram. I am the NadaVerse AI Tutor, grounded exclusively in verified Carnatic musicology sources. Ask me about raga structures, swara intervals, tala angas, or instrument history.',
      confidence: 'high',
      timestamp: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    // Grounded Knowledge Retrieval Engine
    setTimeout(() => {
      const q = userText.toLowerCase();

      let answer = '';
      let citations: Citation[] = [];
      let confidence: 'high' | 'moderate' | 'uncertain' = 'high';
      let uncertaintyNote: string | undefined = undefined;

      if (q.includes('mayamalavagowla') || q.includes('purandara') || q.includes('sarali')) {
        const raga = VERIFIED_RAGAS.find((r) => r.slug === 'mayamalavagowla')!;
        answer = `Mayamalavagowla is the 15th Melakarta raga (S R₁ G₃ M₁ P D₁ N₃ Ṡ). Saint Purandara Dasa selected it in the 15th-16th century as the foundational training scale for all beginner exercises. Its defining genius is symmetrical geometry: both the lower tetrachord (Sa to Ma) and upper tetrachord (Pa to Tara Sa) consist of identical interval patterns (minor second, major second, minor second), allowing learners to develop exact pitch placement without acoustic confusion.`;
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
      } else if (q.includes('shankarabharanam') || q.includes('major scale')) {
        const raga = VERIFIED_RAGAS.find((r) => r.slug === 'shankarabharanam')!;
        answer = `Dheerasankarabharanam is the 29th Melakarta (S R₂ G₃ M₁ P D₂ N₃ Ṡ). While it shares pitch positions with the Western Major scale (C D E F G A B C), it is distinctively rendered with rich Carnatic gamakas—notably the kampita (oscillation) on Gandharam and Nishadam, and subtle jarus (glides) connecting notes.`;
        citations = [
          {
            sourceTitle: raga.sources[0].title,
            author: raga.sources[0].authorOrCreator,
            excerpt: raga.sources[0].citation
          }
        ];
      } else if (q.includes('adi tala') || q.includes('tala') || q.includes('laghu')) {
        const tala = VERIFIED_TALAS.find((t) => t.slug === 'adi-tala')!;
        answer = `Adi Tala (Chatusra Jati Triputa Tala) has 8 aksharas structured as one Laghu (4 counts) followed by two Dhrutams (2 counts each): I₄ + O + O. The physical kriyas are: Beat 1 (Clap), Beats 2-4 (Pinky, Ring, Middle finger counts), Beat 5 (Clap), Beat 6 (Wave), Beat 7 (Clap), Beat 8 (Wave).`;
        citations = [
          {
            sourceTitle: tala.sources[0].title,
            author: tala.sources[0].authorOrCreator,
            excerpt: tala.sources[0].citation
          }
        ];
      } else if (q.includes('veena') || q.includes('saraswati')) {
        const inst = VERIFIED_INSTRUMENTS.find((i) => i.slug === 'saraswati-veena')!;
        answer = `The Saraswati Veena is a 24-fret plucked chordophone sculpted from seasoned jackwood. It was codified in Thanjavur during the 17th century by Govinda Dikshitar. Gamakas are produced through lateral string deflection across fixed brass frets set into wax, closely emulating the human voice (gayaki style).`;
        citations = [
          {
            sourceTitle: inst.sources[0].title,
            author: inst.sources[0].authorOrCreator,
            excerpt: inst.sources[0].citation
          }
        ];
      } else if (q.includes('mridangam') || q.includes('karanai')) {
        const inst = VERIFIED_INSTRUMENTS.find((i) => i.slug === 'mridangam')!;
        answer = `The Mridangam is the primary Carnatic double-ended barrel drum. Its right head (valanthalai) contains the "karanai" (a permanent circular paste of iron powder and boiled rice) discovered by Nobel laureate Sir C.V. Raman to generate true harmonic overtones, allowing the drum to be tuned precisely to the vocalist's tonic pitch (Sa).`;
        citations = [
          {
            sourceTitle: inst.sources[0].title,
            author: inst.sources[0].authorOrCreator,
            excerpt: inst.sources[0].citation
          }
        ];
      } else if (q.includes('shruti') || q.includes('tonic') || q.includes('drone')) {
        answer = `Shruti has two meanings: (1) The continuous reference pitch (Adhara Shadjam) provided by the Tambura, and (2) The 22 microtonal intervals within an octave in ancient Indian music theory. In Carnatic concerts, all artists synchronize strictly to one unchanging Shruti throughout the recital.`;
        citations = [
          {
            sourceTitle: 'Natya Shastra (Chapter 28)',
            author: 'Bharata Muni',
            excerpt: 'The 22 Shruti division and acoustic determination.'
          }
        ];
      } else {
        answer = `I do not have sufficient verified musicology documents in the NadaVerse peer-reviewed database to answer this specific inquiry with high authority. To maintain scholarly integrity, I refrain from fabricating speculative details. You may explore our verified records on Mayamalavagowla, Shankarabharanam, Kalyani, Adi Tala, Veena, or Mridangam.`;
        confidence = 'uncertain';
        uncertaintyNote = 'Question outside currently reviewed knowledge corpus. Verified fallback applied.';
      }

      const tutorReply: Message = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: answer,
        citations,
        confidence,
        uncertaintyNote,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, tutorReply]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-dialog-title"
    >
      <div className="bg-[#191916] border border-[#3B392F] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#3B392F] flex items-center justify-between bg-[#11110F]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#22221D] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="tutor-dialog-title" className="text-lg font-serif font-bold text-[#F4EBDD]">
                NadaVerse Grounded AI Tutor
              </h2>
              <span className="text-[11px] text-[#87947A] flex items-center space-x-1 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>Grounded Retrieval · Verifiable Citations</span>
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
                        <span>Verified Citations:</span>
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
              <span>Consulting verified Carnatic musicology sources...</span>
            </div>
          )}
        </div>

        {/* Pedagogical Disclaimer & Input Box */}
        <div className="p-4 border-t border-[#3B392F] bg-[#11110F]">
          <div className="text-[11px] text-[#BDB4A4] mb-3 px-1">
            <strong>Pedagogical Notice:</strong> NadaVerse AI Tutor is an educational reference companion grounded in verified texts. It does not replace the experiential guidance of an authentic Guru.
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
              placeholder="Ask about Mayamalavagowla, Adi Tala, Veena, or Swaras..."
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
