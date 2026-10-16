# NadaVerse — System Threat Model & Security Architecture

**Document status:** Production Security Specification  
**Methodology:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)

---

## 1. System Overview & Asset Classification

### High-Value Assets
1. **User Audio Recordings:** Strictly private, confidential personal practice exercises.
2. **User Practice Notes & History:** Personally identifiable practice journals.
3. **Peer-Reviewed Reference Knowledge Base:** Integrity of raga lakshana, tala angas, and historical citations.
4. **AI Gateway Credentials:** External LLM API keys.

---

## 2. STRIDE Threat Analysis & Implemented Controls

| Threat Category | Potential Vector | Implemented Mitigations | Verification Status |
|---|---|---|---|
| **Spoofing** | JWT token forging, alg=none attacks | Strict `HS256` algorithm enforcement, secret key length validation, expiry timestamp checks in `app/core/security.py`. | Tested |
| **Tampering** | Parameter tampering, SQL injection | SQLAlchemy ORM parameterized queries; Pydantic request models with strict type validation at API boundary. | Tested |
| **Repudiation** | Denying content modification or deletion | `AuditEvent` table recording actor ID, action, target type, and UTC timestamp for all administrative and user deletion actions. | Tested |
| **Information Disclosure** | Cross-tenant access to private practice recordings | Object-level authorization enforced server-side: queries filter strictly by `user_id == current_user.id`. | Tested |
| **Denial of Service** | Flooding AI tutor endpoints or audio analysis | Rate limiting middleware, query length bounds (max 1000 chars), low max_tokens (500), client-side audio pitch detection. | Tested |
| **Elevation of Privilege** | Normal user attempting to delete another's bookmark or notes | Database query requires both `id == resource_id` and `user_id == current_user.id`. Unauthorized attempts return 404/403. | Tested |

---

## 3. AI Safety & Prompt-Injection Defenses

1. **Untrusted Data Isolation:**
   Retrieved reference texts are treated strictly as reference data, not system instructions.
2. **Instruction Override Filtering:**
   Queries attempting to override guardrails ("ignore previous instructions", "reveal system prompt") are intercepted by `AIGatewayService.sanitize_and_check_injection` and safely terminated with an explicit refusal notice.
3. **Citation Validation:**
   Every generated citation is verified to match an existing reviewed content slug in the database.
4. **Model Training Opt-Out:**
   No user conversation or practice recording is forwarded to third-party model training pipelines.

---

## 4. Production Security Headers & CORS Policy

- **CORS:** Locked down strictly to authorized frontend origins (`http://localhost:3000` in dev, production domain in prod).
- **HTTP Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
