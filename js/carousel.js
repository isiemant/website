/* ─────────────────────────────────────────────────────────────
   js/carousel.js — Updates timeline carousel
   Handles: paged scrolling, responsive card sizing, keyboard,
            touch-swipe, resize debounce.

   Exports:
     initCarousel()           — wire up DOM, called once from main.js
     setTimelineItems(items)  — called by i18n.js after each rebuild
                                so the carousel knows the item count
     carouselGoTo(page, anim) — called by i18n.js to reset to page 0
                                after a language change / rebuild
───────────────────────────────────────────────────────────── */

import { CAROUSEL_GAP, CAROUSEL_TRANSITION_MS, CAROUSEL_BUSY_LOCK_MS } from './constants.js';
import { initSwipe, track } from './utils.js';

// ── Shared state updated by i18n.js ──────────────────────────

/** Current timeline items — kept in sync with buildTimeline() via setTimelineItems(). */
let timelineItems = [];

export function setTimelineItems(items) {
  timelineItems = items;
}

// ── carouselGoTo delegate ─────────────────────────────────────
// initCarousel() replaces this with the real goTo once the DOM is ready.

let carouselGoToFn = () => {};

export function carouselGoTo(page, animate) {
  carouselGoToFn(page, animate);
}

// ── Carousel init ─────────────────────────────────────────────

export function initCarousel() {
  const timelineEl = document.getElementById('timeline');
  const prevBtn    = document.getElementById('timelinePrev');
  const nextBtn    = document.getElementById('timelineNext');
  if (!timelineEl || !prevBtn || !nextBtn) return;

  let page = 0;
  let busy = false;

  // ── Layout helpers ──────────────────────────────────────

  function perPage() {
    if (window.innerWidth >= 960) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function totalPages() {
    return Math.ceil(timelineItems.length / perPage());
  }

  function cardWidth() {
    const win = timelineEl.closest('.timeline-window') || timelineEl;
    return (win.clientWidth - CAROUSEL_GAP * (perPage() - 1)) / perPage();
  }

  function sizeCards() {
    const w = cardWidth();
    timelineEl.querySelectorAll('.timeline-item').forEach(c => {
      c.style.flex = `0 0 ${w}px`;
    });
  }

  // ── Core navigation ──────────────────────────────────────

  function goTo(targetPage, animate) {
    // Skip if a previous animation is still running.
    // CAROUSEL_BUSY_LOCK_MS is intentionally longer than CAROUSEL_TRANSITION_MS
    // to account for the spring overshoot at the end of the easing curve.
    if (busy && animate) return;

    page = Math.max(0, Math.min(targetPage, totalPages() - 1));

    const offset = page * perPage() * (cardWidth() + CAROUSEL_GAP);
    timelineEl.style.transition = animate
      ? `transform ${CAROUSEL_TRANSITION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
      : 'none';
    timelineEl.style.transform = `translateX(-${offset}px)`;

    if (animate) {
      busy = true;
      setTimeout(() => { busy = false; }, CAROUSEL_BUSY_LOCK_MS);
    }

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page >= totalPages() - 1;
  }

  // ── Controls ─────────────────────────────────────────────

  prevBtn.addEventListener('click', () => { track('carousel-prev'); goTo(page - 1, true); });
  nextBtn.addEventListener('click', () => { track('carousel-next'); goTo(page + 1, true); });

  // Arrow keys — active only when the updates section is in the viewport,
  // so they don't conflict with the photo slideshow arrows.
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rect = document.getElementById('updates').getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      e.preventDefault();
      e.key === 'ArrowRight' ? goTo(page + 1, true) : goTo(page - 1, true);
    }
  });

  initSwipe(timelineEl, dir => {
    track('carousel-swipe');
    dir === 'left' ? goTo(page + 1, true) : goTo(page - 1, true);
  });

  // Recompute layout on resize (debounced to avoid thrashing).
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCards();
      goTo(Math.min(page, totalPages() - 1), false);
    }, 100);
  });

  // ── Initial render ────────────────────────────────────────

  sizeCards();
  carouselGoToFn = goTo; // expose delegate for i18n.js
  goTo(0, false);
}
