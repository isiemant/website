/* ─────────────────────────────────────────────────────────────
   js/story.js — "Read my story" modal — timeline edition
   Now → past, 7 stations, dark gradients, slide+fade transition.

   Exports:
     initStoryModal()         — wire up DOM, called once from main.js
     buildStorySlides(lang)   — (re)build slide content; called by i18n.js
                                on every language change
───────────────────────────────────────────────────────────── */

import { TRANSLATIONS } from './translations.js';
import { initSwipe, track } from './utils.js';

// ── Module-level state ────────────────────────────────────────

let storySlides = [];
let currentIdx  = 0;
let isAnimating = false;

// Filled in by initStoryModal so buildStorySlides can call it safely.
let storyGoToFn = () => {};

// ── UI updater ────────────────────────────────────────────────

function updateUI() {
  const fill    = document.getElementById('storyFill');
  const counter = document.getElementById('storyCounter');
  const total   = storySlides.length;
  if (!total) return;

  if (fill)    fill.style.width = total > 1 ? `${(currentIdx / (total - 1)) * 100}%` : '100%';
  if (counter) {
    const year = storySlides[currentIdx]?.year ?? '';
    counter.textContent = `${year} · ${currentIdx + 1} / ${total}`;
  }
}

// ── Slide builder (called by i18n.js) ─────────────────────────

export function buildStorySlides(lang) {
  const t     = TRANSLATIONS[lang];
  storySlides = t.story;

  const trackEl = document.getElementById('storyTrack');
  if (!trackEl) return;

  trackEl.innerHTML = '';

  storySlides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'story-slide' + (i === 0 ? ' is-active' : '');
    slide.style.background = s.color;

    const yearEl       = document.createElement('div');
    yearEl.className   = 'story-slide__year';
    yearEl.textContent = s.year;

    const emojiEl       = document.createElement('div');
    emojiEl.className   = 'story-slide__emoji';
    emojiEl.textContent = s.emoji;

    const titleEl       = document.createElement('h2');
    titleEl.className   = 'story-slide__title';
    titleEl.textContent = s.title;

    const tagEl       = document.createElement('span');
    tagEl.className   = 'story-slide__tag';
    tagEl.textContent = s.label;

    const bodyEl       = document.createElement('p');
    bodyEl.className   = 'story-slide__body';
    bodyEl.textContent = s.body;

    slide.append(yearEl, emojiEl, titleEl, tagEl, bodyEl);
    trackEl.appendChild(slide);
  });

  currentIdx = 0;
  updateUI();
}

// ── Modal init ────────────────────────────────────────────────

export function initStoryModal() {
  const modal    = document.getElementById('storyModal');
  const openBtn  = document.getElementById('openStory');
  const closeBtn = document.getElementById('storyClose');
  const prevBtn  = document.getElementById('storyPrev');
  const nextBtn  = document.getElementById('storyNext');
  const trackEl  = document.getElementById('storyTrack');
  if (!modal) return;

  storyGoToFn = function goTo(newIdx, dir) {
    const slides = trackEl.querySelectorAll('.story-slide');
    if (!slides.length || isAnimating) return;

    const total = storySlides.length;
    const next  = ((newIdx % total) + total) % total;
    if (next === currentIdx) return;

    const direction  = dir !== undefined ? dir : (next > currentIdx ? 'forward' : 'back');
    const enterClass = direction === 'forward' ? 'is-entering-right' : 'is-entering-left';
    const leaveClass = direction === 'forward' ? 'is-leaving-left'   : 'is-leaving-right';

    const incoming = slides[next];
    const outgoing = slides[currentIdx];

    isAnimating = true;

    // Position incoming off-screen instantly (suppress transition)
    incoming.style.transition = 'none';
    incoming.classList.remove('is-active', 'is-leaving-left', 'is-leaving-right', 'is-entering-left', 'is-entering-right');
    incoming.classList.add(enterClass);

    // Force reflow so the starting position is painted before we animate
    incoming.offsetHeight; // eslint-disable-line no-unused-expressions

    // Restore transition and animate incoming to active
    incoming.style.transition = '';
    incoming.classList.remove(enterClass);
    incoming.classList.add('is-active');

    // Animate outgoing away
    outgoing.classList.remove('is-active');
    outgoing.classList.add(leaveClass);

    currentIdx = next;
    updateUI();

    const onEnd = () => {
      outgoing.removeEventListener('transitionend', onEnd);
      outgoing.classList.remove(leaveClass);
      isAnimating = false;
    };
    outgoing.addEventListener('transitionend', onEnd);
  };

  prevBtn.addEventListener('click', () => { track('story-prev'); storyGoToFn(currentIdx - 1, 'back'); });
  nextBtn.addEventListener('click', () => { track('story-next'); storyGoToFn(currentIdx + 1, 'forward'); });

  initSwipe(trackEl, dir =>
    storyGoToFn(
      dir === 'left' ? currentIdx + 1 : currentIdx - 1,
      dir === 'left' ? 'forward' : 'back'
    )
  );

  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  storyGoToFn(currentIdx - 1, 'back');
    if (e.key === 'ArrowRight') storyGoToFn(currentIdx + 1, 'forward');
  });

  openBtn.addEventListener('click', () => {
    track('story-open');
    // Reset all slides to initial state
    const slides = trackEl.querySelectorAll('.story-slide');
    slides.forEach((s, i) => {
      s.classList.remove('is-active', 'is-leaving-left', 'is-leaving-right', 'is-entering-left', 'is-entering-right');
      if (i === 0) s.classList.add('is-active');
    });
    currentIdx  = 0;
    isAnimating = false;
    updateUI();
    modal.showModal();

    // Nudge nav buttons briefly after modal animation settles
    const storyNav = document.getElementById('storyNav');
    if (storyNav) {
      setTimeout(() => {
        storyNav.classList.add('is-nudging');
        storyNav.addEventListener('animationend', () => storyNav.classList.remove('is-nudging'), { once: true });
      }, 200);
    }
  });

  closeBtn.addEventListener('click', () => { track('story-close'); modal.close(); });
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}
