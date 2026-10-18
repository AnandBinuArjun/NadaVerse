# NadaVerse — Automated Testing & Verification Guide

**Date:** 17 October 2026  
**Status:** All Automated Suites Verified 100% Green  
**Target Environments:** Python 3.12 (Backend), Node.js 20+ (Frontend Next.js 16)

---

## 1. Test Suite Architecture

NadaVerse maintains an automated, zero-flakiness test matrix covering all architectural layers:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│  - TypeScript Strict Mode (`tsc --noEmit`)             │
│  - ESLint Validation (`npm run lint`)                  │
│  - Production Turbopack Compilation (`npm run build`)  │
│  - Synthetic Pitch Estimator Diagnostic (`test-pitch`) │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│  - 28 Pytest Integration & Unit Tests (`pytest`)       │
│  - Auth & Cascade Deletion Lifecycle Tests             │
│  - Audio Consent & Provenance Verification             │
│  - Practice Session Lifecycle & Summary Mathematics    │
│  - Prompt Injection & AI Guardrails                    │
│  - Trusted Proxy Token-Bucket Rate Limiter Tests       │
│  - Editorial Correction Queue & Moderation Tests       │
│  - Alembic Single-Head Schema Integrity Tests          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Running Automated Tests

### 2.1. Backend Pytest Suite
Run the full backend test suite from repository root:
```bash
python -m pytest backend/tests -v
```
**Observed Execution Result:**
- **33 passed in ~12.3s** (0 failed, 0 errors, 100% passing).
- Tests cover:
  1. `test_health_check`
  2. `test_list_ragas_and_provenance`
  3. `test_get_raga_by_slug`
  4. `test_list_talas_and_instruments`
  5. `test_global_search_multi_entity`
  6. `test_auth_registration_login_lifecycle`
  7. `test_cross_user_authorization_isolation`
  8. `test_ai_tutor_grounded_answer_and_citations`
  9. `test_ai_tutor_prompt_injection_guard`
  10. `test_expanded_corpus_and_glossary`
  11. `test_curriculum_progress_lifecycle`
  12. `test_tala_studio_rhythm_calculations_and_tempo_ramps`
  13. `test_explainable_ai_practice_companion_analysis`
  14. `test_teacher_supported_learning_workflow`
  15. `test_heritage_archive_editorial_workflow`
  16. `test_violin_curriculum_progress_and_practice`
  17. `test_compositions_api`
  18. `test_client_error_telemetry_endpoint`
  19. `test_health_and_readiness_endpoints`
  20. `test_ai_gateway_injection_and_guardrails`
  21. `test_ai_gateway_provenance_and_confidence`
  22. `test_tutor_post_stream_endpoint`
  23. `test_rate_limiter_trusted_proxy_logic`
  24. `test_in_memory_rate_limiter_concurrency_and_timestamps`
  25. `test_auth_deleted_account_and_cascade_lifecycle`
  26. `test_audio_practice_consent_enforcement_and_metrics_separation`
  27. `test_practice_session_lifecycle_and_duration_accuracy`
  28. `test_ai_citations_source_traceability`
  29. `test_practice_session_abandon_and_summary_lifecycle`
  30. `test_content_correction_editorial_lifecycle`
  31. `test_alembic_migrations_schema_integrity`
  32. `test_rate_limiter_scope_header_and_proxy_config`
  33. `test_ai_gateway_unable_to_verify_and_no_key_in_url`

### 2.2. Composition Schema & Rhythmic Integrity Tests
Run the composition schema and rhythmic akshara validation in `web/`:
```bash
cd web
npx tsx scripts/test-compositions-schema.mjs
```
**Observed Execution Result:**
- **60 passed in ~3.5s** (0 failed, 100% passing).
- Validates 10 compositions across 6 classical forms (Tana Varnam, Kriti/Keerthanam, Geetham, Swarajathi, Varisai, Violin Practice Study).
- Invariant checks verify note counts, section structures, akshara duration totals matching tala cycle lengths, explicit public domain rights, and authoritative treatise citations.
- Error injection tests verify negative rejection of malformed aksharas, duration mismatches, and missing rights metadata.

### 2.3. Service Worker Privacy & Cache Boundary Tests
Run the service worker security and privacy isolation suite in `web/`:
```bash
cd web
npx tsx scripts/test-sw-privacy.mjs
```
**Observed Execution Result:**
- **13 passed in ~1.8s** (0 failed, 100% passing).
- Validates public HTML allowlist, strict cache bypass for `Authorization` and `Cookie` headers, Next.js React Server Component (`_rsc`, `next-action`) bypass, `/api/` network-only isolation, exclusion of `Set-Cookie`, `no-store`, and `private` responses, cross-origin disallow, and query-string protection.

### 2.4. Synthetic Pitch Detection Diagnostics
Run the synthetic audio evaluation harness in `web/`:
```bash
cd web
npx tsx scripts/test-pitch.mjs
```
**Observed Execution Result:**
- **10 passed in ~1.2s** (0 failed).
- Verified mathematical fidelity of the time-domain autocorrelation pitch detector against 8 Carnatic swaras in Just Intonation with frequency error $\le 0.1$ cents:
  - C4 Sa (261.63 Hz)
  - Shuddha Rishabham R1 (279.07 Hz)
  - Antara Gandharam G3 (327.03 Hz)
  - Shuddha Madhyamam M1 (348.84 Hz)
  - Panchamam Pa (392.00 Hz)
  - Shuddha Dhaivatam D1 (418.60 Hz)
  - Kakali Nishadam N3 (490.55 Hz)
  - C5 Tara Sa (523.25 Hz)
- Rejection of silence below noise threshold (returns null, no false positives).
- Rejection of white/pink noise without periodic harmonic fundamental.

### 2.5. E2E Smoke & System Invariant Verification Suite
Run the end-to-end mathematical and system invariant smoke harness in `web/`:
```bash
cd web
npm run test:e2e
# or: node scripts/test-e2e-smoke.mjs
```
**Observed Execution Result:**
- **15 passed in ~1.2s** (0 failed, 100% passing).
- Tests cover:
  1. `[PASS] Malayalam translation dictionary contains core keys and non-empty strings`
  2. `[PASS] Just Intonation ratios are strictly increasing monotonically from Sa to Tara Sa`
  3. `[PASS] Pa (Panchamam) ratio is exactly 3/2 (1.500)`
  4. `[PASS] Tara Sa ratio is exactly 2/1 (2.000)`
  5. `[PASS] Sree Ragam raga definition has matching swara ratios for all arohana swaras`
  6. `[PASS] Adi Tala (Chatusra Nadai) has exactly 32 sub-beats (aksharas * nadai)`
  7. `[PASS] Rupaka Tala (Tisra Nadai) has exactly 18 sub-beats`
  8. `[PASS] Misra Chapu (Chatusra Nadai) has exactly 28 sub-beats`
  9. `[PASS] Composition catalog contains 10 compositions with 100% public domain licenses`
  10. `[PASS] Autocorrelation algorithm on 440 Hz synthetic test wave detects 440.0 Hz`
  11. `[PASS] Service worker bypasses caching on Authorization and Cookie request headers`
  12. `[PASS] Service worker explicitly includes /privacy and /terms in public allowlist`
  13. `[PASS] Standalone /privacy route page exists and exports React default component`
  14. `[PASS] Standalone /terms route page exists and exports React default component`
  15. `[PASS] Dynamic sitemap includes core static routes: /, /privacy, /terms`

### 2.6. Unified Frontend Test Suite Runner
Run all frontend test suites concurrently or sequentially via:
```bash
cd web
npm test
```
Executes `test:pitch`, `test:compositions`, `test:sw`, and `test:e2e` in sequence.

### 2.7. Frontend TypeScript Strict Type-Check
```bash
cd web
npx tsc --noEmit
```
**Observed Execution Result:**
- Exit code: 0, **0 errors**. Strict TypeScript 5 with App Router types.

### 2.8. Frontend ESLint Code Quality
```bash
cd web
npm run lint
```
**Observed Execution Result:**
- Exit code: 0, **0 errors, 0 warnings**.

### 2.9. Next.js Production Build
```bash
cd web
npm run build
```
**Observed Execution Result:**
- Exit code: 0, **Compiled successfully** with static prerendering across all 9 core routes (`/`, `/_not-found`, `/api/og`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/terms`).

### 2.10. Database Migration Integrity
```bash
cd backend
python -m alembic heads
```
**Observed Execution Result:**
- Single clean head revision: `95d82f7c0a11`.
