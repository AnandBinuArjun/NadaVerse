# NadaVerse — Content Provenance & Licensing Documentation

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**License Policy:** 100% Free & Open Access (CC-BY-SA 4.0 / Public Domain / MIT Code)

---

## 1. Principles of Provenance & Licensing

NadaVerse is committed to authentic, respectful, and ethically sourced Carnatic musicological knowledge. The platform adheres strictly to the following standards:
1. **Zero Piracy & Zero Unauthorized Scraping:** No copyrighted audio recordings, commercial performance clips, or proprietary book scans are uploaded or served without verified rights.
2. **Treatise-Grounded Musicology:** All raga definitions, swarasthanas, lakshana classifications, and tala structures are verified against peer-reviewed classical treatises.
3. **Synthetic Audio Independence:** Instrument auditions, Tanpura drones, and Tala metronomes are generated programmatically via the Web Audio API using microtonal Just Intonation algorithms. No third-party proprietary sound libraries or commercial samples are required.
4. **Public Domain Heritage & Creative Commons:** Historical documents, epigraphic records, and biographical summaries are released under Creative Commons Attribution-ShareAlike 4.0 International (CC-BY-SA 4.0) or are in the public domain.

---

## 2. Canonical Musicological Treatises Referenced

The NadaVerse knowledge corpus and AI gateway ground their pedagogical data in the following authoritative treatises:

| Treatise | Codified By | Historical Era | Canonical Significance in NadaVerse |
|---|---|---|---|
| **Chaturdandi Prakasika** | Venkatamakhin | 17th Century CE | Codified the mathematical 72 Melakarta Raga classification scheme using combinations of Shuddha, Sadharana, Antara Gandhara, and Prati Madhyama. |
| **Sangita Ratnakara** | Sarangadeva | 13th Century CE | Pan-Indian musicological text outlining the 22 Shrutis, Grama-Murchana systems, and fundamental Tala Angas (Laghu, Dhrutam, Anudhrutam). |
| **Sangita Sampradaya Pradarsini** | Subbarama Dikshitar | 1904 CE | 1,700-page encyclopedia published under Ettayapuram patronage; primary source for authentic notation systems, gamaka deflections, and Dikshitar compositions. |
| **Natya Shastra** | Bharata Muni | c. 200 BCE – 200 CE | Foundational acoustic treatise outlining the Sarana Chatushtayi experiment, modal consonance (Vadi-Samvadi), and microtonal intervals. |
| **Sangita Saramrita** | King Tulaja I of Thanjavur | 18th Century CE | Thanjavur court treatise providing essential bridging documentation on raga lakshanas and performance practices of the Trinity era. |

---

## 3. Audio Asset & Sound Synthesis Provenance

All audible elements in NadaVerse are generated client-side with zero external streaming dependencies:

- **Tanpura Drone (`audioEngine.ts`):** Synthesized using 4 harmonic oscillators with customized gain envelopes, randomized detuning (+/- 1.5 cents), and Jivari acoustic bridge simulation.
- **Instrument Auditions (`auditionInstrument`):**
  - *Saraswati Veena*: Plucked string harmonics with physical envelope damping.
  - *Carnatic Violin*: Dual harmonic oscillators with continuous vibrato LFO.
  - *Mridangam*: Resonant bandpass filter sweeps simulating Chapu, Thom, and Tha strikes.
  - *Ghatam*: Helmholtz cavity resonance modulated with metallic slap impulses.
  - *Kanjira*: Low-pass filtered membrane with dynamic gumki pitch deflection envelope.
  - *Tambura*: Continuous 4-string overtone cascade.
  - *Carnatic Flute*: Sine wave oscillator with subtle breath noise modulation.
  - *Nadaswaram & Morsing*: High-frequency resonant pulse wave synthesis.
- **Tala Clicks & Strokes:** Metronome ticks and Solkattu syllables are rendered using high-precision Web Audio clock scheduling to prevent timing drift.

---

## 4. Heritage Archive & Biographical Records

| Entry Category | Primary Sources | Rights & Licensing Status |
|---|---|---|
| **Purandara Dasa Abhyasa Gana** | Prof. P. Sambamoorthy, 'South Indian Music', Vol. 1–3; T. V. Subba Rao, 'Studies in Indian Music'. | Public Domain / Educational Fair Use |
| **Thanjavur Veena Lutherie** | Government of India Geographical Indication (GI-187); Thanjavur Musical Instrument Workers Co-operative Society documentation. | CC-BY-SA 4.0 |
| **Kudumiyanmalai Rock Inscriptions** | Archaeological Survey of India, 'Epigraphia Indica', Vol. XII; Dr. C. Meenakshi, 'Administration and Social Life under the Pallavas'. | Public Domain (Archaeological Record) |
| **Subbarama Dikshitar & 1904 Printing** | Music Academy Madras Commemorative Edition (1961); Ettayapuram Samsthanam Archives. | Public Domain 1904 Historical Record |
| **Manamadurai Ghatam Crafting** | C. V. Raman, 'The Indian Musical Drums' (Indian Academy of Sciences, 1934). | CC-BY 4.0 Academic Citation |

---

## 5. Editorial & Peer-Review Governance

1. **Suggest a Correction System:**
   - Any vidwan, musicology scholar, or student can submit corrections via the `/api/v1/corrections` endpoint.
   - All submissions require mandatory citation references and are reviewed by editorial moderators before inclusion.
2. **Heritage Archive Submissions:**
   - Contributor submissions via `/api/v1/heritage/submit` default to `pending_review`.
   - Content is evaluated for source authenticity, historical accuracy, copyright compliance, and cultural sensitivity before publication.
3. **Takedown & Correction Policy:**
   - Any contested historical claim or copyright notice can be submitted to the NadaVerse maintainers. Contested records will be placed on hold immediately pending peer review.
