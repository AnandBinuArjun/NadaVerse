# NadaVerse — Testing & Release Checklist

**Version:** 1.0.0-beta  
**Release Candidate Commit:** `1ca02f3caa4e7c219aa9e1924ce072e9681fd08b` (`1ca02f3`)  
**Evaluation Date:** 18 October 2026  
**Environment:** Windows 11 / Python 3.12.1 / Node v21.7.2  
**Target Hosts:** Vercel (Frontend), FastAPI Production Server (Backend)  

---

## 1. Automated Test Verification Summary

| Test Category | Command | Target / Suite | Result |
|---|---|---|---|
| **Backend Unit & Privacy Tests** | `python -m pytest backend/tests -v` | All 36 tests across API, two-user IDOR isolation, user data export, account deletion cascade, rate limiting, audio consent, practice lifecycle, violin learning, editorial corrections, Alembic migrations, playable compositions, deployment metadata | **36 Passed (100%)** |
| **Composition Schema & Rhythms** | `npx tsx scripts/test-compositions-schema.mjs` (in `web/`) | 60 invariant checks across 10 compositions: 6 cornerstone forms, akshara durations, sections, rights metadata, primary treatise sources | **60 Passed (100%)** |
| **Synthetic Pitch Diagnostics** | `npx tsx scripts/test-pitch.mjs` (in `web/`) | Centralized autocorrelation pitch detector across 8 swarasthanas, silence gating, and noise rejection | **10 Passed (100%)** |
| **Acoustic Pitch Research Benchmark** | `npx tsx scripts/test-pitch-benchmark.mjs` (in `web/`) | 19 invariant checks: Mandra, Madhya, Tara registers, 5.5 Hz gamaka vibrato modulation, additive noise, unvoiced silence, frame latency < 15ms | **19 Passed (100%)** |
| **Service Worker Privacy Tests** | `npx tsx scripts/test-sw-privacy.mjs` (in `web/`) | Public allowlist enforcement, Cookie/Auth header isolation, Next.js RSC bypass, cross-origin disallow, and query-string protection | **13 Passed (100%)** |
| **E2E Smoke & System Invariants** | `node scripts/test-e2e-smoke.mjs` (in `web/`) | 18 invariant checks: translations, Just Intonation math ratios, Tala cycle math, composition licensing, autocorrelation, SW privacy, standalone /privacy & /terms routes, /me/export, deployment metadata, Buy Me a Coffee link | **18 Passed (100%)** |
| **Strict TypeScript Type-Check** | `npx tsc --noEmit` (in `web/`) | Strict TypeScript 5 with App Router types, components, and audio engine | **0 Errors (Exit 0)** |
| **Frontend Code Quality & Lint** | `npm run lint` (in `web/`) | Next.js ESLint configuration | **0 Errors, 0 Warnings** |
| **Frontend Production Build** | `npm run build` (in `web/`) | Next.js 16.4.2 Turbopack production compilation across 9 static/dynamic routes | **Compiled Successfully** |
| **Database Migration Integrity** | `python -m alembic heads` | Clean single head `95d82f7c0a11` covering all feature tables | **Verified Clean Head** |
| **Master Evidence Generation** | `node scripts/generate-release-evidence.mjs` | Automated execution producing `docs/release-evidence.json` | **All 9 Suites Passed (156 Checks)** |

---

## 2. Core Feature Release Verification Checklist

### Feature 1: Interactive Carnatic Learning Paths
- [x] All 13 lessons load with complete metadata, duration, and prerequisites.
- [x] Search filters by keyword, difficulty level, and completion status.
- [x] Quizzes validate user responses dynamically and provide explanatory feedback.
- [x] Incorrect answers trigger appropriate revision recommendations.
- [x] Progress is saved to `localStorage` for guests and synced to `/api/v1/curriculum/progress` for authenticated accounts.
- [x] "Resume Learning" button navigates directly to the earliest incomplete lesson.

### Feature 2: Carnatic Instrument Learning Library
- [x] Profiles rendered for 9 core instruments across all 4 classical families (Tata, Sushira, Avanaddha, Ghana).
- [x] Web Audio synthesis auditions instrument timbres on demand without external network requests.
- [x] Bookmarking syncs reactively to user storage.
- [x] Expandable panels for posture guidance, common beginner mistakes, and maintenance.
- [x] Filter pills allow instantaneous family grouping.

### Feature 3: Better Tala Studio
- [x] Accurate audio scheduling using Web Audio lookahead clock (immune to JavaScript interval jitter).
- [x] 4-beat Lead-in Count-In plays distinct beats before cycle starts.
- [x] Bounded tempo ramps correctly increment BPM on Samam without exceeding target tempo.
- [x] Real-time cycle counter and elapsed duration timer accurately increment.
- [x] Reusable practice presets (Adi Tala Kalam acceleration, Rupaka Tisra Nadai, Khanda Chapu, Misra Chapu) load instantly.
- [x] "Log to Sadhana Journal" button transfers preset parameters into the practice logger.

### Feature 4: Explainable AI Practice Companion
- [x] Mandatory explicit user consent dialog prior to audio processing.
- [x] Real-time pitch tracking with time-domain autocorrelation.
- [x] Pitch contour canvas plots performer frequency against Adhara Shadjam swarasthanas.
- [x] Swara breakdown table displays cent error (-50c to +50c) and stability percentage.
- [x] API endpoint `/api/v1/audio/analyze-practice` validates duration and frequency bounds.
- [x] Explanation layer provides evidence-grounded guru commentary with transparent acoustic limitations notice.
- [x] Report can be logged to practice journal.

### Feature 5: Teacher-Supported Learning (Gurukulam)
- [x] Dual-mode UI (Student / Teacher).
- [x] Teacher can create Gurukulam learning classes.
- [x] Expiring 64-character invitation tokens can be generated and revoked.
- [x] Students can join classes via invitation token.
- [x] Teachers can create assignments with target Kalam, BPM, and instructions.
- [x] Students can submit practice reflections and acoustic companion scores.
- [x] Teachers can review submissions and issue feedback with recommended lessons.
- [x] Backend enforces strict authorization; cross-user tampering attempts return 403 Forbidden.

### Feature 6: Carnatic Heritage Archive
- [x] Curated repository with baseline published entries on veena lutherie, Purandara Dasa, Kudumiyanmalai epigraphy, and Dikshitar treatises.
- [x] Category filtering and full-text search over titles, summaries, and content.
- [x] Full-text article reader modal with complete academic citations and license declarations.
- [x] Contributor submission modal forces `pending_review` status.
- [x] Unapproved submissions are hidden from public queries until approved through editorial review.

### Feature 7: Playable Composition Library & Raga Prayogas
- [x] 10 cornerstone pieces across 6 classical forms with section looping, tempo control, tonic-aware drone, vocal/violin modes.
- [x] Accessible text-first view (`accessibleTextView`) providing high-contrast plain text for screen readers.
- [x] Client-only learner annotations drawer (`localStorage` persisted, zero server leakage).
- [x] Raga Prayoga signature phrase explorer with Just Intonation audio auditioning for primary ragas.

### Feature 8: User Data Lifecycle & Privacy
- [x] User-scoped full data export via `GET /api/v1/me/export`.
- [x] Self-service account deletion cascading across all user records via `DELETE /api/v1/me`.
- [x] Deployment metadata endpoint `GET /api/v1/meta/deployment` exposing candidate commit SHA without secrets.

---

## 3. Security & Operational Checklist

- [x] **Rate Limiting:** In-memory and trusted-proxy rate limiter active on all API endpoints.
- [x] **Security Headers:** Nosniff, Frame-Options DENY, XSS protection, and Strict-Origin-When-Cross-Origin enabled.
- [x] **Prompt Injection Defense:** Unicode NFKC normalization and regex pattern filter active in `AIGatewayService`.
- [x] **Secret Isolation:** API keys and JWT secret keys reside strictly on the server and are never exposed to client bundles.
- [x] **Data Minimization:** No raw audio recordings are uploaded or stored on the server.
- [x] **100% Free Guarantee:** Zero monetization libraries, payment gateways, or paywall guards exist in the repository.
