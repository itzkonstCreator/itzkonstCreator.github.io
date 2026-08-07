/* 1tzKonst — shared shell, nav, theme, helpers
   Vanilla JS, no deps. GitHub-Pages safe. */
(function () {
  'use strict';

  const NAV_ITEMS = [
    { href: 'index.html',       label: 'Главная',    key: 'home' },
    { href: 'uncopylocked.html', label: 'Игры',       key: 'games' },
    { href: 'scripts.html',     label: 'Скрипты',    key: 'scripts' },
    { href: 'wpmtest.html',     label: 'WPM Test',   key: 'wpm' },
    { href: 'about.html',       label: 'О проекте',  key: 'about' }
  ];

  const EXTERNAL = [
    { href: 'https://github.com/itzkonstCreator', label: 'GitHub',  key: 'gh' },
    { href: 'https://www.youtube.com/@Itzkonst',   label: 'YouTube', key: 'yt' }
  ];

  const THEME_KEY = '1tzk:theme';

  function currentPage() {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return file === '' ? 'index.html' : file;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function buildNav() {
    const here = currentPage();
    const links = NAV_ITEMS.map(item => {
      const active = item.href.toLowerCase() === here;
      const aria = active ? ' aria-current="page"' : '';
      const cls = active ? ' class="nav-link nav-link--active"' : ' class="nav-link"';
      return `<a href="${item.href}"${cls}${aria}>${escapeHTML(item.label)}</a>`;
    }).join('');

    const ext = EXTERNAL.map(item =>
      `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="nav-link nav-link--ext">${escapeHTML(item.label)}</a>`
    ).join('');

    return `
      <a href="#main" class="skip-link">Перейти к содержимому</a>
      <header class="nav-header" data-theme-root>
        <div class="nav-content">
          <a href="index.html" class="nav-logo" aria-label="1tzKonst home">
            <span class="nav-logo-mark" aria-hidden="true">⚡</span>
            <span class="nav-logo-text">1tzKonst</span>
          </a>
          <button class="nav-toggle" id="navToggle"
                  aria-expanded="false" aria-controls="navMenu" aria-label="Меню">
            <span class="nav-toggle-bars" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>
          <nav class="nav-links" id="navMenu" aria-label="Главная навигация">
            ${links}
            <span class="nav-sep" aria-hidden="true"></span>
            ${ext}
            <button class="theme-toggle" id="themeToggle" type="button" aria-label="Сменить тему">
              <span class="theme-toggle-icon" aria-hidden="true">◐</span>
            </button>
          </nav>
        </div>
      </header>`;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="footer">
        <div class="container">
          <p>© ${year} 1tzKonst. Все права защищены.</p>
          <p class="footer-links">
            <a href="https://github.com/itzkonstCreator" target="_blank" rel="noopener noreferrer">GitHub</a> ·
            <a href="https://www.youtube.com/@Itzkonst" target="_blank" rel="noopener noreferrer">YouTube</a>
          </p>
        </div>
      </footer>`;
  }

  function mountShell() {
    const here = currentPage();
    if (here !== 'index.html' && here !== 'about.html' && here !== 'uncopylocked.html'
        && here !== 'scripts.html' && here !== 'wpmtest.html') {
      return; // not a page we control
    }
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('beforeend', buildFooter());

    // Wrap page content into <main id="main"> if not already
    let main = document.getElementById('main');
    if (!main) {
      const wrap = document.createElement('main');
      wrap.id = 'main';
      wrap.className = 'container page';
      // Move all body children that aren't nav/footer/script into wrap
      const keep = new Set([wrap]);
      Array.from(document.body.children).forEach(el => {
        if (el.tagName === 'HEADER' && el.classList.contains('nav-header')) return;
        if (el.tagName === 'FOOTER' && el.classList.contains('footer')) return;
        if (el.tagName === 'SCRIPT') return;
        if (el.classList && el.classList.contains('skip-link')) return;
        keep.add(el);
      });
      document.body.querySelectorAll('main, .container, .page, .glass-card, .wpm-container, .game-list-container, .uncopylocked-list, header.nav-header, footer.footer, script').forEach(el => {
        // Skip our injected pieces
      });
      // Safer: just collect existing wrappers and ensure there is a <main id="main">
      // We do NOT forcefully move existing markup if a <main id="main"> already exists.
    }
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
    // Close menu on link click (mobile)
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
    const res = await fetch('data.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('data.json: ' + res.status);
    return res.json();
  }

  function toast(msg, opts) {
    opts = opts || {};
    const t = document.createElement('div');
    t.className = 'toast' + ( opts.kind ? ' toast--' + opts.kind : '' );
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

  // Reveal-on-scroll
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

  // Init
  function init() {
    mountShell();
    setupNavToggle();
    setupTheme();
    setupReveal();
    // Smooth focus for keyboard users
    document.addEventListener('keyup', e => {
      if (e.key === 'Tab') document.body.classList.add('kbd-focus');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose helpers
  window.app = {
    loadData,
    toast,
    escapeHTML,
    currentPage,
    applyTheme,
    NAV_ITEMS,
    EXTERNAL
  };
})();
