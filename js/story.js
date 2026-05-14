/* ─────────────────────────────────────────────────────────────
   js/story.js — "Read my story" modal with slides
   Handles: slide navigation, dot indicators, swipe, keyboard,
            open/close, backdrop click-to-close.

   Exports:
     initStoryModal()         — wire up DOM, called once from main.js
     buildStorySlides(lang)   — (re)build slide content; called by i18n.js
                                on every language change
───────────────────────────────────────────────────────────── */

import { TRANSLATIONS } from './translations.js';
import { initSwipe, track } from './utils.js';

// ── Module-level state ────────────────────────────────────────

let storySlides  = [];
let currentIdx   = 0;

// initStoryModal() replaces this with the real implementation once the DOM
// is ready, so buildStorySlides() can safely call it during language changes.
let storyGoToFn = () => {};

// ── Slide builder (called by i18n.js) ─────────────────────────

/**
 * (Re)build the story slides and dots for the given language,
 * then reset to the first slide.
 *
 * @param {string} lang - 'en' or 'de'
 */
export function buildStorySlides(lang) {
  const t      = TRANSLATIONS[lang];
  storySlides  = t.story;

  const storyTrack = document.getElementById('storyTrack');
  const dotsEl = document.getElementById('storyDots');
  if (!storyTrack || !dotsEl) return;

  storyTrack.innerHTML = '';
  dotsEl.innerHTML = '';

  // Slides — built with createElement throughout (no innerHTML) for consistency.
  storySlides.forEach(s => {
    const slide = document.createElement('div');
    slide.className        = 'story-slide';
    slide.style.background = s.color;

    const labelEl       = document.createElement('span');
    labelEl.className   = 'story-slide__label';
    labelEl.textContent = s.label;

    const emojiEl       = document.createElement('div');
    emojiEl.className   = 'story-slide__emoji';
    emojiEl.textContent = s.emoji;

    const titleEl       = document.createElement('h2');
    titleEl.className   = 'story-slide__title';
    titleEl.textContent = s.title;

    const bodyEl       = document.createElement('p');
    bodyEl.className   = 'story-slide__body';
    bodyEl.textContent = s.body;

    slide.append(labelEl, emojiEl, titleEl, bodyEl);
    storyTrack.appendChild(slide);
  });

  // Dots
  storySlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `${t['ui.slide']} ${i + 1}`);
    dot.addEventListener('click', () => storyGoToFn(i));
    dotsEl.appendChild(dot);
  });

  storyGoToFn(0);
}

// ── Modal init ────────────────────────────────────────────────

export function initStoryModal() {
  const modal    = document.getElementById('storyModal');
  const openBtn  = document.getElementById('openStory');
  const closeBtn = document.getElementById('storyClose');
  const prevBtn  = document.getElementById('storyPrev');
  const nextBtn  = document.getElementById('storyNext');
  const storyTrackEl = document.getElementById('storyTrack');
  if (!modal) return;

  // ── Core navigation ────────────────────────────────────

  storyGoToFn = function goTo(idx) {
    const trackEl = document.getElementById('storyTrack');
    const dotsEl  = document.getElementById('storyDots');

    currentIdx = (idx + storySlides.length) % storySlides.length;

    if (trackEl) trackEl.style.transform = `translateX(-${currentIdx * 100}%)`;
    if (dotsEl) {
      dotsEl.querySelectorAll('.slideshow__dot').forEach((d, i) =>
        d.classList.toggle('active', i === currentIdx)
      );
    }
  };

  // ── Controls ──────────────────────────────────────────

prevBtn.addEventListener('click', () => { track('story-prev'); storyGoToFn(currentIdx - 1); });
    nextBtn.addEventListener('click', () => { track('story-next'); storyGoToFn(currentIdx + 1); });

  initSwipe(storyTrackEl, dir =>
    storyGoToFn(dir === 'left' ? currentIdx + 1 : currentIdx - 1)
  );

  // Arrow keys inside the open modal.
  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  storyGoToFn(currentIdx - 1);
    if (e.key === 'ArrowRight') storyGoToFn(currentIdx + 1);
  });

  // ── Open / close ───────────────────────────────────────

openBtn.addEventListener('click', () => { track('story-open'); storyGoToFn(0); modal.showModal(); });
    closeBtn.addEventListener('click', () => { track('story-close'); modal.close(); });

  // Click on the backdrop (outside the dialog content) closes the modal.
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}
