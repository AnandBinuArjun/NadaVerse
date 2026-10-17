# Contributing to NadaVerse

Thank you for your interest in contributing to **NadaVerse**! NadaVerse is an open-source, 100% free digital learning ecosystem dedicated to Carnatic musicology, practice companions, and cultural heritage preservation.

## Core Principles

1. **100% Free Forever:** NadaVerse must remain completely free for all learners and teachers. Never propose paywalls, gated subscriptions, advertisements, or monetization mechanics.
2. **Musicological Authenticity:** All ragas, talas, compositions, and treatise citations must adhere strictly to verified classical authorities (*Chaturdandi Prakasika*, *Sangita Ratnakara*, *Sangita Sampradaya Pradarsini*).
3. **No Hallucinated Claims:** Acoustic companion algorithms and AI explanations must be transparent, evidence-grounded, and clearly state measurement limits without exaggerated claims.

---

## How Can You Contribute?

* **Musicological Data & Treatises:** Help expand or correct raga swarasthanas, composer biographies, tala angas, and historical epigraphy.
* **Bug Fixes & Security:** Fix reported issues, enhance API validation, or strengthen accessibility.
* **Audio Engineering:** Improve Web Audio scheduling lookahead, pitch extraction precision, or synthesizer timbres.
* **Translations:** Expand Malayalam, Tamil, Telugu, Kannada, Sanskrit, and English transliterations and UI strings.

---

## Development Setup

### Backend (FastAPI + Python 3.12)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run test suite
python -m pytest backend/tests -v

# Run local development server
cd backend && uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js 16 + React 19 + TypeScript)
```bash
cd web

# Install dependencies
npm ci

# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Start local development server
npm run dev
```

---

## Pull Request Guidelines

1. **Fork & Branch:** Create a feature or fix branch from `main` (e.g. `feature/shankarabharanam-annotations` or `fix/audio-buffer-leak`).
2. **Automated Checks:** Ensure both `python -m pytest backend/tests` and `npx tsc --noEmit` pass with zero failures before opening a pull request.
3. **Commit Messages:** Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `test:`).
4. **Code of Conduct:** Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all discussions and code reviews.
