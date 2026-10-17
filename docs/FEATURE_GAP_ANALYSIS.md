# NadaVerse — Feature Gap Analysis & Codebase Audit

**Date:** 17 October 2026  
**Repository:** [AnandBinuArjun/NadaVerse](https://github.com/AnandBinuArjun/NadaVerse)  
**Analysis Type:** Codebase Inspection & Roadmap Gap Classification  
**Guiding Constraint:** 100% Free Platform (Zero paywalls, tiers, ads, or monetization restrictions)

---

## 1. Classification Methodology

In accordance with the NadaVerse Product Roadmap Brief, every proposed capability has been mapped against existing repository code and classified into one of four statuses:
- **`EXISTS`**: Implemented, verified in code, and backed by automated tests.
- **`PARTIAL`**: Present in the codebase but incomplete, missing key user workflows, or lacking comprehensive edge-case handling.
- **`MISSING`**: Not implemented in the current branch.
- **`NEEDS_VALIDATION`**: Implementation exists but requires live production/external environment verification (e.g., real-device microphone permissions, live domain TLS).

---

## 2. Feature & Architectural Gap Inventory

| Feature / Capability | Roadmap Priority | Status | Evidence (Code & Tests) | User Impact & Risk | Proposed Enhancement | Acceptance Criteria | Dependencies |
|---|---|---|---|---|---|---|---|
| **Audio Consent & Local Processing** | P0 | `EXISTS` | `ExplainablePracticeCompanion.tsx` (consent defaults to false); `audio_practice.py` (mandatory boolean schema); `test_beta_readiness.py` (`test_audio_practice_consent_enforcement_and_metrics_separation`). | Eliminates privacy violations and unauthorized audio capture. Zero risk of remote eavesdropping. | Retain current strict opt-in pattern; integrate with Audio Calibration Wizard. | No Web Audio context or stream without explicit user consent; omitted consent returns 422. | Web Audio API |
| **Acoustic Assessment Labels & Trust** | P0 | `EXISTS` | `pitchDetector.ts` (centralized autocorrelation + synthetic test); `InstrumentCard.tsx` ("Treatise-Documented Organology"); `test-pitch.mjs` (10 passing tests). | Prevents misleading "verified" or "exam-certified" grading claims. High trust. | Maintain truthful local heuristic fallback labels. | All confidence labels accurately disclose algorithmic provenance; no automated examination grading claimed. | None |
| **Practice Session Lifecycle & Summary** | P0/P1 | `EXISTS` | `backend/app/main.py` (PATCH `/complete`, PATCH `/abandon`, GET `/summary`); `SadhanaTracker.tsx` (demo filtering in CSV/JSON exports); `test_practice_session_lifecycle_and_duration_accuracy`. | Ensures logged practice reflects real elapsed practice time; avoids inflated streaks or sample data leakage. | Connect to Daily Sadhana Planner to schedule planned sessions. | Sessions track actual duration; abandoned sessions zero duration; export excludes demo records. | SQLite / PostgreSQL |
| **Traceable AI Citations & Evidence** | P1 | `EXISTS` | `ai_gateway.py` (record IDs, edition, quote); `TutorModal.tsx` (collapsible Evidence Inspector); `SuggestCorrectionModal.tsx`; `test_ai_citations_source_traceability`. | Builds scholarly trust; users can inspect root treatise editions and submit peer review corrections. | Expand Source Inspector to a dedicated modal/drawer across all entity cards. | Citations resolve to verified treatise records; ungrounded queries trigger explicit refusal. | Curated Corpus |
| **Daily Sadhana Planner** | P1 | `PARTIAL` | `SadhanaTracker.tsx` logs sessions after the fact and has basic Tala presets, but lacks a personalized goal-driven daily planner. | High: Learners often struggle with *how* to structure a 15, 30, or 60-minute practice routine across Shruti, Swaras, Alankaram, and Raga. | Build `DailySadhanaPlanner` component with configurable time, level, customizable step blocks, deterministic routine generator, and one-click launch. | Deterministic plan generation; editable/reorderable steps; guest localStorage & authenticated DB sync; planned vs actual tracking. | `SadhanaTracker`, `audioEngine` |
| **Exercise & Composition Playlists** | P1 | `PARTIAL` | `GradedExercises.tsx` and `carnaticExercises.ts` contain structured Sarali/Jantai exercises, but no user-customizable playlist sequence runner. | High: Students cannot string together warmup drills, specific lessons, and varnams with custom repetition loops and timers. | Build `PracticePlaylistRunner` allowing users to create, reorder, loop, set repetition counts, export/import JSON, and resume practice sets. | Reorderable practice sequence; loop counter; tempo lock; JSON import/export; zero paid paywalls. | Web Audio, LocalStorage |
| **Audio Calibration Wizard** | P1 | `PARTIAL` | `TunerCompanion.tsx` and `ExplainablePracticeCompanion.tsx` have microphone logic, but no guided pre-practice input gain, ambient noise check, or clipping test. | Medium: Poor microphone gain or room reverberation causes erratic pitch detection, confusing learners. | Build `AudioCalibrationWizard` component offering ambient noise floor test, clipping detector, reference tone A4/C4 generator, and manual fallback mode. | Step-by-step wizard; input level meter; noise floor baseline measurement; manual mode for denied mic; resource cleanup on unmount. | Web Audio AnalyserNode |
| **Source & Provenance Inspector** | P1 | `PARTIAL` | `TutorModal.tsx` has Evidence Inspector and `AttributionModal.tsx` has high-level credits, but entity cards lack deep primary source inspection. | High: Cultural researchers and traditionalists need transparent visibility into manuscript editions and sampradaya variations. | Build unified `SourceProvenanceModal` accessible from Ragas, Talas, Instruments, and Heritage entries with source metadata and edit suggestion. | Displays treatise title, author, historical era, specific edition/page, CC license, and editorial review history. | `content_corrections` |
| **Offline Learning Packs** | P1/P2 | `MISSING` | `web/public/sw.js` caches static shell (cache-v2), but no user-facing offline learning pack manager exists. | High: Rural or travelling students with intermittent connectivity cannot intentionally download curated modules. | Build `OfflinePackManager` allowing learners to download bundled text, SVG diagrams, and synthesized audio for lessons/ragas into IndexedDB/CacheStorage with storage quota indicators. | Selectable offline packs; download progress; storage quota disclosure; one-click pack removal; excludes private user tokens. | CacheStorage API, IndexedDB |
| **Curated Listening Library** | P2 | `PARTIAL` | `HeritageArchive.tsx` has historical articles; `audioEngine.ts` has synthesized instrument auditions, but no curated listening guide for musical forms. | Medium: Listening (*Kelvi Gnanam*) is central to Carnatic pedagogy; learners need structured listening prompts paired with ragas/talas. | Build `CuratedListeningLibrary` indexing public domain / CC recordings and open archival links with structured listening analysis prompts. | Filterable by raga, tala, composer, form; includes listening prompts; rights/licensing transparently labeled. | Heritage data |
| **Unified Search & Discovery** | P1/P2 | `PARTIAL` | `backend/app/api/v1/endpoints/search.py` performs multi-entity search; frontend has search in curriculum and archive, but lacks a global keyboard-shortcut (`Cmd+K`) spotlight search. | Medium: Users navigate between separate tabs to find a raga, lesson, or treatise reference. | Build global `CommandPalette` / Unified Search modal indexing ragas, talas, instruments, lessons, and archive entries. | Instant global search with keyboard shortcut (`/` or `Ctrl+K`), entity type badges, and direct navigation. | Backend search API |
| **Database Migrations & Constraints** | P0 | `EXISTS` | `backend/alembic/versions/95d82f7c0a11_feature_tables_and_practice_lifecycle.py`; tested in `test_alembic_migrations_schema_integrity`. | High: Prevents schema drift and data corruption in production deployments. | Retain clean Alembic single-head posture; document rollback procedure. | Clean upgrade and rollback path; all foreign key cascades tested. | Alembic, SQLAlchemy |
| **Production Domain, TLS & Backups** | P0 | `NEEDS_VALIDATION` | Configuration examples exist in `.env.example` and `backend/.env.example`, but live production deployment requires external hosting credentials. | Critical for public production: Live certificates, automated WAL backups, and Redis cluster failover cannot be executed in local sandbox. | Document explicit hosting runbook and manual verification checklist for the deployment owner. | Live HTTPS enforcement, scheduled database backups, monitoring alerts verified on deployed host. | Vercel / Railway / AWS / VPS |

---

## 3. Implementation Priorities for Immediate Execution

To deliver the highest immediate value to learners without destabilizing the verified core:

1. **Feature A — Daily Sadhana Planner (P1):**
   - Provide a goal-driven, adaptable daily practice routine generator (15m, 30m, 45m, 60m).
   - Structured activities: Shruti alignment $\to$ Swaravali drills $\to$ Alankaram/Tala $\to$ Raga study $\to$ Reflection.
   - Interactive reordering, duration editing, and direct connection to session logger.

2. **Feature B — Exercise and Composition Playlists (P1):**
   - User-curated practice sequences with repetition count, tempo lock, and section looping.
   - JSON import/export and guest local persistence.

3. **Feature C — Audio Calibration Wizard (P1):**
   - Guided pre-practice microphone test: input level meter, clipping warning, background noise floor assessment, reference pitch drone, and manual fallback mode.

4. **Feature D — Source & Provenance Inspector (P1):**
   - Deep treatise metadata modal accessible across ragas, instruments, and lessons with direct "Suggest Edit" integration.

5. **Feature E — Offline Learning Packs Manager (P1/P2):**
   - User-facing offline packs dialog allowing modular caching of lessons, raga scales, and synthesized instruments with storage indicators.
