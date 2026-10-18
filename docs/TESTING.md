# NadaVerse — Automated Testing & Verification Guide

**Date:** 18 October 2026  
**Candidate Release Commit:** `e46104b4879e33ede682eee0329f3085e9456afe` (`e46104b`)  
**Status:** All Automated Suites Verified 100% Green (156 Automated Checks)  
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
│  - Synthetic Pitch Diagnostics (10 checks)             │
│  - Acoustic Pitch Research Benchmark (19 checks)       │
│  - Service Worker Multi-Account Privacy (13 checks)    │
│  - Mathematical & E2E Smoke Invariants (18 checks)     │
│  - Composition Schema & Rhythmic Math (60 checks)      │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│  - 36 Pytest Integration, RBAC & Privacy Tests         │
│  - Two-User IDOR Cross-Account Data Isolation          │
│  - User Data Portability (`GET /api/v1/me/export`)     │
│  - Cascading Account Deletion (`DELETE /api/v1/me`)    │
│  - Audio Consent & Browser-Local Metrics Separation   │
│  - Practice Session Lifecycle & Summary Mathematics    │
│  - Prompt Injection & AI Citation Traceability Guard   │
│  - Trusted Proxy Token-Bucket Rate Limiter Tests       │
│  - Editorial Correction Queue & Moderation Tests       │
│  - Deployment Metadata Endpoint (`/meta/deployment`)   │
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
- **36 passed in ~25.7s** (0 failed, 0 errors, 100% passing).
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
  34. `test_deployment_metadata_endpoint`
  35. `test_two_user_export_and_isolation`
  36. `test_account_deletion_lifecycle_via_me`

### 2.2. Composition Schema & Rhythmic Integrity Tests
Run the composition schema and rhythmic akshara validation in `web/`:
```bash
cd web
npx tsx scripts/test-compositions-schema.mjs
```
**Observed Execution Result:**
- **60 passed in ~2.5s** (0 failed, 100% passing).
- Validates 10 compositions across 6 classical forms (Tana Varnam, Kriti/Keerthanam, Geetham, Swarajathi, Varisai, Violin Practice Study).
- Invariant checks verify note counts, section structures, akshara duration totals matching tala cycle lengths, explicit public domain rights, and authoritative treatise citations.
- Error injection tests verify negative rejection of malformed aksharas, duration mismatches, and missing rights metadata.

### 2.3. Synthetic Pitch Detection Diagnostics
Run the synthetic audio evaluation harness in `web/`:
```bash
cd web
npx tsx scripts/test-pitch.mjs
```
**Observed Execution Result:**
- **10 passed in ~2.5s** (0 failed, 100% passing).
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

### 2.4. Acoustic Multi-Register & Noise Pitch Research Benchmark
Run the pitch estimator acoustic research benchmark in `web/`:
```bash
cd web
npx tsx scripts/test-pitch-benchmark.mjs
```
**Observed Execution Result:**
- **19 passed in ~2.8s** (0 failed, 100% passing).
- Benchmarks pitch tracking accuracy and latency across Mandra (P̣, Ṣ), Madhya, and Tara (Ṡ, Ġ3, Ṗ) registers.
- Validates tracking under 5.5 Hz gamaka vibrato frequency modulation.
- Validates robustness in background acoustic room noise.
- Validates unvoiced silence rejection and pure random white-noise rejection.
- Guarantees per-frame analysis latency under 15ms.

### 2.5. Service Worker Privacy & Cache Boundary Tests
Run the service worker security and privacy isolation suite in `web/`:
```bash
cd web
npx tsx scripts/test-sw-privacy.mjs
```
**Observed Execution Result:**
- **13 passed in ~2.3s** (0 failed, 100% passing).
- Validates public HTML allowlist, strict cache bypass for `Authorization` and `Cookie` headers, Next.js React Server Component (`_rsc`, `next-action`) bypass, `/api/` network-only isolation, exclusion of `Set-Cookie`, `no-store`, and `private` responses, cross-origin disallow, and query-string protection.

### 2.6. E2E Smoke & System Invariant Verification Suite
Run the end-to-end mathematical and system invariant smoke harness in `web/`:
```bash
cd web
npm run test:e2e
# or: node scripts/test-e2e-smoke.mjs
```
**Observed Execution Result:**
- **18 passed in ~0.1s** (0 failed, 100% passing).
- Tests cover:
  1. `[PASS] Translations file exists and contains English and Malayalam maps`
  2. `[PASS] Just Intonation ratios include exact mathematical fractions (R1=16/15, G3=5/4, P=3/2)`
  3. `[PASS] Tala Adi Tala: 8 aksharas at 60 BPM calculates beat duration ~1000ms`
  4. `[PASS] Tala Rupaka Tala: 6 aksharas at 120 BPM calculates beat duration ~500ms`
  5. `[PASS] Tala Khanda Chapu: 5 aksharas at 75 BPM calculates beat duration ~800ms`
  6. `[PASS] Tala Misra Chapu: 7 aksharas at 84 BPM calculates beat duration ~714ms`
  7. `[PASS] Composition library defines COMPOSITION_CATALOG with all 6 core categories`
  8. `[PASS] Compositions feature dual-mode rendition (vocal Akara vowel & violin fingering)`
  9. `[PASS] Pitch detector uses normalized time-domain autocorrelation with parabolic interpolation`
  10. `[PASS] Pitch detector includes silence threshold and parabolic peak refinement`
  11. `[PASS] Service Worker includes /privacy and /terms in public allowlist`
  12. `[PASS] Service Worker strictly bypasses cache on Authorization header (preventing account data cross-leakage)`
  13. `[PASS] Service Worker rejects private and no-store responses`
  14. `[PASS] /privacy standalone route exists and provides zero-audio-retention disclosures`
  15. `[PASS] /terms standalone route exists and states 100% Free Forever non-commercial commitment`
  16. `[PASS] Backend auth router implements user-scoped data export (/me/export)`
  17. `[PASS] Backend system router provides deployment metadata endpoint (/api/v1/meta/deployment)`
  18. `[PASS] Footer provides non-commercial voluntary Buy Me a Coffee link without tracking cookies`

### 2.7. Grand Total Verification Count
The **156 checks** total is the exact sum of the six counted test and invariant suites:
$$36 \text{ (Backend)} + 60 \text{ (Compositions)} + 10 \text{ (Pitch Diagnostics)} + 19 \text{ (Pitch Benchmark)} + 13 \text{ (SW Privacy)} + 18 \text{ (E2E Smoke)} = 156 \text{ Passed (100\%)}$$

Four additional static quality gates are verified before release:
- **TypeScript Strict Check:** `npx tsc --noEmit` $\to$ **0 errors (Exit 0)**
- **ESLint Code Hygiene:** `npm run lint` $\to$ **0 errors, 0 warnings (Exit 0)**
- **Alembic Database Head:** `python -m alembic heads` $\to$ **Clean single head (`95d82f7c0a11`)**
- **Next.js Turbopack Build:** `npm run build` $\to$ **Clean compilation across all 9 routes**
