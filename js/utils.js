/* ─────────────────────────────────────────────────────────────
   js/utils.js — Shared helpers
   Exports:
     initSwipe(el, onSwipe)          — unified touch-swipe listener
     parseMarkdownFrontMatter(text)  — YAML front matter → plain object
     revealObserver                  — shared IntersectionObserver for scroll-reveal
───────────────────────────────────────────────────────────── */

import { SWIPE_THRESHOLD, REVEAL_THRESHOLD } from './constants.js';

export const track = (name) => window.umami?.track(name);


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


// ── Markdown front matter ─────────────────────────────────────

/**
 * Parse a Markdown file's YAML front matter into a plain object.
 * Requires js-yaml to be loaded globally (window.jsyaml).
 * Anything after the closing --- delimiter is returned as `body`.
 *
 * @param  {string}  text - Raw .md file content.
 * @returns {Object}
 */
export function parseMarkdownFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = window.jsyaml.load(match[1]) || {};
  const afterClose = text.indexOf('---', text.indexOf('---') + 3) + 3;
  const body = text.slice(afterClose).trim();
  if (body) data.body = body;
  return data;
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
