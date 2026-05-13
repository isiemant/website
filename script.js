/* ─────────────────────────────────────────────────────────────
   script.js — Personal Website
   Features:
     1. Hamburger / Sidebar toggle
     2. Photo lightbox
     3. Contact form mockup feedback
───────────────────────────────────────────────────────────── */

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

// Close sidebar when a nav link is clicked (smooth scroll takes over)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

// ── 2. Lightbox ──────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxTitle   = document.getElementById('lightboxTitle');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(photoEl) {
  // Clone the appearance of the placeholder block into the lightbox
  const bg     = photoEl.style.background;
  const title  = photoEl.dataset.title || '';

  lightboxContent.style.cssText = `
    background: ${bg};
    width: min(520px, 80vw);
    height: min(400px, 60vh);
    border-radius: 14px;
  `;
  lightboxTitle.textContent = title;

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.photo').forEach(photo => {
  photo.addEventListener('click', () => openLightbox(photo));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Close lightbox with Escape key, sidebar too
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeSidebar();
  }
});

// ── 3. Contact form mockup ───────────────────────────────────
const form      = document.querySelector('.contact-form');
const formNote  = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Sent ✓';
  submitBtn.disabled = true;
  submitBtn.style.background = '#7a9e80';
  formNote.hidden = false;
});
