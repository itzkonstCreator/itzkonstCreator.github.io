/* uncopylocked.html — render games list with search */
(async function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  const list = document.getElementById('gamesList');
  const search = document.getElementById('searchInput');

  let data;
  try {
    data = await window.app.loadData();
  } catch (e) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div>Не удалось загрузить список игр: ' + esc(e.message || String(e)) + '</div>';
    return;
  }

  function render(games) {
    if (!games.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔎</div>Ничего не найдено.</div>';
      return;
    }
    list.innerHTML = games.map((g, i) => {
      const tags = (g.tags || []).map(t => {
        const cls = t === 'uncopylocked' ? 'tag--accent' : 'tag--blue';
        return '<span class="tag ' + cls + '">' + esc(t) + '</span>';
      }).join('');
      return '<article class="list-card reveal" style="--i:' + i + '" data-title="' + esc(g.title.toLowerCase()) + '">' +
        '<div>' +
          '<div class="list-card-title">' +
            '<span aria-hidden="true">🎮</span>' +
            esc(g.title) +
          '</div>' +
          '<div class="list-card-meta">' + tags +
            (g.added ? '<span class="tag">' + esc(g.added) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="list-card-actions">' +
          '<a class="btn" href="' + esc(g.url) + '" target="_blank" rel="noopener noreferrer">⬇ Скачать <i>→</i></a>' +
        '</div>' +
      '</article>';
    }).join('');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('reveal--in'); io.unobserve(e.target); }
    }), { threshold: 0.05 });
    list.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  const games = (data.games || []).slice().sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  render(games);

  search.addEventListener('input', () => {
    const q = (search.value || '').trim().toLowerCase();
    render(games.filter(g => g.title.toLowerCase().includes(q)));
  });
})();