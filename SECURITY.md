# Security Policy for NadaVerse

NadaVerse is committed to safeguarding user privacy, local audio processing guarantees, and application security. We take all security vulnerabilities seriously and welcome responsible disclosure from researchers, developers, and students.

---

## Supported Versions

Only the latest release on the `main` branch receives active security updates and patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x (Public Beta)   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report vulnerabilities using one of the following secure channels:

1. **GitHub Private Vulnerability Reporting (Recommended):**
   - Navigate to the **Security** tab of this repository.
   - Click on **Report a vulnerability** to privately submit your findings to the repository maintainers.
2. **Direct Email:**
   - If GitHub private vulnerability reporting is unavailable, email the maintainer directly at:
     **security@abarjun.online** or contact via [abarjun.online](https://abarjun.online).
   - Please include:
     - Description of the vulnerability.
     - Steps to reproduce or proof-of-concept (PoC).
     - Potential impact (e.g., cross-user authorization bypass, injection, rate-limit evasion).
     - Any suggested remediation or patch.

---

## Response & Disclosure Process

- **Acknowledgment:** We aim to acknowledge receipt of your vulnerability report within **48 hours**.
- **Investigation:** We will investigate and confirm the issue within **5 business days**.
- **Remediation & Patch:** A fix will be developed, tested, and deployed to `main`.
- **Coordinated Disclosure:** We kindly request that you allow a reasonable window (typically 30 days) for remediation before public disclosure.
- **Credit:** We are glad to credit researchers in our release notes and security advisories for valid, responsibly disclosed findings.

---

## Scope & Non-Negotiable Guarantees

- **No Monetization / Paywalls:** NadaVerse is 100% free. Any report attempting to claim "unauthorized access to paid features" is out of scope as no paid features exist.
- **Local Audio Processing:** User microphone audio is processed locally via browser Web Audio autocorrelation; reports demonstrating server-side retention of raw audio without explicit consent will be treated as high priority.
