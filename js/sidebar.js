/* ─────────────────────────────────────────────────────────────
   js/sidebar.js — Sidebar navigation
   Handles:
     · Hamburger open / close + overlay dismiss
     · Ink-stamp animation on nav links
     · Section-label flash on smooth-scroll target
     · Escape key to close
───────────────────────────────────────────────────────────── */

export function initSidebar() {
  const hamburger    = document.getElementById('hamburger');
  const sidebar      = document.getElementById('sidebar');
  const overlay      = document.getElementById('overlay');
  const sidebarClose = document.getElementById('sidebarClose');

  // ── Open / close ─────────────────────────────────────────

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

  // Escape key closes the sidebar from anywhere on the page.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  // ── Nav-link animations ───────────────────────────────────

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      // Restart the CSS stamp animation.  Simply removing and re-adding the
      // class in the same tick is a no-op for CSS animations, so we force a
      // reflow with `void offsetWidth` to let the browser see the removal
      // before the class is added back.
      this.classList.remove('nav-stamp');
      void this.offsetWidth;
      this.classList.add('nav-stamp');
      this.addEventListener('animationend', () => this.classList.remove('nav-stamp'), { once: true });

      closeSidebar();

      // Flash the section label once the smooth-scroll settles (~520 ms).
      const targetId = this.getAttribute('href');
      if (!targetId?.startsWith('#')) return;

      setTimeout(() => {
        const section = document.querySelector(targetId);
        if (!section) return;
        const label = section.querySelector('.section-label');
        if (!label) return;

        label.classList.remove('flash');
        void label.offsetWidth; // same reflow trick as above
        label.classList.add('flash');
        label.addEventListener('animationend', () => label.classList.remove('flash'), { once: true });
      }, 520);
    });
  });
}
