/**
 * NadaVerse Composition Schema Validator
 * 
 * Verifies that a Carnatic composition adheres to schema v1.0.0,
 * ensures rhythmic cycle arithmetic matches Tala structure,
 * and confirms presence of provenance and rights metadata.
 */

import { PlayableComposition, CompositionValidationReport, SwaraEvent } from '../types/composition';

export function validateComposition(comp: unknown): CompositionValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  let totalNotes = 0;
  let totalDurationAksharas = 0;

  if (!comp || typeof comp !== 'object') {
    return {
      isValid: false,
      errors: ['Composition must be a valid non-null object'],
      warnings: [],
      totalNotes: 0,
      totalDurationAksharas: 0,
      sectionCount: 0
    };
  }

  const c = comp as Partial<PlayableComposition>;

  // 1. Schema Version Check
  if (c.schemaVersion !== '1.0.0') {
    errors.push(`Invalid or missing schemaVersion: expected "1.0.0", got "${c.schemaVersion}"`);
  }

  // 2. Identity & Metadata Check
  if (!c.id || typeof c.id !== 'string') errors.push('Missing or invalid id string');
  if (!c.slug || typeof c.slug !== 'string') errors.push('Missing or invalid slug string');
  if (!c.title || typeof c.title !== 'string') errors.push('Missing or invalid title string');
  if (!c.ragaName || typeof c.ragaName !== 'string') errors.push('Missing or invalid ragaName string');
  if (!c.talaName || typeof c.talaName !== 'string') errors.push('Missing or invalid talaName string');
  if (!c.composerName || typeof c.composerName !== 'string') errors.push('Missing or invalid composerName string');

  if (!c.talaTotalAksharas || typeof c.talaTotalAksharas !== 'number' || c.talaTotalAksharas <= 0) {
    errors.push('talaTotalAksharas must be a positive integer');
  }

  const validCategories = [
    'varnam',
    'keerthanam',
    'geetham',
    'swarajathi',
    'varisai',
    'raga_exercise',
    'violin_piece'
  ];
  if (!c.category || !validCategories.includes(c.category)) {
    errors.push(`Invalid category: "${c.category}". Must be one of: ${validCategories.join(', ')}`);
  }

  // 3. Sections & Rhythmic Arithmetic
  if (!Array.isArray(c.sections) || c.sections.length === 0) {
    errors.push('Composition must contain at least one valid section in sections array');
  } else {
    c.sections.forEach((section, sIdx) => {
      if (!section.id) errors.push(`Section at index ${sIdx} is missing an id`);
      if (!section.name) errors.push(`Section at index ${sIdx} is missing a name`);

      if (!Array.isArray(section.lines) || section.lines.length === 0) {
        errors.push(`Section "${section.name || sIdx}" contains no rhythmic lines`);
      } else {
        section.lines.forEach((line, lIdx) => {
          if (!Array.isArray(line.swaras) || line.swaras.length === 0) {
            errors.push(`Line ${line.lineNumber || lIdx} in section "${section.name}" has no swara events`);
          } else {
            let lineAksharaSum = 0;
            line.swaras.forEach((swara: SwaraEvent, swIdx: number) => {
              totalNotes++;
              if (!swara.swara) {
                errors.push(`Missing swara symbol at section "${section.name}", line ${lIdx + 1}, note ${swIdx + 1}`);
              }
              if (typeof swara.ratio !== 'number' || swara.ratio <= 0.4 || swara.ratio >= 5.0) {
                errors.push(
                  `Invalid frequency ratio ${swara.ratio} for swara "${swara.swara}" in section "${section.name}"`
                );
              }
              if (typeof swara.durationAksharas !== 'number' || swara.durationAksharas <= 0) {
                errors.push(
                  `Invalid duration ${swara.durationAksharas} for swara "${swara.swara}" in section "${section.name}"`
                );
              } else {
                lineAksharaSum += swara.durationAksharas;
                totalDurationAksharas += swara.durationAksharas;
              }

              // Validate violin annotations if present
              if (swara.violin) {
                if (![1, 2, 3, 4].includes(swara.violin.string)) {
                  errors.push(`Invalid violin string ${swara.violin.string}. Must be 1, 2, 3, or 4`);
                }
                if (![0, 1, 2, 3, 4].includes(swara.violin.finger)) {
                  errors.push(`Invalid violin finger ${swara.violin.finger}. Must be 0, 1, 2, 3, or 4`);
                }
                if (!['down', 'up'].includes(swara.violin.bowDirection)) {
                  errors.push(`Invalid violin bowDirection "${swara.violin.bowDirection}". Must be "down" or "up"`);
                }
              }
            });

            // Rhythmic check against Tala length
            if (c.talaTotalAksharas && Math.abs(lineAksharaSum - c.talaTotalAksharas) > 0.001) {
              errors.push(
                `Akshara duration mismatch: Line ${line.lineNumber || lIdx + 1} in section "${section.name}" has duration sum ${lineAksharaSum} aksharas, expected ${c.talaTotalAksharas} for ${c.talaName}`
              );
            }
          }
        });
      }
    });
  }

  // 4. Rights & Provenance Check
  if (!c.rights || typeof c.rights !== 'object') {
    errors.push('Missing rights metadata object');
  } else {
    if (!c.rights.status) errors.push('Missing rights.status (e.g. public_domain, cc_by_sa)');
    if (!c.rights.rightsHolder) errors.push('Missing rights.rightsHolder');
  }

  if (!Array.isArray(c.sources) || c.sources.length === 0) {
    warnings.push('Composition does not cite any primary source treatises or publications');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalNotes,
    totalDurationAksharas,
    sectionCount: Array.isArray(c.sections) ? c.sections.length : 0
  };
}
