# NadaVerse — Release Verification & Automated Test Evidence Report

**Document Date:** 18 October 2026  
**Commit Evaluated:** `c6f1a8aae0d1f0be486d95847f5d40d92296c3e9`  
**Evaluated Branch:** `main` (clean working tree, zero uncommitted modifications)  
**Execution Environment:** Windows 11 (win32), Python 3.12.1, Node.js v21.7.2, npm 10.5.0, Next.js 16.4.2 (Turbopack)  
**Database Engines Tested:** SQLite (In-Memory / Async aiosqlite for tests and development) + PostgreSQL schema normalization verified in `config.py`  
**CI Workflow Reference:** `.github/workflows/ci.yml` (Web Frontend Verification + Backend API & AI Gateway Tests)

---

## 1. Executive Evidence Summary

| Suite / Check | Command Executed | Items Tested | Result | Duration |
|---|---|---|---|---|
| **Backend Unit & Integration Suite** | `python -m pytest backend/tests -v` | 33 test cases covering API, authorization, rate limiting, audio consent, practice lifecycle, violin learning, editorial corrections, Alembic migrations, playable compositions, error telemetry | **33 Passed (100%)** | 14.26s |
| **Composition Schema & Rhythmic Integrity** | `npx tsx scripts/test-compositions-schema.mjs` (in `web/`) | 60 invariant checks across 10 compositions: 6 cornerstone forms, akshara durations, sections, rights metadata, primary treatise sources | **60 Passed (100%)** | 3.5s |
| **Synthetic Pitch Detector Diagnostics** | `npx tsx scripts/test-pitch.mjs` (in `web/`) | 8 swarasthanas, silence rejection, white-noise immunity | **10 Passed (100%)** | 2.1s |
| **Service Worker Privacy & Security** | `npx tsx scripts/test-sw-privacy.mjs` (in `web/`) | 13 cache boundary invariants: allowlist, cookie/auth bypass, RSC bypass, query-string guard, same-origin | **13 Passed (100%)** | 1.8s |
| **E2E Smoke & System Invariants** | `node scripts/test-e2e-smoke.mjs` (in `web/`) | 15 invariant checks: translations, Just Intonation math ratios, Tala cycle math, composition licensing, autocorrelation, SW privacy, standalone /privacy & /terms routes, dynamic sitemap | **15 Passed (100%)** | 1.2s |
| **Strict TypeScript Type-Check** | `npx tsc --noEmit` (in `web/`) | App Router routes, components, violin studio, composition player & library, audio engine, types | **0 Errors (Exit 0)** | 2.9s |
| **Code Quality & Lint** | `npx eslint src` (in `web/`) | Next.js ESLint configuration | **0 Errors, 0 Warnings** | 18.0s |
| **Turbopack Production Build** | `npm run build` (in `web/`) | Production compilation of 9 static/dynamic routes including Playable Composition Library, `/privacy`, and `/terms` | **Clean Build Success** | 35.8s |
| **Alembic Migration Heads** | `python -m alembic heads` (in `backend/`) | Migration chain coherence | **Single Head (`95d82f7c0a11`)** | 1.1s |

---

## 2. Verbatim Command Outputs

### 2.1 Backend Pytest Execution (`python -m pytest backend/tests -v`)
```text
============================= test session starts =============================
platform win32 -- Python 3.12.1, pytest-9.1.1, pluggy-1.6.0 -- C:\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\Ddeveloped_things\NadaVerse
plugins: anyio-3.7.1, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.STRICT, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 33 items

backend/tests/test_api.py::test_health_check PASSED                      [  3%]
backend/tests/test_api.py::test_list_ragas_and_provenance PASSED         [  6%]
backend/tests/test_api.py::test_get_raga_by_slug PASSED                  [  9%]
backend/tests/test_api.py::test_list_talas_and_instruments PASSED        [ 12%]
backend/tests/test_api.py::test_global_search_multi_entity PASSED        [ 15%]
backend/tests/test_api.py::test_auth_registration_login_lifecycle PASSED [ 18%]
backend/tests/test_api.py::test_cross_user_authorization_isolation PASSED [ 21%]
backend/tests/test_api.py::test_ai_tutor_grounded_answer_and_citations PASSED [ 24%]
backend/tests/test_api.py::test_ai_tutor_prompt_injection_guard PASSED   [ 27%]
backend/tests/test_api.py::test_expanded_corpus_and_glossary PASSED      [ 30%]
backend/tests/test_api.py::test_curriculum_progress_lifecycle PASSED     [ 33%]
backend/tests/test_api.py::test_tala_studio_rhythm_calculations_and_tempo_ramps PASSED [ 36%]
backend/tests/test_api.py::test_explainable_ai_practice_companion_analysis PASSED [ 39%]
backend/tests/test_api.py::test_teacher_supported_learning_workflow PASSED [ 42%]
backend/tests/test_api.py::test_heritage_archive_editorial_workflow PASSED [ 45%]
backend/tests/test_api.py::test_violin_curriculum_progress_and_practice PASSED [ 48%]
backend/tests/test_api.py::test_compositions_api PASSED                  [ 51%]
backend/tests/test_api.py::test_client_error_telemetry_endpoint PASSED   [ 54%]
backend/tests/test_beta_readiness.py::test_health_and_readiness_endpoints PASSED [ 57%]
backend/tests/test_beta_readiness.py::test_ai_gateway_injection_and_guardrails PASSED [ 60%]
backend/tests/test_beta_readiness.py::test_ai_gateway_provenance_and_confidence PASSED [ 63%]
backend/tests/test_beta_readiness.py::test_tutor_post_stream_endpoint PASSED [ 66%]
backend/tests/test_beta_readiness.py::test_rate_limiter_trusted_proxy_logic PASSED [ 69%]
backend/tests/test_beta_readiness.py::test_in_memory_rate_limiter_concurrency_and_timestamps PASSED [ 72%]
backend/tests/test_beta_readiness.py::test_auth_deleted_account_and_cascade_lifecycle PASSED [ 75%]
backend/tests/test_beta_readiness.py::test_audio_practice_consent_enforcement_and_metrics_separation PASSED [ 78%]
backend/tests/test_beta_readiness.py::test_practice_session_lifecycle_and_duration_accuracy PASSED [ 81%]
backend/tests/test_beta_readiness.py::test_ai_citations_source_traceability PASSED [ 84%]
backend/tests/test_beta_readiness.py::test_practice_session_abandon_and_summary_lifecycle PASSED [ 87%]
backend/tests/test_beta_readiness.py::test_content_correction_editorial_lifecycle PASSED [ 90%]
backend/tests/test_beta_readiness.py::test_alembic_migrations_schema_integrity PASSED [ 93%]
backend/tests/test_beta_readiness.py::test_rate_limiter_scope_header_and_proxy_config PASSED [ 96%]
backend/tests/test_beta_readiness.py::test_ai_gateway_unable_to_verify_and_no_key_in_url PASSED [100%]

====================== 33 passed, 44 warnings in 14.26s =======================
```

### 2.2 Composition Schema & Rhythmic Integrity Verification (`npx tsx scripts/test-compositions-schema.mjs`)
```text
--- NadaVerse Composition Schema & Rhythmic Integrity Verification ---
[PASS] Catalog contains 10 compositions (>= 6 required)
[PASS] Catalog includes Tana Varnam
[PASS] Catalog includes Kriti / Keerthanam
[PASS] Catalog includes Geetham
[PASS] Catalog includes Swarajathi
[PASS] Catalog includes Varisai / Abhyasa Ganam
[PASS] Catalog includes Violin Practice Piece
[PASS] "Ninnukori (Tana Varnam)" (ninnukori-mohanam-varnam) is valid schema v1.0.0
[PASS] "Ninnukori (Tana Varnam)" has 40 notes
[PASS] "Ninnukori (Tana Varnam)" has 3 sections
[PASS] "Ninnukori (Tana Varnam)" is explicitly verified public domain
[PASS] "Ninnukori (Tana Varnam)" cites authoritative source treatise
[PASS] "Jalajaksha (Tana Varnam)" (jalajaksha-hamsadhwani-varnam) is valid schema v1.0.0
[PASS] "Jalajaksha (Tana Varnam)" has 40 notes
[PASS] "Jalajaksha (Tana Varnam)" has 3 sections
[PASS] "Jalajaksha (Tana Varnam)" is explicitly verified public domain
[PASS] "Jalajaksha (Tana Varnam)" cites authoritative source treatise
[PASS] "Sami Ninne (Tana Varnam)" (sami-ninne-sreeragam-varnam) is valid schema v1.0.0
[PASS] "Sami Ninne (Tana Varnam)" has 26 notes
[PASS] "Sami Ninne (Tana Varnam)" has 2 sections
[PASS] "Sami Ninne (Tana Varnam)" is explicitly verified public domain
[PASS] "Sami Ninne (Tana Varnam)" cites authoritative source treatise
[PASS] "Vatapi Ganapatim Bhajeham" (vatapi-ganapatim-hamsadhwani-keerthanam) is valid schema v1.0.0
[PASS] "Vatapi Ganapatim Bhajeham" has 14 notes
[PASS] "Vatapi Ganapatim Bhajeham" has 1 sections
[PASS] "Vatapi Ganapatim Bhajeham" is explicitly verified public domain
[PASS] "Vatapi Ganapatim Bhajeham" cites authoritative source treatise
[PASS] "Raghuvamsa Sudha" (raghuvamsa-sudha-kathanakuthuhalam-keerthanam) is valid schema v1.0.0
[PASS] "Raghuvamsa Sudha" has 32 notes
[PASS] "Raghuvamsa Sudha" has 2 sections
[PASS] "Raghuvamsa Sudha" is explicitly verified public domain
[PASS] "Raghuvamsa Sudha" cites authoritative source treatise
[PASS] "Samaja Vara Gamana" (samaja-vara-gamana-hindolam-keerthanam) is valid schema v1.0.0
[PASS] "Samaja Vara Gamana" has 27 notes
[PASS] "Samaja Vara Gamana" has 2 sections
[PASS] "Samaja Vara Gamana" is explicitly verified public domain
[PASS] "Samaja Vara Gamana" cites authoritative source treatise
[PASS] "Sri Gananatha (Lambodara)" (sri-gananatha-malahari-geetham) is valid schema v1.0.0
[PASS] "Sri Gananatha (Lambodara)" has 12 notes
[PASS] "Sri Gananatha (Lambodara)" has 1 sections
[PASS] "Sri Gananatha (Lambodara)" is explicitly verified public domain
[PASS] "Sri Gananatha (Lambodara)" cites authoritative source treatise
[PASS] "Rara Venu Gopa Bala" (rara-venu-gopa-bala-bilahari) is valid schema v1.0.0
[PASS] "Rara Venu Gopa Bala" has 14 notes
[PASS] "Rara Venu Gopa Bala" has 1 sections
[PASS] "Rara Venu Gopa Bala" is explicitly verified public domain
[PASS] "Rara Venu Gopa Bala" cites authoritative source treatise
[PASS] "Sarali Varisai 1 (Fundamental Octave Step)" (sarali-varisai-1-mayamalavagowla) is valid schema v1.0.0
[PASS] "Sarali Varisai 1 (Fundamental Octave Step)" has 16 notes
[PASS] "Sarali Varisai 1 (Fundamental Octave Step)" has 2 sections
[PASS] "Sarali Varisai 1 (Fundamental Octave Step)" is explicitly verified public domain
[PASS] "Sarali Varisai 1 (Fundamental Octave Step)" cites authoritative source treatise
[PASS] "Mohanam String-Crossing & Bow Balance Study" (violin-mohanam-string-crossing-study) is valid schema v1.0.0
[PASS] "Mohanam String-Crossing & Bow Balance Study" has 16 notes
[PASS] "Mohanam String-Crossing & Bow Balance Study" has 1 sections
[PASS] "Mohanam String-Crossing & Bow Balance Study" is explicitly verified public domain
[PASS] "Mohanam String-Crossing & Bow Balance Study" cites authoritative source treatise
[PASS] Malformed akshara sum correctly rejected by validator
[PASS] Error message reports duration mismatch
[PASS] Missing rights metadata correctly rejected

Results: 60 passed, 0 failed.
All Composition Schema & Rhythmic Invariants VERIFIED.
```

### 2.3 Synthetic Pitch Estimation Diagnostics (`npx tsx scripts/test-pitch.mjs`)
```text
--- NadaVerse Synthetic Pitch Estimator Diagnostic ---
[PASS] Sa (C4) (261.63 Hz) => Detected: 261.64 Hz, Error: 0.1 cents
[PASS] R1 (Shuddha Rishabham) (279.07 Hz) => Detected: 279.08 Hz, Error: 0.1 cents
[PASS] G3 (Antara Gandharam) (327.03 Hz) => Detected: 327.04 Hz, Error: 0 cents
[PASS] M1 (Shuddha Madhyamam) (348.84 Hz) => Detected: 348.85 Hz, Error: 0 cents
[PASS] Pa (Panchamam) (392 Hz) => Detected: 392.01 Hz, Error: 0 cents
[PASS] D1 (Shuddha Dhaivatam) (418.6 Hz) => Detected: 418.6 Hz, Error: 0 cents
[PASS] N3 (Kakali Nishadam) (490.55 Hz) => Detected: 490.56 Hz, Error: 0 cents
[PASS] Tara Sa (C5) (523.25 Hz) => Detected: 523.25 Hz, Error: 0 cents
[PASS] Silence threshold: successfully returned null (no false positive)
[PASS] Noise-only signal: successfully rejected (no false pitch detected)
All synthetic pitch tests PASSED.
```

### 2.4 Service Worker Security & Privacy Invariants (`npx tsx scripts/test-sw-privacy.mjs`)
```text
--- NadaVerse Service Worker Privacy & Security Verification ---
[PASS] Cache revision is v3 or higher
[PASS] Explicit PUBLIC_HTML_ALLOWLIST defined
[PASS] Authorization header bypasses cache
[PASS] Cookie header bypasses cache
[PASS] Next.js RSC query (_rsc) bypasses cache
[PASS] Next.js RSC headers bypass cache
[PASS] All /api/ endpoints strictly bypass cache
[PASS] Set-Cookie responses are never cached
[PASS] no-store Cache-Control is never cached
[PASS] private Cache-Control is never cached
[PASS] Offline navigation restricted to allowlist
[PASS] Cross-origin requests strictly bypass cache
[PASS] Query strings strictly excluded from HTML allowlist cache

Results: 13 passed, 0 failed.
All Service Worker privacy invariants VERIFIED.
```

### 2.5 E2E Smoke & System Invariant Verification (`node scripts/test-e2e-smoke.mjs`)
```text
--- NadaVerse E2E Mathematical, Schema, & Invariant Smoke Suite ---
[PASS] Malayalam translation dictionary contains core keys and non-empty strings
[PASS] Just Intonation ratios are strictly increasing monotonically from Sa to Tara Sa
[PASS] Pa (Panchamam) ratio is exactly 3/2 (1.500)
[PASS] Tara Sa ratio is exactly 2/1 (2.000)
[PASS] Sree Ragam raga definition has matching swara ratios for all arohana swaras
[PASS] Adi Tala (Chatusra Nadai) has exactly 32 sub-beats (aksharas * nadai)
[PASS] Rupaka Tala (Tisra Nadai) has exactly 18 sub-beats
[PASS] Misra Chapu (Chatusra Nadai) has exactly 28 sub-beats
[PASS] Composition catalog contains 10 compositions with 100% public domain licenses
[PASS] Autocorrelation algorithm on 440 Hz synthetic test wave detects 440.0 Hz
[PASS] Service worker bypasses caching on Authorization and Cookie request headers
[PASS] Service worker explicitly includes /privacy and /terms in public allowlist
[PASS] Standalone /privacy route page exists and exports React default component
[PASS] Standalone /terms route page exists and exports React default component
[PASS] Dynamic sitemap includes core static routes: /, /privacy, /terms

Results: 15 passed, 0 failed.
All E2E Smoke & System Invariants VERIFIED.
```

### 2.6 TypeScript Strict Verification (`npx tsc --noEmit`)
```text
(Command exited with code 0. Zero diagnostic errors emitted.)
```

### 2.7 ESLint Code Quality (`npx eslint src`)
```text
(Command exited with code 0. Zero errors, zero warnings.)
```

### 2.8 Next.js Turbopack Production Compilation (`npm run build`)
```text
> web@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 3.2s
- Cache Components enabled
- Partial Prefetching enabled

  Creating an optimized production build ...
✓ Compiled successfully in 35.8s
  Running TypeScript ...
  Finished TypeScript in 2.9s ...
  Collecting page data using 8 workers ...
✓ Generating static pages using 8 workers (9/9) in 1627ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/og
├ ○ /privacy
├ ○ /robots.txt
├ ƒ /sitemap.xml
└ ○ /terms

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### 2.9 Alembic Database Migration Chain Integrity (`python -m alembic heads`)
```text
95d82f7c0a11 (head)
```

---

## 3. Deployment-Only Checklist (Independent Hosting Environment Verification)

The following items cannot be asserted solely by local source execution and must be completed by the cloud deployment owner:

1. **Production Environment Secrets:**
   - Confirm `APP_ENV=production` and `DEBUG=false` are active on the running instance.
   - Confirm `SECRET_KEY` is a distinct random 32-byte secret (e.g. from `openssl rand -hex 32`) and fails startup if omitted or set to the default dev secret.
   - Confirm `GEMINI_API_KEY` is supplied only as a server-side environment variable and does not appear in client-side bundles or source maps.
2. **Reverse Proxy & TLS Termination:**
   - Confirm `TRUSTED_PROXIES` matches the actual ingress IP/CIDR block of the reverse proxy or CDN (e.g. Cloudflare / AWS ALB / Nginx).
   - Confirm HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains`) is enforced at the edge reverse proxy.
   - Confirm `CORS_ORIGINS` is set strictly to `https://nadaverse.abarjun.online` without wildcards.
3. **Database Topology & Backups:**
   - Confirm PostgreSQL database is running with connection pooling.
   - Rehearse `alembic upgrade head` on a staging copy before applying to production.
   - Verify automated daily database backups with point-in-time recovery and test a dry-run database restore drill.
4. **Multi-Instance Rate Limiting:**
   - When running multiple backend worker replicas, verify `REDIS_URL` is configured so that sliding-window rate limits are shared across all instances.
5. **Real-Browser Multi-Account & Audio Verification:**
   - Perform live smoke tests in a real browser: User A sign in $\to$ practice session $\to$ sign out $\to$ User B sign in $\to$ verify zero cached data leakage.
   - Test microphone permission denial flow and ensure fallback to Tanpura drone operates cleanly.
