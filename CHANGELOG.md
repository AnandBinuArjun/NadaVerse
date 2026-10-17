# Changelog

All notable changes to the NadaVerse project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta] - 2026-10-17

### Added
- **Curated Listening Library (`CuratedListeningLibrary.tsx` + `listeningLibraryData.ts`):**
  - Structured, evidence-based *Kelvi Gnanam* (കേൾവി ജ്ഞാനം) listening discovery space covering cornerstone forms (Geetham, Swarajathi, Varnam, Krithi, and Thillana).
  - Web Audio API melodic phrase audiation with real-time swara note visualizer synchronized to the user's selected Adhara Sa.
  - Multi-dimensional pedagogical analysis: Jeeva Swara identification, gamaka contours, laya/tala eduppu, and structural highlights.
  - Direct actions: "Practise in Studio" (auto-configures raga & tala), "Ask AI Tutor", and primary treatise evidence inspection.
  - 100% Free, zero paywalls, public domain / CC-BY-SA 4.0 classical heritage.
- **Global Spotlight Command Palette (`CommandPalette.tsx`):**
  - Universal keyboard listener triggering on `Ctrl+K`, `Cmd+K`, or `/`.
  - Instantaneous fuzzy search across all 72 Melakarta + Janya Ragas, Talas, Instruments, Composers, Curriculum Lessons, Compositions, and Glossary Terms.
  - Quick action launcher: Tanpura drone toggle, AI tutor queries, Practice Studio jump, Audio Calibration Wizard, Offline Pack Manager, and bilingual language toggle.
  - Keyboard arrow navigation, enter-to-select, escape-to-close, category chips (`#all`, `#ragas`, `#talas`, `#listening`, `#lessons`, `#tools`), and recent search memory via `localStorage`.
  - Desktop Navbar trigger pill with `⌘K` micro-badge and mobile drawer search integration.
- **Daily Sadhana Planner (`DailySadhanaPlanner.tsx`):**
  - Configurable daily practice routines for 15, 30, 45, and 60 minutes across Beginner, Student, and Practitioner levels.
  - Deterministic 5-step sequence: Shruti Alignment $\to$ Swaravali Drills $\to$ Tala/Alankaram $\to$ Raga Study $\to$ Reflection.
  - Drag-and-drop / up-down activity reordering, duration increments (+/- minutes), and direct integration with session logging.
- **Practice Playlist Runner (`PracticePlaylistRunner.tsx`):**
  - Sequenced practice playlists with loop repetitions, target Kalam lock, target BPM, and swara notation.
  - Preloaded with 15-minute fundamental warmups and Jantai sphuritam drills.
  - Documented JSON export and import for student practice routines.
- **Audio Calibration Wizard (`AudioCalibrationWizard.tsx`):**
  - Guided pre-practice microphone diagnostic measuring input gain level, ambient room noise floor, and clipping warnings.
  - User-configurable Adhara Shadjam (Tonic pitch) with sine tone reference generator.
  - Manual fallback mode when microphone access is denied.
- **Source & Provenance Inspector (`SourceProvenanceModal.tsx`):**
  - Transparent manuscript metadata modal for ragas, talas, instruments, and treatises.
  - Displays codifier, historical era, critical edition/page, sampradaya lineage variations, and verbatim treatise shlokas.
  - One-click integration with the peer-review edit submission queue (`SuggestCorrectionModal`).
- **Offline Learning Packs Manager (`OfflinePackManager.tsx`):**
  - Modular offline package downloader for Abhyasa Gana Foundations, Raga Mastery, Tala Studio, and Heritage Archive.
  - Browser StorageManager quota display and clean package uninstallation.
- **Peer-Reviewed Content Corrections Queue:**
  - Added `ContentCorrection` SQLAlchemy model and API endpoints (`POST /api/v1/corrections`, `GET /api/v1/corrections/pending`, `POST /api/v1/corrections/{id}/review`).
- **Synthetic Pitch Detection Test Suite (`web/scripts/test-pitch.mjs`):**
  - 10 automated test cases evaluating autocorrelation pitch detection across 8 Carnatic swaras in Just Intonation ($\le 0.1$ cents error), silence threshold rejection, and noise rejection.
- **Single Head Alembic Migration:**
  - Codified migration revision `95d82f7c0a11` covering all 6 feature tables (`learning_groups`, `group_members`, `group_invitations`, `assignments`, `assignment_submissions`, `assignment_feedback`, `heritage_entries`, `content_corrections`) and session lifecycle columns.

- **Mobile Browser Audio Resilience & Lifecycle Auto-Recovery (`audioEngine.ts` & `audioKeepAlive.ts`):**
  - Resolved mobile browser audio silence occurring when returning to un-refreshed tabs on iOS Safari and Android Chrome.
  - Implemented global one-time hardware bus touch unlocker playing an inaudible 1-sample buffer on first user gesture.
  - Added lifecycle listeners (`visibilitychange`, `pageshow`, `focus`) with automatic context recovery for `suspended` and WebKit `interrupted` states.
  - Clamped Tala scheduler lookahead on app foregrounding to eliminate drift spikes and main-thread freezes.
  - Awaited context un-suspension before scheduling gain ramps in Tanpura, Tala, and Swara note synthesis.
- **Audio Consent Enforcement:**
  - `ExplainablePracticeCompanion.tsx` initializes consent to `false`. MediaStream and AudioContext instantiation strictly prevented until user opt-in.
  - `backend/app/schemas/audio_practice.py` enforces mandatory `user_consent_granted: bool`.
- **Acoustic Trust & Labels:**
  - Removed unqualified "Verified" claims; scoped to `"Treatise-Documented Organology"` and `"Canonical Learning Raga"`.
  - Surfaced local heuristic fallback provenance (`local_heuristic_estimate`) and separated measured vs inferred metrics.
- **Practice Session Lifecycle:**
  - Added `PATCH /api/v1/practice/sessions/{id}/abandon` to cancel abandoned sessions and zero duration.
  - Added `GET /api/v1/practice/summary` providing authoritative completed sessions, minutes, 7-day volume, and streaks with UTC timezone safety.
  - `SadhanaTracker.tsx` CSV/JSON exports now strictly filter out demo records (`!s.isDemo`).
- **Traceable AI Citations:**
  - AI Gateway responses now trace citations to Corpus Record IDs, primary edition, and verbatim quotes.
  - Collapsible Evidence Inspector drawer integrated into `TutorModal.tsx`.
- **API URL Sanitization:**
  - Updated `web/src/lib/api.ts` with `resolveApiBaseUrl()` to prevent trailing slash and `/api/v1` duplication, defaulting safely to window origin in production.
- **Service Worker Cache Security:**
  - Bumped cache to `nadaverse-cache-v2`, strictly ignore requests with `Authorization` headers, bypass all `/api/` endpoints with 503 offline JSON.
- **Account Deletion Cascade:**
  - Deletion cascades across all bookmarks, progress, sessions, assignments, and submissions, and anonymizes author identity in public heritage records and corrections.
- **Updated Contact Email:**
  - Updated community and accessibility email to `anandbinuarjun@zohomail.eu`.

### Security
- Verified trusted-proxy token-bucket rate limiter with rightmost untrusted hop extraction.
- Unicode NFKC normalization and prompt injection guardrails active on AI gateway endpoints.
- Strict cross-user authorization tests on Gurukulam teacher/student classes.
