/* ─────────────────────────────────────────────────────────────
   js/scroll.js — Scroll progress bar + hero parallax
───────────────────────────────────────────────────────────── */

import { PARALLAX_FACTOR, PARALLAX_MAX_SHIFT } from './constants.js';
import { track } from './utils.js';

export function initScroll() {
  const bar       = document.getElementById('scrollProgress');
  const heroInner = document.querySelector('.hero__inner');
  const depthFired = new Set();

  function onScroll() {
    const scrolled = window.scrollY;
    const max      = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = max > 0 ? (scrolled / max) * 100 : 0;

    if (bar) bar.style.width = pct + '%';

    for (const milestone of [25, 50, 75, 100]) {
      if (pct >= milestone && !depthFired.has(milestone)) {
        depthFired.add(milestone);
        track(`scroll-${milestone}`);
      }
    }

    // Shift the hero text downward as the user scrolls — clamped at
    // PARALLAX_MAX_SHIFT so it never overflows its container on long pages.
    // Applied only to .hero__inner so it doesn't affect layout.
    if (heroInner) {
      const shift = Math.min(scrolled * PARALLAX_FACTOR, PARALLAX_MAX_SHIFT);
      heroInner.style.transform = `translateY(${shift}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state before first scroll
}
