# NadaVerse 2.0 — Music Information Retrieval (MIR) & Experimental Recognition Architecture

**Document Version:** 2.0.0  
**Implementation Module:** `web/src/lib/mirEngine.ts` & `web/src/components/MusicalIntelligenceLab.tsx`

---

## 1. Scope & Pedagogical Boundaries (Sections 5, 6, 7, 8)

The NadaVerse 2.0 MIR Engine provides browser-local signal processing and musicological feature extraction for Carnatic vocal and monophonic instrumental (Violin, Veena, Flute) input:

1. **Fundamental Frequency ($F_0$) & Harmonic Partial Analysis:**
   - Normalized time-domain autocorrelation with parabolic peak interpolation extracts $F_0$ within `< 1 cent` on clean synthetic signals (`< 11 ms` per 2048-sample frame).
   - Evaluates relative energy at integer harmonic multiples ($H_1 \dots H_6$) and estimates spectral centroid and pitch stability index.
2. **Adhara Shadjam-Relative Swara Candidate Mapping:**
   - Maps any measured frequency $f$ against the musician's configured Adhara Shadjam $f_{Sa}$ using $C = 1200 \log_2(f / f_{Sa})$ normalized into the middle octave $[0, 1200)$ cents, ranking candidate Carnatic swarasthanas (`S, R1, R2, R3, G1, G2, G3, M1, M2, P, D1, D2, D3, N1, N2, N3`) by microtonal Just Intonation proximity.
3. **Monophonic Note Onset Segmentation & Gamaka Inflection Tagging:**
   - Groups contiguous voiced frames into candidate swara events when pitch remains within a swarasthana basin for $\ge 90\text{ ms}$, while tagging continuous wide oscillations (`> 32 cents` peak-to-peak at `3–7 Hz`) as `kampita` and monotonic slides (`> 80 cents`) as `jaru` rather than erroneously splitting every microtonal inflection into discrete notes.
4. **Experimental Raga Candidate Recognition (`[EXPERIMENTAL]`):**
   - Combines (a) Swarasthana inventory overlap, (b) Characteristic Prayoga n-gram matching (e.g., `S R1 G3 M1 P`, `G3 P D2 S`, `G3 P N3 S`, `S G2 M1 D1 N2`), and (c) Vadi/Samvadi emphasis weighting.
   - Rejects unknown or ambiguous input when top candidate confidence is `< 45%`.

---

## 2. Measured Limitations & Honesty Disclosures

- **Monophonic Input Only:** The transcription and pitch contour algorithms assume a single dominant melodic source (solo voice, violin, or flute). Polyphonic recordings (e.g., full concert mixes with loud mridangam and violin accompaniment) or low-SNR rooms (`< 8 dB SNR`) trigger an explicit signal warning.
- **Scale $\neq$ Raga:** Raga candidate rankings are heuristic research aids and are explicitly badged `[EXPERIMENTAL — RESEARCH LAB]`.
