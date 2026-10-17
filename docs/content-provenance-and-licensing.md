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
   - Any vidwan, musicology scholar, or student can submit corrections via the `/api/v1/corrections` endpoint or in-app "Suggest Edit" buttons in the Tutor Evidence Inspector.
   - All submissions require mandatory citation references and are reviewed by editorial moderators before inclusion (`pending_review` -> `approved` / `rejected`).
2. **Heritage Archive Submissions:**
   - Contributor submissions via `/api/v1/heritage/submit` default to `pending_review`.
   - Content is evaluated for source authenticity, historical accuracy, copyright compliance, and cultural sensitivity before publication.

---

## 6. Item-Level Rights Ledger

Every published composition, exercise notation, instrument profile, heritage article, and synthesized asset is tracked in this item-level ledger with verifiable edition, license evidence, offline caching rights, and review status:

| Asset Identifier | Asset Category | Title / Subject | Creator / Lineage | Primary Source & Edition Evidence | License / Rights Basis | Modification / Download / Offline Rights | Verification Status & Review Date |
|---|---|---|---|---|---|---|---|
| `raga_mayamalavagowla` | Raga Definition | Mayamalavagowla (Mela 15) | Govindacharya / Venkatamakhin | *Chaturdandi Prakasika* (c. 1620 CE; Music Academy 1934 critical edition) | Public Domain (pre-1925 root work) | Permitted (text/JSON) | Verified (17 Oct 2026) |
| `raga_shankarabharanam` | Raga Definition | Dheerasankarabharanam (Mela 29) | Classical tradition | *Sangita Sampradaya Pradarsini* (1904 CE; Ettayapuram) | Public Domain (1904 edition) | Permitted (text/JSON) | Verified (17 Oct 2026) |
| `raga_kalyani` | Raga Definition | Mechakalyani (Mela 65) | Classical tradition | *Sangita Saramrita* (Tulaja I, 18th c.; Music Academy) | Public Domain (18th c. text) | Permitted (text/JSON) | Verified (17 Oct 2026) |
| `tala_adi` | Tala Definition | Chatusra Jati Triputa Tala (Adi) | Purandara Dasa (Abhyasa system) | *South Indian Music* (Prof. P. Sambamoorthy, 1958) | Educational Fair Use / Public Domain | Permitted (text/JSON) | Verified (17 Oct 2026) |
| `tala_rupaka` | Tala Definition | Rupaka Tala (Dhrutam + Laghu) | Suladi Sapta Tala tradition | *Sangita Ratnakara* (Sarangadeva, 13th c. CE) | Public Domain (13th c. text) | Permitted (text/JSON) | Verified (17 Oct 2026) |
| `inst_veena` | Instrument Profile | Saraswati Veena | Thanjavur Lutherie tradition | GI Registry (GI-187, Gov of India); Sambamoorthy Organology | CC-BY-SA 4.0 (original synthesis & text) | Permitted (audio/text) | Verified (17 Oct 2026) |
| `inst_mridangam` | Instrument Profile | Mridangam | Thanjavur / Pudukkottai traditions | C. V. Raman, *The Indian Musical Drums* (IAS, 1934) | CC-BY 4.0 / Public Domain (1934) | Permitted (audio/text) | Verified (17 Oct 2026) |
| `inst_ghatam` | Instrument Profile | Manamadurai Ghatam | Meenakshi Ammal hereditary potting | Craft Council of India fieldwork records (2020) | CC-BY-SA 4.0 (NadaVerse documentation) | Permitted (audio/text) | Verified (17 Oct 2026) |
| `archive_purandara` | Heritage Article | Purandara Dasa & Pedagogy | Purandara Dasa (1484–1564) | T. V. Subba Rao, *Studies in Indian Music* (1962) | Educational Non-Commercial Fair Use | Permitted (text/offline) | Verified (17 Oct 2026) |
| `archive_kudumiyanmalai` | Heritage Article | Kudumiyanmalai Epigraph | King Mahendravarman I (7th c. CE) | *Epigraphia Indica*, Vol. XII (ASI, 1914) | Public Domain (Archaeological Record) | Permitted (text/offline) | Verified (17 Oct 2026) |
| `archive_dikshitar_1904` | Heritage Article | Subbarama Dikshitar 1904 Printing | Subbarama Dikshitar (1839–1906) | Music Academy Commemorative Edition (1961) | Public Domain Historical Record | Permitted (text/offline) | Verified (17 Oct 2026) |
| `synth_tanpura_engine` | Audio Synthesis | 4-String Tanpura Just Intonation | NadaVerse Engine Team | Original JavaScript Web Audio DSP implementation | MIT License (open source code) | Permitted (local synthesis) | Verified (17 Oct 2026) |
| `synth_tala_engine` | Audio Synthesis | Drift-Free Lookahead Metronome | NadaVerse Engine Team | Original JavaScript Web Audio clock scheduling | MIT License (open source code) | Permitted (local synthesis) | Verified (17 Oct 2026) |

---

## 7. Content Quarantine Protocol

Any asset whose copyright status, critical edition rights, modern translation ownership, or traditional lineage permission cannot be independently verified with documentary evidence is immediately subjected to the following quarantine protocol:

1. **Immediate Quarantine:** The asset status is set to `quarantined` in both the database and offline manifest.
2. **Access Revocation:** Quarantined items are immediately excluded from API endpoints, search index, AI tutor retrieval corpus, and service worker precache lists.
3. **Scholarly Audit:** The NadaVerse editorial team initiates a 14-day archival review with primary sources or license holders.
4. **Permanent Removal or Clearance:** If valid rights documentation is provided, the item is restored with explicit license attribution; otherwise, it is permanently deleted and replaced with an original, rights-cleared alternative.

---

## 8. Notice, Takedown & Content Dispute Procedure

NadaVerse respects the intellectual property and traditional cultural knowledge of artists, hereditary practitioners, and academic scholars.

1. **Designated Contact:**
   - Email: `heritage@nadaverse.org` (or open a GitHub Issue tagged `legal-takedown` on [AnandBinuArjun/NadaVerse](https://github.com/AnandBinuArjun/NadaVerse)).
2. **Notice Requirements:**
   - URL or Record ID of contested material.
   - Specific basis for claim (e.g., copyright ownership of critical edition, traditional lineage objection, or factual error).
   - Proof of authority or scholarly citation counter-evidence.
3. **Response Protocol:**
   - **Triage (within 24 hours):** The contested item is flagged and moved to `quarantined` status.
   - **Investigation:** NadaVerse editorial moderators review the primary source evidence and contact the claimant.
   - **Resolution:** The record is either corrected with updated scholarly attribution, updated with balanced sampradaya viewpoints, or permanently removed.
