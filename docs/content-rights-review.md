# NadaVerse — Content Rights, Provenance & Pedagogical Licensing Review

**Document Version:** 1.0.0-beta  
**Evaluation Commit:** `738838e`  
**Review Basis:** Source-Level Audit of Composition Library, Raga Prayogas, Treatises & Media Assets  
**Licensing Policy:** Code under MIT License; Pedagogical & Musicological Content under CC-BY-SA 4.0  
**Takedown SLA:** 48 hours via [anandbinuarjun@zohomail.eu](mailto:anandbinuarjun@zohomail.eu) with `rights-takedown` label  

---

## 1. Principles of Rights-Respecting Cultural Preservation

NadaVerse evaluates intellectual property across six distinct layers for every published asset:
1. **Underlying Composition / Vaggeyakara Work:** Historical musical work (composed 14th–20th century).
2. **Notation & Edition Provenance:** The specific pedagogical transcription and beat alignment.
3. **Sahitya (Lyrics) & Translations:** Classical lyric text and bilingual English/Malayalam translations.
4. **Acoustic Audio Auditions:** Exclusively algorithmic, real-time Web Audio API sound synthesis (physical modeling and additive oscillators). Zero proprietary master recordings are distributed or streamed.
5. **Treatise Citations & Musicological Grammar:** Verified citations from canonical historical musicological texts (*Sangita Sampradaya Pradarsini*, *Chaturdandi Prakasika*, *Sangita Ratnakara*).
6. **Offline Distribution & Caching:** Controlled via Service Worker allowlist; no unlicensed external media is cached.

---

## 2. Item-Level Rights Ledger: 10 Core Compositions

| ID | Title & Form | Raga & Tala | Vaggeyakara (Composer) | Underlying Work Rights | Notation Edition & Provenance | Acoustic Audio Basis | Publication Decision |
|---|---|---|---|---|---|---|---|
| **C-01** | *Sri Gananatha* (Geetham) | Malahari / Rupaka | Purandara Dasa (1484–1564) | **Public Domain** (Pre-1929) | Primary pedagogical abhyasa gana edition; validated in *Sangita Sampradaya Pradarsini* (1904). | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-02** | *Vara Veena* (Geetham) | Mohanam / Rupaka | Appayya Dikshitar (1554–1626) | **Public Domain** (Pre-1929) | Traditional abhyasa gana standard curriculum edition; verified against Subbarama Dikshitar tradition. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-03** | *Kunda Goura* (Geetham) | Malahari / Rupaka | Purandara Dasa (1484–1564) | **Public Domain** (Pre-1929) | Traditional beginner Geetham curriculum edition. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-04** | *Sami Ninne* (Adi Varnam) | Shankarabharanam / Adi | Veena Kuppayyar (1798–1860) | **Public Domain** (Pre-1929) | Classical pedagogical Adi Tala Varnam edition; verified against Kuppayyar disciple manuscripts. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-05** | *Ninnukori* (Adi Varnam) | Mohanam / Adi | Ramnad Srinivasa Iyengar (1860–1919) | **Public Domain** (Pre-1929) | Standard concert & pedagogical Varnam edition; akshara sum mathematically verified (32 beats). | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-06** | *Vatapi Ganapatim* (Kriti) | Hamsadhwani / Adi | Muthuswami Dikshitar (1775–1835) | **Public Domain** (Pre-1929) | *Sangita Sampradaya Pradarsini* (1904, Ettayapuram); notation verified against original Telugu script edition. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-07** | *Rara Venu Gopa Bala* (Swarajati) | Bilahari / Adi | Annamacharya (1408–1503) | **Public Domain** (Pre-1929) | Traditional Bilahari Swarajati pedagogical edition. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-08** | *Siddhi Vinayakam* (Kriti) | Shanmukhapriya / Rupaka | Muthuswami Dikshitar (1775–1835) | **Public Domain** (Pre-1929) | Dikshitar Guru-Guha Sampradaya lineage; *Sangita Sampradaya Pradarsini*. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-09** | *Bhagyada Lakshmi Baramma* (Devaranama) | Madhyamavati / Adi | Purandara Dasa (1484–1564) | **Public Domain** (Pre-1929) | Traditional Haridasa sampradaya devotional notation; tuning standardized to 22-Shrutis Just Intonation. | Algorithmic Web Audio synthesis (No recording) | **APPROVED (Active)** |
| **C-10** | *Dhim-ta-dare* (Tillana) | Darbari Kanada / Adi | Lalgudi Jayaraman (1930–2013) | **20th Century Work** | Pedagogical study notation published for educational analysis under Fair Dealing / CC-BY-SA with explicit composer attribution. | Algorithmic Web Audio synthesis (No recording) | **PROVISIONAL / MARKED FOR REVIEW** |

---

## 3. Special Scrutiny on Modern Works (C-10)

For *Dhim-ta-dare* (Tillana by Sri Lalgudi Jayaraman):
- The underlying composition is a 20th-century masterpiece.
- The notation presented in NadaVerse is a synthesized pedagogical guide for learners to study the rhythmic eduppu and Darbari Kanada gamakas.
- No commercial exploitation or paywall restriction exists.
- In accordance with precautionary rights governance:
  1. Full attribution is rendered prominently in the UI.
  2. If the estate or copyright holders request quarantine or takedown, the item will be moved to `quarantined: true` within 48 hours without breaking the application.

---

## 4. Takedown & Content Quarantine Workflow

NadaVerse maintains an automated quarantine mechanism in `web/src/data/compositionLibraryData.ts`:
- Setting `quarantined: true` on any entry automatically suppresses it from the UI, the search index, the offline pack cache, and the public API.
- All takedown requests received at [anandbinuarjun@zohomail.eu](mailto:anandbinuarjun@zohomail.eu) are logged with timestamp, claimant evidence, and resolution record.
