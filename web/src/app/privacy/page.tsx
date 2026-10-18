import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Mic, Lock, Database, RefreshCw, ArrowLeft, Mail, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Sovereign Practice | NadaVerse',
  description: 'Comprehensive privacy policy, microphone local-processing guarantees, and account data deletion lifecycle for NadaVerse.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Sovereignty & Practice Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F4EBDD] tracking-tight">
            Privacy Policy & Data Flow Architecture
          </h1>
          <p className="text-sm sm:text-base text-[#BDB4A4] max-w-3xl leading-relaxed">
            NadaVerse is an open cultural educational platform dedicated to Carnatic musicology.
            We treat your musical sadhana as private artistic practice. This document describes our
            exact data flow, client-side audio processing guarantees, and account deletion lifecycle.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#87947A] pt-2">
            <span>Effective Date: 18 October 2026</span>
            <span>·</span>
            <span>Version: 2.0 (Public Beta)</span>
            <span>·</span>
            <span>Governing Principle: Zero Raw Audio Retention</span>
          </div>
        </div>

        {/* 1. Foundational Commitment */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <HeartHandshake className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              1. Foundational Product Guarantees
            </h2>
          </div>
          <div className="p-5 bg-[#191916] rounded-2xl border border-[#3B392F] space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              <strong className="text-[#F4EBDD]">100% Free Forever:</strong> NadaVerse has zero paywalls, checkout flows, premium tiers, or advertising tracking. Any third-party claiming to sell NadaVerse subscriptions is unauthorized.
            </p>
            <p>
              <strong className="text-[#F4EBDD]">No Commercial Monetization of Student Data:</strong> We will never sell, lease, or license user practice reflections, audio metrics, or account information to data brokers, ad networks, or third-party marketing companies.
            </p>
          </div>
        </section>

        {/* 2. Microphone Audio Processing */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Mic className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              2. Microphone Audio & Zero Raw Audio Retention
            </h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              When you activate the Tuner, Swarasthana Visualizer, or Explainable AI Practice Companion, your device microphone captures sound waves solely for local processing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#14120E] border border-[#C7A45B]/30 rounded-xl space-y-2">
                <span className="text-[#C7A45B] font-mono text-xs font-bold uppercase">What Stays in Your Browser</span>
                <p className="text-xs">
                  Raw PCM audio frames, time-domain autocorrelation waveform buffers, and microphone media streams. These exist only in volatile device RAM and are immediately discarded when recording stops.
                </p>
              </div>
              <div className="p-4 bg-[#14120E] border border-[#3B392F] rounded-xl space-y-2">
                <span className="text-[#87947A] font-mono text-xs font-bold uppercase">What May Reach the Server</span>
                <p className="text-xs">
                  Only user-consented, post-extracted numeric summaries: mean cents deviation, pitch stability index (0–100%), and swarasthana timestamps submitted to <code className="text-[#E0C98F]">/api/v1/audio/analyze-practice</code>.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#87947A]">
              Non-Microphone Fallback: Learners who decline microphone permissions can use the Tanpura drone companion and Tala Studio metronome with complete fidelity.
            </p>
          </div>
        </section>

        {/* 3. AI Gateway & Pedagogical Guidance */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Lock className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              3. AI Practice Companion & Model Disclosures
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              The AI Practice Companion connects to an isolated server-side gateway (Google Gemini with deterministic treatise fallback).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#F4EBDD]">Zero Audio Sent to AI Models:</strong> No raw audio or audio recordings are transmitted to AI providers. Only text queries and numeric summary vectors are analyzed.
              </li>
              <li>
                <strong className="text-[#F4EBDD]">Pedagogical Limitations:</strong> Automated pitch feedback is an acoustic engineering heuristic. It does not replace a qualified human guru, nor can it authoritatively evaluate traditional gamakas, spiritual bhava, or lineage authenticity.
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Accounts, Gurukulam & Deletion */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Database className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              4. User Accounts, Gurukulam & Self-Service Deletion
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              Guest learners can use lessons, Tala Studio, and the composition player without creating an account; progress is retained locally in browser <code className="text-[#E0C98F]">localStorage</code>.
            </p>
            <p>
              For registered students and teachers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#F4EBDD]">Object-Level Isolation:</strong> Teachers can access only their own Gurukulam groups and submissions. Students can view only their own assigned work and direct teacher reviews.
              </li>
              <li>
                <strong className="text-[#F4EBDD]">Self-Service Account Deletion:</strong> You may delete your account at any time via <code className="text-[#E0C98F]">DELETE /api/v1/auth/me</code>. This triggers an automated database cascade removing your session history, bookmarks, lesson progress, group enrollments, assignments, submissions, and feedback.
              </li>
              <li>
                <strong className="text-[#F4EBDD]">Heritage Anonymization:</strong> Scholarly submissions to the heritage archive and musicological corrections are permanently anonymized to preserve academic history without retaining personal identifiable information (PII).
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Offline Storage & Service Worker */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <RefreshCw className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              5. Offline Cache & Service Worker Boundaries
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#BDB4A4] leading-relaxed">
            <p>
              NadaVerse operates a privacy-hardened Service Worker (<code className="text-[#E0C98F]">sw.js</code>) enabling offline practice in low-connectivity concert halls and temples:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All <code className="text-[#E0C98F]">/api/</code> network calls strictly bypass cache and return 503 offline notifications.</li>
              <li>Requests bearing <code className="text-[#E0C98F]">Authorization</code> or <code className="text-[#E0C98F]">Cookie</code> headers are never cached.</li>
              <li>Responses with <code className="text-[#E0C98F]">no-store</code> or <code className="text-[#E0C98F]">private</code> cache-control headers are rejected by the offline cache engine.</li>
              <li>Switching accounts on shared or public devices will never reveal previously cached private learner notes.</li>
            </ul>
          </div>
        </section>

        {/* 6. Contact & Takedown SLA */}
        <section className="space-y-4 border-t border-[#C7A45B]/20 pt-8">
          <div className="flex items-center space-x-2.5 text-[#C7A45B]">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
              6. Privacy Inquiries & Scholarly Contact
            </h2>
          </div>
          <div className="p-5 bg-[#161410] rounded-2xl border border-[#C7A45B]/30 space-y-3 text-xs sm:text-sm text-[#BDB4A4]">
            <p>
              For data access, export requests, security vulnerabilities, or takedown notices under copyright:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#F4EBDD] pt-1">
              <a
                href="mailto:anandbinuarjun@zohomail.eu"
                className="text-[#C7A45B] hover:underline"
              >
                anandbinuarjun@zohomail.eu
              </a>
              <span>·</span>
              <a
                href="mailto:security@abarjun.online"
                className="text-[#C7A45B] hover:underline"
              >
                security@abarjun.online
              </a>
              <span>·</span>
              <span className="text-[#87947A]">Response SLA: 48 hours</span>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
