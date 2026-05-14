/* ─────────────────────────────────────────────────────────────
   js/translations.js — EN / DE string catalogue
   Structure: one const per section, each with { en, de }.

   ► To add a PROJECT : edit  data/projects.csv  (one row = one card)
   ► To add an UPDATE : edit  data/updates.csv   (one row = one card)

   The CSVs are fetched at runtime by i18n.js and overwrite the
   fallback arrays below.  If the fetch fails (e.g. file:// origin)
   the hard-coded arrays here are used automatically.

   ► To add a language: add the key to every section + the merge.
───────────────────────────────────────────────────────────── */


/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
const S_NAV = {
  en: {
    'nav.home':     'Home',
    'nav.about':    'About',
    'nav.projects': 'Projects',
    'nav.updates':  'Updates',
    'nav.gallery':  'Photography',
    'nav.contact':  'Contact',
  },
  de: {
    'nav.home':     'Start',
    'nav.about':    'Über mich',
    'nav.projects': 'Projekte',
    'nav.updates':  'Updates',
    'nav.gallery':  'Fotografie',
    'nav.contact':  'Kontakt',
  },
};


/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
const S_HERO = {
  en: {
    'hero.greeting': "Hello, I'm",
    'hero.tagline':  'AI-Coding · Photography · Marketing',
    'hero.cta':      'Get to know me',
  },
  de: {
    'hero.greeting': 'Hey, ich bin',
    'hero.tagline':  'KI-Coding · Fotografie · Marketing',
    'hero.cta':      'Lern mich kennen',
  },
};


/* ══════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════ */
const S_ABOUT = {
  en: {
    'about.label':     'About Me',
    'about.heading':   'A little about myself',
    'about.teaser':    'Curious developer, photographer, and marketing explorer. I build things for the web, capture quiet moments through a lens, and share everything I learn along the way.',
    'about.story-btn': 'Read my story →',
    'about.tag.html':  'HTML & CSS',
    'about.tag.js':    'JavaScript',
    'about.tag.photo': 'Photography',
    'about.tag.ai':    'AI & Claude',
    'about.tag.git':   'Git',
  },
  de: {
    'about.label':     'Über mich',
    'about.heading':   'Ein bisschen über mich',
    'about.teaser':    'Neugieriger Entwickler, Fotograf und Marketing-Entdecker. Ich baue Dinge fürs Web, halte stille Momente mit der Kamera fest und teile alles, was ich dabei lerne.',
    'about.story-btn': 'Meine Geschichte →',
    'about.tag.html':  'HTML & CSS',
    'about.tag.js':    'JavaScript',
    'about.tag.photo': 'Fotografie',
    'about.tag.ai':    'KI & Claude',
    'about.tag.git':   'Git',
  },
};


/* ══════════════════════════════════════════════════════════
   PROJECTS
   FALLBACK data — normally overwritten by data/projects.csv at runtime.
   Fields: title · desc · tags (pipe-separated) · url · linkLabel
══════════════════════════════════════════════════════════ */
const S_PROJECTS = {
  en: {
    'projects.label':   'Current projects',
    'projects.heading': "Things I've built",
    projects: [
      {
        title:     'This Website',
        desc:      'A personal site built from scratch as a learning project — pure HTML, CSS & JavaScript. No frameworks, just fundamentals.',
        tags:      'HTML|CSS|JS',
        url:       '',
        linkLabel: '',
      },
      {
        title:     'Website Repository',
        desc:      'The source code for this very site — open for exploration, learning, and iteration as the project grows.',
        tags:      'HTML|CSS|JS|Git',
        url:       'https://github.com/isiemant/website',
        linkLabel: 'View on GitHub →',
      },
      {
        title:     'Photo Archive',
        desc:      'An ongoing personal archive of photography — landscapes, street scenes, and anything that catches my eye.',
        tags:      'Photography',
        url:       '',
        linkLabel: '',
      },
    ],
  },
  de: {
    'projects.label':   'Aktuelle Projekte',
    'projects.heading': 'Was ich gebaut habe',
    projects: [
      {
        title:     'Diese Website',
        desc:      'Eine persönliche Website von Grund auf als Lernprojekt — reines HTML, CSS & JavaScript. Keine Frameworks, nur Grundlagen.',
        tags:      'HTML|CSS|JS',
        url:       '',
        linkLabel: '',
      },
      {
        title:     'Website-Repository',
        desc:      'Der Quellcode dieser Website — offen zum Entdecken, Lernen und Weiterentwickeln.',
        tags:      'HTML|CSS|JS|Git',
        url:       'https://github.com/isiemant/website',
        linkLabel: 'Auf GitHub ansehen →',
      },
      {
        title:     'Fotoarchiv',
        desc:      'Ein fortlaufendes persönliches Fotoarchiv — Landschaften, Straßenszenen und alles, was mein Auge einfängt.',
        tags:      'Fotografie',
        url:       '',
        linkLabel: '',
      },
    ],
  },
};


/* ══════════════════════════════════════════════════════════
   UPDATES  (section headings only — card data lives in S_TIMELINE)
══════════════════════════════════════════════════════════ */
const S_UPDATES = {
  en: {
    'updates.label':   'Updates',
    'updates.heading': "What's been happening",
    'updates.sub':     'Notes, links & things worth sharing.',
  },
  de: {
    'updates.label':   'Updates',
    'updates.heading': 'Was so los war',
    'updates.sub':     'Notizen, Links & Dinge, die es wert sind.',
  },
};


/* ══════════════════════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════════════════ */
const S_GALLERY = {
  en: {
    'gallery.label':   'Photography',
    'gallery.heading': 'Through the lens',
    'gallery.sub':     'Placeholder colours — real photos coming soon.',
  },
  de: {
    'gallery.label':   'Fotografie',
    'gallery.heading': 'Durch die Linse',
    'gallery.sub':     'Platzhalterfarben — echte Fotos kommen bald.',
  },
};


/* ══════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════ */
const S_CONTACT = {
  en: {
    'contact.label':          'Contact',
    'contact.heading':        'Say hello',
    'form.name.label':        'Name',
    'form.name.placeholder':  'Your name',
    'form.email.label':       'Email',
    'form.email.placeholder': 'your@email.com',
    'form.msg.label':         'Message',
    'form.msg.placeholder':   "What's on your mind?",
    'form.submit':            'Send message',
    'form.note':              '✓ Thanks! (This is a mockup — no message was actually sent.)',
  },
  de: {
    'contact.label':          'Kontakt',
    'contact.heading':        'Sag hallo',
    'form.name.label':        'Name',
    'form.name.placeholder':  'Dein Name',
    'form.email.label':       'E-Mail',
    'form.email.placeholder': 'deine@email.com',
    'form.msg.label':         'Nachricht',
    'form.msg.placeholder':   'Was beschäftigt dich?',
    'form.submit':            'Nachricht senden',
    'form.note':              '✓ Danke! (Das ist ein Prototyp — keine Nachricht wurde gesendet.)',
  },
};


/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
const S_FOOTER = {
  en: {
    'footer.copy':   '© 2026 isiemant · Built with curiosity & soft pastels',
    'footer.source': 'Source at',
  },
  de: {
    'footer.copy':   '© 2026 isiemant · Gebaut mit Neugier & sanften Pastellfarben',
    'footer.source': 'Quellcode bei',
  },
};


/* ══════════════════════════════════════════════════════════
   ARIA LABELS
══════════════════════════════════════════════════════════ */
const S_ARIA = {
  en: {
    'aria.hamburger':     'Open navigation',
    'aria.sidebar-close': 'Close navigation',
    'aria.timeline-prev': 'Previous',
    'aria.timeline-next': 'Next',
    'aria.slide-prev':    'Previous',
    'aria.slide-next':    'Next',
    'aria.story-prev':    'Previous',
    'aria.story-next':    'Next',
    'aria.story-close':   'Close',
  },
  de: {
    'aria.hamburger':     'Navigation öffnen',
    'aria.sidebar-close': 'Navigation schließen',
    'aria.timeline-prev': 'Zurück',
    'aria.timeline-next': 'Weiter',
    'aria.slide-prev':    'Zurück',
    'aria.slide-next':    'Weiter',
    'aria.story-prev':    'Zurück',
    'aria.story-next':    'Weiter',
    'aria.story-close':   'Schließen',
  },
};


/* ══════════════════════════════════════════════════════════
   JS UI STRINGS
══════════════════════════════════════════════════════════ */
const S_UI = {
  en: {
    'ui.read-more': 'Read more →',
    'ui.sent':      'Sent ✓',
    'ui.slide':     'Slide',
  },
  de: {
    'ui.read-more': 'Mehr lesen →',
    'ui.sent':      'Gesendet ✓',
    'ui.slide':     'Folie',
  },
};


/* ══════════════════════════════════════════════════════════
   TIMELINE  (Updates section cards)
   FALLBACK data — normally overwritten by data/updates.csv at runtime.
   Fields: date · topic · title · description · url · thumbnail
══════════════════════════════════════════════════════════ */
const S_TIMELINE = {
  en: {
    timeline: [
      {
        date:        'May 2026',
        topic:       'AI Coding',
        title:       'Building this site with Claude',
        description: 'How I used Claude Code to go from zero to a full cartoon-themed personal site in one session.',
        url:         'https://github.com/isiemant/website',
        thumbnail:   'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
      },
      {
        date:        'Apr 2026',
        topic:       'Photography',
        title:       'Golden hour walk',
        description: 'A short series of shots taken during a late-afternoon walk. Shot on a mirrorless kit lens.',
        url:         '',
        thumbnail:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      },
      {
        date:        'Mar 2026',
        topic:       'Marketing',
        title:       'What I learned about landing pages',
        description: 'Reading through a dozen high-converting landing pages and noting the patterns that keep showing up.',
        url:         'https://github.com/isiemant/website',
        thumbnail:   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
      },
      {
        date:        'Feb 2026',
        topic:       'AI Coding',
        title:       'Trying out Cursor + Claude',
        description: 'First impressions after a week of pair-programming with AI editors on small web projects.',
        url:         '',
        thumbnail:   'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80',
      },
    ],
  },
  de: {
    timeline: [
      {
        date:        'Mai 2026',
        topic:       'KI-Coding',
        title:       'Diese Website mit Claude bauen',
        description: 'Wie ich Claude Code genutzt habe, um in einer einzigen Session eine komplette Cartoon-Website zu erstellen.',
        url:         'https://github.com/isiemant/website',
        thumbnail:   'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
      },
      {
        date:        'Apr. 2026',
        topic:       'Fotografie',
        title:       'Goldene-Stunde-Spaziergang',
        description: 'Eine kurze Fotoserie, aufgenommen bei einem Spaziergang am späten Nachmittag. Mit einem Einsteiger-Zoomobjektiv.',
        url:         '',
        thumbnail:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      },
      {
        date:        'März 2026',
        topic:       'Marketing',
        title:       'Was ich über Landing Pages gelernt habe',
        description: 'Ein Dutzend erfolgreiche Landing Pages analysiert und die wiederkehrenden Muster notiert.',
        url:         'https://github.com/isiemant/website',
        thumbnail:   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
      },
      {
        date:        'Feb. 2026',
        topic:       'KI-Coding',
        title:       'Cursor + Claude ausprobiert',
        description: 'Erste Eindrücke nach einer Woche Pair-Programming mit KI-Editoren bei kleinen Webprojekten.',
        url:         '',
        thumbnail:   'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80',
      },
    ],
  },
};


/* ══════════════════════════════════════════════════════════
   STORY SLIDES  (About modal)
   To add a slide: append an object to BOTH arrays below.
   Fields: color · emoji · label · title · body
══════════════════════════════════════════════════════════ */
const S_STORY = {
  en: {
    story: [
      {
        color: '#00a8ff',
        emoji: '👋',
        label: 'Who I Am',
        title: "Hi, I'm Isiemant",
        body:  "A curious developer and photographer based somewhere beautiful. I love building things for the web and capturing quiet moments through a lens. This site is my personal corner of the internet — and an ongoing learning project.",
      },
      {
        color: '#ff4757',
        emoji: '💻',
        label: 'What I Do',
        title: 'I build & shoot',
        body:  "By day I write HTML, CSS and JavaScript — no frameworks, just fundamentals. By weekend I'm outside with my camera looking for interesting light. Marketing and storytelling tie both worlds together for me.",
      },
      {
        color: '#a855f7',
        emoji: '🧠',
        label: "What I'm Learning",
        title: 'AI × Web × Design',
        body:  "Right now I'm deep in AI-assisted coding with Claude, exploring design systems, and pushing my JavaScript further. Every page of this site is a live experiment — expect it to keep changing.",
      },
      {
        color: '#2ed573',
        emoji: '🚀',
        label: "What's Next",
        title: 'Keep building',
        body:  "More projects, more photos, more experiments shared in the open. If something here resonates — say hello. I'm always happy to talk code, cameras, or anything in between.",
      },
    ],
  },
  de: {
    story: [
      {
        color: '#00a8ff',
        emoji: '👋',
        label: 'Wer ich bin',
        title: 'Hi, ich bin Isiemant',
        body:  'Ein neugieriger Entwickler und Fotograf irgendwo an einem schönen Ort. Ich liebe es, Dinge fürs Web zu bauen und stille Momente mit der Kamera einzufangen. Diese Seite ist meine persönliche Ecke im Internet — und ein ständiges Lernprojekt.',
      },
      {
        color: '#ff4757',
        emoji: '💻',
        label: 'Was ich mache',
        title: 'Ich baue & fotografiere',
        body:  'Tagsüber schreibe ich HTML, CSS und JavaScript — keine Frameworks, nur Grundlagen. Am Wochenende bin ich mit meiner Kamera draußen und suche nach interessantem Licht. Marketing und Storytelling verbinden beide Welten für mich.',
      },
      {
        color: '#a855f7',
        emoji: '🧠',
        label: 'Was ich lerne',
        title: 'KI × Web × Design',
        body:  'Gerade stecke ich tief in KI-assistiertem Coding mit Claude, erkunde Design-Systeme und treibe mein JavaScript weiter. Jede Seite dieser Website ist ein Live-Experiment — sie wird sich ständig verändern.',
      },
      {
        color: '#2ed573',
        emoji: '🚀',
        label: 'Was als Nächstes kommt',
        title: 'Weitermachen',
        body:  'Mehr Projekte, mehr Fotos, mehr Experimente — alles offen geteilt. Wenn dir hier etwas gefällt — sag hallo. Ich rede immer gerne über Code, Kameras oder irgendetwas dazwischen.',
      },
    ],
  },
};


/* ══════════════════════════════════════════════════════════
   MERGE — shape consumed by i18n.js stays identical.
   To add a language: add the key to every section above,
   then add a new entry here, e.g.:
     fr: { ...S_NAV.fr, ...S_HERO.fr, … }
══════════════════════════════════════════════════════════ */
export const TRANSLATIONS = {
  en: {
    ...S_NAV.en, ...S_HERO.en, ...S_ABOUT.en, ...S_PROJECTS.en,
    ...S_UPDATES.en, ...S_GALLERY.en, ...S_CONTACT.en, ...S_FOOTER.en,
    ...S_ARIA.en, ...S_UI.en, ...S_TIMELINE.en, ...S_STORY.en,
  },
  de: {
    ...S_NAV.de, ...S_HERO.de, ...S_ABOUT.de, ...S_PROJECTS.de,
    ...S_UPDATES.de, ...S_GALLERY.de, ...S_CONTACT.de, ...S_FOOTER.de,
    ...S_ARIA.de, ...S_UI.de, ...S_TIMELINE.de, ...S_STORY.de,
  },
};
