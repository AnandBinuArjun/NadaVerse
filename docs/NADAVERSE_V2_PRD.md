# NadaVerse 2.0 — Product Requirements Document & Comprehensive System Audit

**Document Version:** 2.0.0  
**Audit & Baseline Date:** 24 November 2026  
**Audited Git Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)  
**Repository:** [https://github.com/AnandBinuArjun/NadaVerse](https://github.com/AnandBinuArjun/NadaVerse)  
**Production Target:** [https://nadaverse.abarjun.online/](https://nadaverse.abarjun.online/)  
**Non-Negotiable Guarantee:** 100% Free Forever — Zero subscriptions, paywalls, paid API tiers, or advertisements.

---

## 1. Actual Current Repository SHA & Baseline Inventory

- **Git Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)
- **Alembic Migration Single Head:** `95d82f7c0a11`
- **Frontend Stack:** Next.js 16.4.6 (App Router) + React 19.3.1 + TypeScript 5 + Tailwind CSS 4 + Web Audio API
- **Backend Stack:** Python 3.12 + FastAPI + SQLAlchemy 2.1 (Async) + SQLite/PostgreSQL
- **Baseline Automated Verification:** 166/166 automated checks passing (42 backend pytest tests, 60 composition schema checks, 11 pitch & signal quality checks, 19 multi-register acoustic benchmarks, 13 service worker privacy invariants, 21 E2E smoke invariants).

---

## 2. Existing & New Feature Classification Matrix (Section 4 & Section 44.2–44.3)

Every capability across NadaVerse 1.x and the NadaVerse 2.0 specification is classified using the required taxonomy:
`IMPLEMENTED` | `PARTIALLY_IMPLEMENTED` | `MISSING` | `NEEDS_IMPROVEMENT` | `REQUIRES_RESEARCH` | `REQUIRES_EXPERT_REVIEW` | `BLOCKED`.

| Sec | Feature / Subsystem | Baseline Status | V2 Target Status | Technical Feasibility | Educational / Musical Value | Notes & Provenance Requirements |
|---|---|---|---|---|---|---|
| **1–4** | Core Curriculum, Sadhana Planner, Personalised Dashboard, Guest Migration | `IMPLEMENTED` | `IMPLEMENTED` | High | Critical (Beginners–Advanced) | Activity-grounded recommendations; lesson completion explicitly distinguished from musical proficiency. |
| **5** | **Music Information Retrieval (MIR) Engine** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High (Browser-Local DSP) | High | Extend time-domain autocorrelation with harmonic partial extraction, onset segmentation, swara candidate ranking, and confidence scores (`web/src/lib/mirEngine.ts`). |
| **6** | **Experimental AI/MIR Raga Recognition** | `REQUIRES_RESEARCH` | `IMPLEMENTED` (Experimental Lab) | Medium–High (Deterministic Prayoga + Swara N-gram) | High | Must never identify ragas solely by scale; uses swara distribution + characteristic prayoga matching + unknown-raga rejection; labeled `[EXPERIMENTAL]`. |
| **7** | **Automatic Monophonic Swara Transcription** | `MISSING` | `IMPLEMENTED` | High (Monophonic Vocal/Violin) | High | Browser-local monophonic pitch-to-swara segmentation with configurable Adhara Sa, editable swara cells, confidence badges, and polyphonic/noise warnings. |
| **8** | **Interactive Musical Spectrogram Lab** | `MISSING` | `IMPLEMENTED` | High (Web Audio AnalyserNode + Canvas) | High | Real-time waveform, FFT spectrum, scrolling spectrogram, harmonic bars, SNR/clipping metrics, accessible numerical readout table, and JSON export. |
| **9–10** | **Intelligent Accompaniment & Virtual Carnatic Ensemble** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High (Web Audio Synthesis Mixer) | High | Multi-instrument mixer (Tanpura, Mridangam, Ghatam, Kanjira, Lead Veena/Violin) with individual volume, Mute/Solo, Eduppu offset, and honest synthesis notice. |
| **11** | **Kutcheri Planner (Concert Setlist Workspace)** | `MISSING` | `IMPLEMENTED` | High | High (Performers & Teachers) | Concert creation, traditional structure suggestions (100% overridable), duration estimator, accompanist notes, print-friendly programme, JSON export. |
| **12** | **Live Performance Mode (Stage Reader)** | `MISSING` | `IMPLEMENTED` | High (Wake Lock API + Stage UI) | High (Performing Musicians) | Distraction-free full-screen notation, Dark/Light reading modes, current/upcoming piece, stage timer, Shruti reference, Wake Lock with manual fallback. |
| **13–14** | **Professional Repertoire Manager & Digital Music Notebook** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High | High | Repertoire status tiers (`learning`, `practising`, `performance_ready`, `revision_required`), custom tags, notebook entries, local autosave & JSON export. |
| **15–17** | **Multi-Track Practice, Accompaniment Trainer & Memory Trainer** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High | High | Call-and-response phrase memory & accompaniment continuation drills with deterministic scoring and non-microphone notation input options. |
| **18** | **Carnatic Knowledge Graph** | `MISSING` | `IMPLEMENTED` | High (In-Memory / Relational Provenance Graph) | High (Researchers & Students) | Connects Ragas, 72 Melakartas, Janya Ragas, Composers, Compositions, Talas, Instruments, and Treatises with accessible list view & JSON export. |
| **19** | **Interactive Melakarta Universe (72 Melakartas & 12 Chakras)** | `IMPLEMENTED` | `IMPLEMENTED` | High | Critical | All 72 Melakartas across 12 Chakras with Katapayadi verification, M1/M2 symmetry pairing, and Just Intonation playback (`MelakartaChakraExplorer.tsx`). |
| **20** | **Musical Phrase Search Engine** | `MISSING` | `IMPLEMENTED` | High (Deterministic Swara Substring & Transposition Search) | High | Search compositions and raga prayogas by swara sequence (e.g. `G3 P D2 S`, `S R1 G3 M1 P`), raga, tala, or composer with highlighted matches. |
| **21** | **Comparative Music Theory Lab** | `MISSING` | `IMPLEMENTED` | High | Medium–High | Compares Carnatic, Hindustani, and Western Classical concepts (Swara/Note, Shruti/Intonation, Raga/Mode, Tala/Meter, Gamaka/Ornament) with scholarly disclaimers. |
| **22–23** | **Music Research Workspace & Archival Manuscript Library** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High | High (Musicologists) | Research project notes, treatise bibliography generator, CSV/JSON export, and rights-cleared archival treatise metadata. |
| **24** | **Multilingual Music Dictionary (6 Languages)** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` (`REQUIRES_EXPERT_REVIEW` for expansions) | High | High | Reviewed Carnatic terminology across **English, Malayalam, Tamil, Telugu, Kannada, and Sanskrit** with transliteration, pronunciation, and citations. |
| **25–27** | **Curriculum Builder, Assessment Engine & Completion Certificates** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High | High | Structured assessments and non-accredited educational completion certificates with learner-chosen display name, unique ID, and printable view. |
| **32** | **Open Developer API (`/api/v1/public/...`)** | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | High (FastAPI Versioned Public Router) | High (Developers & Researchers) | Versioned, paginated, rate-limited, attribution-tagged public endpoints (`/api/v1/public/ragas`, `talas`, `composers`, `instruments`, `glossary`, `compositions`, `relationships`, `phrase-search`). |
| **33** | **Embeddable Music Widgets** | `MISSING` | `IMPLEMENTED` | High | Medium | Configurable embeddable widget preview & iframe snippet generator with strict CSP, zero tracking, and click-to-play audio policy. |
| **28, 30** | **Public Musician Directory & Live Internet Jam Rooms (Phase G)** | `DEFERRED` | `DEFERRED` (Phase G Gate) | Low–Medium (Network Jitter & Moderation Risk) | Medium | Intentionally deferred per Section 28, 30 & 41 until moderation, abuse reporting, and low-latency privacy infrastructure gates are formally approved. |

---

## 3. Security & Privacy Risk Matrix (Section 39 & Section 44.6)

| Threat / Risk Vector | Severity | Mitigation & Control Implemented in NadaVerse 2.0 |
|---|---|---|
| **Raw Microphone Audio Exfiltration** | Critical | **Zero Raw Audio Upload:** All MIR pitch tracking, spectrogram FFT, monophonic swara transcription, and experimental raga recognition run 100% inside the browser via Web Audio API. Raw audio never leaves the device. |
| **Broken Object-Level Authorization (BOLA / IDOR)** | High | Strict owner checks on `/api/v1/notations/{id}`, `/api/v1/kutcheri/plans/{id}`, `/api/v1/practice/sessions/{id}`, and `/api/v1/me/export`. Cross-user access returns `403 Forbidden` or `404 Not Found`. |
| **Broken Function-Level Authorization (BFLA)** | High | Editorial review queues (`GET /api/v1/corrections/pending`, `GET /api/v1/heritage/editorial/pending`, `POST /api/v1/corrections/{id}/review`) enforce `Depends(get_current_editor_or_admin)`. |
| **Public Developer API Data Leakage** | High | `/api/v1/public/*` endpoints read exclusively from static, rights-cleared musicological corpora (`VERIFIED_*_DATA` and `MELAKARTA_72_CATALOG`) and never query user tables. |
| **Untrusted JSON Import (XSS / Prototype Pollution)** | Medium | Imported notation, korvai, and kutcheri JSON files are validated against strict allowlisted schemas and rendered via React escaped text nodes (never `dangerouslySetInnerHTML`). |

---

## 4. First Ten Implementation Milestones (Section 44.13)

1. **Milestone 1 (Phase A):** Baseline audit, P0 security header hardening (`CSP`, `Permissions-Policy`), editorial queue RBAC fix, and Tailwind CSS v4 Webpack build pipeline fix. *(Completed)*
2. **Milestone 2 (Phase A):** AudioEngine oscillator `onended` memory cleanup, 5-Nadai scheduler (`tisra`, `chatusra`, `khanda`, `misra`, `sankirna`), and `analyzeSignalQuality` clipping/SNR diagnostics. *(Completed)*
3. **Milestone 3 (Phase A/E):** Personalised Learning Dashboard (`PersonalisedLearningDashboard.tsx`), Progressive Experience Mode switcher (`Beginner`, `Standard`, `Advanced Musician`, `Research`), and Guest-to-Account migration (`POST /api/v1/me/migrate-guest-state`). *(Completed)*
4. **Milestone 4 (Phase E):** Advanced Carnatic Ear Training Academy (`EarTrainingAcademy.tsx`) & Musical Memory Trainer. *(Completed)*
5. **Milestone 5 (Phase C):** Gamaka Laboratory (`GamakaLaboratory.tsx`) with Dasavidha Gamaka reference contours and real-time learner overlay. *(Completed)*
6. **Milestone 6 (Phase D):** Interactive Melakarta Universe (`MelakartaChakraExplorer.tsx`) & 35 Suladi Sapta Tala / Konnakol Korvai Studio (`KonnakolAcademy.tsx`). *(Completed)*
7. **Milestone 7 (Phase B):** Interactive Swara Notation Editor & Manodharma Studio (`SwaraNotationEditor.tsx`) with BOLA-protected persistence (`/api/v1/notations`). *(Completed)*
8. **Milestone 8 (Phase C):** Modular Music Information Retrieval Engine (`web/src/lib/mirEngine.ts`) & Musical Intelligence Lab (`MusicalIntelligenceLab.tsx`: Real-Time Spectrogram Lab, Monophonic Swara Transcription Lab, and Experimental Raga Recognition Lab). *(In Progress — Implementing Now)*
9. **Milestone 9 (Phase B):** Kutcheri Concert Planner, Distraction-Free Live Performance Stage Mode, Virtual Carnatic Ensemble Mixer, and Digital Music Notebook (`KutcheriAndPerformanceStudio.tsx`). *(In Progress — Implementing Now)*
10. **Milestone 10 (Phase D/F):** Carnatic Knowledge Graph, Musical Phrase Search Engine, Comparative Music Theory Lab, 6-Language Music Dictionary, Non-Accredited Completion Certificates, and Open Developer API (`/api/v1/public/*` + `ResearchAndKnowledgeHub.tsx`). *(In Progress — Implementing Now)*

---

## 5. Features Requiring Expert Review, Research Datasets, or Deferral (Section 44.14–44.16)

- **Features Requiring Ongoing Expert Musical Review (`REQUIRES_EXPERT_REVIEW`):**
  1. Pathantara variations in Dasavidha Gamaka pitch contours across vocal and instrumental lineages (banis).
  2. Technical musical translations across Tamil, Telugu, Kannada, Malayalam, and Sanskrit in the Multilingual Music Dictionary.
  3. Janya raga vakra prayoga classifications where historical treatises (*Chaturdandi Prakasika* vs. *Sangraha Chudamani*) document distinct sampradayas.
- **Features Requiring Licensed Research Datasets (`REQUIRES_RESEARCH`):**
  1. Neural/ML Raga Recognition across diverse room acoustics, polyphonic concert recordings, and multiple performers (currently implemented as a transparent, deterministic Swara + Prayoga N-gram Research Lab labeled `[EXPERIMENTAL]`).
  2. Polyphonic ensemble source separation and automatic mridangam stroke transcription.
- **Features Deferred to Phase G (`DEFERRED`):**
  1. Real-time low-latency internet ensemble jamming in Virtual Practice Rooms (blocked by public internet jitter > 30ms and audio transmission privacy review).
  2. Public Musician Directory with user-submitted contact profiles (deferred until automated + human abuse moderation workflows are operational).
