/* ─────────────────────────────────────────────────────────────
   script.js — Personal Website
   Features:
     1. Hamburger / Sidebar toggle
     2. Photo slideshow (carousel)
     3. Contact form mockup feedback
     4. Updates timeline rendering
     5. Story modal with slides
     6. Scroll reveal animations (Intersection Observer)
     7. Cyclops eye with cursor tracking and blinking
     8. i18n language toggle (English / German)
     9. CSV content loading for projects and updates (with fallback)
     10. Accessibility features: ARIA roles, keyboard navigation, reduced motion respect
     11. Responsive design with mobile-first approach and touch support
     12. Performance optimizations: debounced resize, requestAnimationFrame for cursor tracking, minimal DOM updates
───────────────────────────────────────────────────────────── */

// ── i18n state ───────────────────────────────────────────────
let currentLang   = 'en';
let formSubmitted = false;
let carouselGoTo  = () => {};
let storyCur      = 0;
let storyGoTo     = () => {};

// ── 1. Sidebar ───────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const sidebar     = document.getElementById('sidebar');
const overlay     = document.getElementById('overlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ── Nav link: ink-stamp animation + section label flash ──────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    this.classList.remove('nav-stamp');
    void this.offsetWidth;
    this.classList.add('nav-stamp');
    this.addEventListener('animationend', () => this.classList.remove('nav-stamp'), { once: true });

    closeSidebar();

    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      setTimeout(() => {
        const section = document.querySelector(targetId);
        if (!section) return;
        const label = section.querySelector('.section-label');
        if (!label) return;
        label.classList.remove('flash');
        void label.offsetWidth;
        label.classList.add('flash');
        label.addEventListener('animationend', () => label.classList.remove('flash'), { once: true });
      }, 520);
    }
  });
});

// ── Scroll Progress Bar + Subtle Hero Parallax ───────────────
(function initScrollEffects() {
  const bar      = document.getElementById('scrollProgress');
  const heroName = document.querySelector('.hero__name');
  const heroInner = document.querySelector('.hero__inner');

  function onScroll() {
    const scrolled = window.scrollY;
    const max      = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = max > 0 ? (scrolled / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';

    // Subtle parallax on hero text only (won't affect layout)
    if (heroInner) {
      const shift = Math.min(scrolled * 0.12, 60);
      heroInner.style.transform = `translateY(${shift}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── 2. Slideshow ─────────────────────────────────────────────
const track   = document.getElementById('slideshowTrack');
const dotsEl  = document.getElementById('slideDots');
const slides  = Array.from(track.querySelectorAll('.slide'));
const total   = slides.length;
let current   = 0;
let autoTimer = null;
const INTERVAL = 4000;

// Build dot buttons
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsEl.appendChild(dot);
});

function goTo(idx) {
  current = (idx + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsEl.querySelectorAll('.slideshow__dot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
}

function startAuto() {
  stopAuto();
  autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
}

function stopAuto() {
  clearInterval(autoTimer);
}

document.getElementById('slidePrev').addEventListener('click', () => { goTo(current - 1); startAuto(); });
document.getElementById('slideNext').addEventListener('click', () => { goTo(current + 1); startAuto(); });

// Pause on hover
const slideshowEl = document.getElementById('slideshow');
slideshowEl.addEventListener('mouseenter', stopAuto);
slideshowEl.addEventListener('mouseleave', startAuto);

// Touch / swipe support
let touchStartX = 0;
slideshowEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
slideshowEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
});

startAuto();

// Arrow keys for slideshow; Escape closes sidebar
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
  if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  if (e.key === 'Escape') {
    closeSidebar();
  }
});

// ── 3. Contact form mockup ───────────────────────────────────
const form      = document.querySelector('.contact-form');
const formNote  = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSubmitted = true;
  submitBtn.textContent = TRANSLATIONS[currentLang]['ui.sent'];
  submitBtn.disabled = true;
  submitBtn.style.background = '#15803d';
  formNote.hidden = false;
});

// ── CSV utilities ────────────────────────────────────────────

// Split one CSV row, respecting double-quoted fields (handles commas + escaped "")
function splitCSVRow(row) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuote && row[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

// Parse a full CSV text → array of objects keyed by header row.
// Lines starting with # are treated as comments and skipped.
function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .split('\n')
    // strip any leading " that Excel adds before checking for comment marker
    .filter(l => { const s = l.trim().replace(/^"+/, ''); return s && !s.startsWith('#'); });
  if (lines.length < 2) return [];
  const headers = splitCSVRow(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = splitCSVRow(line);
    const obj  = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  });
}

// Fetch both CSVs and overwrite the fallback data in TRANSLATIONS.
// On any error (network, file://, parse) keeps the built-in fallback silently.
async function loadContentCSVs() {
  try {
    const [projRes, updRes] = await Promise.all([
      fetch('data/projects.csv'),
      fetch('data/updates.csv'),
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

// ── 3b. Projects Grid ────────────────────────────────────────

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
      const span = document.createElement('span');
      span.textContent = tag.trim();
      tagsDiv.appendChild(span);
    });

    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(tagsDiv);

    if (item.url && item.linkLabel) {
      const a = document.createElement('a');
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

// ── 4. Updates Timeline ─────────────────────────────────────
let updates = []; // populated per language by applyLang()

function buildTimeline(lang) {
  const t = TRANSLATIONS[lang];
  updates = t.timeline;
  const container = document.getElementById('timeline');
  if (!container) return;
  container.innerHTML = '';
  updates.forEach(item => {
    const article = document.createElement('article');
    article.className = 'timeline-item';

    const thumb = document.createElement('div');
    thumb.className = 'timeline-item__thumb';
    if (item.thumbnail) {
      const img = document.createElement('img');
      img.src = item.thumbnail;
      img.alt = item.title;
      img.loading = 'lazy';
      thumb.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'timeline-item__body';

    const meta = document.createElement('div');
    meta.className = 'timeline-item__meta';
    meta.innerHTML = `<span class="timeline-item__topic">${item.topic}</span><span class="timeline-item__date">${item.date}</span>`;

    const title = document.createElement('h3');
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(desc);

    if (item.url) {
      const link = document.createElement('a');
      link.className = 'card__link';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = t['ui.read-more'];
      body.appendChild(link);
    }

    article.appendChild(thumb);
    article.appendChild(body);
    container.appendChild(article);
  });
  carouselGoTo(0, false);
}

// ── 4b. Updates Carousel Controller ──────────────────────────
(function initCarousel() {
  const track   = document.getElementById('timeline');
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');
  if (!track || !prevBtn || !nextBtn) return;

  const GAP = 20;
  let page = 0;
  let busy = false;

  function perPage() {
    const w = window.innerWidth;
    if (w >= 960) return 3;
    if (w >= 600) return 2;
    return 1;
  }

  function totalPages() {
    return Math.ceil(updates.length / perPage());
  }

  // Width of each card = (window width − gaps) / cards visible
  function cardW() {
    const win = track.closest('.timeline-window') || track;
    return (win.clientWidth - GAP * (perPage() - 1)) / perPage();
  }

  function sizeCards() {
    const w = cardW();
    track.querySelectorAll('.timeline-item').forEach(c => {
      c.style.flex = `0 0 ${w}px`;
    });
  }

  function goTo(p, animate) {
    if (busy && animate) return;
    page = Math.max(0, Math.min(p, totalPages() - 1));
    const offset = page * perPage() * (cardW() + GAP);
    track.style.transition = animate
      ? 'transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    if (animate) { busy = true; setTimeout(() => { busy = false; }, 530); }
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page >= totalPages() - 1;
  }

  prevBtn.addEventListener('click', () => goTo(page - 1, true));
  nextBtn.addEventListener('click', () => goTo(page + 1, true));

  // Keyboard — only when updates section is in view
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rect = document.getElementById('updates').getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      e.preventDefault();
      e.key === 'ArrowRight' ? goTo(page + 1, true) : goTo(page - 1, true);
    }
  });

  // Touch swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) dx > 0 ? goTo(page + 1, true) : goTo(page - 1, true);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCards();
      goTo(Math.min(page, totalPages() - 1), false);
    }, 100);
  });

  sizeCards();
  carouselGoTo = goTo;
  goTo(0, false);
})();

// ── 5. Story Modal ─────────────────────────────────────
let storySlides = []; // populated per language by applyLang()

function buildStorySlides(lang) {
  const t = TRANSLATIONS[lang];
  storySlides = t.story;
  const track  = document.getElementById('storyTrack');
  const dotsEl = document.getElementById('storyDots');
  if (!track || !dotsEl) return;
  track.innerHTML  = '';
  dotsEl.innerHTML = '';

  storySlides.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'story-slide';
    slide.style.background = s.color;
    slide.innerHTML = `
      <span class="story-slide__label">${s.label}</span>
      <div class="story-slide__emoji">${s.emoji}</div>
      <h2 class="story-slide__title">${s.title}</h2>
      <p class="story-slide__body">${s.body}</p>
    `;
    track.appendChild(slide);
  });

  storySlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `${t['ui.slide']} ${i + 1}`);
    dot.addEventListener('click', () => storyGoTo(i));
    dotsEl.appendChild(dot);
  });

  storyGoTo(0);
}

(function initStoryModal() {
  const modal    = document.getElementById('storyModal');
  const openBtn  = document.getElementById('openStory');
  const closeBtn = document.getElementById('storyClose');
  const prevBtn  = document.getElementById('storyPrev');
  const nextBtn  = document.getElementById('storyNext');
  if (!modal) return;

  storyGoTo = function(idx) {
    const tr = document.getElementById('storyTrack');
    const de = document.getElementById('storyDots');
    storyCur = (idx + storySlides.length) % storySlides.length;
    if (tr) tr.style.transform = `translateX(-${storyCur * 100}%)`;
    if (de) de.querySelectorAll('.slideshow__dot').forEach((d, i) =>
      d.classList.toggle('active', i === storyCur)
    );
  };

  prevBtn.addEventListener('click', () => storyGoTo(storyCur - 1));
  nextBtn.addEventListener('click', () => storyGoTo(storyCur + 1));

  // Touch swipe
  const track = document.getElementById('storyTrack');
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) storyGoTo(dx < 0 ? storyCur + 1 : storyCur - 1);
  });

  openBtn.addEventListener('click', () => { storyGoTo(0); modal.showModal(); });
  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  storyGoTo(storyCur - 1);
    if (e.key === 'ArrowRight') storyGoTo(storyCur + 1);
  });
})();

// ── 6. Scroll Reveal (Intersection Observer) ─────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  revealObserver.observe(el);
});

// ── 7. Cyclops Eye ───────────────────────────────────────────
(function () {
  const cyclops = document.getElementById('cyclops');
  const lid     = document.getElementById('cyclopsLid');
  const lashes  = document.getElementById('cyclopsLashes');
  const gaze    = document.getElementById('cyclopsGaze');
  if (!cyclops || !lid || !gaze) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Entrance observer ────────────────────────────────────
  const entranceObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cyclops.classList.add('is-visible');
      entranceObs.disconnect();
      if (!reducedMotion) scheduleBlink();
    }
  }, { threshold: 0.5 });
  entranceObs.observe(cyclops);

  // ── Cursor tracking ──────────────────────────────────────
  if (!reducedMotion) {
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
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
      const rect = eyeball.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.hypot(dx, dy);
      const max  = 16;
      const s    = dist > max ? max / dist : 1;
      const x    = (dx * s).toFixed(1);
      const y    = (dy * s).toFixed(1);
      gaze.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  }

  // ── Eyelid blink loop ────────────────────────────────────
  function doBlink(cb) {
    lid.classList.add('is-closed');
    if (lashes) lashes.classList.add('is-closed');
    setTimeout(() => {
      lid.classList.remove('is-closed');
      if (lashes) lashes.classList.remove('is-closed');
      if (cb) setTimeout(cb, 260);
    }, 230);
  }

  function scheduleBlink() {
    const delay = 2000 + Math.random() * 3200;
    setTimeout(() => {
      const doDouble = Math.random() < 0.3;
      doBlink(doDouble ? () => doBlink(scheduleBlink) : scheduleBlink);
    }, delay);
  }
})();

// ── 8. i18n — Language Toggle ────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  // Update <html lang="">
  document.documentElement.lang = lang;

  // Swap text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Swap placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Swap aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // Override submit button if form was already sent
  if (formSubmitted) {
    submitBtn.textContent = t['ui.sent'];
  }

  // Rebuild dynamic content
  buildProjects(lang);
  buildTimeline(lang);
  buildStorySlides(lang);

  // Toggle button shows the language you will switch TO
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = lang === 'en' ? 'DE' : 'EN';

  // Persist choice
  localStorage.setItem('lang', lang);
}

// Wire toggle button
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'de' : 'en');
  });
}

// Initialise on load — fetch CSVs first, then apply language
// (falls back to built-in data if fetch fails, e.g. on file://)
// Tip for local dev: run  npx serve .  so fetch() works.
(async () => {
  await loadContentCSVs();
  applyLang(localStorage.getItem('lang') || 'en');
})();

