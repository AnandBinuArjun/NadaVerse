# NadaVerse — Privacy & Data Lifecycle Architecture

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**Guiding Principle:** Data Minimization & Learner Sovereignty (100% Free, Zero Audio Upload)

---

## 1. Zero Audio Upload & Client-Side Memory Guarantee

1. **Local-Only Audio Processing:**
   - Microphone input is processed strictly inside the user's browser via the Web Audio API (`AnalyserNode` time-domain autocorrelation).
   - Audio waveform buffers exist only in temporary volatile RAM while practice analysis is active.
   - When the user stops recording or navigates away, all MediaStream audio tracks are called with `.stop()` and audio contexts are closed.
   - **Zero raw audio files are streamed, uploaded, or persisted to backend servers.**

2. **Acoustic Metadata Transmission:**
   - When using the optional "Explainable AI Practice Companion", only high-level mathematical summary metrics are transmitted to `/api/v1/audio/analyze-practice`:
     - Average cent deviation across recognized notes.
     - Overall pitch stability percentage.
     - Per-swara intonation breakdown (e.g., `{"note": "Sa", "deviation_cents": 4.2}`).
     - Session duration seconds and selected tonic note.

3. **Explicit Opt-In Consent:**
   - Consent defaults to `false` in both the UI and backend API schemas.
   - Microphone streams cannot be initiated until the user clicks the explicit opt-in confirmation.
   - Missing or false consent flags in API requests are rejected with HTTP 422 / HTTP 400.

---

## 2. Account Data Model & Cascade Deletion

NadaVerse implements strict database-level cascading deletion to honor user deletion requests without leaving orphaned personal records.

### Cascade Matrix on User Deletion (`users.id`):

| Related Entity | Table Name | Deletion Action | Purpose / Integrity Note |
|---|---|---|---|
| **User Profile** | `user_profiles` | `CASCADE DELETE` | Cleans up display name, tonic preference, skill level, and personal notes. |
| **Bookmarks** | `bookmarks` | `CASCADE DELETE` | Cleans up saved ragas, instruments, and lessons. |
| **Lesson Progress** | `lesson_progress` | `CASCADE DELETE` | Cleans up curriculum quiz completions and progress state. |
| **Practice Sessions** | `practice_sessions` | `CASCADE DELETE` | Cleans up logged sadhana sessions, notes, and duration metrics. |
| **Group Memberships** | `group_members` | `CASCADE DELETE` | Removes student from Gurukulam teacher classes. |
| **Assignments** | `assignments` | `CASCADE DELETE` | Removes teacher-created assignments and drafts. |
| **Assignment Submissions** | `assignment_submissions` | `CASCADE DELETE` | Removes student submissions and reflection logs. |
| **Assignment Feedback** | `assignment_feedback` | `CASCADE DELETE` | Removes teacher feedback comments. |
| **Heritage Submissions** | `heritage_entries` | `SET NULL` | Anonymizes author identity (`submitter_id = NULL`) to preserve historical treatise contributions while erasing PII. |
| **Content Corrections** | `content_corrections` | `SET NULL` | Anonymizes submitter identity (`submitter_id = NULL`) while preserving peer-reviewed editorial history. |

### Immediate Token Revocation:
- Upon account deletion, the user row is marked with `deleted_at = now()`.
- Dependency middleware (`get_current_user`) rejects any request with a deleted or inactive user token with HTTP 401 Unauthorized.

---

## 3. Service Worker & Offline Cache Isolation

To prevent private account data from leaking across users sharing a family device, mobile phone, or public library terminal:

1. **Authentication & Credential Bypass:**
   - `web/public/sw.js` explicitly inspects incoming requests. Any request with an `Authorization` or `Cookie` header completely bypasses the Service Worker cache.
   - Responses containing `Set-Cookie` or `Cache-Control: private` / `no-store` are strictly rejected by the caching engine.
2. **Next.js React Server Component (RSC) Bypass:**
   - Navigation query parameter `_rsc` and server action headers (`rsc`, `next-router-state-tree`, `next-url`, `next-action`) bypass CacheStorage entirely.
3. **Public HTML Route Allowlist:**
   - Only explicitly declared static public routes (`PUBLIC_HTML_ALLOWLIST = new Set(['/', '/index.html'])`) are eligible for offline HTML caching. Dynamic, account-specific, or authenticated routes never enter CacheStorage.
4. **API Isolation:**
   - All `/api/` network requests bypass static caching. If offline, the Service Worker returns an explicit HTTP 503 JSON payload:
     `{"offline": true, "status": "offline_unavailable", "detail": "Offline Mode: ... requires a live network connection."}`
5. **Cache Storage Hygiene:**
   - Only public static assets (HTML shell, CSS, bundled JavaScript, SVG diagrams, and user-initiated offline learning packs) are stored in `CacheStorage`.
   - Outdated caches (`nadaverse-cache-v1`, `nadaverse-cache-v2`) are purged immediately upon activation of `nadaverse-cache-v3`.

---

## 4. Guest Mode & Local Data Sovereignty

- Unregistered guest learners can use all learning tools, Tala Studio, Tuner, Sadhana Planner, and Practice Playlists without creating an account.
- Guest practice records and bookmarks are stored exclusively in the browser's `localStorage` and `IndexedDB`.
- Guests have full local controls to export their data (`Export JSON / CSV`) and clear their history at any time with zero server trace.
