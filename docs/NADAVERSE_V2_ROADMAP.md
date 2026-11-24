# NadaVerse 2.0 — Phased Engineering Roadmap (Phases A–G)

**Document Version:** 2.0.0  
**Base Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)  

---

## Phase A — Foundation, Security & Audio DSP Hygiene (`COMPLETE`)
- **A.1:** Repository baseline audit, P0 HTTP security headers (`CSP`, `Permissions-Policy`, `HSTS`), and RBAC enforcement on `GET /api/v1/corrections/pending`.
- **A.2:** Web Audio oscillator lifecycle auto-pruning (`osc.onended`), 5-Nadai lookahead rhythmic scheduler (`tisra`, `chatusra`, `khanda`, `misra`, `sankirna`), and on-device `analyzeSignalQuality` diagnostics.
- **A.3:** Universal responsive layout (`320px` mobile to `2560px` ultrawide) and Tailwind CSS v4 build integration on Next.js `16.4.6`.

## Phase B — Professional Musician & Stage Tools (`COMPLETE`)
- **B.1:** Interactive Swara Notation Editor & Manodharma Phrase Studio with Tala cycle alignment validation and BOLA-protected persistence (`/api/v1/notations`).
- **B.2:** **Kutcheri Concert Planner** — Build concert programmes with optional traditional structure suggestions, duration calculation, rehearsal checklist, accompanist notes, print-friendly programme, and JSON setlist export.
- **B.3:** **Live Performance Mode** — Distraction-free full-screen stage interface with Dark/Light reading modes, large typography, current/upcoming piece, stage timer, Shruti reference, and Screen Wake Lock API integration.
- **B.4:** **Virtual Carnatic Ensemble & Intelligent Accompaniment Mixer** — Multi-instrument synthesized practice mixer (Tanpura, Veena/Violin, Mridangam, Ghatam, Kanjira) with Mute/Solo, volume controls, and Eduppu offset.
- **B.5:** **Digital Music Notebook & Repertoire Manager** — Repertoire status tracking (`learning`, `practising`, `performance_ready`, `revision_required`) and tagged musician notebook.

## Phase C — Musical Intelligence & MIR Lab (`COMPLETE`)
- **C.1:** **Modular Music Information Retrieval Engine (`web/src/lib/mirEngine.ts`)** — F0 & harmonic partial extraction, spectral centroid, pitch stability index, swara candidate ranking, and monophonic note onset segmentation.
- **C.2:** **Interactive Musical Spectrogram Lab** — Real-time waveform, FFT spectrum, scrolling spectrogram canvas, harmonic partial meters, SNR/clipping indicators, accessible numerical readout table, and JSON export.
- **C.3:** **Automatic Monophonic Swara Transcription Lab** — Vocal and violin monophonic pitch-to-swara transcription with configurable Adhara Sa, editable swara tokens, confidence badges, and notation export.
- **C.4:** **Experimental AI/MIR Raga Recognition Lab** — Swara distribution + characteristic prayoga phrase matching with ranked candidate ragas, confidence explanations, unknown-raga rejection, and explicit `[EXPERIMENTAL]` research disclosures.

## Phase D — Research, Knowledge Graph & Multilingual Dictionary (`COMPLETE`)
- **D.1:** **72 Melakarta Universe & 12 Chakras** — Complete 72 Melakarta catalog with Katapayadi verification and M1/M2 symmetry pairing.
- **D.2:** **Carnatic Knowledge Graph Explorer** — Provenance-backed relationship graph connecting Ragas, Melakartas, Janya Ragas, Composers, Compositions, Talas, Instruments, and Treatises with accessible list view and JSON export.
- **D.3:** **Musical Phrase Search Engine** — Deterministic swara-sequence search across compositions and raga prayogas (`/api/v1/public/phrase-search`).
- **D.4:** **Comparative Music Theory Lab** — Structured comparison across Carnatic, Hindustani, and Western Classical concepts with scholarly non-equivalence disclaimers.
- **D.5:** **Multilingual Carnatic Music Dictionary (6 Languages)** — Reviewed terminology in English, Malayalam, Tamil, Telugu, Kannada, and Sanskrit.

## Phase E — Education, Ear Training & Completion Certificates (`COMPLETE`)
- **E.1:** Personalised Learning Dashboard, Progressive Experience Mode switcher (`Beginner`, `Standard`, `Advanced Musician`, `Research`), and Guest-to-Account migration.
- **E.2:** Advanced Carnatic Ear Training & Musical Memory Academy.
- **E.3:** Non-Accredited Educational Course Completion Certificate Generator with opt-in verification metadata and print/PDF view.

## Phase F — Open Developer API & Embeddable Widgets (`COMPLETE`)
- **F.1:** Open Developer API (`/api/v1/public/ragas`, `talas`, `composers`, `instruments`, `glossary`, `compositions`, `relationships`, `phrase-search`) with pagination, filtering, licensing metadata, and zero private user data exposure.
- **F.2:** Embeddable Music Widget configuration generator with click-to-play policy and zero tracking.

## Phase G — High-Risk Experimental Collaborative Features (`DEFERRED`)
- **G.1:** Real-time internet ensemble jamming in Virtual Practice Rooms and Public Musician Directory are safely deferred until network latency/jitter validation and human moderation infrastructure gates are met.
