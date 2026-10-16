# NadaVerse — UI/UX Specification

## 1. UX objective

Help a first-time visitor discover something meaningful about Carnatic music in under a minute, then give them a clear next step. Experienced learners should be able to reach practice tools and reference content quickly without navigating beginner material every time.

The interface should feel like a music-learning product, not an e-commerce storefront or a generic AI chat wrapper.

## 2. Information architecture

```text
NadaVerse
├── Home
├── Learn
│   ├── Start Here
│   ├── Learning Paths
│   ├── Lessons
│   └── Glossary
├── Explore
│   ├── Ragas
│   ├── Talas
│   ├── Instruments
│   ├── Composers
│   └── Compositions
├── Practice
│   ├── Shruti / Tonic
│   ├── Tala Studio
│   ├── Guided Exercises
│   ├── Practice Sessions
│   └── Recordings (opt-in)
├── AI Tutor
├── My Learning
│   ├── Progress
│   ├── Saved Items
│   └── Practice History
├── Teachers (later)
├── Community / Heritage (later)
└── Account & Settings
```

### Navigation principles
- Public content remains browseable without sign-in.
- Ask for account creation when the user wants to save progress, not before they can explore.
- Keep Practice one tap away on mobile.
- Do not place every catalogue category in the primary navigation on small screens.
- Clearly mark features that are experimental or not yet available; do not render fake buttons.

## 3. Primary navigation

### Desktop
- Logo/wordmark: NadaVerse.
- Main links: Learn, Explore, Practice, AI Tutor.
- Right side: Search, Saved/Progress, profile.
- A restrained “Start learning” CTA for signed-out users.

### Mobile
- Top bar: wordmark, search, profile.
- Bottom navigation: Home, Learn, Explore, Practice, Tutor.
- Secondary catalogue items live in contextual menus or Explore.
- Practice tools must fit narrow screens and landscape mode where useful.

## 4. Core pages and specifications

### 4.1 Home page

**Purpose:** Explain the product quickly and route visitors to a meaningful first action.

Sections:
1. Hero: “Discover Carnatic music. One note at a time.” with Start Learning and Explore Instruments.
2. Beginner entry card: “New to Carnatic music?” with a short, welcoming description.
3. Explore by interest: Ragas, Talas, Instruments, Composers.
4. Practice preview: Shruti Companion and Tala Studio.
5. Featured lesson or artist story, only when content is available and rights-cleared.
6. Learning paths for different experience levels.
7. Trust section: editorial review, attribution, and AI transparency.
8. Footer: about, accessibility, privacy, terms, contact, content correction/takedown.

Avoid a carousel as the primary hero. A static, strong hero is easier to understand and more accessible.

### 4.2 Start Here / beginner onboarding

**Purpose:** Reduce intimidation and establish the learner's next step.

Flow:
1. Welcome and plain-language explanation.
2. Optional question: “What are you interested in?” (listening, singing, instruments, rhythm, theory).
3. Optional experience level.
4. Recommend a short starter path.
5. Start lesson immediately; account can be offered after the first meaningful activity.

Requirements:
- Skip option available.
- Do not make users answer a long questionnaire.
- Explain unfamiliar terms in context.
- Persist choices only after appropriate consent/account creation.

### 4.3 Explore catalogue

**Purpose:** Make reference content discoverable.

Features:
- Search with type filters.
- Alphabetical and curated browse options.
- Relevant aliases/transliterations.
- Filters must be useful and not overcomplicate small catalogues.
- Clear empty state with spelling suggestions or alternate categories.
- Search results show content type, short description, and review status where useful.

### 4.4 Raga detail page

Recommended structure:
1. Raga name, alternate names/transliterations, and concise overview.
2. Verified arohanam and avarohanam with an accessible text representation.
3. Characteristic phrases and listening examples, if rights-cleared.
4. Parent/janya relationship where reviewed and appropriate.
5. Related compositions/composers and learning material.
6. Sources, editorial reviewer, and last-reviewed date.
7. Save and share actions.
8. “Ask the AI tutor about this raga” with context sent only as needed.

UX rules:
- Do not imply a raga is defined only by ascending/descending scales.
- Label differing traditions or interpretations when relevant.
- Do not generate notation without human review.
- Do not autoplay audio.

### 4.5 Instrument detail page

Recommended structure:
1. Instrument name and family.
2. Hero image with accurate alt text and source/rights metadata.
3. What it sounds like: short audio examples with clear attribution.
4. How it works: parts, construction, tuning, playing technique.
5. Role in Carnatic performance.
6. Related artists, traditions, and other instruments.
7. Beginner FAQ and glossary links.
8. Save/share and related learning path.

Use a mix of images, labelled diagrams, and short text. Avoid overly technical detail in the first viewport.

### 4.6 Tala Studio

**Purpose:** Practise a rhythmic cycle with dependable timing and clear state.

Controls:
- Tala selector.
- Tempo in BPM with direct numeric entry and increment/decrement.
- Cycle/subdivision display.
- Start, pause, stop, and reset.
- Optional accent/voice/sound choices if supported.
- Tap-along input with visual timing feedback.
- Help explaining the chosen tala and its structure.

Interaction:
- Start should provide immediate visual feedback.
- Tempo changes during playback must behave predictably.
- Do not assume one universal accent pattern when traditions differ.
- Offer a simple mode first and an advanced configuration panel second.
- Provide a non-animated accessible beat indicator.
- Handle audio context restrictions and permission errors gracefully.

### 4.7 Shruti Companion

**Purpose:** Provide a reliable reference tone and basic pitch awareness.

Controls:
- Tonic selection using a clear note/tonic convention.
- Octave/register where appropriate.
- Reference sound selection only when the sound is licensed or generated.
- Volume, play/pause, and continuous playback.
- Optional microphone pitch visualisation with explicit permission.

Feedback:
- Show measured frequency and confidence/quality when using a microphone.
- Explain that pitch detection may be affected by background noise and multiple sounds.
- Do not label a detected frequency as a definitive swara without context.
- Keep the tuner useful without an account.

### 4.8 Practice session

- Start a session with a chosen focus, or start without setup.
- Optional timer, private notes, selected reference material, and exercise.
- Recording is off by default and requires an explicit action/permission.
- Session summary shows duration, focus, notes, and available analysis.
- User can delete a session and its associated recording.
- Do not show fabricated performance scores.
- If analysis is processing, show status and allow leaving the page safely.

### 4.9 AI tutor

Layout:
- Clear prompt examples such as “What is a raga?” and “Explain this tala cycle”.
- Chat history and new conversation.
- Source citations on answers, linked to approved content.
- Follow-up suggestions tied to the current topic.
- Report answer / suggest correction action.
- Visible notice that AI may make mistakes and is not a replacement for a teacher.

Behaviour:
- If sources are weak or absent, say so.
- Distinguish established reference information from interpretive suggestions.
- Never fabricate citations.
- Never expose another user's recordings or private conversations.
- For audio uploads, explain processing, retention, and consent before upload.
- Use transparent fair-use/abuse-prevention limits only where operationally necessary. Never show paid-tier gates, upgrade prompts, or premium-only access.

### 4.10 My Learning dashboard

For beginners:
- Resume the current path.
- One recommended next step.
- Recently explored content.
- Practice streak only if it is genuinely useful and can be disabled.

For students/musicians:
- Recent practice sessions.
- Saved ragas/instruments/talas.
- Practice goals and history.
- Quick access to shruti and tala tools.

Avoid shame-based streak copy. A missed day should not be framed as failure.

### 4.11 Account, privacy, and settings

- Profile and language preference.
- Audio/microphone permissions guidance.
- AI processing and data-use explanations.
- Recording retention and delete controls.
- Export and account deletion.
- Notification preferences.
- Usage and privacy settings; do not show subscription status, pricing tiers, or upgrade prompts.
- Accessibility preferences, including reduced motion where applicable.

### 4.12 Admin content studio

- Content list with draft/review/published/archived states.
- Structured fields by content type.
- Source and rights metadata required before publishing relevant media.
- Review/approve workflow with reviewer identity and timestamps.
- Revision history and rollback.
- Reported-content queue and correction workflow.
- Admin actions recorded in audit logs.

## 5. Key interaction states

Every async component must define:
- Initial/loading.
- Loaded/ready.
- Empty.
- Error/retry.
- Offline or degraded state where relevant.
- Permission denied.
- Access restricted/fair-use limit (explain the reason and recovery path; no paid upgrade path).
- Processing/pending.
- Success/complete.

Do not show success until the backend or browser API confirms it.

## 6. Search UX

- Search across all supported content types.
- Show suggestions only when they are grounded in catalogue data.
- Support alternate names and transliterations.
- Preserve recent searches locally only where privacy policy allows; provide a clear option to clear them.
- Do not send sensitive search history to analytics by default.
- Explain no-results states and offer a route to report a missing item.

## 7. AI transparency and feedback UX

- Display citations in a compact, inspectable source list.
- Show source title, content type, and review state.
- Provide a report button with categories: inaccurate, missing context, unclear, inappropriate, other.
- Avoid numeric confidence percentages unless calibrated and validated.
- Mark experimental audio analysis clearly.
- Distinguish “detected pitch contour” from “musical interpretation”.
- Never use an AI answer as published reference content without human review.

## 8. Accessibility and inclusive design

- Target WCAG 2.2 AA.
- Keyboard navigation and visible focus.
- Screen-reader names for all controls.
- Captions/transcripts for videos when available.
- Text alternative for visual pitch/tala displays.
- Reduced-motion support.
- High contrast and scalable type.
- Avoid flashing beat effects.
- Do not rely on audio alone for critical feedback.
- Do not rely on colour alone to communicate a beat, status, or error.
- Test English and any supported Indic scripts with real content.

## 9. Mobile-specific UX

- Large, stable tap targets in Practice Studio.
- Keep screen awake only with user consent and only while a practice session needs it.
- Explain microphone and notification permissions at the point of need.
- Handle audio focus interruptions, phone calls, headphones, Bluetooth latency, and app backgrounding.
- Do not assume web and mobile audio timing will be identical.
- Cache only content that is permitted for offline use.
- Protect local private recordings and clear them on account/session deletion where applicable.

## 10. Content quality and trust

Each published content item should expose or internally maintain:
- Canonical title and alternate names.
- Language and transliteration.
- Author/contributor.
- Sources and attribution.
- Review status and reviewer.
- Last reviewed date.
- Rights status for each attached media asset.
- Known limitations or differing interpretations.
- Revision history.

A visually polished page with unreliable music information is a product failure. Content quality is part of UX.

## 11. Usability testing plan

Test with at least:
- 5–8 people unfamiliar with Carnatic music.
- 5–8 current students or practising musicians.
- 2–3 teachers or domain experts for content correctness and pedagogy.

Tasks:
1. Explain what NadaVerse offers after viewing the home page.
2. Find an instrument and explain its role.
3. Find a raga and locate its reference information.
4. Start a tala practice session and change tempo.
5. Play a shruti reference.
6. Ask the AI tutor a question and verify the source.
7. Find privacy settings and delete a test recording.

Observe task completion, confusion, misinterpretations, accessibility barriers, and trust. Do not treat small-sample usability results as statistically representative.

## 12. UX release checklist

- First-time visitor can discover and start without forced registration.
- Core content works on mobile and desktop.
- Audio never autoplays unexpectedly.
- Practice tools expose clear current state.
- All buttons work; unavailable features are not presented as functional.
- Loading/error/empty/offline states exist.
- AI citations resolve to real approved content.
- Users can find recording and AI data-use disclosures.
- Account deletion and recording deletion have been tested.
- Contrast, keyboard access, reduced motion, and screen-reader labels are checked.
- User testing feedback has been reviewed and critical issues fixed.
