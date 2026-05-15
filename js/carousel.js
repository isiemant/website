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
  renderDots(); // rebuild dots to match new item count
}

// ── carouselGoTo delegate ─────────────────────────────────────
// initCarousel() replaces this with the real goTo once the DOM is ready.

let carouselGoToFn = () => {};

// ── Dot state (populated after initCarousel runs) ─────────────

let renderDotsInternal = () => {};

function renderDots() { renderDotsInternal(); }

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

  // ── Dots ─────────────────────────────────────────────────

  const dotsEl = document.getElementById('timelineDots');

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const total = totalPages();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'timeline-dot' + (i === page ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsEl.appendChild(dot);
    }
  }

  function syncDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.timeline-dot').forEach((d, i) =>
      d.classList.toggle('active', i === page)
    );
  }

  // Expose buildDots so setTimelineItems (called before initCarousel sometimes) can call it.
  renderDotsInternal = buildDots;

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
    buildDots(); // dot count may change when perPage() changes on resize
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
    syncDots();
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

  // ── Nudge nav buttons when updates section first enters view ──
  const timelineNav = document.getElementById('timelineNav');
  if (timelineNav) {
    const nudgeObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      nudgeObs.disconnect();
      timelineNav.classList.add('is-nudging');
      timelineNav.addEventListener('animationend', () => timelineNav.classList.remove('is-nudging'), { once: true });
    }, { threshold: 0.5 });
    const updatesSection = document.getElementById('updates');
    if (updatesSection) nudgeObs.observe(updatesSection);
  }
}
