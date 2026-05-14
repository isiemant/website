/* ─────────────────────────────────────────────────────────────
   js/slideshow.js — Photo slideshow carousel
   Handles: dot navigation, auto-play, swipe, keyboard arrows.
───────────────────────────────────────────────────────────── */

import { SLIDE_INTERVAL } from './constants.js';
import { initSwipe }      from './utils.js';

export function initSlideshow() {
  const slideshowEl = document.getElementById('slideshow');
  const track       = document.getElementById('slideshowTrack');
  const dotsEl      = document.getElementById('slideDots');
  const slides      = Array.from(track.querySelectorAll('.slide'));
  const total       = slides.length;
  let   currentIdx  = 0;
  let   autoTimer   = null;

  // ── Dot buttons ───────────────────────────────────────────

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  // ── Core navigation ───────────────────────────────────────

  function goTo(idx) {
    currentIdx = (idx + total) % total;
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
    dotsEl.querySelectorAll('.slideshow__dot').forEach((d, i) =>
      d.classList.toggle('active', i === currentIdx)
    );
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(currentIdx + 1), SLIDE_INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // ── Controls ──────────────────────────────────────────────

  document.getElementById('slidePrev').addEventListener('click', () => { goTo(currentIdx - 1); startAuto(); });
  document.getElementById('slideNext').addEventListener('click', () => { goTo(currentIdx + 1); startAuto(); });

  // Pause auto-play while the user is hovering.
  slideshowEl.addEventListener('mouseenter', stopAuto);
  slideshowEl.addEventListener('mouseleave', startAuto);

  // Swipe support via shared utility.
  initSwipe(slideshowEl, dir => {
    goTo(dir === 'left' ? currentIdx + 1 : currentIdx - 1);
    startAuto();
  });

  // Arrow keys advance the slideshow, but only when the updates section
  // is NOT in the viewport — the carousel (carousel.js) handles arrows there.
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const updates = document.getElementById('updates');
    if (updates) {
      const rect = updates.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) return;
    }
    goTo(e.key === 'ArrowLeft' ? currentIdx - 1 : currentIdx + 1);
    startAuto();
  });

  startAuto();
}
