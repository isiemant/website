/* ─────────────────────────────────────────────────────────────
   js/consent.js — Cookie / DSGVO consent for Google Fonts
   Storage key: 'consent'  →  JSON { fonts: true|false }
   Umami analytics loads unconditionally (no consent required).
───────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'consent';

// ── Read / write helpers ──────────────────────────────────────
function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    // Validate shape: must be an object with a boolean 'fonts' property
    if (parsed && typeof parsed === 'object' && typeof parsed.fonts === 'boolean') {
      return parsed;
    }
    // Malformed — treat as unset so banner shows again
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setConsent(prefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
  catch { /* storage unavailable (e.g. private browsing with storage blocked) */ }
}

// ── Load Google Fonts dynamically ─────────────────────────────
export function loadFonts() {
  const prefs = getConsent();
  if (!prefs || prefs.fonts === true) {
    // Remove fallback class first (defensive — ensures re-runs work correctly)
    document.body.classList.remove('no-custom-fonts');
    // Avoid injecting duplicate link elements on re-runs
    if (!document.querySelector('link[data-gfonts]')) {
      const pc1 = document.createElement('link');
      pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
      const pc2 = document.createElement('link');
      pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = '';
      const link = document.createElement('link');
      link.rel       = 'stylesheet';
      link.setAttribute('data-gfonts', '');
      link.href = 'https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka+One&family=Nunito:wght@400;500;600;700;800&display=swap';
      document.head.append(pc1, pc2, link);
    }
  } else {
    // Explicitly declined — remove any injected font link and apply fallback class
    const existing = document.querySelector('link[data-gfonts]');
    if (existing) existing.remove();
    document.body.classList.add('no-custom-fonts');
  }
}

// ── Save prefs from banner and hide it ────────────────────────
function saveConsent() {
  const toggle = document.getElementById('consentFontsToggle');
  const prefs  = { fonts: toggle ? toggle.checked : true };
  setConsent(prefs);
  loadFonts();
  hideBanner();
}

function hideBanner() {
  const banner = document.getElementById('consentBanner');
  if (banner) { banner.classList.add('consent-banner--hidden'); }
}

function showBanner() {
  const banner = document.getElementById('consentBanner');
  if (banner) { banner.classList.remove('consent-banner--hidden'); }
}

// ── Init — show banner only on first visit ────────────────────
export function initConsent() {
  const prefs = getConsent();
  if (prefs === null) {
    // First visit — show banner
    showBanner();
  } else {
    hideBanner();
  }

  // Save button
  const saveBtn = document.getElementById('consentSave');
  if (saveBtn) saveBtn.addEventListener('click', saveConsent);

  // Footer reset link
  const resetBtn = document.getElementById('consentReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEY);
      // Reset toggle to reflect current (now cleared) state
      const toggle = document.getElementById('consentFontsToggle');
      if (toggle) toggle.checked = true;
      showBanner();
    });
  }
}
