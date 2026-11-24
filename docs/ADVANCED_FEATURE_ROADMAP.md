# NadaVerse — Master Product Expansion Roadmap

**Document Version:** 2.0.0  
**Base Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)  
**Product Commitment:** 100% Free Forever — Zero paywalls, subscriptions, checkouts, or advertisements.

---

## 1. Priority Tiers & Engineering Sequencing

### P0 — Production Safety, Security & Audio DSP Lifecycle
- **P0.1 — RBAC Enforcement on Editorial Queues:** Enforce `Depends(get_current_editor_or_admin)` on `GET /api/v1/corrections/pending` so ordinary students cannot inspect unreviewed community submissions.
- **P0.2 — HTTP Security & Privacy Header Hardening:** Add `Permissions-Policy`, `Content-Security-Policy`, and production `Strict-Transport-Security` headers to FastAPI middleware.
- **P0.3 — Web Audio Node Lifecycle & Memory Hygiene:** Auto-prune completed scheduled oscillator handles on `osc.onended` in `web/src/lib/audioEngine.ts` and support all 5 Jati/Nadai subdivisions (*Tisra 3, Chatusra 4, Khanda 5, Misra 7, Sankirna 9*).
- **P0.4 — Real-Time Audio Signal Quality & Clipping Diagnostics:** Implement `analyzeSignalQuality` in `web/src/lib/pitchDetector.ts` to compute RMS, peak amplitude, clipping detection, quiet-signal detection, and SNR estimation locally on-device.

### P1 — Core Educational Value Expansion
- **P1.1 — Personalised Learning Dashboard & Guest-to-Account Migration:**
  - Unified dashboard connecting active curriculum progress, daily Sadhana recommendations, weekly goals, favourite ragas/compositions, teacher assignments, and explainable recommendations (explicitly distinguishing lesson completion from musical proficiency).
  - Idempotent `POST /api/v1/me/migrate-guest-state` endpoint to migrate guest `localStorage` progress, bookmarks, and practice sessions into a registered account.
- **P1.2 — Advanced Carnatic Ear Training Academy:**
  - Interactive exercises for Swara identification, interval recognition, ascending/descending phrase recognition, Raga & Prayoga identification, Shruti matching, and Tala recognition.
  - Deterministic client/server scoring, adaptive difficulty, tonic selection, playback speed adjustment, and microphone-free + optional mic modes.
- **P1.3 — Gamaka Laboratory:**
  - Interactive laboratory for classical Carnatic gamakas (*Kampita, Jaru, Nokku, Spurita, Pratyahata, Ravai, Khandippu, Andolita, Odukkal, Orikkai*) cited from *Sangita Sampradaya Pradarsini* (1904) and *Chaturdandi Prakasika*.
  - Real-time reference vs. learner pitch contour canvas, adjustable speed (0.5x–1.0x), looping, signal quality & confidence badges, violin demonstrations, and pathantara disclaimer.
- **P1.4 — Advanced Raga Explorer & 72 Melakarta Chakra Navigator:**
  - Complete 72 Melakarta scheme across all 12 Chakras (*Indu* to *Aditya*) with Katapayadi Sankhya formula verification, Shuddha/Prati Madhyama symmetry pairing, Arohana/Avarohana, Jeeva/Nyasa swaras, and Just Intonation playback.
- **P1.5 — Advanced Tala & Konnakol Academy:**
  - 35 Suladi Sapta Talas (7 families × 5 jatis) + Chapu Talas, 5 Nadai engine (*Tisra, Chatusra, Khanda, Misra, Sankirna*), Korvai & Mora arithmetic builder/validator (`POST /api/v1/tala/validate-korvai`), Konnakol call-and-response, tap-to-beat latency calibration, and JSON pattern import/export.

### P2 — Product Differentiation
- **P2.1 — Interactive Swara Notation Editor & Manodharma Studio:**
  - Visual and keyboard Swara notation authoring with Mandra/Madhya/Tara octaves, akshara durations, gamaka markers, Tala cycle alignment validation, synthesized playback (Vocal, Violin, Neutral), undo/redo, draft autosave, JSON import/export, print view, and BOLA-protected persistence (`/api/v1/notations`).
  - Integrated Manodharma Alapana & Eduppu-aware Kalpana Swara phrase builder with reviewed raga phrase templates and explicit musicological disclaimers.

### P3 — Long-Term Ecosystem Expansion
- **P3.1 — Multi-Script Indic Transliteration & Language Expansion Architecture:** Extensible locale registry supporting English (`en`) and Malayalam (`ml`) with modular hooks for Tamil (`ta`), Telugu (`te`), Kannada (`kn`), and Sanskrit (`sa`).
- **P3.2 — Native Mobile Wrapper Architecture:** After full PWA validation, optional Capacitor/WebView native packaging preserving browser-local audio privacy.
