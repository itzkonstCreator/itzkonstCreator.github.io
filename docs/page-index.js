/* index.html — render project grid, stats, search, filter */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function whenAppReady(cb) {
  if (window.app) { cb(); return; }
  let n = 0;
  const t = setInterval(() => {
    if (window.app) { clearInterval(t); cb(); }
    else if (++n > 50) { clearInterval(t); cb(); } // give up after ~5s, run anyway
  }, 100);
}

(async function main() {
  let data;
  try {
    data = await window.app.loadData();
  } catch (e) {
    document.getElementById('projects').innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">⚠️</div>Не удалось загрузить список проектов: ' + esc(e.message || String(e)) + '</div>';
    return;
  }

  // Stats
  const heroStats = document.getElementById('heroStats');
  heroStats.innerHTML =
    '<span class="hero-stat"><strong>' + data.stats.games + '</strong>&nbsp;игр</span>' +
    '<span class="hero-stat"><strong>' + data.stats.scripts + '</strong>&nbsp;скрипт</span>' +
    '<span class="hero-stat"><strong>' + (data.stats.wpmWords / 1000).toFixed(0) + 'k</strong>&nbsp;слов в WPM</span>';

  // Items
  const items = [
    { href: 'uncopylocked.html', icon: '🎮', title: 'Uncopylocked', desc: 'Roblox Games', filterTags: ['games', 'tools'] },
    { href: 'scripts.html',      icon: '🛠️', title: 'Scripts',      desc: 'ROBLOX скрипты', filterTags: ['scripts'] },
    { href: 'wpmtest.html',      icon: '⌨️', title: 'WPM Test',     desc: 'Скорость печати', filterTags: ['tools'] },
    { href: 'about.html',        icon: '👤', title: 'About',        desc: 'О проекте', filterTags: ['tools'] },
    { href: 'https://www.youtube.com/@Itzkonst', icon: '▶️', title: 'YouTube', desc: 'Видео и туториалы', external: true, filterTags: ['tools'] },
    { href: 'https://github.com/itzkonstCreator', icon: '📦', title: 'GitHub',  desc: 'Исходный код',      external: true, filterTags: ['tools'] }
  ];

  const grid = document.getElementById('projects');
  grid.innerHTML = items.map((it, i) => {
    const tfilter = it.filterTags.join(' ');
    return '<a href="' + it.href + '"' + (it.external ? ' target="_blank" rel="noopener noreferrer"' : '') +
      ' class="card-mini reveal" style="--i:' + (3 + i) + '" data-tags="' + tfilter + '" data-title="' + esc(it.title.toLowerCase()) + '" data-desc="' + esc(it.desc.toLowerCase()) + '">' +
      '<div class="card-mini-icon">' + it.icon + '</div>' +
      '<div class="card-mini-content">' +
        '<h3>' + esc(it.title) + '</h3>' +
        '<p>' + esc(it.desc) + '</p>' +
      '</div>' +
    '</a>';
  }).join('');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Featured
  const featured = document.getElementById('featuredStrip');
  const lastGame = (data.games || [])[0];
  const lastScript = (data.scripts || [])[0];
  let html = '';
  if (lastGame) {
    html += '<a class="featured-card" href="uncopylocked.html">' +
              '<span class="tag tag--accent">Последняя игра</span>' +
              '<h3>🎮 ' + esc(lastGame.title) + '</h3>' +
              '<p>' + esc((lastGame.tags || []).join(' · ')) + '</p>' +
            '</a>';
  }
  if (lastScript) {
    html += '<a class="featured-card" href="scripts.html">' +
              '<span class="tag tag--purple">Скрипт</span>' +
              '<h3>' + (lastScript.icon || '🔮') + ' ' + esc(lastScript.name) + '</h3>' +
              '<p>' + esc(lastScript.description || '') + '</p>' +
            '</a>';
  }
  featured.innerHTML = html;

  // Filter & search
  const filterBtns = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('searchInput');
  let currentFilter = 'all';

  function applyFilter() {
    const q = (searchInput.value || '').trim().toLowerCase();
    let visible = 0;
    grid.querySelectorAll('.card-mini').forEach(el => {
      const tags = (el.dataset.tags || '').split(' ');
      const matchesFilter = currentFilter === 'all' || tags.includes(currentFilter);
      const haystack = (el.dataset.title || '') + ' ' + (el.dataset.desc || '');
      const matchesSearch = !q || haystack.includes(q);
      const show = matchesFilter && matchesSearch;
      el.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    let empty = grid.querySelector('.empty-state--inline');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-state empty-state--inline';
        empty.innerHTML = '<div class="empty-state-icon">🤷</div>Ничего не найдено. Попробуй другой запрос.';
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  }

  filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => {
      x.classList.remove('filter-chip--active');
      x.setAttribute('aria-selected', 'false');
    });
    b.classList.add('filter-chip--active');
    b.setAttribute('aria-selected', 'true');
    currentFilter = b.dataset.filter;
    applyFilter();
  }));
  searchInput.addEventListener('input', applyFilter);
}

whenAppReady(main);