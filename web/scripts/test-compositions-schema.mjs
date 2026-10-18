/**
 * NadaVerse Composition Schema & Arithmetic Invariant Verification
 * Tests all canonical compositions against schema v1.0.0, rhythmic akshara sums,
 * frequency ratio validity, and rights provenance.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPOSITION_CATALOG } from '../src/data/compositionLibraryData.ts';
import { validateComposition } from '../src/lib/compositionValidator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rightsDocPath = path.resolve(__dirname, '../../docs/content-rights-review.md');
const rightsDoc = fs.existsSync(rightsDocPath) ? fs.readFileSync(rightsDocPath, 'utf8') : '';

console.log('--- NadaVerse Composition Schema & Rhythmic Integrity Verification ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify Catalog Size and Categories
assert(COMPOSITION_CATALOG.length >= 6, `Catalog contains ${COMPOSITION_CATALOG.length} compositions (>= 6 required)`);

const categories = new Set(COMPOSITION_CATALOG.map((c) => c.category));
assert(categories.has('varnam'), 'Catalog includes Tana Varnam');
assert(categories.has('keerthanam'), 'Catalog includes Kriti / Keerthanam');
assert(categories.has('geetham'), 'Catalog includes Geetham');
assert(categories.has('swarajathi'), 'Catalog includes Swarajathi');
assert(categories.has('varisai'), 'Catalog includes Varisai / Abhyasa Ganam');
assert(categories.has('violin_piece'), 'Catalog includes Violin Practice Piece');

// 2. Validate Every Canonical Composition with validateComposition
for (const comp of COMPOSITION_CATALOG) {
  const report = validateComposition(comp);
  assert(report.isValid, `"${comp.title}" (${comp.slug}) is valid schema v1.0.0 (Errors: ${report.errors.join(', ')})`);
  assert(report.totalNotes > 0, `"${comp.title}" has ${report.totalNotes} notes`);
  assert(report.sectionCount > 0, `"${comp.title}" has ${report.sectionCount} sections`);
  const hasRightsLedgerEntry = rightsDoc.includes(`**${comp.id}**`);
  assert(comp.rights.status === 'public_domain' && hasRightsLedgerEntry, `"${comp.title}" is explicitly verified public domain with matching rights ledger entry`);
  assert(comp.sources && comp.sources.length > 0, `"${comp.title}" cites authoritative source treatise`);
}

// 3. Test Rejection of Malformed Timing
const badRhythm = JSON.parse(JSON.stringify(COMPOSITION_CATALOG[0]));
badRhythm.sections[0].lines[0].swaras[0].durationAksharas = 99.0;
const badReport = validateComposition(badRhythm);
assert(!badReport.isValid, 'Malformed akshara sum correctly rejected by validator');
assert(badReport.errors.some(e => e.includes('duration sum')), 'Error message reports duration mismatch');

// 4. Test Rejection of Missing Rights Metadata
const badRights = JSON.parse(JSON.stringify(COMPOSITION_CATALOG[0]));
delete badRights.rights;
const badRightsReport = validateComposition(badRights);
assert(!badRightsReport.isValid, 'Missing rights metadata correctly rejected');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All Composition Schema & Rhythmic Invariants VERIFIED.\n');
}
