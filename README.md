<p align="center">
  <img src="./assets/logo.png" alt="NadaVerse — Carnatic Music For Everyone" width="480" />
</p>

# NadaVerse — Carnatic Music Discovery, Practice Sanctuary & Gurukulam

> **Discover Carnatic music. Understand its language. Practise with purpose. 100% Free Forever.**

NadaVerse is a comprehensive, open-source Carnatic music ecosystem combining authentic musicological research, microtonal Just Intonation sound synthesis, evidence-grounded AI acoustic analysis, structured curriculum paths, and collaborative mentorship.

---

## 🌟 Six Major Core Features

1. **Interactive Carnatic Learning Paths:**
   - 13 structured lessons across Vocal (*Gāyana Mārga*), Instrumental (*Vādya Mārga*), and Rhythm (*Tāla Mārga*).
   - Prerequisite gating, search, difficulty/completion filters, multiple-choice quizzes with instant musical rationales and revision recommendations, and persistent progress.
2. **Carnatic Instrument Learning Library:**
   - In-depth profiles for 9 core instruments (Veena, Violin, Mridangam, Flute, Tambura, Ghatam, Kanjira, Nadaswaram, Morsing).
   - Dynamic Web Audio synthesis auditions instrument timbres on demand.
   - Comprehensive beginner posture guidance, common mistakes, storage/care, and bookmarking.
3. **Better Tala Studio:**
   - Precision Web Audio lookahead rhythmic scheduler (drift-free).
   - 4-beat Lead-in Count-In mode before cycle starts.
   - Bounded tempo ramps (start/target BPM, cycle intervals, automatic Samam increments).
   - Live cycle counter, elapsed timer, and reusable rhythm presets with direct Sadhana Journal logging.
4. **Explainable AI Practice Companion:**
   - Evidence-based performance analysis using browser autocorrelation pitch extraction.
   - Real-time pitch contour visualizer graphing sung frequencies against Adhara Shadjam swarasthanas.
   - Cent deviation meter per swara, pitch stability index, and grounded guru feedback via `/api/v1/audio/analyze-practice` with transparent limitations notices.
5. **Teacher-Supported Learning (Gurukulam):**
   - 100% Free Gurukulam learning workspace with dual Student and Teacher modes.
   - Expiring 64-character invitation tokens, group enrollment, and assignment creation (Kalam, BPM, instructions, due dates).
   - Student practice note submissions with attached acoustic scores, and teacher reviews with constructive feedback.
   - Backend authorization ensuring strict cross-user data isolation.
6. **Carnatic Heritage Archive:**
   - Curated digital repository documenting instrument lutherie (Thanjavur Veena Jackwood carving, Manamadurai Ghatam), composer biographies, temple epigraphy (7th-century Kudumiyanmalai rock inscriptions), and treatise publication histories.
   - Full-text search, category filters, article reader modal with complete academic citations and license declarations.
   - Contributor submission workflow with mandatory peer-review moderation.

---

## 🛡️ Non-Negotiable Product Guarantees

- **100% Free Forever:** Zero paywalls, subscriptions, checkouts, or advertisements.
- **Pedagogical Integrity:** Microtonal Just Intonation (*22 Shrutis*), verified treatises (*Chaturdandi Prakasika*, *Sangita Ratnakara*, *Sangita Sampradaya Pradarsini*).
- **Privacy by Design:** Local audio processing inside the browser; raw microphone audio is never retained on the server.
- **Bilingual Interface:** Complete English and Malayalam (`ml`) localization.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** Next.js 16 (App Router + Turbopack) + TypeScript + Tailwind CSS
- **Audio Engine:** Low-latency Web Audio API (Tanpura overtone synthesis, instrument timbre modeling, autocorrelation pitch tracking, drift-free metronome)
- **Backend API:** Python 3.12 + FastAPI + SQLAlchemy + SQLite / PostgreSQL
- **AI Gateway:** Provider-neutral gateway with Google Gemini 1.5 Flash / Pro and deterministic classical treatise fallback
- **Testing:** Pytest (33 backend unit/integration tests) + Next.js 16 production build & strict TypeScript verification + 40 composition schema tests + 10 synthetic pitch tests + 13 service worker privacy tests

---

## 🔄 System Data Flow & Security Architecture

### Data Flow Diagram

```text
[ Browser Client (Next.js 16) ]
  ├── Web Audio Hardware Clock
  │     ├── Tanpura Drone Synthesis (Pa, Ma, Ni with Jivari resonance)
  │     ├── Tala Metronome Scheduler (Acoustic Bell + Mridangam Solkattu)
  │     └── Just Intonation Auditioning (web/src/lib/carnaticRatios.ts)
  │
  ├── Browser-Local Acoustic Tracking
  │     ├── Microphone Input (User-Calibrated)
  │     ├── Local Autocorrelation Pitch Detector (Zero audio leaves client)
  │     └── Cent Deviation & Stability Contours
  │
  ├── Transparent API Gateway / Next.js Proxy
  │     └── Rewrites: /api/v1/:path* ──► FastAPI Backend (:8000)
  │
  └── Error Boundary & Telemetry Beacon
        └── Non-blocking navigator.sendBeacon ──► POST /api/v1/telemetry/errors

[ FastAPI Backend (:8000) ]
  ├── Security & Authorization Middleware
  │     ├── Trusted Proxy & Sliding-Window IP Rate Limiting
  │     ├── Bearer JWT Verification (deps.get_current_active_user)
  │     └── Role-Based Access Control (deps.get_current_editor_or_admin)
  │           ├── Guarded: POST /api/v1/corrections/{id}/review
  │           ├── Guarded: GET  /api/v1/heritage/editorial/pending
  │           └── Guarded: POST /api/v1/heritage/{id}/review
  │
  ├── Pedagogical & Musicological Engines
  │     ├── Composition Catalog & Schema Validation (6 Cornerstone Forms)
  │     ├── Gurukulam Teacher-Student Assignments & Ownership Gating
  │     └── AI Practice Companion Analysis (Provider-neutral Gemini + Treatise fallback)
  │
  └── Telemetry Ingestion
        └── Structured audit logging for uncaught runtime & audio errors
```

### Security & Privacy Commitments

1. **Role-Based Access Control (RBAC):**
   - User identities support distinct roles (`student`, `teacher`, `editor`, `admin`).
   - Ordinary students and teachers are strictly forbidden (HTTP 403 Forbidden) from approving or rejecting editorial corrections or heritage archive submissions. Only authenticated `editor` and `admin` accounts can modify canonical content.
2. **Zero Raw Audio Retention:**
   - Microphone pitch analysis is executed entirely on the client's device using real-time Web Audio API autocorrelation. Only extracted numerical features (mean cents deviation, pitch stability score, swarasthana timestamps) are submitted to `/api/v1/audio/analyze-practice`.
3. **Resilient Error Telemetry:**
   - Uncaught UI and Web Audio exceptions are trapped by the React `<ErrorBoundary>` and dispatched non-blocking via `navigator.sendBeacon` to `/api/v1/telemetry/errors` without degrading the user's practice experience.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.11 or 3.12

### 1. Clone & Setup Repository
```bash
git clone https://github.com/AnandBinuArjun/NadaVerse.git
cd NadaVerse
```

### 2. Run Backend API
```bash
# Navigate to backend and install dependencies
cd backend
python -m pip install -r requirements.txt

# Run backend development server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI documentation is available at `http://localhost:8000/docs`.

### 3. Run Frontend Web Application
```bash
# Navigate to web and install dependencies
cd ../web
npm install

# Run frontend development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Verification & Automated Testing

### Backend Test Suite (Pytest)
```bash
python -m pytest backend/tests -v
```
*Current status:* **33 passed (100%)** covering curriculum progression, tala calculations, audio practice companion analysis, teacher-student authorization workflows, rate limiting scope & trusted proxy resolution, heritage archive moderation, role-based access control (RBAC 403 Forbidden enforcement), and client error telemetry ingestion.

### Frontend Composition Schema & Rhythmic Integrity Tests
```bash
cd web
npx tsx scripts/test-compositions-schema.mjs
```
*Current status:* **40 passed (100%)** testing all 6 repertoire forms, akshara duration sums, section structures, public domain assertions, and treatise citations.

### Frontend Synthetic Pitch Tests
```bash
cd web
npx tsx scripts/test-pitch.mjs
```
*Current status:* **10 passed (100%)** testing 8 swarasthanas, silence gating, and noise rejection.

### Service Worker Privacy & Boundary Tests
```bash
cd web
npx tsx scripts/test-sw-privacy.mjs
```
*Current status:* **13 passed (100%)** testing public allowlist, cookie/auth isolation, RSC prevention, cross-origin bypass, and query-string isolation.

### Frontend TypeScript & Production Build
```bash
cd web
npx tsc --noEmit
npm run lint
npm run build
```
*Current status:* **0 TypeScript errors**, **0 ESLint errors**, **production build successful**.

---

## 📚 Documentation Index

- [docs/publication-readiness-audit.md](docs/publication-readiness-audit.md) — Comprehensive source-level release audit and remediation report.
- [docs/feature-gap-matrix.md](docs/feature-gap-matrix.md) — 18-feature capability status matrix (EXISTS / PARTIAL / MISSING / NEEDS_VALIDATION).
- [docs/release-evidence.md](docs/release-evidence.md) — Automated test verification outputs, commit SHA, and release evidence.
- [docs/content-rights-ledger.md](docs/content-rights-ledger.md) — Item-level content rights and primary treatise provenance ledger.
- [docs/feature-implementation-report.md](docs/feature-implementation-report.md) — Six core features implementation report.
- [docs/content-provenance-and-licensing.md](docs/content-provenance-and-licensing.md) — Source attribution, treatise provenance, and licensing policy.
- [docs/testing-and-release-checklist.md](docs/testing-and-release-checklist.md) — Verification checklist and release testing records.
- [docs/architecture.md](docs/architecture.md) — Complete full-stack system architecture.

---

## 📄 License

Released under the **MIT License** for code and **CC-BY-SA 4.0** for musicological educational content.
NadaVerse is and will always remain completely free for all learners, teachers, and musicians worldwide.
