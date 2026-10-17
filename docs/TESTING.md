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
- **28 passed in ~9.5s** (0 failed, 0 errors, 100% passing).
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
  16. `test_health_and_readiness_endpoints`
  17. `test_ai_gateway_injection_and_guardrails`
  18. `test_ai_gateway_provenance_and_confidence`
  19. `test_tutor_post_stream_endpoint`
  20. `test_rate_limiter_trusted_proxy_logic`
  21. `test_in_memory_rate_limiter_concurrency_and_timestamps`
  22. `test_auth_deleted_account_and_cascade_lifecycle`
  23. `test_audio_practice_consent_enforcement_and_metrics_separation`
  24. `test_practice_session_lifecycle_and_duration_accuracy`
  25. `test_ai_citations_source_traceability`
  26. `test_practice_session_abandon_and_summary_lifecycle`
  27. `test_content_correction_editorial_lifecycle`
  28. `test_alembic_migrations_schema_integrity`

### 2.2. Synthetic Pitch Detection Diagnostics
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

### 2.3. Frontend TypeScript Strict Type-Check
```bash
cd web
npx tsc --noEmit
```
**Observed Execution Result:**
- Exit code: 0, **0 errors**. Strict TypeScript 5 with App Router types.

### 2.4. Frontend ESLint Code Quality
```bash
cd web
npm run lint
```
**Observed Execution Result:**
- Exit code: 0, **0 errors, 0 warnings**.

### 2.5. Next.js Production Build
```bash
cd web
npm run build
```
**Observed Execution Result:**
- Exit code: 0, **Compiled successfully** in ~2s with static prerendering across all routes (`/`, `/_not-found`, `/api/og`, `/robots.txt`, `/sitemap.xml`).

### 2.6. Database Migration Integrity
```bash
cd backend
python -m alembic heads
```
**Observed Execution Result:**
- Single clean head revision: `95d82f7c0a11`.
