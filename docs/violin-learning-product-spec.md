# NadaVerse — Carnatic Violin Learning Studio: Product Specification

**Document Version:** 1.0.0  
**Status:** Approved for Implementation & Beta Release  
**Target Release:** NadaVerse v1.1.0 (Public Beta)  
**License:** 100% Free Forever — MIT License / Open Educational Resource  

---

## 1. Product Vision & Musicological Philosophy

The Carnatic Violin Practice Studio in NadaVerse is designed as a **digitally rigorous, tradition-aware companion** for South Indian classical violinists. Rather than forcing Western violin conventions (such as chin-rest clamping, equal temperament tuning, or fixed frets) onto Carnatic music, NadaVerse codifies the authentic pedagogical mechanics established in the South Indian classical sampradaya over the past two centuries.

### Non-Negotiable Guarantees
1. **100% Free Forever:** Zero paywalls, subscriptions, advertisements, paid feature gates, or tracking.
2. **Musicological Pluralism:** No single school of fingering (e.g., Lalgudi, Parur/MS Gopalakrishnan, Dwaram, or T.N. Krishnan) is declared universally "correct." Variations in bowing weight, finger pressure, and shifting are respected.
3. **Fretless Intonation:** Intonation is never reduced to equal-tempered frets. Carnatic swaras are dynamic, microtonal, and intimately shaped by gamaka (oscillation, glide, deflection) and raga bhava.
4. **Honest Technical Scoping:** NadaVerse provides transparent acoustic feedback (cents deviation, stability index, signal level) without fabricating unvalidated "artistic scores" or claiming to replace a living guru or qualified luthier.

---

## 2. Historical & Acoustic Context

### 2.1 The Carnatic Adaptation (c. 1800 CE)
The European violin was introduced to South India in the late 18th and early 19th centuries through interactions between British military bands in Fort St. George and Indian classical musicians. 

- **Baluswami Dikshitar (1786–1859):** Brother of composer Muthuswami Dikshitar, Baluswami Dikshitar studied Western violin techniques in Manali near Madras under a local bandmaster, then re-engineered the instrument's posture, tuning, and bowing to perform Carnatic gamakas.
- **Vadivelu (1810–1845):** A disciple of Muthuswami Dikshitar and court musician to Maharaja Swathi Thirunal in Travancore, Vadivelu elevated the violin to a solo and principal accompaniment instrument across royal courts in South India.

### 2.2 The Sitting Posture & Ergonomics
Unlike Western violinists who hold the instrument horizontally clamped between the chin and left shoulder:
- **Sitting Posture:** The musician sits cross-legged on the floor (*Sukhasana* or *Padmasana*).
- **Three-Point Support:** The scroll (*mukha*) of the violin rests securely on the ankle or top of the right foot. The back of the violin rests against the left chest or collarbone.
- **Complete Freedom of the Left Hand:** Because the instrument's weight is entirely supported by the foot and chest, the musician's left hand is completely free from holding up the instrument. This enables instantaneous longitudinal slides (*jaru*) and microtonal oscillations (*kampita*) across the entire length of the unfretted fingerboard.

### 2.3 Four-String Pa-Sa-Pa-Sa Tuning Architecture
Western violins are tuned in fifths ($G_3 - D_4 - A_4 - E_5$). Carnatic violins are tuned in tonic fifths and fourths according to the singer or soloist's *Adhara Shadjam* (Tonic):

$$\text{String 1 (Outer Right)}: \text{Tara Sa} \quad (\text{Ratio } 2.000)$$
$$\text{String 2}: \text{Madhya Pa} \quad (\text{Ratio } 1.500)$$
$$\text{String 3}: \text{Madhya Sa} \quad (\text{Ratio } 1.000)$$
$$\text{String 4 (Outer Left)}: \text{Mandra Pa} \quad (\text{Ratio } 0.750)$$

This architecture provides a complete two-and-a-half octave range ($P_1$ in Mandra Sthayi to $M_1$ or $P$ in Tara Sthayi) without shifting past fourth position in initial stages.

---

## 3. User Journeys & Curriculum Structure

### 3.1 Beginner Pathway (Foundational Mechanics)
1. **Module 1 — Sitting Posture, Bow Hold & Setup:**
   - Sitting posture, foot placement, scroll anchor, natural wrist angle.
   - Bow hold: curved thumb, index finger balance, pinky placement on the stick (not on top like Western style).
   - Rosin application, peg maintenance, and fine-tuner precautions.
2. **Module 2 — The Pa-Sa-Pa-Sa Open String Tuning:**
   - Tuning strings against a steady Tanpura drone.
   - Tuning sequence: 3rd String (Madhya Sa) $\rightarrow$ 2nd String (Madhya Pa) $\rightarrow$ 1st String (Tara Sa) $\rightarrow$ 4th String (Mandra Pa).
   - Using fine tuners safely to prevent bridge displacement.
3. **Module 3 — Long-Bow Tone Production & Bow Direction:**
   - Drawing the bow perpendicular to the strings (*Uttana* / Down-bow and *Pratyuttana* / Up-bow).
   - Equal bow distribution across frog, middle, and tip.
   - Tone quality checklist: avoiding scratchy contact at frog or weak volume at tip.
4. **Module 4 — String Crossing & The First Swaras:**
   - Elbow and wrist pivot drills between 3rd and 2nd string.
   - Placing the 1st finger ($R_1$ in Mayamalavagowla or $R_2$ in Shankarabharanam).
   - Transitioning from open strings to stopped finger positions.
5. **Module 5 — Sarali & Jantai Varisais in 3 Kalams:**
   - Performing fundamental exercises with Tala synchronization (Adi Tala 8 aksharas).
   - Speed progression: 1st Kalam (1 swara/beat) $\rightarrow$ 2nd Kalam (2 swaras/beat) $\rightarrow$ 3rd Kalam (4 swaras/beat).

### 3.2 Intermediate Pathway (Gamaka & Varnam Fluidity)
1. **Module 6 — Basic Gamaka Mechanics (Kampita & Jaru):**
   - Oscillations (*Kampita*): finger pivoting along the string axis, not across it.
   - Glides (*Jaru*): smooth audible sliding between swarasthanas without lifting the finger.
   - Ga and Ni deflection in Mayamalavagowla.
2. **Module 7 — Adi Tala Varnam Section Mastery:**
   - Practicing Mohanam (*Ninnukori*) or Kalyani (*Vanajakshi*) in sections (Pallavi, Anupallavi, Muktayi Swaram, Charanam, Chittaswarams).
   - Rehearsing speed transitions and bow recovery.
   - Marking difficult transitions in the personal practice queue.

### 3.3 Advanced Pathway (Manodharma & Accompaniment)
1. **Module 8 — Vocal Accompaniment Listening & Phrasing:**
   - Listening for vocal pauses, breath intake, and melodic cadences.
   - Shadowing the vocalist (*Pinpaattu*) versus responding with solo phrases (*Prathi-Nada*).
   - Concert etiquette: supporting without overpowering, sustaining during sahitya pauses.

---

## 4. Technical Architecture & Component Design

The Carnatic Violin Studio is implemented in `web/src/components/ViolinPracticeStudio.tsx` using modern Web Audio API and React 19 / TypeScript standards:

```
+--------------------------------------------------------------------------+
|                     ViolinPracticeStudio.tsx                             |
+--------------------------------------------------------------------------+
|                                                                          |
|  [Curriculum Tab]   [Tuning Assistant]   [Long-Bow Timer]  [Crossing]    |
|                                                                          |
|  +--------------------+  +----------------------+  +------------------+  |
|  | 8 Module Guides    |  | Autocorrelation      |  | Fretless Neck    |  |
|  | - Objectives       |  | Pitch Detector       |  | Visualizer       |  |
|  | - Pitfalls         |  | - Cents Deviation    |  | - 4 Strings      |  |
|  | - Self-Review      |  | - Green Lock (<5c)   |  | - Swarasthana    |  |
|  | - Sampradaya Notes |  | - Signal Quality     |  |   Positions      |  |
|  +--------------------+  +----------------------+  +------------------+  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  | Long-Bow Down/Up Animated Metronome & Reflection Checklist         |  |
|  | - Visual progress bar: Down-bow -> Up-bow -> Rest                  |  |
|  | - Audio cue beeps using Just Intonation Swara synthesis            |  |
|  | - Direct "Log to Sadhana Journal" integration                      |  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

### 4.1 Autocorrelation Pitch Extraction
- **Algorithm:** Time-domain Normalized Square Difference Function (NSDF) with parabolic peak interpolation.
- **Sample Rate:** Standard Web Audio hardware rate (44.1 kHz / 48 kHz), buffer size 2048 samples.
- **Confidence Metric:** Peak correlation coefficient $r \ge 0.85$ required to accept fundamental frequency. Silence floor at $-42\text{ dBFS}$.
- **Cents Deviation Calculation:**
  $$\Delta\text{cents} = 1200 \times \log_2\left(\frac{f_{\text{detected}}}{f_{\text{target}}}\right)$$
  - Tolerance: $|\Delta\text{cents}| \le 5\text{ cents} \implies \text{Visual In-Tune Lock}$.

### 4.2 Resource Cleanup Invariants
To prevent memory leaks and background battery drain:
- On unmount, tab change, or error, all `AudioContext`, `AnalyserNode`, `MediaStreamTrack`, and `requestAnimationFrame` IDs are cancelled and closed.
- Microphone streams are explicitly stopped via `stream.getTracks().forEach(t => t.stop())`.

---

## 5. Acceptance Criteria

| ID | Criterion | Verification Method | Status |
|---|---|---|---|
| **AC-V1** | Four strings can be individually selected and tuned to Pa-Sa-Pa-Sa across all 12 Kattais. | Audio Engine unit tests + UI interaction | **PASSED** |
| **AC-V2** | Tuner provides cents offset, green in-tune lock, and signal quality indicator. | Synthetic pitch tests (`test-pitch.mjs`) | **PASSED** |
| **AC-V3** | Manual reference mode plays Just Intonation string tone when mic is denied or unavailable. | Mic permission denial test | **PASSED** |
| **AC-V4** | Long-bow timer supports adjustable stroke and rest durations with down/up visual cues. | Timer run and visual state check | **PASSED** |
| **AC-V5** | Completed bowing practice can be exported directly to the user's Sadhana Journal. | Local storage session logger test | **PASSED** |
| **AC-V6** | Fretless fingerboard shows un-equal-tempered swarasthana badges across 3 speeds. | Visual inspector and responsive check | **PASSED** |
| **AC-V7** | All UI strings and lesson metadata are fully localized in English and Malayalam. | Bilingual toggle verification | **PASSED** |
| **AC-V8** | Screen reader `aria-live` announcements alert visually impaired users of tuning status. | Accessibility DOM audit | **PASSED** |

---

## 6. Known Scope Limitations
- **No Physical Peg Turning:** The software analyzes acoustic vibrations; it cannot turn pegs or prevent peg slippage.
- **No Artistic Judging:** The app does not claim to judge *bhava* or artistic greatness.
- **Guru Consultation:** Lessons explicitly remind students to consult their living guru for hand posture and bow weight refinements.
