/* 1tzKonst — shared shell, nav, theme, helpers
   Vanilla JS, no deps. GitHub-Pages safe.
   Designed so a page-specific script (also with defer) can use window.app safely. */
(function () {
  'use strict';

  const NAV_ITEMS = [
    { href: 'index.html',       label: 'Главная' },
    { href: 'uncopylocked.html', label: 'Игры' },
    { href: 'scripts.html',     label: 'Скрипты' },
    { href: 'wpmtest.html',     label: 'WPM Test' },
    { href: 'about.html',       label: 'О проекте' }
  ];

  const EXTERNAL = [
    { href: 'https://github.com/itzkonstCreator', label: 'GitHub' },
    { href: 'https://www.youtube.com/@Itzkonst',   label: 'YouTube' }
  ];

  const THEME_KEY = '1tzk:theme';
  const KNOWN_PAGES = new Set(['index.html','about.html','uncopylocked.html','scripts.html','wpmtest.html']);

  function currentPage() {
    const last = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return KNOWN_PAGES.has(last) ? last : 'index.html';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function buildNav() {
    const here = currentPage();
    const links = NAV_ITEMS.map(item => {
      const active = item.href === here;
      return '<a href="' + item.href + '"' +
        ' class="nav-link' + (active ? ' nav-link--active"' : '"') +
        (active ? ' aria-current="page"' : '') +
        '>' + esc(item.label) + '</a>';
    }).join('');

    const ext = EXTERNAL.map(item =>
      '<a href="' + item.href + '" target="_blank" rel="noopener noreferrer" class="nav-link nav-link--ext">' + esc(item.label) + '</a>'
    ).join('');

    return '<a href="#main" class="skip-link">Перейти к содержимому</a>' +
      '<header class="nav-header" data-theme-root>' +
        '<div class="nav-content">' +
          '<a href="index.html" class="nav-logo" aria-label="1tzKonst home">' +
            '<span class="nav-logo-mark" aria-hidden="true">⚡</span>' +
            '<span class="nav-logo-text">1tzKonst</span>' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle"' +
                  ' aria-expanded="false" aria-controls="navMenu" aria-label="Меню">' +
            '<span class="nav-toggle-bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '</button>' +
          '<nav class="nav-links" id="navMenu" aria-label="Главная навигация">' +
            links +
            '<span class="nav-sep" aria-hidden="true"></span>' +
            ext +
            '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Сменить тему">' +
              '<span class="theme-toggle-icon" aria-hidden="true">◐</span>' +
            '</button>' +
          '</nav>' +
        '</div>' +
      '</header>';
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return '<footer class="footer">' +
      '<div class="container">' +
        '<p>© ' + year + ' 1tzKonst. Все права защищены.</p>' +
        '<p class="footer-links">' +
          '<a href="https://github.com/itzkonstCreator" target="_blank" rel="noopener noreferrer">GitHub</a> · ' +
          '<a href="https://www.youtube.com/@Itzkonst" target="_blank" rel="noopener noreferrer">YouTube</a>' +
        '</p>' +
      '</div>' +
    '</footer>';
  }

  function mountShell() {
    if (!document.body || document.querySelector('header.nav-header')) return;
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('beforeend', buildFooter());
  }

  function setupNavToggle() {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('nav-links--open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('nav-toggle--active', open);
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (menu.classList.contains('nav-links--open')) {
          menu.classList.remove('nav-links--open');
          btn.setAttribute('aria-expanded', 'false');
          btn.classList.remove('nav-toggle--active');
        }
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('title', theme === 'light' ? 'Тёмная тема' : 'Светлая тема');
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  function setupTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light' : 'dark';
    }
    applyTheme(saved);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'light' ? 'dark' : 'light');
      });
    }
  }

  // ---- Public helpers ----
  async function loadData() {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json: HTTP ' + res.status);
    const txt = await res.text();
    try { return JSON.parse(txt); }
    catch (e) { throw new Error('data.json: invalid JSON — ' + e.message); }
  }

  function toast(msg, opts) {
    opts = opts || {};
    const t = document.createElement('div');
    t.className = 'toast' + (opts.kind ? ' toast--' + opts.kind : '');
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast--visible'));
    setTimeout(() => {
      t.classList.remove('toast--visible');
      setTimeout(() => t.remove(), 250);
    }, opts.duration || 1800);
  }

  function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || items.length === 0) {
      items.forEach(el => el.classList.add('reveal--in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  }

  // Global error overlay — surfaces script failures so they're visible without DevTools
  function setupErrorOverlay() {
    function show(msg) {
      let box = document.getElementById('js-error-overlay');
      if (!box) {
        box = document.createElement('div');
        box.id = 'js-error-overlay';
        box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;' +
          'background:#1a0b10;color:#ffd2d6;border:1px solid #ff4655;border-radius:12px;' +
          'padding:12px 14px;font:13px/1.4 ui-monospace,Menlo,Consolas,monospace;' +
          'box-shadow:0 12px 30px rgba(0,0,0,0.5);max-height:40vh;overflow:auto;white-space:pre-wrap';
        document.body.appendChild(box);
      }
      const line = document.createElement('div');
      line.textContent = msg;
      box.appendChild(line);
    }
    window.addEventListener('error', (e) => {
      show('JS error: ' + (e.message || 'unknown') +
           (e.filename ? '\n  at ' + e.filename + ':' + e.lineno + ':' + e.colno : ''));
    });
    window.addEventListener('unhandledrejection', (e) => {
      const r = e.reason || {};
      show('Promise error: ' + (r.message || String(r)));
    });
  }

  // Expose IMMEDIATELY so any defer-loaded page script can use window.app
  // even if init() hasn't finished yet.
  window.app = {
    loadData,
    toast,
    escapeHTML: esc,
    currentPage,
    applyTheme,
    NAV_ITEMS,
    EXTERNAL
  };

  function init() {
    setupErrorOverlay();
    mountShell();
    setupNavToggle();
    setupTheme();
    setupReveal();
    document.addEventListener('keyup', e => {
      if (e.key === 'Tab') document.body.classList.add('kbd-focus');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();