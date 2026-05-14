/* ─────────────────────────────────────────────────────────────
   js/main.js — Entry point
   Import order follows dependency graph:
     constants / utils have no imports from this project.
     Feature modules import constants + utils only.
     i18n imports carousel + story (for rebuild callbacks).
     main imports everything and wires it up.
───────────────────────────────────────────────────────────── */

import { revealObserver }                        from './utils.js';
import { initSidebar }                           from './sidebar.js';
import { initScroll }                            from './scroll.js';
import { initSlideshow }                         from './slideshow.js';
import { initCarousel }                          from './carousel.js';
import { initStoryModal }                        from './story.js';
import { initCyclops }                           from './cyclops.js';
import { loadContentCSVs, applyLang, initI18n }  from './i18n.js';
import { initConsent, loadFonts }                from './consent.js';

// ── Scroll-reveal — static elements ──────────────────────────
// Dynamic elements (project cards, etc.) are observed individually
// inside buildProjects() in i18n.js after they are added to the DOM.
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Feature modules ──────────────────────────────────────────
loadFonts();     // apply consent prefs before paint
initConsent();   // show banner if first visit
initSidebar();
initScroll();
initSlideshow();
initCarousel();
initStoryModal();
initCyclops();
initI18n();

// ── Initialisation ────────────────────────────────────────────
// Fetch CSV data first so the correct content is in place before
// the first applyLang() renders the UI.  Falls back to the built-in
// TRANSLATIONS data automatically if the fetch fails (e.g. offline).
(async () => {
  await loadContentCSVs();
  applyLang(localStorage.getItem('lang') || 'en');
})();
