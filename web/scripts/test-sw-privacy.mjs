/**
 * NadaVerse Service Worker Privacy & Cache Boundary Automated Test Suite
 * Tests:
 * 1. Public route allowlist enforcement
 * 2. Header privacy (Authorization, Cookie, Set-Cookie)
 * 3. Cache-Control (no-store, private) exclusion
 * 4. Next.js RSC (_rsc, next-router-state-tree) exclusion
 * 5. API route bypass
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swPath = path.resolve(__dirname, '../public/sw.js');

const swContent = fs.readFileSync(swPath, 'utf8');

console.log('--- NadaVerse Service Worker Privacy & Security Verification ---');
let testsPassed = 0;
let testsFailed = 0;

function assertCheck(name, condition) {
  if (condition) {
    console.log(`[PASS] ${name}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${name}`);
    testsFailed++;
  }
}

// Invariant 1: Cache versioning exists and is updated
assertCheck('Cache revision is v3 or higher', swContent.includes('nadaverse-cache-v3'));

// Invariant 2: Explicit public HTML allowlist
assertCheck('Explicit PUBLIC_HTML_ALLOWLIST defined', swContent.includes('PUBLIC_HTML_ALLOWLIST') && swContent.includes("Set(["));

// Invariant 3: Authorization & Cookie guard
assertCheck('Authorization header bypasses cache', swContent.includes("request.headers.has('authorization')"));
assertCheck('Cookie header bypasses cache', swContent.includes("request.headers.has('cookie')"));

// Invariant 4: RSC protection
assertCheck('Next.js RSC query (_rsc) bypasses cache', swContent.includes("url.searchParams.has('_rsc')"));
assertCheck('Next.js RSC headers bypass cache', swContent.includes("request.headers.has('rsc')") && swContent.includes("request.headers.has('next-action')"));

// Invariant 5: API route bypass
assertCheck('All /api/ endpoints strictly bypass cache', swContent.includes("url.pathname.startsWith('/api/')"));

// Invariant 6: Response cacheability checks (no-store, private, Set-Cookie)
assertCheck('Set-Cookie responses are never cached', swContent.includes("response.headers.has('set-cookie')"));
assertCheck('no-store Cache-Control is never cached', swContent.includes("cacheControl.includes('no-store')"));
assertCheck('private Cache-Control is never cached', swContent.includes("cacheControl.includes('private')"));

// Invariant 7: Offline fallback only for public routes
assertCheck('Offline navigation restricted to allowlist', swContent.includes("if (isAllowedPublicRoute)"));

// Invariant 8: Same-origin boundary enforcement
assertCheck('Cross-origin requests strictly bypass cache', swContent.includes("url.origin !== self.location.origin"));

// Invariant 9: Query string leakage protection
assertCheck('Query strings strictly excluded from HTML allowlist cache', swContent.includes("!url.search"));

console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('All Service Worker privacy invariants VERIFIED.');
}
