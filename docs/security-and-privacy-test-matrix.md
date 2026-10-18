# NadaVerse — Security, Authorization & Privacy Test Matrix

**Document Version:** 1.0.0-beta  
**Evaluation Commit:** `a09cf4e757f2d8ec02dd934b412d2eb30b1981e4` (`a09cf4e`)  
**Target Hosts:** FastAPI Backend (`/api/v1/*`), Next.js Web Client  
**Verification Framework:** Pytest (Async SQLAlchemy) + Service Worker Invariant Harness  

---

## 1. Role-Based Access Control (RBAC) & Endpoint Authorization Matrix

Every API route enforces explicit authentication and role-based permissions. The table below documents authorization behavior across the five user roles:
- **Guest** (Unauthenticated)
- **Student** (Authenticated learner)
- **Teacher** (Authenticated instructor)
- **Editor** (Authenticated musicologist/content reviewer)
- **Admin** (System administrator)

| Endpoint | Method | Guest | Student | Teacher | Editor | Admin | Object-Level Check / IDOR Protection |
|---|---|---|---|---|---|---|---|
| `/api/v1/health` | GET | 200 | 200 | 200 | 200 | 200 | Public health probe |
| `/api/v1/meta/deployment` | GET | 200 | 200 | 200 | 200 | 200 | Zero secrets exposed (SHA, runtime only) |
| `/api/v1/ragas` | GET | 200 | 200 | 200 | 200 | 200 | Canonical public catalogue |
| `/api/v1/talas` | GET | 200 | 200 | 200 | 200 | 200 | Canonical public catalogue |
| `/api/v1/instruments` | GET | 200 | 200 | 200 | 200 | 200 | Canonical public catalogue |
| `/api/v1/compositions` | GET | 200 | 200 | 200 | 200 | 200 | Rights-cleared composition metadata |
| `/api/v1/search` | GET | 200 | 200 | 200 | 200 | 200 | Public multi-entity full-text search |
| `/api/v1/auth/register` | POST | 201 | 201 | 201 | 201 | 201 | Rate-limited registration |
| `/api/v1/auth/login` | POST | 200 | 200 | 200 | 200 | 200 | Rate-limited JWT issue |
| `/api/v1/me/export` | GET | 401 | 200 | 200 | 200 | 200 | Scoped strictly to authenticated user's ID |
| `/api/v1/me` | DELETE | 401 | 200 | 200 | 200 | 200 | Cascading self-deletion of all records |
| `/api/v1/users/{id}` | DELETE | 401 | 403* | 403* | 403* | 200 | *Self-delete allowed; others return 403 |
| `/api/v1/curriculum/progress` | GET/POST | 401 | 200 | 200 | 200 | 200 | Isolated to authenticated user session |
| `/api/v1/audio/analyze-practice` | POST | 200* | 200 | 200 | 200 | 200 | *Requires numerical metrics & explicit consent |
| `/api/v1/classes` (Create) | POST | 401 | 403 | 200 | 200 | 200 | Only teacher/editor/admin can create classes |
| `/api/v1/classes/{id}/invite` | POST | 401 | 403 | 200* | 200* | 200 | *Teacher must own the target class ID |
| `/api/v1/classes/join` | POST | 401 | 200 | 200 | 200 | 200 | Validates token expiry & single-use |
| `/api/v1/assignments` (Create) | POST | 401 | 403 | 200* | 200* | 200 | *Teacher must own the target class ID |
| `/api/v1/submissions` (Create) | POST | 401 | 200* | 200* | 200* | 200 | *Must be enrolled in assignment's class |
| `/api/v1/submissions/{id}/review` | POST | 401 | 403 | 200* | 200* | 200 | *Teacher must own assignment's class |
| `/api/v1/heritage/entries` (Public) | GET | 200 | 200 | 200 | 200 | 200 | Returns only approved (`published`) items |
| `/api/v1/heritage/submissions` | POST | 401 | 201* | 201* | 201* | 201 | *Forces status to `pending_review` |
| `/api/v1/heritage/{id}/review` | POST | 401 | 403 | 403 | 200 | 200 | Students & teachers strictly rejected (403) |
| `/api/v1/telemetry/errors` | POST | 200 | 200 | 200 | 200 | 200 | Non-blocking client crash logger; no PII |

---

## 2. Invariable Isolation & IDOR Negative Tests (Pytest Verified)

The following security invariants are verified across `backend/tests/test_api.py`, `backend/tests/test_beta_readiness.py`, and `backend/tests/test_privacy_and_export.py`:

1. **Cross-User Submission Tampering:**
   - User A (student) cannot view or submit reviews against User B's assignment submissions $\to$ HTTP 403 Forbidden.
2. **Teacher Class Boundary Enforcement:**
   - Teacher A cannot issue assignments, generate invites, or review submissions for Teacher B's Gurukulam class $\to$ HTTP 403 Forbidden.
3. **Privilege Escalation Protection:**
   - Ordinary students and teachers attempting to approve or reject Heritage Archive submissions $\to$ HTTP 403 Forbidden.
4. **Data Export Privacy Boundary:**
   - `GET /api/v1/me/export` for User A returns only User A's profile, sessions, bookmarks, curriculum progress, memberships, and submissions. It contains zero records from User B.
5. **Account Deletion Cascade:**
   - `DELETE /api/v1/me` deletes User A's credentials, progress, and assignments; subsequent requests with User A's JWT return HTTP 401 Unauthorized.
6. **Token Expiry & Revocation:**
   - Expired or revoked Gurukulam invitation tokens return HTTP 400 Bad Request.

---

## 3. Privacy by Design: Client Audio Guarantee

### 3.1 Zero Raw Audio Flow
- **Capture:** `navigator.mediaDevices.getUserMedia({ audio: true })` initializes an in-memory `AudioContext`.
- **Processing:** `autocorrelation()` runs in-browser on `Float32Array` time-domain buffers (frame latency < 15ms).
- **Extraction:** Only computed mathematical scalars (`fundamentalFrequency`, `centsDeviation`, `stabilityScore`, `swarasthana`) are retained.
- **Submission:** If and only if the user explicitly consents, numerical metrics are posted to `/api/v1/audio/analyze-practice`.
- **Network Verification:** DevTools network analysis and automated test `web/scripts/test-pitch-benchmark.mjs` verify zero audio blobs, WebM chunks, WAV buffers, or base64 audio streams are transmitted.
- **Storage Verification:** No raw audio data is persisted in `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.

---

## 4. Service Worker Cache Isolation & Multi-Account Protection

The Service Worker (`web/public/sw.js`) enforces strict boundaries verified by `web/scripts/test-sw-privacy.mjs`:
- **Allowlist Only:** Only designated static assets (`/`, `/favicon.ico`, `/manifest.json`, static CSS/JS) are cached.
- **API Request Bypass:** All `/api/*` requests bypass cache with a 503 fallback when offline.
- **Header Isolation:** Any request containing `authorization` or `cookie` headers strictly bypasses cache.
- **Server Component Bypass:** Next.js RSC requests (`_rsc`, `next-action`, `next-router-state-tree`) are never cached.
- **Query String Protection:** URLs with query strings (e.g., invitation tokens, reset parameters) are excluded from the HTML cache.
- **Same-Origin Restriction:** Cross-origin requests cannot enter the cache.
