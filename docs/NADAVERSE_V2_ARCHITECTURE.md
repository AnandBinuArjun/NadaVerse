# NadaVerse 2.0 — System & Audio DSP Architecture

**Document Version:** 2.0.0  
**Last Updated:** 24 November 2026  

---

## 1. High-Level Architecture Diagram

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                   NadaVerse 2.0 Browser Client (Next.js 16.4.6)                   │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ Progressive Disclosure Experience Layer (100% Free Forever)                 │  │
│  │   [ Beginner ]   [ Standard ]   [ Advanced Musician ]   [ Research Lab ]    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│  ┌──────────────────────────────┐  ┌───────────────────────────────────────────┐  │
│  │ Web Audio Synthesis Engine   │  │ Browser-Local MIR & DSP Engine            │  │
│  │ (web/src/lib/audioEngine.ts) │  │ (web/src/lib/mirEngine.ts & pitchDetector)│  │
│  │ • 4-String Jivari Tanpura    │  │ • Autocorrelation F0 & Parabolic Peak     │  │
│  │ • Just Intonation Sequencer  │  │ • Harmonic Partial (H1–H6) & Centroid     │  │
│  │ • 5-Nadai Solkattu Scheduler │  │ • On-Device Signal Quality & Clipping     │  │
│  │ • Virtual Ensemble Mixer     │  │ • Monophonic Note Onset & Swara Segmenter │  │
│  │   (Veena/Violin/Mridangam/   │  │ • Deterministic Prayoga Raga Candidate    │  │
│  │    Ghatam/Kanjira)           │  │   Scorer ([EXPERIMENTAL] Research Lab)    │  │
│  └──────────────────────────────┘  └───────────────────────────────────────────┘  │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ Flagship Studios & Workspaces                                               │  │
│  │ • Personalised Learning Dashboard  • Musical Intelligence & Spectrogram Lab │  │
│  │ • Ear Training & Memory Academy    • Kutcheri Planner & Live Stage Mode     │  │
│  │ • Gamaka Laboratory                • Knowledge Graph & Phrase Search Engine │  │
│  │ • 72 Melakarta & 35 Tala Studios   • Comparative Theory & 6-Lang Dictionary │  │
│  │ • Swara Notation & Manodharma      • Non-Accredited Certificates & Open API │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │ HTTPS / REST (/api/v1/*)
                                          │ (Zero raw microphone audio transmitted)
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                     NadaVerse 2.0 FastAPI Authoritative Backend                   │
│                                                                                   │
│  ┌──────────────────────────────┐  ┌───────────────────────────────────────────┐  │
│  │ Security & Privacy Layer     │  │ Public Open Developer API                 │  │
│  │ • CSP, Permissions-Policy    │  │ (/api/v1/public/*)                        │  │
│  │ • Sliding-Window Rate Limit  │  │ • /public/ragas, /talas, /composers       │  │
│  │ • JWT + Object-Level BOLA    │  │ • /public/instruments, /glossary          │  │
│  │ • Editor/Admin RBAC Gates    │  │ • /public/compositions, /relationships    │  │
│  │ • /me/export & DELETE /me    │  │ • /public/phrase-search (Transposition)   │  │
│  └──────────────────────────────┘  └───────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Progressive Disclosure & Experience Modes (Section 37)

To serve beginners without overwhelming them while empowering concert performers and musicologists, the UI supports four instant experience presets:
1. **Beginner Experience:** Highlights Guided Onboarding, Shruti Drone, 13-Lesson Curriculum, Ear Training Basics, and Foundational Ragas.
2. **Standard Experience:** Enables Practice Studio, Playable Compositions, 72 Melakarta Explorer, Violin Studio, and Gurukulam.
3. **Advanced Musician Experience:** Unlocks quick launch into Gamaka Laboratory, Konnakol & 35 Talas Korvai Studio, Swara Notation & Manodharma Editor, Kutcheri Concert Planner, Live Stage Performance Mode, and Virtual Ensemble Mixer.
4. **Research Experience:** Highlights the Musical Intelligence & Spectrogram Lab, Monophonic Swara Transcription, Experimental Raga Recognition, Carnatic Knowledge Graph, Musical Phrase Search, Comparative Music Theory Lab, 6-Language Dictionary, and Open Developer API.
