/* render.js — builds every page from data/profile.js and data/projects.js.
   No build step, no dependencies. Plain script, works over http and file://. */
(function () {
  'use strict';

  // ---------- tiny helpers ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v === true ? '' : v);
    });
    (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // [[ fill-in ]] → highlighted marker, **bold** → <strong>
  function rich(s) {
    return esc(s || '')
      .replace(/\[\[\s*([\s\S]*?)\s*\]\]/g, '<span class="fill">$1</span>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  function isFill(s) { return /\[\[/.test(s || ''); }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>'; }
  function icon(kind) {
    if (kind === 'pdf') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    if (kind === 'video') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    return arrow();
  }
  function sorted() { return PROJECTS.slice().sort(function (a, b) { return (a.order || 99) - (b.order || 99); }); }
  function page() { return (location.pathname.split('/').pop() || 'index.html'); }

  // body text: paragraphs split by blank line; a block of "- " lines becomes a list
  function body(text) {
    if (!text) return [];
    return text.split(/\n\s*\n/).map(function (block) {
      var lines = block.trim().split('\n');
      if (lines.length && lines.every(function (l) { return /^\s*-\s/.test(l); })) {
        return el('ul', {}, lines.map(function (l) { return el('li', { html: rich(l.replace(/^\s*-\s/, '')) }); }));
      }
      return el('p', { html: rich(block.trim()) });
    });
  }

  // ---------- shared chrome ----------
  function renderNav() {
    var root = document.getElementById('nav'); if (!root) return;
    var here = page();
    var links = [
      { href: 'work.html', label: 'Projects' },
      { href: 'about.html', label: 'About' },
      { href: 'resume.html', label: 'Resume' },
      { href: 'contact.html', label: 'Contact' }
    ];
    root.appendChild(el('div', { class: 'container nav__inner' }, [
      el('a', { href: 'index.html', class: 'nav__logo', 'aria-label': PROFILE.name + ' home' }, [
        el('img', { class: 'nav__logo-mark', src: 'assets/favicon.svg', alt: '', width: 30, height: 30 }), el('span', { text: PROFILE.name })
      ]),
      el('nav', { 'aria-label': 'Primary' }, el('ul', { class: 'nav__links' }, links.map(function (l) {
        var active = here === l.href || (l.href === 'work.html' && here === 'project.html');
        return el('li', {}, el('a', { href: l.href, class: 'nav__link' + (active ? ' nav__link--active' : ''), 'aria-current': active ? 'page' : null, text: l.label }));
      }))),
      el('a', { href: 'mailto:' + PROFILE.contact.email, class: 'nav__cta', text: 'Get in touch' })
    ]));
  }
  function renderFooter() {
    var root = document.getElementById('footer'); if (!root) return;
    root.appendChild(el('div', { class: 'container footer' }, [
      el('span', { text: '© ' + new Date().getFullYear() + ' ' + PROFILE.name }),
      el('span', { text: PROFILE.location })
    ]));
  }

  // ---------- chips ----------
  function chipRows(p, limit, only) {
    var rows = [['skills', 'Skills', p.skills], ['software', 'Software', p.software], ['hardware', 'Hardware', p.hardware]];
    if (only) rows = rows.filter(function (r) { return only.indexOf(r[0]) !== -1; });
    return el('div', { class: 'chiprows' }, rows.map(function (r) {
      var items = (r[2] || []); if (!items.length) return null;
      var shown = limit ? items.slice(0, limit) : items;
      var chips = shown.map(function (t) { return el('span', { class: 'chip', html: rich(t) }); });
      if (limit && items.length > limit) chips.push(el('span', { class: 'chip chip--more', text: '+' + (items.length - limit) }));
      return el('div', { class: 'chiprow chiprow--' + r[0] }, [el('span', { class: 'chiprow__label', text: r[1] }), el('div', { class: 'chips' }, chips)]);
    }));
  }

  // ---------- index ----------
  function tile(p) {
    return el('a', { class: 'tile reveal', href: 'project.html?id=' + encodeURIComponent(p.id), 'aria-label': p.title }, [
      el('div', { class: 'tile__media' }, [
        el('img', { src: p.cover, alt: p.title, loading: 'lazy', style: p.coverPosition ? 'object-position:' + p.coverPosition : null }),
        p.draft ? el('span', { class: 'tile__badge', text: 'In progress' }) : null,
        el('span', { class: 'tile__arrow', html: arrow() }),
        el('div', { class: 'tile__overlay' }, [
          el('h3', { class: 'tile__title', text: p.title })
        ])
      ]),
      el('div', { class: 'tile__body' }, [
        el('p', { class: 'tile__summary', html: rich(p.subtitle) }),
        el('div', { class: 'tile__meta' }, [
          el('span', { class: 'mono', html: rich(p.timeline) }),
          el('span', { class: 'tile__cta', html: 'View case study ' + arrow() })
        ])
      ])
    ]);
  }

  function renderHero() {
    var root = document.getElementById('hero'); if (!root) return;
    root.appendChild(el('div', { class: 'container hero__inner' }, [
      el('div', { class: 'hero__text' }, [
        el('span', { class: 'eyebrow reveal', text: PROFILE.eyebrow }),
        el('h1', { class: 'hero__name reveal', text: PROFILE.name }),
        el('p', { class: 'hero__tagline reveal', html: rich(PROFILE.tagline) }),
        el('div', { class: 'hero__actions reveal' }, [
          el('a', { href: 'work.html', class: 'btn btn--primary', html: 'View projects ' + arrow() }),
          el('a', { href: 'resume.html', class: 'btn', html: icon('pdf') + ' Resume' })
        ])
      ]),
      el('div', { class: 'hero__photo reveal' }, el('img', { src: PROFILE.photo, alt: PROFILE.name, width: 480, height: 600 })),
      el('div', { class: 'facts reveal' }, PROFILE.facts.map(function (f) {
        return el('div', { class: 'fact' }, [el('span', { class: 'fact__value', text: f.value }), el('span', { class: 'fact__label', text: f.label })]);
      }))
    ]));
  }

  function renderWork() {
    var root = document.getElementById('work-grid'); if (!root) return;
    var list = sorted();
    var max = parseInt(root.getAttribute('data-max') || '0', 10);
    var count = document.getElementById('work-count'); if (count) count.textContent = String(list.length).padStart(2, '0') + ' projects';
    (max ? list.slice(0, max) : list).forEach(function (p) { root.appendChild(tile(p)); });
  }

  function renderCta() {
    var root = document.getElementById('cta'); if (!root) return;
    root.appendChild(el('div', { class: 'container cta reveal' }, [
      el('div', {}, [
        el('h2', { text: 'Open to internships and engineering roles.' }),
        el('p', { class: 'muted', text: 'Mechanical design, mechatronics and hardware. ' + PROFILE.location + ' and the New York area.' })
      ]),
      el('div', { class: 'links' }, [
        el('a', { href: 'contact.html', class: 'btn btn--primary', html: 'Contact ' + arrow() }),
        el('a', { href: 'about.html', class: 'btn', text: 'About me' })
      ])
    ]));
  }

  function renderAbout() {
    var root = document.getElementById('about-root'); if (!root) return;
    root.appendChild(el('div', { class: 'about' }, [
      el('div', { class: 'reveal' }, [
        el('div', { class: 'about__photo' }, el('img', { src: PROFILE.photo, alt: PROFILE.name, width: 480, height: 600 })),
        el('div', { class: 'about__bio' }, PROFILE.bio.map(function (para) { return el('p', { html: rich(para) }); }))
      ]),
      el('div', { class: 'card reveal' }, [
        el('h3', { text: 'Education' }),
        el('div', {}, PROFILE.education.map(function (e) {
          return el('div', { class: 'edu' }, [
            el('span', { class: 'edu__school', text: e.school }),
            el('span', { class: 'edu__meta', text: e.degree + ' · ' + e.timeline }),
            e.notes ? el('span', { class: 'edu__notes', text: e.notes }) : null
          ]);
        })),
        el('h3', { text: 'Languages' }),
        el('div', { class: 'chips' }, PROFILE.languages.map(function (l) { return el('span', { class: 'chip', text: l }); })),
        el('h3', { text: 'Beyond engineering' }),
        el('div', { class: 'chips' }, PROFILE.hobbies.map(function (h) { return el('span', { class: 'chip', html: rich(h) }); })),
        el('h3', { text: 'Find me' }),
        el('div', { class: 'links links--compact' }, [
          PROFILE.contact.linkedin ? el('a', { href: PROFILE.contact.linkedin, class: 'btn', target: '_blank', rel: 'noopener', html: 'LinkedIn ' + arrow() }) : null,
          el('a', { href: PROFILE.contact.github, class: 'btn', target: '_blank', rel: 'noopener', html: 'GitHub ' + arrow() }),
          el('a', { href: 'mailto:' + PROFILE.contact.email, class: 'btn', text: 'Email' }),
          el('a', { href: PROFILE.contact.resume, class: 'btn', target: '_blank', rel: 'noopener', html: icon('pdf') + ' Resume' })
        ])
      ])
    ]));
    root.appendChild(el('div', { class: 'skillgroups reveal' }, PROFILE.skills.map(function (g) {
      return el('div', { class: 'skillgroup' }, [
        el('span', { class: 'skillgroup__name', text: g.group }),
        el('div', { class: 'chips' }, g.items.map(function (i) { return el('span', { class: 'chip', text: i }); }))
      ]);
    })));
    root.appendChild(el('div', { class: 'xp reveal' }, [el('h3', { class: 'eyebrow', text: 'Experience' })].concat(PROFILE.experience.map(function (x) {
      return el('div', { class: 'xp__item' }, [
        el('span', { class: 'xp__when', text: x.timeline }),
        el('div', {}, [
          el('div', { class: 'xp__role', text: x.role }),
          el('div', { class: 'xp__org', text: x.org + (x.location ? ' · ' + x.location : '') }),
          el('ul', {}, x.bullets.map(function (b) { return el('li', { text: b }); }))
        ])
      ]);
    }))));
  }

  function renderContact() {
    var root = document.getElementById('contact-root'); if (!root) return;
    var c = PROFILE.contact;
    var rows = [
      ['Email', el('a', { href: 'mailto:' + c.email, text: c.email })],
      ['Phone', el('a', { href: c.phoneHref, text: c.phone })],
      ['GitHub', el('a', { href: c.github, target: '_blank', rel: 'noopener', text: c.github.replace(/^https?:\/\//, '') })],
      ['LinkedIn', c.linkedin ? el('a', { href: c.linkedin, target: '_blank', rel: 'noopener', text: c.linkedin.replace(/^https?:\/\/(www\.)?/, '') }) : el('span', { class: 'fill', text: 'add LinkedIn URL in data/profile.js' })],
      ['Resume', el('a', { href: c.resume, target: '_blank', rel: 'noopener', text: 'Download PDF' })]
    ];
    root.appendChild(el('div', { class: 'contact' }, [
      el('div', { class: 'reveal' }, [
        el('h2', { text: 'Let’s build something.' }),
        el('p', { class: 'muted', style: 'margin-top:16px;max-width:44ch', text: 'Open to internships and engineering roles in mechanical design, mechatronics and hardware. The fastest way to reach me is email.' })
      ]),
      el('div', { class: 'contact__list reveal' }, rows.map(function (r) {
        return el('div', { class: 'contact__row' }, [el('span', { class: 'contact__k', text: r[0] }), el('span', { class: 'contact__v' }, r[1])]);
      }))
    ]));
  }

  // ---------- project detail ----------
  function figure(img) {
    var item = typeof img === 'string' ? { src: img, caption: '' } : img;
    return el('figure', { class: 'fig' }, [
      el('div', { class: 'fig__frame' }, el('img', { src: item.src, alt: item.caption || '', loading: 'lazy' })),
      item.caption ? el('figcaption', { html: rich(item.caption) }) : null
    ]);
  }
  function figs(images) {
    if (!images || !images.length) return null;
    var n = Math.min(images.length, 3);
    return el('div', { class: 'figs' + (n > 1 ? ' figs--' + n : '') }, images.map(figure));
  }
  function videoFig(v) {
    return el('figure', { class: 'fig fig--video' }, [
      el('div', { class: 'fig__frame' }, el('video', { src: v.src, poster: v.poster || null, controls: true, playsinline: true, preload: 'none' })),
      v.caption ? el('figcaption', { html: rich(v.caption) }) : null
    ]);
  }

  function renderProject() {
    var root = document.getElementById('project-root'); if (!root) return;
    var id = new URLSearchParams(location.search).get('id');
    var list = sorted();
    var idx = list.findIndex(function (x) { return x.id === id; });
    var p = list[idx];

    if (!p) {
      document.title = 'Project not found · ' + PROFILE.name;
      root.appendChild(el('div', { class: 'container section' }, [
        el('h1', { text: 'Project not found' }),
        el('p', { class: 'muted', style: 'margin:12px 0 24px', text: 'No project with id "' + (id || '') + '".' }),
        el('a', { href: "work.html", class: "btn", text: "Back to all projects" })
      ]));
      return;
    }
    document.title = p.title + ' · ' + PROFILE.name;
    var meta = document.querySelector('meta[name="description"]'); if (meta && !isFill(p.subtitle)) meta.setAttribute('content', p.subtitle);

    var c = el('div', { class: 'container' });
    root.appendChild(c);

    c.appendChild(el('div', { class: 'phero' }, [
      el('a', { href: 'work.html', class: 'back reveal', html: '← All projects' }),
      el('span', { class: 'eyebrow reveal', text: p.category }),
      el('h1', { class: 'phero__title reveal', text: p.title }),
      el('p', { class: 'phero__sub reveal', html: rich(p.subtitle) }),
      el('div', { class: 'phero__meta reveal' }, [
        el('span', { html: 'Timeline <b>' + rich(p.timeline) + '</b>' }),
        el('span', { html: 'Role <b>' + rich(p.role) + '</b>' })
      ])
    ]));

    if (p.draft) {
      c.appendChild(el('div', { class: 'draft-note reveal', style: 'margin-bottom:24px' }, [
        el('b', { text: 'In progress' }),
        el('span', { text: 'This write-up is being completed. Highlighted text marks details still to be filled in; photos, CAD and demo videos are real.' })
      ]));
    }

    c.appendChild(el('div', { class: 'cover reveal' }, el('img', { src: p.cover, alt: p.title, style: p.coverPosition ? 'object-position:' + p.coverPosition : null })));

    if (p.highlights && p.highlights.length) {
      c.appendChild(el('div', { class: 'highlights reveal' }, p.highlights.map(function (h) {
        return el('div', { class: 'hl' }, [el('span', { class: 'hl__value', html: rich(h.value) }), el('span', { class: 'hl__label', html: rich(h.label) })]);
      })));
    }

    c.appendChild(el('div', { class: 'block reveal' }, [el('h2', { text: 'Overview' }), el('p', { class: 'summary', html: rich(p.summary) })]));
    c.appendChild(el('div', { class: 'detail-chips reveal' }, chipRows(p)));

    if (p.specs && p.specs.length) {
      c.appendChild(el('div', { class: 'block reveal' }, [
        el('h2', { text: 'Targets and results' }),
        el('div', { class: 'spec' }, el('div', { class: 'spec__wrap' }, el('table', {}, [
          el('thead', {}, el('tr', {}, ['Parameter', 'Target', 'Achieved', 'Status'].map(function (h) { return el('th', { text: h }); }))),
          el('tbody', {}, p.specs.map(function (s) {
            var label = { met: 'Target met', partial: 'Partial', todo: 'To measure' }[s.status] || s.status;
            return el('tr', {}, [
              el('td', { html: rich(s.parameter) }), el('td', { html: rich(s.target) }), el('td', { html: rich(s.achieved) }),
              el('td', {}, el('span', { class: 'pill pill--' + (s.status || 'todo'), text: label }))
            ]);
          }))
        ])))
      ]));
    }

    (p.sections || []).forEach(function (s) {
      c.appendChild(el('section', { class: 'block reveal' }, [
        el('h2', { text: s.heading }),
        el('div', { class: 'prose' }, body(s.body)),
        figs(s.images)
      ]));
    });

    if (p.videos && p.videos.length) {
      c.appendChild(el('section', { class: 'block reveal' }, [
        el('h2', { text: 'Demo' }),
        el('div', { class: 'figs figs--videos' }, p.videos.map(videoFig))
      ]));
    }

    if (p.iterations && p.iterations.length) {
      c.appendChild(el('section', { class: 'block reveal' }, [
        el('h2', { text: 'Engineering iterations' }),
        el('div', { class: 'iters' }, p.iterations.map(function (it) {
          return el('div', { class: 'iter' }, [
            el('h3', { html: rich(it.title) }),
            el('div', { class: 'iter__col' }, [el('span', { class: 'iter__k', text: 'Problem' }), el('span', { html: rich(it.problem) })]),
            el('div', { class: 'iter__col iter__col--fix' }, [el('span', { class: 'iter__k', text: 'Fix' }), el('span', { html: rich(it.fix) })])
          ]);
        }))
      ]));
    }

    if (p.links && p.links.length) {
      c.appendChild(el('div', { class: 'block reveal' }, [
        el('h2', { text: 'Documents' }),
        el('div', { class: 'links' }, p.links.map(function (l, i) {
          return el('a', { href: l.href, class: 'btn' + (i === 0 ? ' btn--primary' : ''), target: '_blank', rel: 'noopener', html: icon(l.kind) + ' ' + esc(l.label) });
        }))
      ]));
    }

    var prev = list[idx - 1], next = list[idx + 1];
    c.appendChild(el('nav', { class: 'pnav', 'aria-label': 'Project navigation' }, [
      prev ? el('a', { href: 'project.html?id=' + prev.id, class: 'prev' }, [el('span', { class: 'k', text: '← Previous' }), el('span', { class: 't', text: prev.title })]) : el('span'),
      next ? el('a', { href: 'project.html?id=' + next.id, class: 'next' }, [el('span', { class: 'k', text: 'Next →' }), el('span', { class: 't', text: next.title })]) : el('span')
    ]));
  }

  // ---------- resume page ----------
  function renderResume() {
    var root = document.getElementById('resume-root'); if (!root) return;
    var pdf = PROFILE.contact.resume;
    root.appendChild(el('div', { class: 'section-head' }, [
      el('h2', { text: 'Resume' }),
      el('div', { class: 'links' }, [
        el('a', { href: pdf, class: 'btn', target: '_blank', rel: 'noopener', html: arrow() + ' Open PDF' }),
        el('a', { href: pdf, class: 'btn btn--primary', download: '', html: icon('pdf') + ' Download' })
      ])
    ]));
    root.appendChild(el('a', { href: pdf, target: '_blank', rel: 'noopener', class: 'resume-sheet reveal', 'aria-label': 'Open resume PDF' },
      el('img', { src: 'assets/img/resume-page-1.jpg', alt: 'Resume of ' + PROFILE.name + ', page 1' })));
  }

  // ---------- reveal on scroll ----------
  function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (n) { n.classList.add('is-in'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (n) { io.observe(n); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav(); renderHero(); renderWork(); renderCta(); renderAbout(); renderContact(); renderProject(); renderResume(); renderFooter(); reveal();
  });
})();
