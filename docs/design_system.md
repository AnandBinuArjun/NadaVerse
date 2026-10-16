# NadaVerse — Design System

## 1. Design intent

NadaVerse should feel like a contemporary digital music institution shaped by Carnatic music: calm, precise, culturally grounded, and inviting. The design should use heritage as a source of visual character without turning the interface into a festival poster or a generic luxury dashboard.

**Visual keywords:** raga, resonance, rhythm, warm light, craftsmanship, clarity, quiet confidence.

## 2. Brand principles

1. **Tradition with clarity:** Reference Carnatic forms through imagery, material, rhythm, and editorial content—not decorative clutter.
2. **Warm, not ornate:** Ivory and muted gold create warmth against charcoal; avoid excessive gold effects.
3. **Listening-led:** Audio controls and musical examples are first-class interface elements.
4. **Accessible contrast:** Every surface must remain readable in bright and low-light settings.
5. **Trustworthy learning:** Editorial sources, review status, and AI citations should be visually legible.
6. **Progressive density:** Beginners see simple explanations; advanced details are available without overwhelming the first view.

## 3. Colour tokens

Use semantic tokens in code; do not scatter raw hex values through components. These initial values are proposals and must be checked against WCAG 2.2 AA before release.

### Core palette

| Token | Hex | Intended use |
|---|---|---|
| `--nv-bg` | `#11110F` | Main dark canvas |
| `--nv-surface-1` | `#191916` | Cards and navigation surfaces |
| `--nv-surface-2` | `#22221D` | Raised panels, inputs |
| `--nv-border` | `#3B392F` | Subtle borders and dividers |
| `--nv-ivory` | `#F4EBDD` | Primary text on dark surfaces |
| `--nv-muted` | `#BDB4A4` | Secondary text; verify contrast by usage |
| `--nv-gold` | `#C7A45B` | Brand accent, selected state, focus accent |
| `--nv-gold-soft` | `#E0C98F` | Hover/active accent where contrast permits |
| `--nv-terracotta` | `#A95E45` | Limited editorial accent |
| `--nv-sage` | `#87947A` | Secondary positive/heritage accent |
| `--nv-success` | `#6EA887` | Success status; pair with text/icon |
| `--nv-warning` | `#D9A441` | Warning status |
| `--nv-danger` | `#E17D73` | Error/destructive status |

Do not use gold as body text on every background without contrast testing. Status colours must not be the sole signal.

### Light surfaces

The app may support a light reading mode in a later release. If implemented, define a complete semantic token set rather than inverting colours mechanically. The core brand can remain dark-first. Visual emphasis must never imply that a feature is paid or restricted to a premium tier; all user-facing product features are free.

## 4. Typography

- **UI font:** Manrope or another high-legibility sans serif with broad language coverage.
- **Editorial/heritage accent:** A restrained serif may be used for selected page titles, quotations, or artist profiles. It must not be used for dense UI labels.
- **Indic scripts:** Choose a font with verified Malayalam and other required script coverage; test shaping and line height on actual devices.
- **Music notation:** Use a consistent, documented notation style and accessible text equivalents.

### Type scale (desktop starting point)

| Token | Size / line height | Use |
|---|---|---|
| `display` | 56/64 px | Home hero only, responsive down |
| `h1` | 40/48 px | Main page title |
| `h2` | 32/40 px | Major section |
| `h3` | 24/32 px | Card/detail section |
| `h4` | 20/28 px | Subsection |
| `body-lg` | 18/28 px | Introductory content |
| `body` | 16/24 px | Default body |
| `body-sm` | 14/20 px | Supporting text |
| `label` | 12/16 px | Compact labels; avoid critical long copy |

Mobile headings should scale fluidly and avoid clipping at large text settings.

## 5. Spacing and layout

Use a 4 px base unit:
- `space-1`: 4 px
- `space-2`: 8 px
- `space-3`: 12 px
- `space-4`: 16 px
- `space-5`: 20 px
- `space-6`: 24 px
- `space-8`: 32 px
- `space-10`: 40 px
- `space-12`: 48 px
- `space-16`: 64 px
- `space-20`: 80 px

Recommended content width: 1120–1240 px for desktop reading and discovery pages. Keep long-form text narrower for readability. Use generous section spacing on marketing pages and tighter, task-oriented layouts in Practice Studio.

## 6. Shape, borders, and elevation

- Small controls: 8 px radius.
- Standard cards: 12–16 px radius.
- Hero/media panels: 20–24 px radius when appropriate.
- Border: 1 px solid semantic border token.
- Shadows: subtle and purposeful; dark UI should rely more on surface contrast than heavy shadows.
- Avoid glassmorphism as the default. If used for a media overlay, maintain contrast and avoid blur that makes text hard to read.

## 7. Imagery and illustration

Use authentic, high-quality imagery of veena, violin, mridangam, flute, tambura, ghatam, artists, instrument-making, and performance settings. Seek diverse contexts and accurate instrument depictions.

Rules:
- Prefer commissioned, licensed, or permission-cleared assets.
- Record source, creator, usage rights, and expiry where applicable.
- Avoid generic “Indian” stock imagery that misrepresents Carnatic practice.
- Avoid inaccurate instrument details or fabricated cultural artefacts.
- Provide meaningful alt text; decorative images use empty alt text.
- Use a consistent crop and colour grade; do not apply strong filters that distort instrument appearance.
- Use abstract line motifs inspired by strings, resonance, or tala cycles sparingly and respectfully.

## 8. Iconography

Use one consistent line-icon family, such as Lucide, with a stable stroke width. Icons should be paired with labels when meaning is not universally clear. Avoid using emoji as production UI icons. Instrument silhouettes may be custom illustrations with review from a knowledgeable contributor.

## 9. Components

### Buttons
- Primary: gold accent with dark text only when contrast passes; otherwise use an accessible adjusted token.
- Secondary: surface with border.
- Tertiary: text action.
- Destructive: danger styling with explicit confirmation for irreversible actions.
- States: default, hover, focus-visible, pressed, disabled, loading.

### Inputs
- Persistent label; placeholder is not the label.
- Inline validation with a clear error message.
- Visible focus ring.
- Password visibility toggle where relevant.
- Touch-friendly control height.

### Cards
- Use for raga, instrument, lesson, artist, and course summaries.
- Include clear title, concise description, metadata, and a single dominant action.
- Do not make every card a decorative glass panel.

### Audio player
- Play/pause, progress, elapsed/total time, volume where useful.
- Keyboard-operable controls and accessible names.
- Distinguish buffering, unavailable, and failed audio.
- Show attribution/rights context when relevant.
- Never autoplay audio with sound on page load.

### Practice controls
- Large, touch-friendly tempo and start/stop controls.
- Clearly display tonic, tempo, tala, and current state.
- Use both motion and labels to indicate beat position.
- Respect reduced motion and provide a non-animated state.

### AI tutor
- Distinguish user messages, tutor responses, and cited sources.
- Provide “Why this answer?”/source details.
- Make uncertainty and limitations visible without overwhelming every response.
- Include report/correction affordance.

### Status and badges
- Use text labels with status colour/icon.
- Use review badges such as “Expert reviewed”, “Community contribution”, or “AI suggestion” only when the underlying state is true and auditable.

## 10. Motion

- Use Framer Motion for short, purposeful transitions.
- Typical transition range: 150–250 ms; use longer motion only for meaningful page-level storytelling.
- No animation should block a primary action.
- Support `prefers-reduced-motion`.
- Avoid parallax and looping animations in the practice interface.
- Tala pulse animation must not be the only representation of beat position.

## 11. Accessibility requirements

Target WCAG 2.2 AA:
- Verify text and non-text contrast.
- Visible keyboard focus.
- Logical heading hierarchy and landmarks.
- Semantic buttons/links; no clickable `div` controls.
- Keyboard access to all core features.
- Screen-reader labels for audio and practice controls.
- Captions/transcripts for instructional video where available.
- Text alternatives for notation and visual pitch charts.
- Do not rely on colour alone.
- Respect zoom and text resizing.
- Touch targets should be comfortably usable; aim for at least 44 × 44 CSS px where practical.
- Test with keyboard, VoiceOver, and at least one desktop screen reader during release validation.

## 12. Responsive behaviour

- **Mobile:** Single-column content, bottom navigation for the primary learner journeys, sticky mini-player only when it does not obscure controls, large practice controls.
- **Tablet:** Two-column catalogue and learning layouts where comfortable; practice panel may remain stacked.
- **Desktop:** Sidebar or top navigation, content grid, wider practice workspace.
- Keep the current task prominent; avoid showing every feature at once.

## 13. Design tokens in CSS

```css
:root {
  color-scheme: dark;
  --nv-bg: #11110F;
  --nv-surface-1: #191916;
  --nv-surface-2: #22221D;
  --nv-border: #3B392F;
  --nv-text: #F4EBDD;
  --nv-text-muted: #BDB4A4;
  --nv-accent: #C7A45B;
  --nv-accent-soft: #E0C98F;
  --nv-terracotta: #A95E45;
  --nv-sage: #87947A;
  --nv-success: #6EA887;
  --nv-warning: #D9A441;
  --nv-danger: #E17D73;
  --nv-radius-sm: 8px;
  --nv-radius-md: 14px;
  --nv-radius-lg: 22px;
  --nv-space-unit: 4px;
}
```

This is a starting token set, not a guarantee of accessibility. Run contrast checks on actual component pairings and tune tokens before release.

## 14. Brand do / don't

**Do**
- Use authentic instrument imagery.
- Keep the learning experience calm and readable.
- Show sources, attribution, and review status.
- Give audio controls clear priority.
- Use gold as an accent rather than a flood colour.

**Don't**
- Use ornate motifs behind body text.
- Overuse gradients, blur, glow, or gold outlines.
- Use stereotypical or culturally inaccurate imagery.
- Treat all Carnatic traditions as identical.
- use animation as a substitute for accessible feedback.
