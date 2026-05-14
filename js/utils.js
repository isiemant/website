/* ─────────────────────────────────────────────────────────────
   js/utils.js — Shared helpers
   Exports:
     initSwipe(el, onSwipe)  — unified touch-swipe listener
     splitCSVRow(row)        — CSV row tokeniser (quoted fields)
     parseCSV(text)          — full CSV text → array of objects
     revealObserver          — shared IntersectionObserver for scroll-reveal
───────────────────────────────────────────────────────────── */

import { SWIPE_THRESHOLD, REVEAL_THRESHOLD } from './constants.js';


// ── Touch-swipe helper ───────────────────────────────────────

/**
 * Attach touch-swipe listeners to an element.
 * Replaces three near-identical inline handler pairs across
 * slideshow.js, carousel.js and story.js.
 *
 * @param {HTMLElement}                    el       - Element to listen on.
 * @param {function('left'|'right'): void} onSwipe  - Called with direction string.
 */
export function initSwipe(el, onSwipe) {
  let startX = 0;

  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      onSwipe(dx < 0 ? 'left' : 'right');
    }
  }, { passive: true });
}


// ── CSV utilities ────────────────────────────────────────────

/**
 * Split one CSV row into fields, respecting double-quoted fields
 * (handles embedded commas and escaped double-quotes "").
 *
 * @param  {string}   row
 * @returns {string[]}
 */
export function splitCSVRow(row) {
  const result = [];
  let   cur     = '';
  let   inQuote = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      // Escaped quote inside a quoted field → literal "
      if (inQuote && row[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }

  result.push(cur);
  return result;
}

/**
 * Parse a full CSV text → array of objects keyed by the header row.
 * Lines starting with # (after stripping leading quotes added by Excel)
 * are treated as comments and skipped.
 *
 * @param  {string}   text - Raw CSV content.
 * @returns {Object[]}
 */
export function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .split('\n')
    .filter(l => {
      const stripped = l.trim().replace(/^"+/, '');
      return stripped && !stripped.startsWith('#');
    });

  if (lines.length < 2) return [];

  const headers = splitCSVRow(lines[0]).map(h => h.trim());

  return lines.slice(1).map(line => {
    const vals = splitCSVRow(line);
    const obj  = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  });
}


// ── Scroll-reveal observer ───────────────────────────────────

/**
 * Shared IntersectionObserver for scroll-reveal animations.
 * Adds `.is-visible` to each target once it crosses REVEAL_THRESHOLD,
 * then unobserves it.  Dynamic elements (e.g. project cards) call
 * revealObserver.observe() after being added to the DOM.
 */
export const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: REVEAL_THRESHOLD }
);
