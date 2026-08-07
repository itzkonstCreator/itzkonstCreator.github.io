/* about.html — populate tech chips and timeline */
(async function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }
  let data;
  try { data = await window.app.loadData(); }
  catch (e) { return; }

  const tech = data.tech || ['HTML5', 'CSS3', 'JavaScript', 'Lua', 'ROBLOX Studio'];
  document.getElementById('techChips').innerHTML = tech.map(t =>
    '<span class="chip">' + esc(t) + '</span>'
  ).join('');

  const tl = data.timeline || [];
  document.getElementById('timeline').innerHTML = tl.map(item =>
    '<li><span class="tl-date">' + esc(item.date) + '</span><div>' + esc(item.label) + '</div></li>'
  ).join('');
})();