/* scripts.html — render scripts list with copy + preview */
(async function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  const list = document.getElementById('scriptList');

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      window.app.toast('✓ Код скопирован в буфер обмена', { kind: 'ok' });
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); window.app.toast('✓ Скопировано', { kind: 'ok' }); }
      catch (_) { window.app.toast('✗ Не удалось скопировать', { kind: 'err' }); }
      ta.remove();
    }
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Готово';
      setTimeout(() => btn.innerHTML = orig, 1200);
    }
  }

  let data;
  try {
    data = await window.app.loadData();
  } catch (e) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div>Не удалось загрузить список скриптов: ' + esc(e.message || String(e)) + '</div>';
    return;
  }

  const scripts = data.scripts || [];
  if (!scripts.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🪄</div>Здесь скоро появятся скрипты.</div>';
    return;
  }

  list.innerHTML = scripts.map((s, i) => {
    const tags = (s.tags || []).map(t => {
      const cls =
        t === 'obfuscated' ? 'tag--accent' :
        t === 'solara'     ? 'tag--blue'   :
        t === 'lua'        ? 'tag--purple' : 'tag--green';
      return '<span class="tag ' + cls + '">' + esc(t) + '</span>';
    }).join('');
    const safeCode = esc(s.code);
    return '<article class="list-card reveal" style="--i:' + i + '" data-id="' + esc(s.id) + '">' +
      '<div style="flex:1 1 100%;min-width:240px">' +
        '<div class="list-card-title">' +
          '<span aria-hidden="true">' + (s.icon || '🔮') + '</span>' +
          esc(s.name) +
          (s.version ? '<span class="tag tag--green">v' + esc(s.version) + '</span>' : '') +
        '</div>' +
        (s.description ? '<div class="list-card-meta" style="margin-top:0.3rem">' + esc(s.description) + '</div>' : '') +
        '<div class="list-card-meta" style="margin-top:0.4rem">' + tags +
          (s.updated ? '<span class="tag">' + esc(s.updated) + '</span>' : '') +
        '</div>' +
        '<div class="code-preview" data-collapsed>' +
          '<div class="code-preview-header">' +
            '<span>Lua · loadstring</span>' +
            '<button class="btn btn-ghost btn-sm" data-toggle style="padding:0.25rem 0.7rem;font-size:0.8rem">Развернуть</button>' +
          '</div>' +
          '<pre><code>' + safeCode + '</code></pre>' +
        '</div>' +
      '</div>' +
      '<div class="list-card-actions">' +
        '<button class="btn btn-primary" data-copy>📋 Копировать код</button>' +
        '<button class="btn btn-ghost" data-toggle-2>👁 Показать код</button>' +
      '</div>' +
    '</article>';
  }).join('');

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('reveal--in'); io.unobserve(e.target); }
  }), { threshold: 0.05 });
  list.querySelectorAll('.reveal').forEach(el => io.observe(el));

  list.addEventListener('click', (ev) => {
    const card = ev.target.closest('.list-card');
    if (!card) return;
    const id = card.dataset.id;
    const script = scripts.find(s => s.id === id);
    if (!script) return;
    const preview = card.querySelector('.code-preview');

    if (ev.target.closest('[data-copy]')) {
      copyText(script.code, ev.target.closest('[data-copy]'));
    } else if (ev.target.closest('[data-toggle]') || ev.target.closest('[data-toggle-2]')) {
      const isCollapsed = preview.hasAttribute('data-collapsed');
      if (isCollapsed) {
        preview.removeAttribute('data-collapsed');
        preview.classList.remove('is-collapsed');
        card.querySelector('[data-toggle]').textContent = 'Свернуть';
        card.querySelector('[data-toggle-2]').textContent = '🙈 Скрыть код';
      } else {
        preview.setAttribute('data-collapsed', '');
        preview.classList.add('is-collapsed');
        card.querySelector('[data-toggle]').textContent = 'Развернуть';
        card.querySelector('[data-toggle-2]').textContent = '👁 Показать код';
      }
    }
  });
})();