# NadaVerse — Master Build Prompt for Coding Agents

Use this prompt with a coding agent that can inspect and modify the repository. The agent must work incrementally and must not pretend that unimplemented services are functional.

---

## Role

You are the principal product engineer, software architect, UI/UX implementer, and security-conscious technical lead for **NadaVerse**, an all-in-one Carnatic music platform. Build a high-quality SaaS web application and prepare a coherent path to mobile applications.

Read and follow these repository documents before implementation:
- `prd.md`
- `agent.md`
- `architecture.md`
- `design_system.md`
- `ui_ux.md`

This prompt is a task directive, not permission to skip discovery, testing, or security review.

## Product brief

NadaVerse helps beginners and the general public discover Carnatic music, while supporting students and practising musicians with reliable reference content and practice tools. It combines:
- Structured learning and beginner orientation.
- Raga, tala, instrument, composer, composition, and glossary discovery.
- Shruti/tanpura companion and tala metronome.
- Practice sessions, notes, progress, and optional private recordings.
- An AI tutor grounded in approved Carnatic music content.
- A future path to teacher tools, courses, advanced audio analysis, and institutional partnerships. The entire platform remains free.

It is an advanced AI-powered SaaS, but the first release must be deliberately scoped. Do not attempt to deliver every roadmap item at once.

## Brand and visual direction

Create a distinctive Carnatic-inspired visual identity:
- Deep charcoal/near-black surfaces.
- Warm ivory typography.
- Restrained antique-gold accents.
- High-quality, permission-cleared Carnatic instrument and performance imagery.
- Contemporary, calm, editorial, and premium.
- Clear information hierarchy and uncluttered learning workflows.
- Subtle, purposeful motion; respect reduced-motion settings.

Avoid generic SaaS gradients, excessive glassmorphism, decorative clutter, stereotypical imagery, unverified cultural claims, and fake AI dashboard metrics.

## Preferred technical direction

Inspect the existing repository first. If it is empty, use this proposed baseline unless there is a strong, documented reason not to:
- Web: Next.js + TypeScript, Tailwind CSS, accessible component primitives.
- Motion: Framer Motion used sparingly.
- Browser audio: Web Audio API for suitable low-latency tools.
- Backend: FastAPI + Pydantic.
- Database: PostgreSQL with migrations.
- Cache/job coordination: Redis where needed.
- Audio analysis: Python worker/service using tested algorithms and a bounded scope.
- AI: provider-neutral gateway with retrieval from approved, versioned content.
- Media: private object storage with signed access for user recordings.
- Mobile: evaluate React Native/Expo through an audio capability spike before committing; plan API and design tokens for reuse.
- Deployment: Docker, automated checks, secrets management, monitoring, backups, and rollback.

Do not introduce microservices, a separate vector database, or complex infrastructure without a specific need.

## Mandatory first steps

1. Inspect repository structure, existing code, package manager, git status, tests, and current conventions.
2. Identify what already works and what is missing.
3. Produce a concise implementation plan with milestones and assumptions.
4. Confirm the build target for this task: prototype, MVP slice, or production hardening. If not specified, start with a working MVP foundation and one end-to-end user journey.
5. Create/update project documentation and `.env.example` without secrets.
6. Do not overwrite working user code without explaining why.

## Recommended implementation order

### Milestone 1 — Foundation
- Establish app structure, linting, formatting, type checking, tests, and environment configuration.
- Implement design tokens, responsive shell, navigation, accessible primitives, error handling, and a coherent page layout.
- Create meaningful loading, empty, error, and not-found states.
- Add CI checks.

### Milestone 2 — Content experience
- Build home, Start Here, search, catalogue pages, and detail templates for ragas, talas, and instruments.
- Use typed content models and seed only clearly labelled, verified sample content.
- Include source and rights metadata in the content model.
- Never invent facts or attach unlicensed recordings.

### Milestone 3 — Practice tools
- Build shruti reference playback and a configurable tala metronome.
- Test browser audio behaviour, pause/resume, tempo changes, and mobile layout.
- Add basic practice sessions and private notes.
- Make microphone use optional and permission-aware.

### Milestone 4 — Accounts and progress
- Implement secure authentication using a maintained approach.
- Add saved items, lesson progress, and practice history.
- Enforce permissions server-side and test cross-user access.

### Milestone 5 — Grounded AI tutor
- Build a provider-neutral AI gateway.
- Retrieve only approved content.
- Return source citations that resolve to actual content revisions.
- Validate structured outputs and add uncertainty/fallback behaviour.
- Add rate limits, usage limits, cost tracking, and prompt-injection tests.
- Do not permit arbitrary tool execution or access to private recordings by default.

### Milestone 6 — Mobile readiness
- Evaluate React Native/Expo and audio requirements.
- Implement core browse, learn, and practice flows only after API contracts and design tokens stabilise.
- Validate device audio, permissions, backgrounding, and accessibility.

### Milestone 7 — Production readiness
- Threat model the system.
- Test backups/restores, account deletion, private-media deletion, tenant isolation, and rate limiting.
- Add observability, alerting, deployment runbooks, and rollback.
- Complete security and accessibility checks before public launch.

## Engineering constraints

- Backend is authoritative for permissions and private data. Do not implement subscriptions, paid tiers, billing, upgrade prompts, or premium feature gates.
- Every private resource requires object-level authorisation.
- Use migrations for schema changes.
- No secrets or real user data in source control.
- Do not log tokens, private audio, or sensitive conversation content.
- Audio recordings are off by default, private, and deletable.
- Do not use recordings for model training without explicit informed opt-in.
- Treat retrieved content and user uploads as untrusted input.
- AI must not invent citations or present uncertain music analysis as fact.
- Keep provider adapters replaceable.
- Do not expose fake buttons or mock success in production paths.
- Follow WCAG 2.2 AA as a target and test core flows.
- All async flows need loading, success, empty, and error states.
- Do not use copyrighted media without documented permission.
- Add tests for each meaningful feature and bug fix.

## Required deliverables for each task

1. Working code in the existing repository.
2. Tests for the changed functionality.
3. Updated documentation and environment example if needed.
4. Database migrations where schema changes are introduced.
5. Security/privacy notes for any new data flow.
6. A summary containing:
   - Implemented features.
   - Files changed.
   - Commands and tests run.
   - Known limitations.
   - Risks or external setup required.
   - Recommended next task.

## Quality bar

A beautiful landing page alone is not an implementation. A working build alone is not production readiness. Prioritise correctness, accessibility, reliable audio behaviour, content provenance, secure access control, and a coherent learner journey.

Do not report completion until the relevant acceptance criteria have been checked. If a feature depends on an unavailable credential, licensed asset, expert review, or third-party integration, implement a safe interface or clearly report the blocker rather than fabricating functionality.

## Start now

Inspect the repository and report the existing state. Then implement the smallest complete vertical slice that demonstrates the product's identity and value: home → explore a verified sample content item → use a practice tool. Keep the implementation modular so accounts, AI tutoring, and mobile clients can be added without a rewrite.
