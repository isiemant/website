/* ─────────────────────────────────────────────────────────────
   js/i18n.js — Internationalisation & dynamic content
   Handles:
     · Language toggle (EN ↔ DE) persisted in localStorage
     · DOM text / placeholder / aria-label swaps via data-i18n-*
     · Contact-form mock submission feedback
     · Project cards (buildProjects)
     · Timeline cards (buildTimeline) + carousel reset
     · Story slides rebuild delegated to story.js (buildStorySlides)
     · CSV loading — overwrites fallback data in TRANSLATIONS;
       silently falls back to the built-in arrays on any error
───────────────────────────────────────────────────────────── */

import { TRANSLATIONS }                        from './translations.js';
import { parseCSV }                            from './utils.js';
import { revealObserver }                      from './utils.js';
import { carouselGoTo, setTimelineItems }      from './carousel.js';
import { buildStorySlides }                    from './story.js';

// ── Module-level state ────────────────────────────────────────

let currentLang   = 'en';
let formSubmitted = false;

// ── CSV loading ───────────────────────────────────────────────

/**
 * Fetch data/projects.csv and data/updates.csv, then overwrite the
 * fallback arrays in TRANSLATIONS for both languages.
 * On any error (network, parse, HTTP) the built-in fallback data
 * stays in place and a warning is logged — no UI disruption.
 */
export async function loadContentCSVs() {
  try {
    const [projRes, updRes] = await Promise.all([
      fetch('data/projects.csv?v=' + (document.querySelector('meta[name="cache-bust"]')?.content || Date.now())),
      fetch('data/updates.csv?v='   + (document.querySelector('meta[name="cache-bust"]')?.content || Date.now())),
    ]);
    if (!projRes.ok || !updRes.ok) throw new Error('HTTP error');

    const [projText, updText] = await Promise.all([projRes.text(), updRes.text()]);
    const projRows = parseCSV(projText);
    const updRows  = parseCSV(updText);

    ['en', 'de'].forEach(lang => {
      TRANSLATIONS[lang].projects = projRows.map(r => ({
        title:     r['title_'     + lang] || '',
        desc:      r['desc_'      + lang] || '',
        tags:      r['tags']              || '',
        url:       r['url']               || '',
        linkLabel: r['link_'      + lang] || '',
      }));
      TRANSLATIONS[lang].timeline = updRows.map(r => ({
        date:        r['date_'        + lang] || '',
        topic:       r['topic_'       + lang] || '',
        title:       r['title_'       + lang] || '',
        description: r['description_' + lang] || '',
        url:         r['url']                 || '',
        thumbnail:   r['thumbnail']           || '',
      }));
    });

    console.log('[content] CSV data loaded ✓');
  } catch (err) {
    console.warn('[content] CSV load failed — using built-in fallback. (' + err.message + ')');
  }
}

// ── Content builders ─────────────────────────────────────────

function buildProjects(lang) {
  const t    = TRANSLATIONS[lang];
  const grid = document.querySelector('.projects__grid');
  if (!grid || !Array.isArray(t.projects)) return;
  grid.innerHTML = '';

  t.projects.forEach((item, i) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.setAttribute('data-reveal', '');
    article.setAttribute('data-delay', String((i + 1) * 100));

    const h3 = document.createElement('h3');
    h3.textContent = item.title;

    const p = document.createElement('p');
    p.textContent = item.desc;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'card__tags';
    item.tags.split('|').forEach(tag => {
      if (!tag.trim()) return;
      const span       = document.createElement('span');
      span.textContent = tag.trim();
      tagsDiv.appendChild(span);
    });

    article.append(h3, p, tagsDiv);

    if (item.url && item.linkLabel) {
      const a       = document.createElement('a');
      a.className   = 'card__link';
      a.href        = item.url;
      a.target      = '_blank';
      a.rel         = 'noopener';
      a.textContent = item.linkLabel;
      article.appendChild(a);
    }

    grid.appendChild(article);
    revealObserver.observe(article);
  });
}

function buildTimeline(lang) {
  const t         = TRANSLATIONS[lang];
  const container = document.getElementById('timeline');
  if (!container) return;
  container.innerHTML = '';

  t.timeline.forEach(item => {
    const article     = document.createElement('article');
    article.className = 'timeline-item';

    const thumb     = document.createElement('div');
    thumb.className = 'timeline-item__thumb';
    if (item.thumbnail) {
      const img   = document.createElement('img');
      img.src     = item.thumbnail;
      img.alt     = item.title;
      img.loading = 'lazy';
      thumb.appendChild(img);
    }

    const body     = document.createElement('div');
    body.className = 'timeline-item__body';

    // Build meta row with createElement (not innerHTML) to eliminate any
    // XSS risk should the data source ever change to user-supplied content.
    const meta     = document.createElement('div');
    meta.className = 'timeline-item__meta';

    const topicSpan       = document.createElement('span');
    topicSpan.className   = 'timeline-item__topic';
    topicSpan.textContent = item.topic;

    const dateSpan       = document.createElement('span');
    dateSpan.className   = 'timeline-item__date';
    dateSpan.textContent = item.date;

    meta.append(topicSpan, dateSpan);

    const titleEl       = document.createElement('h3');
    titleEl.textContent = item.title;

    const descEl       = document.createElement('p');
    descEl.textContent = item.description;

    body.append(meta, titleEl, descEl);

    if (item.url) {
      const link       = document.createElement('a');
      link.className   = 'card__link';
      link.href        = item.url;
      link.target      = '_blank';
      link.rel         = 'noopener';
      link.textContent = t['ui.read-more'];
      body.appendChild(link);
    }

    article.append(thumb, body);
    container.appendChild(article);
  });

  // Sync the carousel with the new item count, then reset to first page.
  setTimelineItems(t.timeline);
  carouselGoTo(0, false);
}

// ── Language application ──────────────────────────────────────

/**
 * Apply a language to the entire UI:
 *   1. Swap all data-i18n-* text, placeholders, aria-labels.
 *   2. Rebuild project cards, timeline cards, story slides.
 *   3. Persist the choice in localStorage.
 *
 * @param {'en'|'de'} lang
 */
export function applyLang(lang) {
  currentLang = lang;
  const t     = TRANSLATIONS[lang];

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // Keep the submit button in "sent" state if the form was already submitted.
  const submitBtn = document.getElementById('submitBtn');
  if (formSubmitted && submitBtn) submitBtn.textContent = t['ui.sent'];

  buildProjects(lang);
  buildTimeline(lang);
  buildStorySlides(lang);

  // Toggle button always shows the language you'll switch TO.
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = lang === 'en' ? 'DE' : 'EN';

  localStorage.setItem('lang', lang);
}

// ── Contact form + language toggle wiring ─────────────────────

export function initI18n() {
  // Mock submission feedback — the form is a UI prototype only.
  const form      = document.querySelector('.contact-form');
  const formNote  = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    formSubmitted            = true;
    submitBtn.textContent    = TRANSLATIONS[currentLang]['ui.sent'];
    submitBtn.disabled       = true;
    submitBtn.style.background = '#15803d';
    formNote.hidden          = false;
  });

  // Language toggle button.
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'de' : 'en');
    });
  }
}
