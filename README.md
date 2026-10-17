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
- **Testing:** Pytest (30 backend unit/integration tests) + Next.js production build & strict TypeScript verification + 10 synthetic pitch tests + 11 service worker privacy tests

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
*Current status:* **30 passed (100%)** covering curriculum progression, tala calculations, audio practice companion analysis, teacher-student authorization workflows, rate limiting scope & trusted proxy resolution, and heritage archive moderation.

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
*Current status:* **11 passed (100%)** testing public allowlist, cookie/auth isolation, and RSC prevention.

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

- [docs/feature-implementation-report.md](docs/feature-implementation-report.md) — Comprehensive six-feature implementation report.
- [docs/content-provenance-and-licensing.md](docs/content-provenance-and-licensing.md) — Source attribution, treatise provenance, and licensing policy.
- [docs/testing-and-release-checklist.md](docs/testing-and-release-checklist.md) — Verification checklist and release testing records.
- [docs/architecture.md](docs/architecture.md) — Complete full-stack system architecture.

---

## 📄 License

Released under the **MIT License** for code and **CC-BY-SA 4.0** for musicological educational content.
NadaVerse is and will always remain completely free for all learners, teachers, and musicians worldwide.
