# NadaVerse 2.0 — Infrastructure Cost Model & Sustainability Architecture

**Document Version:** 2.0.0  
**Product Commitment:** 100% Free Forever — Zero paywalls, subscriptions, paid API tiers, or advertisements.

---

## 1. Cost-Control Engineering Principles (Section 38)

Because NadaVerse is permanently free and funded as a public cultural utility, the architecture is engineered to keep marginal per-user server cost near zero:
1. **100% Browser-Local Audio DSP & MIR:** All Tanpura synthesis, 5-Nadai Solkattu scheduling, spectrogram FFT analysis, autocorrelation pitch detection, monophonic swara transcription, and experimental prayoga raga candidate scoring execute on the client's CPU via Web Audio API. **Server CPU & bandwidth cost for audio processing = \$0.00.**
2. **Zero Raw Audio Storage:** Practice recordings and microphone buffers remain in browser memory / local storage. No cloud object storage egress or storage fees are incurred for raw audio.
3. **Static & Cached Musicological Corpora:** The 72 Melakarta catalog, 35 Suladi Sapta Talas, compositions, and multilingual dictionary are served from static/in-memory verified corpora and cached via the privacy-isolated Service Worker (`sw.js`).
4. **Deterministic Algorithms First:** Ear training scoring, Tala/Korvai arithmetic validation, musical phrase search, and knowledge graph traversal use deterministic algorithms rather than paid LLM calls.
5. **Bounded AI Tutor With Deterministic Treatise Fallback:** `/api/v1/tutor/*` enforces sliding-window IP/user rate limiting (`30 req/min`) and automatically falls back to deterministic verified treatise retrieval when `GEMINI_API_KEY` is unset or quota-limited.

---

## 2. Resource & Capacity Projections by Monthly Active Users (MAU)

> **Explicit Assumptions:**
> - Average active learner completes 8 sessions/month (~25 minutes/session).
> - 95% of interactions (Tanpura, Tala metronome, Spectrogram Lab, Gamaka Lab, Ear Training, Composition Player) run locally in the browser after initial asset load (~1.2 MB gzipped).
> - Authenticated API calls average ~40 JSON requests/user/month (~4 KB/request) for progress sync, Sadhana logs, notation drafts, and Gurukulam assignments.
> - Costs below reflect standard public cloud published tiers (Vercel/Cloudflare Pages + Render/Fly.io/Railway + Managed PostgreSQL); actual billings depend on provider promotions and open-source sponsorships.

| Scale Tier | Monthly Active Users (MAU) | Estimated Monthly API Requests | Database Storage (Text & Metadata Only) | Static & API Bandwidth / Mo | Recommended Topology | Estimated Monthly Infrastructure Envelope (USD) |
|---|---|---|---|---|---|---|
| **Tier 1: Community Beta** | **100 MAU** | ~4,000 req/mo (~0.0015 req/sec) | < 25 MB (SQLite or Free Postgres) | ~0.5 GB | Single FastAPI container (512 MB RAM) + Static CDN free tier | **\$0 – \$7 / month** (Fits within standard free/hobby tiers) |
| **Tier 2: Regional Gurukulam** | **1,000 MAU** | ~40,000 req/mo (~0.015 req/sec) | ~150 MB | ~4.5 GB | 1× FastAPI instance (1 vCPU, 1 GB RAM) + Managed Postgres Starter + CDN | **\$7 – \$25 / month** |
| **Tier 3: National Academy Scale** | **10,000 MAU** | ~400,000 req/mo (~0.15 req/sec) | ~1.2 GB | ~45 GB | 2× FastAPI instances (1–2 vCPU, 2 GB RAM) + Managed Postgres (2 GB RAM) + Redis Rate Limiter + Cloudflare CDN | **\$35 – \$95 / month** |
| **Tier 4: Global Classical Ecosystem** | **100,000 MAU** | ~4,000,000 req/mo (~1.5 req/sec avg, ~15 req/sec peak) | ~10–15 GB | ~450 GB (Offloaded via Cloudflare CDN & SW Cache) | 2–4× FastAPI workers (2 vCPU, 4 GB RAM) + Managed Postgres with Read Replica + Redis Cluster + CDN caching `/api/v1/public/*` | **\$150 – \$380 / month** |

---

## 3. Why NadaVerse Avoids Exponential AI/Audio Cloud Costs

If NadaVerse streamed raw microphone audio (e.g., 16-bit 44.1 kHz mono = ~5.3 MB/minute) to cloud GPU servers for pitch tracking and transcription, **10,000 MAU** practising 200 minutes/month would upload **10.6 TB/month** of raw audio and require dedicated GPU inference instances costing **\$2,500–\$8,000+/month**. By executing all DSP and MIR locally in the browser and syncing only compact JSON metadata (`< 2 KB` per session), NadaVerse reduces infrastructure cost by **> 98%** while guaranteeing absolute acoustic privacy.
