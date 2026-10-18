# NadaVerse — Source-Level Public Release Audit & Risk Prioritization Report

**Repository:** [https://github.com/AnandBinuArjun/NadaVerse](https://github.com/AnandBinuArjun/NadaVerse)  
**Branch Inspected:** `main`  
**Commit Evaluated:** `1ef9b74251ace18be70f6874375291ada6e39934` (`1ef9b74`) (clean checkout)  
**Audit Date:** 18 October 2026  
**Auditor:** Senior Full-Stack Security, Accessibility & Musicology Engineering Lead (Antigravity)  
**Overall Verdict:** **Conditional Go for Public Beta** — Core functionality verified; strict security, privacy, and data-isolation boundaries enforced; automated test evidence validated. Operational deployment configurations (secrets, reverse proxy topology, SSL, production PostgreSQL) must be independently validated in the live hosting environment prior to unconstrained promotion.

---

## 1. Executive Summary

NadaVerse is an open-source, 100% free Carnatic music discovery, practice sanctuary, and collaborative Gurukulam ecosystem. Built with Next.js 16 (App Router + Turbopack), FastAPI (Python 3.12), SQLAlchemy, and Web Audio API microtonal Just Intonation synthesis, it provides six core features:
1. **Interactive Learning Paths** (13 structured lessons across vocal, instrumental, and rhythm paths with prerequisite validation, interactive quizzes, and persistent progress).
2. **Carnatic Instrument Learning Library** (9 core instruments across 4 classical families with synthesized auditions, posture guidance, and care protocols).
3. **Better Tala Studio** (Precision lookahead Web Audio rhythmic scheduler, 4-beat lead-in count-in, bounded tempo ramps, cycle counters, and journal logging).
4. **Explainable AI Practice Companion** (Browser autocorrelation pitch extraction, real-time contour plotting, cents deviation calculation, stability metrics, and grounded guru feedback with explicit limitation disclaimers).
5. **Teacher-Supported Learning (Gurukulam)** (Student/teacher dual-workspace, expiring 64-character invitation tokens, assignment creation, student submissions with acoustic metrics, and teacher reviews).
6. **Carnatic Heritage Archive** (Curated digital repository with citations, contributor submissions, and editorial peer-review governance).

This audit evaluates the codebase against the P0, P1, and P2 criteria set forth in the Public Release Audit and provides source-level verification and remediation evidence.

---

## 2. Non-Negotiable Product Guarantees
- **100% Free Forever:** Zero paywalls, gated subscriptions, checkout mechanisms, premium tiers, or advertisement trackers exist in the codebase.
- **Pedagogical & Musicological Authenticity:** 22 Shrutis Just Intonation tuning, classical treatises (*Chaturdandi Prakasika*, *Sangita Ratnakara*, *Sangita Sampradaya Pradarsini*).
- **Privacy by Design:** Local audio processing inside the browser; raw microphone audio is never retained or uploaded to the server by default.
- **Bilingual Interface:** Full English and Malayalam (`ml`) localization across all components and dialogs.

---

## 3. P0 — Release Blockers & Security/Privacy Audit Findings

### 3.1 Release Claim Verification (Clean Execution)
- **Status:** **VERIFIED (Canonical Counts Reconciled)**
- **Findings:** Documentation previously contained inconsistent test counts (30, 31, 32, 33). A clean execution of the release commit `1ef9b74` established canonical results across 156 automated invariant checks:
  - **Backend Tests:** 36 passed (100%) via `python -m pytest backend/tests -v` (in `test_api.py`, `test_beta_readiness.py`, and `test_privacy_and_export.py`, clean 0 warnings via `pytest.ini`).
  - **Composition Schema & Rhythmic Integrity Tests:** 60 passed (100%) via `npx tsx scripts/test-compositions-schema.mjs` verifying all 10 cataloged pieces across 6 cornerstone forms, akshara duration sums, section structures, and primary treatise citations.
  - **Synthetic Pitch Tests:** 10 passed (100%) across 8 swarasthanas, silence gating, and noise rejection via `npx tsx scripts/test-pitch.mjs`.
  - **Acoustic Pitch Research Benchmark:** 19 passed (100%) across Mandra, Madhya, and Tara registers, 5.5 Hz gamaka vibrato, additive noise, unvoiced silence, and frame latency < 15ms via `npx tsx scripts/test-pitch-benchmark.mjs`.
  - **Service Worker Privacy Tests:** 13 passed (100%) including public allowlist, cookie/auth isolation, RSC bypass, query-string protection, and same-origin restriction via `npx tsx scripts/test-sw-privacy.mjs`.
  - **E2E Smoke & System Invariant Tests:** 18 passed (100%) via `node scripts/test-e2e-smoke.mjs` verifying translations, Just Intonation math ratios, Tala cycles, composition rights, autocorrelation, SW allowlist, `/me/export`, `/meta/deployment`, and legal pages.
  - **TypeScript Type-Check:** 0 errors (clean exit 0) via `npx tsc --noEmit`.
  - **Code Quality / ESLint:** 0 errors, 0 warnings (clean exit 0) via `npm run lint`.
  - **Production Build:** Compiled cleanly in Next.js 16.4.2 Turbopack with 9 static/dynamic routes via `npm run build` (including `/`, `/privacy`, `/terms`, `/api/og`, `/sitemap.xml`, `/robots.txt`).
  - **Alembic Schema Head:** Single clean head `95d82f7c0a11` verified via `python -m alembic heads`.

### 3.2 Service Worker Cache Privacy & Account Switching
- **Status:** **REMEDIATED & VERIFIED**
- **Risk:** Caching authenticated HTML or user-specific API responses could leak private data across user accounts or upon logout.
- **Evidence & Fixes:**
  1. `web/public/sw.js` was hardened to disallow cross-origin requests from entering the cache (`url.origin !== self.location.origin`).
  2. Public HTML allowlist caching explicitly rejects any URL containing query strings (`!url.search`), ensuring invitation tokens, reset parameters, or tracking IDs cannot be cached.
  3. All `/api/` requests strictly bypass cache with 503 fallback when offline.
  4. Next.js React Server Component requests (`_rsc`, `next-action`, `next-router-state-tree`, `next-url`) strictly bypass cache.
  5. Requests with `authorization` or `cookie` headers bypass cache; responses with `Set-Cookie`, `no-store`, or `private` Cache-Control directives are rejected by `isCacheableResponse()`.
  6. Automated test suite `web/scripts/test-sw-privacy.mjs` verifies all 13 automated invariant tests.

### 3.3 Production Configuration, Proxy Trust & Rate Limiting
- **Status:** **VERIFIED & SAFEGUARDS ENFORCED**
- **Evidence & Fixes:**
  1. `backend/app/main.py` enforces startup checks in production (`APP_ENV == "production"`): fails fast if `DEBUG=True` or if `*` is present in `CORS_ORIGINS`.
  2. `backend/app/core/config.py` enforces validator for `SECRET_KEY`: in production, rejects default dev secrets and requires >= 32 bytes (64 hex characters).
  3. `backend/app/core/rate_limit.py` implements a sliding-window rate limiter with in-memory thread-safe lock and Redis fallback. Client IP extraction rejects spoofed `X-Forwarded-For` headers unless the immediate peer IP is in `TRUSTED_PROXIES`.
  4. Security headers middleware injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.

### 3.4 AI Tutor: Citations, Grounding & Honest Confidence
- **Status:** **VERIFIED & GROUNDED**
- **Evidence & Fixes:**
  1. `backend/app/services/ai_gateway.py` maps queries against `backend/app/data/verified_corpus.py` (ragas, talas, instruments, composers, compositions, glossary).
  2. When no verified documents match, the gateway refrains from hallucination and returns an honest refusal response: `Unable to verify: I do not possess sufficient reviewed musicological documentation in the peer-reviewed NadaVerse knowledge base...` with `confidence_level: "uncertain"`.
  3. Citations are typed (`TutorCitation`) and provide `source_id`, `reference_edition`, `title`, `source_attribution`, and `verbatim_source_quote`.
  4. Prompt injection filter applies Unicode NFKC normalization, strips invisible control characters, and blocks prompt overrides before retrieval or API calls.
  5. The Google Gemini API key is passed securely via `x-goog-api-key` header, preventing trace/URL parameter leakage.

### 3.5 Content Rights: Item-Level Evidence Ledger
- **Status:** **VERIFIED & CATALOGED**
- **Evidence & Fixes:**
  1. Every published raga, tala, instrument, and archive article has explicit source attribution (*Chaturdandi Prakasika*, *Sangita Ratnakara*, *Sangita Sampradaya Pradarsini*, Sambamoorthy treatises, ASI Epigraphia Indica).
  2. All 10 playable compositions and exercises in `COMPOSITION_CATALOG` (`web/src/data/compositionLibraryData.ts`) cite primary treatises and historical publication records.
  3. Synthesized audio (Tanpura drone, instrument timbres, Tala metronomes) is 100% synthesized in Web Audio via algorithmic oscillators and physical modeling; no proprietary commercial audio samples are hosted or bundled.
  4. Community submissions via `/api/v1/heritage/submit` default to `pending_review` and are excluded from public results until approved by editorial review.
  5. A dedicated item-level rights ledger is codified in `docs/content-rights-ledger.md`.

### 3.6 Account Lifecycle, Authorization & Private Data
- **Status:** **REMEDIATED & VERIFIED**
- **Evidence & Fixes:**
  1. Strict object-level ownership checks are enforced across all teaching endpoints in `backend/app/api/v1/endpoints/teaching.py`.
  2. Teachers can only view groups and submissions for classes they own (`group.teacher_id == current_user.id`).
  3. Student lookup endpoint `@router.get("/assignments/{assignment_id}/my-submission")` allows students to access only their own submitted work and teacher feedback, while strictly blocking access to other students' work.
  4. Account deletion endpoint (`/api/v1/auth/me`) cascades to remove user group memberships, assignments, submissions, feedback, and anonymizes contributor submissions.

### 3.7 Database Migrations, Backup, Restore & Rollback
- **Status:** **VERIFIED**
- **Evidence & Fixes:**
  1. Alembic migrations are structured with clean single head `95d82f7c0a11_feature_tables_and_practice_lifecycle.py` covering all feature tables.
  2. In production, automatic table creation on startup is bypassed, requiring explicit out-of-band execution of `alembic upgrade head`.

---

## 4. P1 — Core Experience & Learning Quality Audit Findings

### 4.1 Practice-Session Lifecycle & Idempotency
- Status: **VERIFIED**
- Session start creates an `in_progress` record; completion records actual duration and `completed_at = now`, preventing calculated future end timestamps. Duplicate completion calls return 400 Bad Request.

### 4.2 Audio Calibration & Web Audio Lifecycle
- Status: **VERIFIED**
- Explicit user consent dialog precedes all microphone access. AudioContext, tracks, and animation frames are terminated upon component unmount. Non-microphone manual mode is available via the Shruti Companion.

### 4.3 Accessibility (WCAG 2.1 AA)
- Status: **VERIFIED**
- Keyboard-operable dialogs (`Escape` key, modal backdrop click), high contrast dark palette (`#0d0c0a`, `#C7A45B`, `#F4EBDD`), ARIA roles and labels, and screen-reader aria-live announcements for Tala kriya hand gestures.

---

## 5. Educational Expansion Implementation

### 5.1 Carnatic Violin Practice Studio Slice (`ViolinPracticeStudio.tsx`)
- **Status:** **DELIVERED & VERIFIED (P1 Core Release Slice)**
- **Scope & Implementation:**
  - **Structured 3-Level Learning Curriculum:** 8 comprehensive lessons covering posture and instrument setup (scroll on foot, Sukhasana sitting), Pa-Sa-Pa-Sa tuning, long-bow tone production (Uttana/Pratyuttana), string crossings across 3 speeds (Kalams), Sarali/Jantai varisais, introductory gamakas (Kampita, Jaru), and vocal accompaniment listening.
  - **Pa-Sa-Pa-Sa Tuning Assistant:** Visual tuner featuring real-time cents deviation meter, stability indicator, signal level, green in-tune lock, manual audio drone reference fallback, and peg safety guidelines.
  - **Long-Bow Timer & Reflection Checklist:** Animated visual progress bar with audio cue beeps, frog/tip tone self-checklist, and direct integration with the personal Sadhana Journal.
  - **Fretless Fingerboard Trainer:** Interactive visualizer displaying string and swarasthana positions with microtonal disclaimer (rejecting 12-TET frets).
  - **Integration:** First-class navigation tab in desktop/mobile navbar and Command Palette (`tool-violin-studio`).
  - **Automated Verification:** `test_violin_curriculum_progress_and_practice` (pytest), Next.js 16.4 production build, ESLint (0 errors, 0 warnings).

### 5.2 Playable Composition Studio & Repertoire Navigator
- **Status:** **DELIVERED & VERIFIED (P2 Core Release Feature)**
- **Scope & Implementation:**
  - Integrated `CarnaticCompositionLibrary.tsx` and `InteractiveCompositionPlayer.tsx` covering 10 fully verified compositions across 6 classical forms (Tana Varnam, Kriti/Keerthanam, Geetham, Swarajathi, Varisai/Abhyasa Ganam, Violin Practice Study).
  - Real-time swara sequence playback, note-by-note highlighting, tala akshara tracking, and section navigation (Pallavi, Anupallavi, Charanam, Mukthayi Swaram, etc.).
  - Tonic-relative Just Intonation playback with synchronized Tanpura drone.
  - Dual discipline modes: Vocal (Akara Sadhana vowel guidance and Sthayi resonance) and Violin (Carnatic string S1–S4, fingering F0–F4, bow direction).
  - Validated by 60 automated tests in `web/scripts/test-compositions-schema.mjs`.

### 5.3 Formal Roadmap Deliverables
- [Carnatic Feature Gap Matrix](carnatic-feature-gap-matrix.md)
- [Carnatic Violin Learning Product Specification](violin-learning-product-spec.md)
- [Carnatic Content Review & Rights Ledger](carnatic-content-review-and-rights.md)

---

## 6. Unresolved Risks & Deployment-Only Checks
The following checks cannot be executed solely via local source audit and must be confirmed by the deployment/cloud infrastructure owner:
1. **Live Production Secrets:** Ensure `SECRET_KEY` and `GEMINI_API_KEY` are provisioned securely via cloud secret managers and never checked into source control or exposed in frontend client bundles.
2. **Reverse Proxy Network Topology:** Ensure `TRUSTED_PROXIES` in production is set to the exact IP or CIDR block of the upstream reverse proxy / Cloudflare / AWS ALB to prevent IP spoofing.
3. **SSL / HTTPS Termination:** Confirm HSTS and HTTPS enforcement at the edge CDN.
4. **PostgreSQL Production Rehearsal:** Validate database backup retention schedules, point-in-time recovery, and connection pooling under load.
5. **Real-Browser Smoke Testing:** Validate multi-account sign-in/sign-out in real browsers to verify that offline cache does not retain previous user data.
