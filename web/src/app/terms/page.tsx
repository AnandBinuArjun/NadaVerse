import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { BookOpen, Shield, Scale, AlertTriangle, Copyright, ArrowLeft, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use & Cultural Governance | NadaVerse',
  description: 'Terms of service, educational limitations, copyright governance, and acceptable use policy for NadaVerse.',
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#11110F] text-[#F4EBDD] font-sans selection:bg-[#C7A45B]/30 selection:text-[#F4EBDD]">
      {/* Top Header */}
      <header className="border-b border-[#C7A45B]/20 bg-[#0c0b09]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C7A45B]/60 bg-[#161410] flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="NadaVerse Emblem"
                width={32}
                height={32}
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <span className="font-serif font-bold text-base bg-gradient-to-r from-[#F4EBDD] to-[#C7A45B] bg-clip-text text-transparent">
              NadaVerse
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C7A45B] hover:text-[#E0C98F] px-3 py-1.5 rounded-lg border border-[#3B392F] hover:border-[#C7A45B]/40 bg-[#191916] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Title Banner */}
        <div className="space-y-4 border-b border-[#C7A45B]/20 pb-8">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#C7A45B] bg-[#191916] px-3.5 py-1.5 rounded-full border border-[#3B392F]">
            <Scale className="w-3.5 h-3.5" />
            <span>Educational Terms & Cultural Stewardship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F4EBDD] tracking-tight">
            Terms of Use & Musicological Governance
          </h1>
          <p className="text-sm sm:text-base text-[#BDB4A4] max-w-3xl leading-relaxed">
            Welcome to NadaVerse. By accessing our learning pathways, practicing with the Tala Studio,
            exploring classical compositions, or joining a Gurukulam, you agree to these educational terms.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#87947A] pt-2">
            <span>Effective Date: 18 October 2026</span>
            <span>·</span>
            <span>Version: 2.0 (Public Beta)</span>
            <span>·</span>
            <span>Status: 100% Free Forever</span>
          </div>
        </div>

        {/* 1. Educational Non-Commercial Nature */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              1. Non-Commercial Mission & Free Access
            </h2>
          </div>
          <div className="p-5 bg-[#191916] rounded-2xl border border-[#3B392F] space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              NadaVerse is dedicated to preserving and making accessible the oral, theoretical, and microtonal traditions of South Indian classical music.
            </p>
            <p>
              The platform is completely free forever. You will never be asked to enter credit card details, subscribe to premium tiers, or view third-party commercial advertisements.
            </p>
          </div>
        </section>

        {/* 2. Educational & Musicological Limitations */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              2. Pedagogical Limitations & AI Advisory
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              <strong className="text-[#F4EBDD]">Practice Aids Only:</strong> The pitch analysis contours, cent deviation counters, and stability metrics are engineering heuristics designed for solo vocal calibration and ear training.
            </p>
            <p>
              <strong className="text-[#F4EBDD]">No Replacement for a Guru:</strong> Classical Carnatic music is an oral tradition requiring direct human transmission (*Guru-Shishya Parampara*). NadaVerse does not claim to replace qualified teachers, nor does automated scoring constitute an examination certificate or verdict on traditional aesthetic expression (*Bhava*).
            </p>
            <p>
              <strong className="text-[#F4EBDD]">Synthetic Audio Approximations:</strong> The synthesized instrument timbres (Veena, Flute, Mridangam, Violin) and Tanpura drones are algorithmic Web Audio models intended as practice references, not definitive commercial master recordings.
            </p>
          </div>
        </section>

        {/* 3. Acceptable Use & Classroom Safety */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              3. Acceptable Use & Community Safety
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              To maintain a supportive and dignified sanctuary for all musicians:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You agree not to upload abusive, defamatory, harassing, or sexually explicit content in student submissions or practice notes.</li>
              <li>You agree not to attempt to reverse engineer, inject adversarial prompts into the AI gateway, or launch Denial-of-Service attacks against public endpoints.</li>
              <li>Teachers using Gurukulam with minor students are responsible for maintaining respectful, professional educational boundaries.</li>
            </ul>
          </div>
        </section>

        {/* 4. Intellectual Property & Rights Boundaries */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Copyright className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              4. Intellectual Property & Licensing Boundaries
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#14120E] border border-[#C7A45B]/30 rounded-xl space-y-2">
                <span className="text-[#C7A45B] font-mono text-xs font-bold uppercase">Software Code (MIT)</span>
                <p className="text-xs">
                  All source code, algorithms, React components, and synthesis engines are licensed under the permissive <Link href="/LICENSE" className="text-[#E0C98F] underline">MIT License</Link>.
                </p>
              </div>
              <div className="p-4 bg-[#14120E] border border-[#3B392F] rounded-xl space-y-2">
                <span className="text-[#87947A] font-mono text-xs font-bold uppercase">Educational Content (CC-BY-SA 4.0)</span>
                <p className="text-xs">
                  Original lesson curricula, raga profiles, treatises summaries, and organology guides are licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-[#E0C98F] underline">CC-BY-SA 4.0</a>.
                </p>
              </div>
            </div>
            <p className="text-xs">
              <strong className="text-[#F4EBDD]">Classical Heritage Compositions:</strong> All root sahitya and swara structures cataloged in the Playable Composition Studio are pre-1923 classical compositions verified as public domain heritage (*Sangita Sampradaya Pradarsini*, *Chaturdandi Prakasika*, *Kriti Mani Malai*).
            </p>
          </div>
        </section>

        {/* 5. Takedowns & Notice Procedure */}
        <section className="space-y-4 border-t border-[#C7A45B]/20 pt-8">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              5. Copyright Notices & Scholarly Corrections
            </h2>
          </div>
          <div className="p-5 bg-[#161410] rounded-2xl border border-[#C7A45B]/30 space-y-3 text-xs sm:text-sm text-[#BDB4A4]">
            <p>
              If you believe any text, notation edition, or translation on NadaVerse infringes copyright or misrepresents a specific lineage tradition, please contact our editorial review board:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#F4EBDD] pt-1">
              <a
                href="mailto:anandbinuarjun@zohomail.eu"
                className="text-[#C7A45B] hover:underline"
              >
                anandbinuarjun@zohomail.eu
              </a>
              <span>·</span>
              <span className="text-[#87947A]">Action Timeline: 48-Hour Takedown / Quarantine SLA</span>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
