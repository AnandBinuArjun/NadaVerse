<p align="center">
  <img src="./assets/logo.png" alt="NadaVerse — Carnatic Music For Everyone" width="480" />
</p>

# NadaVerse — Carnatic Music Discovery & Practice Sanctuary

> **Discover Carnatic music. Understand its language. Practise with purpose.**

NadaVerse is an all-in-one, completely free Carnatic music platform that brings together:
- **Beginner Orientation:** A structured 3-part pathway explaining Shruti, Sapta Swaras, and Laya.
- **Peer-Reviewed Reference Knowledge Base:** Arohanam/avarohanam, swarasthana ratios, historical contexts, and full bibliographic citations for Ragas, Talas, and Instruments (Mayamalavagowla, Shankarabharanam, Mechakalyani, Saraswati Veena, Mridangam, Tambura).
- **Web Audio Practice Studio:**
  - **Shruti & Tanpura Engine:** Acoustically modeled 4-string Tambura with natural Jivari overtone resonance and Just Intonation note auditioning.
  - **Tala Studio & Metronome:** Drift-free rhythmic scheduler tracking traditional Carnatic Angas (Laghu & Dhrutam) with solkattu syllables and thattu/veechu kriya guidance.
- **Grounded AI Tutor Gateway:** Retrieval-grounded assistant with verified citations and transparent uncertainty reporting. Never fabricates citations.
- **Zero Paywalls:** Completely free for all learners, educators, and musicians. No subscriptions or paid feature gates.

---

## Architecture & Technology Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Audio Engine:** Low-latency Web Audio API (Tanpura harmonic overtone synthesis & Lookahead Metronome scheduler)
- **Icons & Styling:** Lucide React line icons + Semantic Carnatic design tokens (Dark charcoal `#11110F`, Warm ivory `#F4EBDD`, Antique gold `#C7A45B`)
- **Backend API:** Python 3.12 + FastAPI + Pydantic v2
- **Testing:** Pytest + Httpx ASGITransport (Backend) & Next.js production build / TypeScript verification (Frontend)

---

## Directory Structure

```text
NadaVerse/
├── docs/                   # Architectural & specification documents
│   ├── prd.md              # Product Requirements Document
│   ├── agent.md            # Agent Operating Guide
│   ├── architecture.md     # System Architecture Reference
│   ├── design_system.md    # Design Tokens & Visual Guidelines
│   ├── ui_ux.md            # Interaction & Journey Specifications
│   └── prompt.md           # Master Build Directives
├── web/                    # Next.js Web Application
│   ├── src/
│   │   ├── app/            # App Router (layout, globals.css, page.tsx)
│   │   ├── components/     # UI Components (Navbar, ShrutiCompanion, TalaStudio, RagaCard, etc.)
│   │   ├── data/           # Verified Carnatic dataset with full provenance
│   │   ├── lib/            # Low-latency Web Audio API engine
│   │   └── types/          # TypeScript domain models
│   ├── package.json
│   └── tsconfig.json
├── backend/                # FastAPI Modular Backend
│   ├── app/
│   │   ├── main.py         # FastAPI endpoints & CORS configuration
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── data/           # Verified backend corpus
│   ├── tests/              # Backend test suite (Pytest)
│   └── requirements.txt
├── .env.example            # Environment configuration template (no secrets)
└── .gitignore
```

---

## Getting Started

### 1. Web Application (Next.js)

```bash
cd web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend API (FastAPI)

```bash
# In workspace root or backend directory
python -m pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

Access OpenAPI interactive documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Running Verification Tests

```bash
# Frontend build & TypeScript check
cd web
npm run build

# Backend API tests
python -m pytest backend/tests
```

---

## Privacy, Audio Safety & Editorial Policy

- **No Unauthorized Model Training:** Personal audio recordings remain local and private, and are never used to train machine learning models.
- **Musicological Provenance:** Every raga, tala, and instrument entry cites primary musicology sources (Subbarama Dikshitar's *Sangita Sampradaya Pradarsini*, Prof. P. Sambamoorthy's *South Indian Music*, Madras Music Academy publications).
- **Pitch vs Swara Integrity:** The platform explicitly teaches that raw physical pitch is not equivalent to musical swara expression without tonic context and gamaka movement.
