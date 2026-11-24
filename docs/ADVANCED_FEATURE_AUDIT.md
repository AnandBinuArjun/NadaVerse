# NadaVerse — Master Product Expansion & Engineering Codebase Audit

**Document Version:** 2.0.0  
**Audit Date:** 24 November 2026  
**Audited Git Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)  
**Repository:** [https://github.com/AnandBinuArjun/NadaVerse](https://github.com/AnandBinuArjun/NadaVerse)  
**Production Target:** [https://nadaverse.abarjun.online/](https://nadaverse.abarjun.online/)  
**Lead Principal Architect & Auditor:** Antigravity Engineering & Musicology Team  

---

## 1. Current Git Commit SHA & Repository State

- **Full Commit SHA:** `247a9cf8b32dc4d7122a5e5d1492cb2084755347` (`247a9cf`)
- **Branch:** `main`
- **Alembic Migration Single Head:** `95d82f7c0a11`
- **Baseline Automated Verification:** 156/156 checks passing (36 backend pytest tests, 60 composition schema invariants, 10 synthetic pitch tests, 19 acoustic multi-register pitch benchmarks, 13 service-worker privacy checks, 18 E2E smoke invariants), 0 TypeScript errors, 0 ESLint warnings.

---

## 2. Existing Feature Inventory (`EXISTS`)

| Module / Capability | Status | Key Frontend & Backend Files | Verification Evidence |
|---|---|---|---|
| **Guided Onboarding & Natural Tonic Selection** | `EXISTS` | `web/src/components/OnboardingModal.tsx` | LocalStorage persistence (`nadaverse_musician_profile`), skippable guest flow, bilingual (`en`/`ml`). |
| **13-Lesson Multi-Path Curriculum** | `EXISTS` | `web/src/components/LearningCurriculum.tsx`, `web/src/data/curriculumData.ts`, `backend/app/api/v1/endpoints/curriculum.py` | `test_curriculum_progress_lifecycle`; Vocal, Instrumental & Rhythm tracks with quizzes and prerequisite gating. |
| **Daily Sadhana Planner & Practice Journal** | `EXISTS` | `web/src/components/DailySadhanaPlanner.tsx`, `web/src/components/SadhanaTracker.tsx`, `backend/app/main.py` | `test_practice_session_lifecycle_and_duration_accuracy`, `test_practice_session_abandon_and_summary_lifecycle`. |
| **Tanpura Overtone Drone & Just Intonation Engine** | `EXISTS` | `web/src/components/ShrutiCompanion.tsx`, `web/src/lib/audioEngine.ts`, `web/src/lib/carnaticRatios.ts` | Supports Pa, Ma, and Ni Shruti tunings with Jivari harmonic beating and 16 pure integer frequency ratios. |
| **Tala Studio & Drift-Free Lookahead Clock** | `EXISTS` | `web/src/components/TalaStudio.tsx`, `web/src/lib/audioEngine.ts` | `test_tala_studio_rhythm_calculations_and_tempo_ramps`; 4-beat lead-in, bounded tempo ramps, Mridangam Solkattu synthesis. |
| **Explainable AI Practice Companion & Pitch Tuner** | `EXISTS` | `web/src/components/ExplainablePracticeCompanion.tsx`, `web/src/components/TunerCompanion.tsx`, `web/src/lib/pitchDetector.ts` | `test-pitch.mjs` (10/10), `test-pitch-benchmark.mjs` (19/19), `test_explainable_ai_practice_companion_analysis`. |
| **Playable Composition Library (10 Compositions)** | `EXISTS` | `web/src/components/CarnaticCompositionLibrary.tsx`, `web/src/components/InteractiveCompositionPlayer.tsx`, `backend/app/api/v1/endpoints/compositions.py` | `test-compositions-schema.mjs` (60/60), `test_compositions_api`; 6 classical forms, section looping, Akara/Violin modes. |
| **Carnatic Violin Practice Studio** | `EXISTS` | `web/src/components/ViolinPracticeStudio.tsx` | `test_violin_curriculum_progress_and_practice`; Pa-Sa-Pa-Sa 4-string tuner, posture, bow drills, string crossing. |
| **Gurukulam Teacher-Student Workspace** | `EXISTS` | `web/src/components/TeacherStudentWorkspace.tsx`, `backend/app/api/v1/endpoints/teaching.py` | `test_teacher_supported_learning_workflow`; 64-char expiring tokens, assignments, submissions, teacher reviews. |
| **Carnatic Heritage Archive & Provenance Inspector** | `EXISTS` | `web/src/components/HeritageArchive.tsx`, `web/src/components/SourceProvenanceModal.tsx`, `backend/app/api/v1/endpoints/heritage.py` | `test_heritage_archive_editorial_workflow`, `test_content_correction_editorial_lifecycle`. |
| **Global Spotlight Search (`Ctrl+K` / `⌘K`)** | `EXISTS` | `web/src/components/CommandPalette.tsx`, `backend/app/api/v1/endpoints/search.py` | `test_global_search_multi_entity`; searches ragas, talas, instruments, composers, compositions, glossary. |
| **Offline Learning Packs & Service Worker Isolation** | `EXISTS` | `web/src/components/OfflinePackManager.tsx`, `web/public/sw.js` | `test-sw-privacy.mjs` (13/13); public allowlist, bypasses `Authorization`, `Cookie`, `_rsc`, and `/api/`. |
| **Privacy Lifecycle (`GET /me/export`, `DELETE /me`)** | `EXISTS` | `backend/app/api/v1/endpoints/auth.py`, `web/src/app/privacy/page.tsx` | `test_two_user_export_and_isolation`, `test_account_deletion_lifecycle_via_me`. |

---

## 3. Missing & Partial Feature Inventory (`PARTIAL` / `MISSING`)

| Expansion Area (Prompt Section) | Current Status | Identified Gaps & Engineering Action Required |
|---|---|---|
| **Personalised Learning Dashboard & Guest Migration (Sec 4)** | `PARTIAL` | Lessons, Sadhana sessions, bookmarks, and assignments exist in separate views, but lack a unified **Personalised Learning Dashboard** with explainable activity-grounded recommendations (explicitly distinguishing lesson completion from musical proficiency) and 1-click **Guest-to-Account Progress Migration** (`POST /api/v1/me/migrate-guest-state`). |
| **Advanced Carnatic Ear Training Academy (Sec 5)** | `MISSING` | No dedicated interactive Ear Training module exists for Swara identification, interval recognition, ascending/descending phrase recognition, Raga & Prayoga identification, Shruti cent-matching, and Tala rhythm identification with deterministic scoring and adaptive difficulty. |
| **Gamaka Laboratory (Sec 6)** | `PARTIAL` | `audioEngine.ts` synthesizes `kampita` and `jaru`, and `ExplainablePracticeCompanion.tsx` plots pitch contours, but there is no dedicated **Gamaka Laboratory** covering the classical Dasavidha Gamakas (*Kampita, Jaru, Nokku, Spurita, Pratyahata, Ravai, Khandippu, Andolita, Odukkal, Orikkai*) with reference vs. learner contour comparison, signal-quality/clipping meters, speed adjustment (0.5x–1.0x), and lineage-respecting self-assessment. |
| **72 Melakarta Chakra Explorer & Raga Graph (Sec 7)** | `PARTIAL` | `carnaticData.ts` contains 32 curated ragas, but lacks the complete mathematical & musicological **72 Melakarta Raga Catalogue** across all 12 Chakras (*Indu* through *Aditya*) with Katapayadi Sankhya verification, Shuddha/Prati Madhyama symmetry pairing (1–36 ↔ 37–72), interactive Chakra wheel/grid navigation, and Just Intonation auditioning for all 72 parent scales. |
| **Advanced Tala & Konnakol Academy (Sec 9)** | `PARTIAL` | `TalaStudio.tsx` and `audioEngine.ts` support Chatusra and Tisra Nadai, but lack all 5 Nadais (*Tisra 3, Chatusra 4, Khanda 5, Misra 7, Sankirna 9*), the full **35 Suladi Sapta Tala Calculator** (7 families × 5 jatis), interactive **Korvai & Mora Construction Validator** (Purvangam + Uttaranga + Mora arithmetic targeting Samam/Eduppu), Tap-to-Beat latency calibration, and JSON pattern import/export. |
| **Interactive Swara Notation Editor & Manodharma Studio (Sec 8, 13)** | `MISSING` | `InteractiveCompositionPlayer.tsx` plays existing compositions, but learners and teachers cannot author, validate, loop, export, or privately share structured Swara notations or build **Manodharma** (Alapana & Eduppu-aware Kalpana Swara) phrases with real-time Tala cycle alignment validation. |

---

## 4. Cybersecurity Findings

1. **Broken Function-Level Authorization (BFLA) on `GET /api/v1/corrections/pending` (Medium — Fixed in P0):**
   - `backend/app/main.py:684` previously required `Depends(get_current_user)` rather than `Depends(get_current_editor_or_admin)`. While reviewing a correction (`POST /api/v1/corrections/{id}/review`) enforced editor/admin RBAC, listing pending corrections allowed an ordinary authenticated student to view unreviewed submissions. Upgrading `list_pending_corrections` to `Depends(get_current_editor_or_admin)` enforces strict RBAC parity with `/api/v1/heritage/editorial/pending`.
2. **HTTP Security Headers Hardening (Low — Enhanced in P0):**
   - `backend/app/main.py:90` sets `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Referrer-Policy`, but lacked `Permissions-Policy` (`camera=(), geolocation=(), payment=(), usb=(), microphone=(self)`), `Content-Security-Policy` (`default-src 'self'; frame-ancestors 'none'`), and conditional production `Strict-Transport-Security`.
3. **Audio Node Reference Accumulation in `audioEngine.ts` (Low — Fixed in P0):**
   - `scheduleSwaraNote` pushed handles to `this.scheduledNoteHandles` without pruning completed oscillators on `osc.onended`. Adding automatic `onended` cleanup and node disconnection prevents memory growth during extended composition or notation playback.

---

## 5. Architecture & Performance Findings

- **Frontend Architecture (`web/src/app/page.tsx`):**
  - Uses Next.js 16 App Router with modular feature components (`LearningCurriculum`, `TalaStudio`, `ViolinPracticeStudio`, `CarnaticCompositionLibrary`, `TeacherStudentWorkspace`, `HeritageArchive`).
  - Rather than rewriting or breaking existing URLs/workflows, new flagship modules (`PersonalisedLearningDashboard`, `EarTrainingAcademy`, `GamakaLaboratory`, `MelakartaChakraExplorer`, `KonnakolAcademy`, `SwaraNotationEditor`) should be built as self-contained, strongly typed components mounted cleanly into the existing navigation and tab structure.
- **Audio DSP Performance (`web/src/lib/pitchDetector.ts` & `audioEngine.ts`):**
  - Time-domain autocorrelation executes in `< 11ms` per 2048-sample frame across Mandra, Madhya, and Tara registers.
  - Adding deterministic `analyzeSignalQuality(buffer)` provides real-time RMS level, peak clipping detection (`|sample| >= 0.98`), noise floor gating, and SNR estimation in `O(N)` single-pass time (`< 0.15ms`).

---

## 6. Proposed Database, Backend & Frontend Changes

### 6.1 Proposed Database & Entity Additions (`backend/app/models/entities.py`)
Reuse existing `User`, `UserProfile`, `Bookmark`, `LessonProgress`, `PracticeSession`, `LearningGroup`, `Assignment`, `HeritageEntry`, `ContentCorrection`, and `AuditEvent` models, and add only genuinely required entities:
1. **`EarTrainingAttempt`**: Persists authenticated ear training exercise completions (`category`, `difficulty`, `score_pct`, `total_questions`, `correct_answers`, `tonic`, `created_at`).
2. **`NotationDocument`**: Persists user/teacher-authored swara notations and Manodharma drafts (`id`, `owner_id`, `title`, `raga_slug`, `tala_slug`, `nadai`, `kalam`, `tonic`, `sections_json`, `is_shared_with_group_id`, `editorial_status`, `created_at`, `updated_at`) with strict object-level authorization.

### 6.2 Proposed Backend Endpoints (`backend/app/api/v1/endpoints/expansion.py`)
- `POST /api/v1/me/migrate-guest-state` — Idempotently migrates guest `localStorage` lessons, bookmarks, and Sadhana practice sessions into an authenticated user account and returns migration counts.
- `GET /api/v1/ragas/melakarta-72` — Returns the complete 72 Melakarta Raga scheme across all 12 Chakras with Katapayadi Sankhya verification, swarasthana permutations, and Shuddha/Prati Madhyama symmetry metadata.
- `POST /api/v1/tala/validate-korvai` — Deterministically validates Suladi Sapta Tala / Chapu Tala cycle arithmetic and Korvai/Mora structures (`purvangam_matras`, `uttarangam_phrase_matras`, `mora_gap_matras`, `tala_aksharas`, `nadai`, `eduppu_offset_matras`).
- `POST /api/v1/ear-training/attempts` & `GET /api/v1/ear-training/summary` — Records and aggregates deterministic ear training accuracy by category.
- `POST /api/v1/notations`, `GET /api/v1/notations`, `GET /api/v1/notations/{id}`, `PUT /api/v1/notations/{id}`, `DELETE /api/v1/notations/{id}` — Full CRUD for Swara Notation Editor documents with strict BOLA/IDOR protection.

### 6.3 Proposed Frontend Components (`web/src/components/`)
1. `PersonalisedLearningDashboard.tsx` — Unified learner hub, explainable recommendations, repertoire tracker, and guest-to-account migration trigger.
2. `EarTrainingAcademy.tsx` — Interactive Carnatic Ear Training Academy with 5 exercise modes, deterministic scoring, adaptive difficulty, and microphone-free + mic modes.
3. `GamakaLaboratory.tsx` — Dedicated Dasavidha Gamaka pitch contour laboratory with reference playback, speed control, signal quality meters, and learner overlay.
4. `MelakartaChakraExplorer.tsx` — Interactive 72 Melakarta & 12 Chakra navigator with Just Intonation auditioning and Katapayadi inspector.
5. `KonnakolAcademy.tsx` — 35 Suladi Sapta Tala & 5 Nadai calculator, interactive Korvai constructor, call-and-response Solkattu trainer, and JSON pattern import/export.
6. `SwaraNotationEditor.tsx` — Visual & keyboard Swara Notation Editor and Manodharma Alapana/Kalpana Swara phrase builder with Tala cycle validation and synthesized playback.

---

## 7. Test Strategy & First Five Implementation Milestones

### Test Strategy
- **Backend Pytest Suite:** Expand from 36 to 45+ integration & security tests covering RBAC on `/api/v1/corrections/pending`, security headers, Guest-to-Account migration idempotency, 72 Melakarta mathematical invariants, Korvai/Tala arithmetic validation, Ear Training attempts, and Notation Document BOLA/IDOR isolation.
- **Frontend Invariant & E2E Smoke Suite:** Verify all 72 Melakartas, 35 Suladi Sapta Talas, 5 Nadais, signal quality analyzer, Gamaka reference corpus, and Swara Notation validator, alongside strict TypeScript (`tsc --noEmit`), ESLint (`npm run lint`), and Next.js production build.

### First Five Implementation Milestones
1. **Milestone 1 (P0):** Security header hardening, `/api/v1/corrections/pending` RBAC fix, `audioEngine.ts` oscillator lifecycle cleanup, `analyzeSignalQuality` DSP diagnostics, and all 5 Nadais (`tisra`, `chatusra`, `khanda`, `misra`, `sankirna`) in `audioEngine.ts`.
2. **Milestone 2 (P1):** Personalised Learning Dashboard (`PersonalisedLearningDashboard.tsx`) & Guest-to-Account Progress Migration (`POST /api/v1/me/migrate-guest-state`).
3. **Milestone 3 (P1):** Advanced Carnatic Ear Training Academy (`EarTrainingAcademy.tsx`) & Gamaka Laboratory (`GamakaLaboratory.tsx`).
4. **Milestone 4 (P1):** 72 Melakarta Chakra Explorer (`MelakartaChakraExplorer.tsx`, `melakarta72Data.ts`) & Advanced Tala/Konnakol Korvai Academy (`KonnakolAcademy.tsx`).
5. **Milestone 5 (P2):** Interactive Swara Notation Editor & Manodharma Phrase Studio (`SwaraNotationEditor.tsx`, `/api/v1/notations`) + comprehensive automated test verification.
