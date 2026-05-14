/* ─────────────────────────────────────────────────────────────
   js/cyclops.js — Animated cyclops eye
   Features:
     · Entrance animation once the eye scrolls into view
     · Pupil tracks the mouse cursor (requestAnimationFrame-throttled)
     · Randomised natural-looking blink loop
     · All animations respect prefers-reduced-motion
───────────────────────────────────────────────────────────── */

import {
  PUPIL_MAX_RADIUS,
  CYCLOPS_THRESHOLD,
  BLINK_CLOSE_MS,
  BLINK_REOPEN_MS,
  BLINK_MIN_DELAY,
  BLINK_JITTER,
} from './constants.js';

export function initCyclops() {
  const cyclops = document.getElementById('cyclops');
  const lid     = document.getElementById('cyclopsLid');
  const lashes  = document.getElementById('cyclopsLashes'); // optional element
  const gaze    = document.getElementById('cyclopsGaze');
  if (!cyclops || !lid || !gaze) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Entrance observer ───────────────────────────────────
  // Uses a higher threshold than the general scroll-reveal observer so the
  // full eye is visible on screen before its entrance animation fires.
  const entranceObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cyclops.classList.add('is-visible');
      entranceObs.disconnect();
      if (!reducedMotion) scheduleBlink();
    }
  }, { threshold: CYCLOPS_THRESHOLD });

  entranceObs.observe(cyclops);

  // ── Cursor-tracking gaze ────────────────────────────────
  // Mouse events fire very frequently, so we read coordinates eagerly but
  // defer the DOM write to the next animation frame to avoid layout thrashing.
  if (!reducedMotion) {
    let mouseX     = window.innerWidth  / 2;
    let mouseY     = window.innerHeight / 2;
    let rafPending = false;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(trackGaze);
      }
    });

    function trackGaze() {
      rafPending = false;
      const eyeball = cyclops.querySelector('.cyclops__eyeball');
      const rect    = eyeball.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = mouseX - cx;
      const dy      = mouseY - cy;
      const dist    = Math.hypot(dx, dy);
      // Clamp travel so the pupil never leaves the eyeball.
      const scale   = dist > PUPIL_MAX_RADIUS ? PUPIL_MAX_RADIUS / dist : 1;
      const x       = (dx * scale).toFixed(1);
      const y       = (dy * scale).toFixed(1);
      gaze.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  }

  // ── Blink loop ──────────────────────────────────────────
  // Uses three-level mutual recursion for natural double-blinks:
  //   scheduleBlink → doBlink(cb) → [lid closes] → [lid opens] → cb
  // where cb is either scheduleBlink (single) or () => doBlink(scheduleBlink) (double).

  function doBlink(cb) {
    lid.classList.add('is-closed');
    if (lashes) lashes.classList.add('is-closed');

    setTimeout(() => {
      lid.classList.remove('is-closed');
      if (lashes) lashes.classList.remove('is-closed');

      // Wait a beat after reopening so the eye looks fully open before
      // the next action (either closing again or scheduling the next blink).
      if (cb) setTimeout(cb, BLINK_REOPEN_MS);
    }, BLINK_CLOSE_MS);
  }

  function scheduleBlink() {
    const delay    = BLINK_MIN_DELAY + Math.random() * BLINK_JITTER;
    const doDouble = Math.random() < 0.3;
    setTimeout(() => {
      doBlink(doDouble ? () => doBlink(scheduleBlink) : scheduleBlink);
    }, delay);
  }
}
