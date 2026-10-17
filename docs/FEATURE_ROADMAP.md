# NadaVerse — Product Roadmap & Architectural Delivery Brief

**Status:** Living Engineering Brief  
**Platform Policy:** 100% Free & Open-Access (Zero Paywalls, Zero Ads, Zero Monetization)  
**Target Audience:** Beginners, General Public, Students, Practicing Musicians, Teachers, Cultural Researchers

---

## 1. Product Vision & Connected Learning Loop

NadaVerse is structured around a connected, self-reinforcing pedagogical loop:
$$\text{Discover} \longrightarrow \text{Learn} \longrightarrow \text{Listen} \longrightarrow \text{Practise} \longrightarrow \text{Evaluate} \longrightarrow \text{Reflect} \longrightarrow \text{Teach}$$

### Core Non-Negotiables:
1. **100% Free for Everyone:** No subscriptions, paid tiers, paywalls, premium gates, or monetization that restricts learning.
2. **Authentic Musicology:** Rooted in peer-reviewed canonical treatises (*Chaturdandi Prakasika*, *Sangita Ratnakara*, *Sangita Sampradaya Pradarsini*, *Natya Shastra*).
3. **Transparent Acoustic Integrity:** Truthful reporting of pitch detection limits; no claims of automated vocal examination grading or definitive gamaka certification.
4. **Data Sovereignty & Privacy:** All raw audio waveforms stay strictly in client-side memory; zero audio streaming or server retention without explicit informed consent.

---

## 2. Roadmap Phases & Implementation Status

### Phase 1 — Trust, Release Safety & Platform Hardening (COMPLETED)
- [x] **P0.1 Audio Consent:** Explicit opt-in checkbox (`consentGranted = false`); backend Pydantic schema validation rejecting omitted or false consent.
- [x] **P0.2 Truthful Acoustic Labels:** Scoped "Verified" badges to "Treatise-Documented Organology"; centralized autocorrelation in `pitchDetector.ts` with synthetic test suite.
- [x] **P0.3 Practice Session Lifecycle:** Implemented `abandon` endpoint, authoritative `GET /api/v1/practice/summary`, duplicate completion prevention (HTTP 400), and sample data exclusion in exports.
- [x] **P0.4 Reproducible CI & Migrations:** 28 passing pytest tests, 10 synthetic audio pitch tests, strict TypeScript (`tsc --noEmit`), clean ESLint, Next.js 16 Turbopack build, and single Alembic migration head (`95d82f7c0a11`).
- [x] **P1.1 AI Citations Traceability:** Expanded citation schemas with Corpus Record IDs, edition metadata, and verbatim source quotations; added in-app Evidence Inspector.
- [x] **P1.2 Auth & Account Deletion:** Complete cascade deletion across all related user entities with audit-safe pseudonymization.
- [x] **P1.3 & P1.4 Config & Cache Privacy:** API base URL normalization, Service Worker v2 ignoring authenticated requests and isolating offline cache.
- [x] **P1.6 Content Provenance & Takedown:** Published Rights-Gap Checklist, designated contact (`heritage@nadaverse.org`), 48-hour takedown SLA, and database-backed `ContentCorrection` moderation queue.

---

### Phase 2 — Core Practice & Learning Quality (DELIVERED)
- [x] **Daily Sadhana Planner (`DailySadhanaPlanner.tsx`):**
  - Tailored practice plans for 15m, 30m, 45m, and 60m routines across 3 skill levels (Beginner, Student, Practitioner).
  - Deterministic 5-stage progression: Shruti Alignment $\to$ Swaravali Drills $\to$ Tala/Alankaram $\to$ Raga Study $\to$ Reflection.
  - Interactive activity reordering, duration increments (+/- mins), skip/replace actions, and direct integration into active session logging.
- [x] **Practice Playlist Runner (`PracticePlaylistRunner.tsx`):**
  - Ordered practice lists with repetition counters, target Kalam lock (1st/2nd/3rd speed), and target BPM.
  - Preloaded with fundamental warmups and Jantai sphuritam drills.
  - Documented JSON export and import for community and teacher-shared routines.
- [x] **Audio Calibration Wizard (`AudioCalibrationWizard.tsx`):**
  - Guided pre-practice microphone test: input gain level meter, ambient room noise floor baseline assessment, clipping detection, reference sine tone generator, and manual fallback mode.
  - Automatic teardown and release of MediaStream tracks and AudioContexts on unmount.
- [x] **Source & Provenance Inspector (`SourceProvenanceModal.tsx`):**
  - Dedicated transparent inspection modal for ragas, talas, instruments, and treatises.
  - Displays manuscript edition, codifier, historical era, sampradaya variations, and verbatim treatise shlokas with direct "Suggest Edit" integration.
- [x] **Offline Learning Packs Manager (`OfflinePackManager.tsx`):**
  - Modular offline caching for Abhyasa Gana Foundations (~1.2 MB), Raga Mastery (~2.1 MB), Tala Studio (~1.8 MB), and Heritage Archive (~3.4 MB).
  - StorageManager API quota integration, progress indicators, and one-click package removal.

---

### Phase 3 — High-Value Community & Pedagogical Expansion (NEXT)
- [x] **Curated Listening Library (`CuratedListeningLibrary.tsx` + `listeningLibraryData.ts`):**
  - Structured, evidence-based *Kelvi Gnanam* (കേൾവി ജ്ഞാനം) discovery space covering canonical compositions across Geethams, Swarajathis, Varnams, Krithis, and Thillanas.
  - Web Audio API melodic phrase audiation with synchronized swara note visualizer matching the user's selected Adhara Sa.
  - Systematic ear-training prompts (*Kelvi Gnanam*) detailing Jeeva Swaras, gamaka contours, laya/tala eduppus, and structural analysis.
  - Direct studio practice launch, AI tutor integration, and transparent primary treatise source evidence inspection.
  - 100% Free, zero paywalls, CC-BY-SA 4.0 / Public Domain classical heritage.
- [x] **Unified Command Palette (`CommandPalette.tsx`):**
  - Global `Ctrl+K`, `Cmd+K`, and `/` keyboard listener indexing all 72 Melakarta + Janya Ragas, Talas, Instruments, Composers, Lessons, Compositions, and Glossary Terms.
  - Interactive launcher for Tanpura drone toggle, AI tutor queries, Practice Studio jump, Audio Calibration Wizard, Offline Pack Manager, and language switcher.
  - Filter category chips (`#all`, `#ragas`, `#talas`, `#listening`, `#lessons`, `#tools`), recent search history via `localStorage`, and full keyboard navigation.
  - Desktop Navbar trigger pill with `⌘K` micro-badge and mobile drawer search integration.
- [ ] **Advanced Tala Studio Features:**
  - Expanded 108 classical talas database and visual Kriya hand-gesture animations for visual learners.
- [ ] **Multi-Language Audio Pronunciation Audio Clips:**
  - Native spoken pronunciations for Sanskrit, Telugu, Tamil, and Kannada sahitya and raga names by vetted scholars.

---

### Phase 4 — Exploratory Capabilities (DEFERRED P3)
- Automated polyphonic accompaniment separation.
- Real-time multi-user video/audio Gurukulam recitals (deferred until bandwidth and WebRTC infrastructure are funded and privacy safeguards are mature).
