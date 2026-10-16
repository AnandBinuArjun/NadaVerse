# NadaVerse — Agent and Repository Operating Guide

This document defines how coding agents and human contributors should work in the NadaVerse repository. Treat it as a set of engineering constraints, not a replacement for the PRD or security review.

## 1. Mission

Build NadaVerse as a reliable, accessible, privacy-conscious Carnatic music learning and practice SaaS across web and mobile. Prioritise a coherent, useful MVP over a broad collection of unfinished features.

## 2. Source-of-truth order

When documents conflict, follow this order:
1. Explicit user/product-owner decisions.
2. `prd.md` for scope and acceptance criteria.
3. `architecture.md` for system boundaries and security controls.
4. `design_system.md` for visual tokens and component conventions.
5. `ui_ux.md` for journeys, page structure, and interaction behaviour.
6. This `agent.md` for day-to-day coding rules.
7. `prompt.md` for the implementation task sequence.

Call out conflicts instead of silently inventing product behaviour.

## 3. Working rules

- Inspect the repository, package manager, existing code, and tests before editing.
- Preserve existing working patterns unless there is a clear reason to change them.
- Make changes in small, testable slices.
- State assumptions in the pull request or task summary.
- Do not claim a feature is complete unless it is implemented and tested.
- Do not create fake integrations, placeholder security, or mock success states in production flows.
- If credentials, external services, or licensing decisions are missing, create a clear adapter/interface and document the blocker.
- Avoid large rewrites when a minimal patch is safer.
- Keep dependencies current within compatible ranges; explain major dependencies and security impact.
- Prefer readable code and explicit types over clever abstractions.
- Do not hard-code secrets, API keys, private URLs, or customer data.
- Never commit `.env` files, credentials, real user audio, or production data.
- Do not use user audio for model training unless a separate explicit opt-in system is designed and approved.

## 4. Product-specific correctness rules

### Carnatic content
- Do not fabricate raga lakshana, arohanam/avarohanam, tala structures, composer details, lyrics, or lineage.
- Content must have provenance and a review status.
- Support alternative names and transliterations where useful.
- Where traditions or interpretations differ, model the difference and cite the contributor/source instead of forcing one answer.
- AI-generated content must never be published as authoritative reference material without editorial review.
- Rights status must be explicit for audio, image, video, lyrics, notation, and lesson content.

### Audio and AI
- Separate raw signal analysis from musical interpretation.
- Pitch detection is not equivalent to swara recognition; swara interpretation depends on tonic, context, and musical phrasing.
- Do not present automated gamaka grading as reliable unless validated by domain experts and a documented evaluation set.
- AI responses must be grounded in approved material, provide citations where available, and acknowledge uncertainty.
- Never expose hidden prompts, API keys, internal logs, or another user's data.
- Use structured output schemas for AI features and validate all model output before use.
- Treat retrieved documents and user uploads as untrusted input; defend against prompt injection and tool misuse.

## 5. Architecture rules

- Web UI, mobile UI, backend API, background workers, AI gateway, and storage must have clear boundaries.
- The backend is the authority for identity, permissions, subscriptions, and private data.
- Use migrations for schema changes; never rely on manual production DB edits.
- Validate request bodies and query parameters at the API boundary.
- Enforce object-level access on every private resource.
- Use short-lived signed URLs for private media; do not make private recordings publicly addressable.
- Use idempotency for retriable background jobs. Do not add payment webhooks or subscription logic; the product is entirely free.
- Add timeouts, retry limits, rate limits, and cost controls to external AI calls.
- Keep AI and object-storage providers replaceable behind interfaces.
- Avoid coupling mobile clients directly to internal database schemas.

## 6. Security checklist for every feature

- Authentication required where appropriate?
- Authorisation checked on the server for the specific resource?
- Input validation and output encoding applied?
- Upload size, MIME type, and file signature validated?
- Secrets stored in a secret manager/environment, not source?
- Rate limiting and abuse controls considered?
- Logs free of tokens, sensitive prompts, and raw private audio?
- Personal data minimised and retention/deletion defined?
- Tenant isolation tested where multi-tenancy applies?
- Error messages avoid leaking internal details?
- Dependency and static analysis checks pass?
- Tests cover unauthorised and cross-user access?

## 7. Code quality

- TypeScript strict mode for TypeScript projects.
- Python type hints for public functions and service boundaries.
- Lint, format, type-check, unit tests, and relevant integration tests before declaring completion.
- Keep functions focused and avoid unnecessary global state.
- Use accessible semantic HTML and labelled controls.
- All async UI flows need loading, success, empty, and error states.
- Avoid inaccessible custom controls when native controls work.
- Use design tokens instead of ad hoc colour/spacing values.
- Keep business logic out of presentation components.
- Add tests for bug fixes that would have caught the original bug.

## 8. UI implementation rules

- Follow `design_system.md` and `ui_ux.md`.
- The visual identity is Carnatic-inspired: deep charcoal, warm ivory, restrained antique gold, and carefully chosen instrument photography/illustration.
- Avoid generic SaaS gradients, excessive glassmorphism, decorative music-note clutter, and ornate patterns that harm readability.
- Use animation sparingly and respect reduced-motion settings.
- Audio playback and practice controls must be reachable and usable on small screens.
- Never rely on colour alone to communicate state.
- Provide keyboard focus, touch target sizing, empty states, and responsive layouts.

## 9. Testing expectations

At minimum, add tests appropriate to the changed layer:
- Unit tests for business rules and data transformations.
- API tests for success, invalid input, unauthenticated access, and forbidden access.
- Integration tests for persistence and background jobs.
- UI tests for critical flows and accessible names.
- Audio tests using synthetic signals and a small consented/rights-cleared test corpus.
- AI evaluation tests for source grounding, refusal/fallback, and prompt injection.
- Tenant-isolation and object-level authorisation tests for private content.
- Fair-use and abuse-control tests; no billing tests are needed because paid plans are out of scope.

Do not use copyrighted recordings or personal recordings in tests without permission.

## 10. Definition of done

A task is done only when:
- Acceptance criteria are met.
- Code is formatted, linted, typed, and tested.
- Loading/error/empty/success states are handled.
- Accessibility and responsive behaviour are checked.
- Security/privacy implications are documented and tested.
- Documentation and environment examples are updated.
- Migrations and rollback implications are understood.
- No secrets or unlicensed media were added.
- The final report lists files changed, commands/tests run, known gaps, and any manual follow-up.

## 11. Agent response format

For each implementation task, report:
1. **Implemented:** concise feature summary.
2. **Files changed:** paths and purpose.
3. **Validation:** exact tests/checks run and results.
4. **Security/privacy:** relevant controls or unresolved risks.
5. **Known limitations:** what is not implemented or not validated.
6. **Next step:** the single most valuable follow-up.

Never state “production-ready” based solely on a successful build.
