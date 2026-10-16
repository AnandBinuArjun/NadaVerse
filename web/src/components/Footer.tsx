'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11110F] border-t border-[#3B392F] text-[#BDB4A4] text-xs pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3B392F]">
          {/* Col 1: Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-[#F4EBDD]">
              <div className="w-7 h-7 rounded-full bg-[#191916] border border-[#C7A45B] flex items-center justify-center text-[#C7A45B] font-serif font-bold text-sm">
                N
              </div>
              <span className="font-serif font-bold text-base tracking-wide">NadaVerse</span>
            </div>
            <p className="leading-relaxed text-[13px]">
              An accessible, trustworthy digital sanctuary for Carnatic music. Free for all learners, educators, and musicians worldwide. No paywalls, no subscriptions.
            </p>
          </div>

          {/* Col 2: Treatises & Provenance */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              Foundational Treatises
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>Sangita Ratnakara (Sarangadeva)</li>
              <li>Chaturdandi Prakasika (Venkatamakhin)</li>
              <li>Sangita Sampradaya Pradarsini (Subbarama Dikshitar)</li>
              <li>South Indian Music Series (Prof. P. Sambamoorthy)</li>
            </ul>
          </div>

          {/* Col 3: Ethical AI & Privacy */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              Ethical Architecture
            </h4>
            <p className="text-xs leading-relaxed">
              Private recordings remain strictly private and are never used for AI model training. Our AI tutor retrieves answers only from peer-reviewed musicology sources and explicitly reports uncertainties.
            </p>
          </div>

          {/* Col 4: Community & Corrections */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-[#F4EBDD] text-sm tracking-wide">
              Editorial Integrity
            </h4>
            <p className="text-xs leading-relaxed">
              If you identify any discrepancy in raga lakshana, tala angas, or attribution, contact our musicology board for immediate review and errata publication.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 text-[#C7A45B] font-mono text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WCAG 2.2 AA Target Compliant</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#BDB4A4]/80 gap-3">
          <div>
            © 2026 NadaVerse Foundation. Preserving and illuminating classical heritage.
          </div>
          <div className="flex items-center space-x-4">
            <span>Privacy by Design</span>
            <span>·</span>
            <span>Accessibility First</span>
            <span>·</span>
            <span>Completely Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
