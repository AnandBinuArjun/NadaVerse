# NadaVerse — Product Requirements Document (PRD)

**Document status:** Initial product specification  
**Product:** NadaVerse  
**Category:** Carnatic music learning, discovery, practice, and cultural platform  
**Delivery:** Responsive web application + mobile applications  
**Business model:** Completely free platform; no paid tiers, subscriptions, paywalls, or paid feature gates  
**Primary audience:** Beginners and the general public  
**Secondary audiences:** Carnatic music students, practising musicians, teachers, artists, and cultural institutions

---

## 1. Product vision

NadaVerse is an accessible, trustworthy digital home for Carnatic music. It brings music discovery, structured learning, instrument exploration, guided practice, music theory, and AI-assisted learning into one coherent product.

The product must respect the depth and diversity of Carnatic tradition. AI should support learning and exploration—not claim to replace a qualified guru, flatten stylistic differences, or present uncertain analysis as musical fact.

### Product promise

**Discover Carnatic music. Understand its language. Practise with purpose.**

### Problem statement

People interested in Carnatic music often encounter fragmented resources: videos without a learning path, theory pages without audio context, practice tools that are not Carnatic-aware, and instrument information scattered across sources. Beginners may not know where to start, while practising musicians need repeatable tools for shruti, tala, reference listening, and progress tracking.

NadaVerse should connect these needs in one product, with a beginner-friendly entry point and depth for experienced learners.

## 2. Goals and non-goals

### Goals

1. Make Carnatic music approachable for people with little or no prior knowledge.
2. Provide a structured, searchable knowledge base for ragas, talas, swaras, compositions, composers, and instruments.
3. Offer useful practice tools: shruti/tuner, tala/metronome, guided exercises, recording, and practice history.
4. Provide an AI music tutor grounded in reviewed content and explicit uncertainty.
5. Support teachers and students through assignments and feedback in later releases.
6. Build a sustainable, completely free platform with secure accounts and responsible use of user audio. Fund operations through grants, donations, sponsorships, or institutional support—not paywalls.
7. Deliver a consistent experience across web and mobile.
8. Preserve cultural context and support contributors, artists, and educators.

### Non-goals for the initial MVP

- Claiming AI can fully grade Carnatic singing or instrument performance.
- Automatically identifying every raga from any arbitrary recording with guaranteed accuracy.
- Reproducing copyrighted compositions, recordings, notation, or lessons without permission.
- Launching a full social network, live-streaming platform, marketplace, and institutional LMS simultaneously.
- Replacing teachers or making medical, psychological, or other unrelated claims.
- Training models on user recordings without explicit, informed consent.

## 3. Audience and personas

### Persona A — Curious beginner
- Wants to understand what Carnatic music is and where to start.
- Needs plain-language explanations, short listening examples, and guided paths.
- Success means completing a first learning path and returning for another session.

### Persona B — Student
- Already learns from a teacher or course.
- Needs practice structure, raga/tala references, recording, and progress history.
- Success means more consistent practice and easier revision between lessons.

### Persona C — Practising musician
- Needs a fast, reliable shruti reference, tala practice, searchable reference material, and session organisation.
- Values accuracy, control, low friction, and clear limitations.
- Success means using the product as a repeatable practice companion.

### Persona D — Teacher or content contributor (later phase)
- Wants to publish approved learning material, assign exercises, and review student submissions.
- Needs attribution, permission controls, and moderation workflows.

## 4. Product principles

1. **Tradition first:** Content must be reviewed by knowledgeable human contributors.
2. **Audio is essential:** Teach concepts with listening wherever possible, not text alone.
3. **Beginner-friendly, not simplistic:** Explain terminology without removing nuance.
4. **AI with evidence:** Show the reference material used by the AI tutor and communicate uncertainty.
5. **Practice, not judgement:** Feedback should be constructive and specific; avoid unsupported performance scores.
6. **Permission-aware:** Rights and consent are requirements, not post-launch tasks.
7. **Progressive complexity:** Introduce advanced controls only when they help the current task.
8. **Accessible by default:** Keyboard access, readable contrast, captions/transcripts where applicable, and scalable text.
9. **Privacy by design:** Minimise audio retention and make deletion and consent choices clear.
10. **Mobile-aware:** Practice flows must work well with touch, headphones, and small screens.

## 5. Product scope

### MVP — Public knowledge and practice foundation

**Discovery and learning**
- Home page with clear routes: Start Learning, Explore Ragas, Explore Instruments, Practise.
- Search across ragas, talas, instruments, composers, compositions, glossary, and lessons.
- Beginner learning path with modules, lesson completion, and saved progress.
- Raga pages with name variants, arohanam/avarohanam, parent/janya relationship where verified, characteristic notes/phrases, curated audio, and sources.
- Tala pages with cycle visualisation, beat/subdivision descriptions, tempo control, and reference audio where licensed.
- Instrument profiles with overview, family, construction, playing technique, cultural context, audio samples, and related artists.
- Glossary with clear explanations of terms such as shruti, swara, gamaka, raga, tala, kriti, and alapana.

**Practice**
- Shruti/tanpura reference player with selectable tonic and configurable volume.
- Basic pitch display/tuner with clear note-frequency visualisation; it must not label a detected pitch as a definitive swara without context.
- Tala metronome with configurable tempo and supported tala patterns.
- Practice session timer and private notes.
- Optional audio recording for personal practice, with consent and deletion controls.
- Practice history and simple consistency indicators.

**AI tutor**
- Chat-based tutor for Carnatic music concepts.
- Retrieval-grounded answers from approved content.
- Source references, confidence/uncertainty language, and safe fallback when the knowledge base lacks an answer.
- Suggested next lesson and follow-up questions.
- Clear notice that the tutor is educational assistance, not an authoritative guru.

**Accounts and SaaS**
- Sign-up, sign-in, password reset, profile, preferences, and account deletion.
- Guest browsing for public content.
- Saved items, learning progress, practice history.
- No paid plans, subscriptions, feature paywalls, or usage tiers. Apply only transparent fair-use and abuse-prevention controls where necessary.
- No subscription or billing integration.

**Administration**
- Protected admin interface for managing reference content.
- Draft, review, publish, archive lifecycle.
- Contributor attribution and source metadata.
- Audit log for content changes.
- Role-based access control.

### Phase 2 — Deeper learning and teacher workflows
- Teacher profiles and verified credentials where applicable.
- Teacher-created courses and assignments.
- Student submissions and feedback.
- More guided exercises: sarali varisai, jantai varisai, alankaram, geetham, and other material with rights clearance.
- Multi-device sync and offline access to selected licensed content.
- Expanded language support, beginning with English and Malayalam if editorial resources support quality.

### Phase 3 — Advanced audio intelligence
- Recording analysis for pitch contour and timing.
- Reference-vs-user comparison for selected exercises.
- Explainable feedback that distinguishes pitch tracking from musical interpretation.
- Carefully scoped gamaka-aware research prototypes evaluated by Carnatic musicians.
- Optional raga/phrase exploration tools with confidence estimates, not definitive automated judgement.

### Phase 4 — Community and ecosystem
- Artist interviews and heritage archive.
- Events, workshops, and teacher discovery.
- Institutional partnerships and grant-supported programmes.
- Carefully moderated community features, if user research demonstrates demand.

## 6. Key user journeys

### Journey A — Beginner starts learning
1. Lands on the home page.
2. Selects “I’m new to Carnatic music”.
3. Sees a short orientation: what it is, how to listen, core concepts.
4. Completes a short lesson with audio.
5. Saves progress or creates an account.
6. Receives a relevant next lesson.

### Journey B — Student explores a raga
1. Searches a raga name.
2. Opens its page and sees verified details and related concepts.
3. Plays available reference audio.
4. Saves the page to a practice collection.
5. Opens related talas/compositions or starts a practice session.

### Journey C — Musician practises
1. Opens Practice Studio.
2. Selects tonic/shruti reference and a tala.
3. Adjusts tempo and starts a session.
4. Optionally records a short exercise.
5. Reviews a pitch display or personal notes.
6. Saves the session privately.

### Journey D — User asks the AI tutor
1. Asks a question about a raga, tala, instrument, or term.
2. Tutor retrieves approved content.
3. Answer includes references and states uncertainty when sources are incomplete.
4. User opens cited material or follows a suggested lesson.

## 7. Functional requirements

Priority key: **P0 = MVP must-have**, **P1 = next release**, **P2 = later/experimental**.

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---:|---|
| FR-001 | Public content browsing | P0 | Core pages are accessible without account; mobile responsive |
| FR-002 | Search and filtering | P0 | Search returns relevant content types with empty/error states |
| FR-003 | Raga and tala reference pages | P0 | Each published page has required fields, source metadata, and review status |
| FR-004 | Instrument library | P0 | Profiles support text, images, related content, and licensed audio |
| FR-005 | Beginner learning path | P0 | User can start, resume, and complete lessons |
| FR-006 | Shruti reference player | P0 | User can select tonic and control playback/volume |
| FR-007 | Tala metronome | P0 | User can select supported tala, set tempo, start/stop, and hear/tap cycles |
| FR-008 | Account and progress | P0 | Authenticated user can save progress and retrieve it across sessions |
| FR-009 | AI tutor with retrieval | P0 | Answers use approved sources; unsupported questions trigger a transparent fallback |
| FR-010 | Content administration | P0 | Editors can draft, review, publish, and archive content with audit trail |
| FR-011 | Recording and session notes | P1 | User consent is explicit; recordings are private and deletable |
| FR-012 | Fair-use and abuse controls | P1 | Any limits are abuse-prevention measures, not paid-tier gates, and are explained clearly |
| FR-013 | Teacher assignments | P1 | Teacher can assign material and review student submissions |
| FR-014 | Pitch-contour comparison | P2 | Evaluated only for supported exercises; feedback shows limitations |
| FR-015 | Community contributions | P2 | Submissions require moderation and rights declarations |

## 8. Non-functional requirements

- **Performance:** Core content pages should target LCP under 2.5 seconds at the 75th percentile on supported devices/network conditions. Avoid shipping large audio assets unnecessarily.
- **Availability:** Define an initial target of 99.5% monthly availability for production APIs, then revise based on actual operational capacity.
- **Security:** Use secure authentication, server-side authorisation, rate limits, secrets management, encryption in transit, and appropriate encryption at rest.
- **Privacy:** Provide clear audio retention, deletion, and AI-processing disclosures. Do not use recordings for model training by default.
- **Accessibility:** Target WCAG 2.2 AA for core web journeys; test keyboard navigation, focus states, contrast, labels, and screen readers.
- **Observability:** Structured logs, metrics, traces where appropriate, error reporting, and audit events.
- **Portability:** Keep AI provider and storage interfaces replaceable; avoid hard dependencies on a single model vendor.
- **Internationalisation:** Design for translated labels and content; do not hard-code UI strings.
- **Data integrity:** Content revisions must be traceable; use migrations and tested backups.
- **Mobile:** Support current stable iOS and Android versions selected at implementation time; document the support policy.

## 9. Success metrics

Measure behaviour and learning utility, not vanity traffic alone.

### Activation
- Percentage of new visitors who complete the first lesson or first practice session.
- Time from landing to first meaningful audio interaction.
- Account creation rate after a value moment, not before it.

### Engagement
- Weekly active learners.
- Practice sessions per active learner.
- Learning path completion and return rate.
- Use of raga/instrument pages from search.

### Learning quality
- User-rated helpfulness of lessons and AI answers.
- Percentage of AI answers with valid source references.
- Content correction rate and expert review outcomes.
- Practice tool reliability and user-reported usefulness.

### Business
- Free-to-paid conversion after pricing is validated.
- Paid retention and cancellation reasons.
- Teacher/course revenue only after those workflows exist.
- Support burden and cost per active learner.

Do not invent target values before establishing a baseline. Set targets after closed beta and cohort analysis.

## 10. Funding and long-term sustainability

NadaVerse is free for everyone. There are no paid tiers, subscriptions, premium features, or paywalls. Core learning content, practice tools, and AI tutor access should not be divided into paid and unpaid feature sets.

Potential non-paywall funding options include cultural grants, arts and education funding, donations, voluntary patron support, sponsorships with clear disclosure, university/cultural-institution partnerships, and philanthropic support. Sponsorship must not influence educational accuracy or editorial independence. If costs require fair-use controls, apply transparent anti-abuse limits rather than charging users or reserving features for paid accounts.

## 11. Content, licensing, and cultural integrity

- Maintain source attribution for factual content and lineage where relevant.
- Record permissions for audio, video, images, notation, lyrics, and lesson material.
- Treat compositions, performances, arrangements, recordings, and transcriptions as potentially separate rights.
- Do not assume a traditional composition means a particular recording is free to use.
- Use approved contributor agreements and a takedown/correction process.
- Allow multiple accepted traditions or interpretations to be represented where appropriate, with provenance.
- Clearly distinguish verified editorial content, contributor-submitted content, and AI-generated suggestions.

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| AI gives inaccurate music-theory answers | Retrieval grounding, citations, expert evaluation, uncertainty fallback |
| Pitch tools misinterpret gamakas | Limit claims, expose raw contour, test with musicians, label experimental features |
| Rights infringement | Rights metadata, upload checks, permission records, takedown process |
| Scope becomes too large | Ship the MVP in staged releases; gate marketplace/community features |
| Content lacks cultural nuance | Editorial board/advisors, contributor attribution, correction workflow |
| Audio privacy concerns | Private-by-default storage, explicit consent, retention controls, deletion |
| SaaS costs grow unpredictably | Usage quotas, observability, model routing, audio processing budgets |
| Low retention | Validate first-session value, guided paths, learner interviews, cohort analysis |

## 13. Release acceptance criteria

The MVP is ready for a controlled beta when:
1. Core browse/search/learn/practise journeys work on web and supported mobile layouts.
2. Content has review state, provenance, and rights metadata.
3. Authentication, authorisation, account deletion, and data access rules pass tests.
4. AI tutor uses the approved knowledge base and provides source references or a safe fallback.
5. Practice tools pass functional, accessibility, and device tests.
6. Audio is private by default and retention/deletion behaviour is tested.
7. There is no billing or subscription system; verify that no feature is paywalled.
8. Monitoring, backups, incident contacts, and rollback procedures exist.
9. No critical/high security issues remain unresolved.
10. A small cohort of beginners and practising musicians has tested the product and their feedback has been triaged.

## 14. Open decisions

Resolve these through research, not guesswork:
- Which language(s) ship in the first release?
- Which music experts review the initial raga, tala, and instrument content?
- Which audio content is licensed or commissioned?
- Is the first mobile release a shared cross-platform codebase or separate native apps?
- What transparent fair-use controls, if any, are needed to prevent abuse while keeping all features free?
- Which exercise set is legally cleared and pedagogically appropriate?
- What data retention period is required for user recordings?
