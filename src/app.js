// Reveal-on-scroll, share buttons and the live GitHub widget.
(() => {
  const EN = document.documentElement.lang === 'en';
  const $ = id => document.getElementById(id);

  // reveal on scroll
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 })
    : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // share
  const copyBtn = $('copy-link'), copied = $('copied'), nativeBtn = $('native-share');
  const url = copyBtn.dataset.url;
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); } catch (_) {
      const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (_) {} t.remove();
    }
    copied.textContent = copied.dataset.msg; copied.classList.add('on');
    setTimeout(() => copied.classList.remove('on'), 2200);
  });
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', () => navigator.share({ title: document.title, url }).catch(() => {}));
  }

  // ---------- GitHub widget (loads when the section gets close) ----------
  const USER = 'gabrielbuarque';
  const LANG_COLORS = { TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#a78bfa', Shell: '#89e051', Python: '#3572a5', Go: '#00add8', Rust: '#dea584', Dart: '#00b4ab' };
  const TTL = 30 * 60 * 1000;
  const L = EN
    ? { sync: 'synced', down: 'unavailable', none: 'no recent public activity', best: 'best day', events: 'recent public events',
        err: 'Couldn’t load right now (API rate limit). See it at', commit: n => `${n} commit${n > 1 ? 's' : ''} to`, created: t => `created ${t} in`,
        pr: a => `${a} PR in`, issue: a => `${a} issue in`, star: 'starred', fork: 'forked', other: t => `${t} in`, month: 'mo', locale: 'en-US' }
    : { sync: 'sincronizado', down: 'indisponível', none: 'sem atividade pública recente', best: 'melhor dia', events: 'eventos públicos recentes',
        err: 'Não consegui carregar agora (limite da API). Veja direto em', commit: n => `${n} commit${n > 1 ? 's' : ''} em`, created: t => `criou ${t} em`,
        pr: a => `${a} PR em`, issue: a => `${a} issue em`, star: 'favoritou', fork: 'fork de', other: t => `${t} em`, month: 'mês', locale: 'pt-BR' };

  const cached = async (key, url) => {
    try { const c = JSON.parse(localStorage.getItem(key)); if (c && Date.now() - c.t < TTL) return c.d; } catch (_) {}
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (_) {}
    return d;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ago = iso => {
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'min';
    if (s < 86400) return Math.round(s / 3600) + 'h';
    if (s < 86400 * 30) return Math.round(s / 86400) + 'd';
    return Math.round(s / 86400 / 30) + L.month;
  };
  function eventText(e) {
    const repo = `<b>${esc(e.repo.name.replace(USER + '/', ''))}</b>`;
    const p = e.payload || {};
    switch (e.type) {
      case 'PushEvent': { const n = p.size || (p.commits || []).length || 1; return ['↑', `${L.commit(n)} ${repo}`]; }
      case 'CreateEvent': return ['+', `${L.created(esc(p.ref_type))} ${repo}`];
      case 'PullRequestEvent': return ['⇄', `${L.pr(esc(p.action))} ${repo}`];
      case 'IssuesEvent': return ['○', `${L.issue(esc(p.action))} ${repo}`];
      case 'WatchEvent': return ['★', `${L.star} ${repo}`];
      case 'ForkEvent': return ['⑂', `${L.fork} ${repo}`];
      default: return ['·', `${L.other(esc(e.type.replace('Event', '')))} ${repo}`];
    }
  }
  function daysFromEvents(events) {
    const map = {};
    events.forEach(e => { const k = e.created_at.slice(0, 10); map[k] = (map[k] || 0) + (e.payload && e.payload.size || 1); });
    const out = [], today = new Date();
    for (let i = 363; i >= 0; i--) {
      const k = new Date(today - i * 864e5).toISOString().slice(0, 10);
      const c = map[k] || 0; out.push({ date: k, count: c, level: c === 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4 });
    }
    return out;
  }

  async function load() {
    try {
      const [user, repos, events] = await Promise.all([
        cached('gh:user', `https://api.github.com/users/${USER}`),
        cached('gh:repos', `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
        cached('gh:events', `https://api.github.com/users/${USER}/events/public?per_page=30`)
      ]);
      $('gh-name').textContent = user.name || USER;
      $('s-repos').textContent = user.public_repos;
      $('s-follow').textContent = user.followers;
      $('gh-sync').textContent = `${L.sync} · ${new Date().toLocaleTimeString(L.locale, { hour: '2-digit', minute: '2-digit' })}`;
      $('feed').innerHTML = events.slice(0, 6).map(e => {
        const [ic, tx] = eventText(e);
        return `<li><span class="ic" aria-hidden="true">${ic}</span><span>${tx}</span><time datetime="${esc(e.created_at)}">${ago(e.created_at)}</time></li>`;
      }).join('') || `<li class="skeleton">${L.none}</li>`;

      const counts = {};
      repos.filter(r => !r.fork && r.language).forEach(r => counts[r.language] = (counts[r.language] || 0) + 1);
      const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
      const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const col = n => LANG_COLORS[n] || '#8b8982';
      $('lang-bar').innerHTML = langs.map(([n, c]) => `<span style="flex:${c};background:${col(n)}" title="${esc(n)}"></span>`).join('');
      $('langs').innerHTML = langs.map(([n, c]) => `<li><i style="background:${col(n)}"></i>${esc(n)}<span>${Math.round(c / total * 100)}%</span></li>`).join('');

      let days, exact = true, sum;
      try {
        const c = await cached('gh:contrib', `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
        days = c.contributions;
        sum = c.total && c.total.lastYear != null ? c.total.lastYear : days.reduce((a, d) => a + d.count, 0);
      } catch (_) {
        days = daysFromEvents(events); exact = false; sum = days.reduce((a, d) => a + d.count, 0);
        $('heat-range').textContent = L.events;
      }
      $('s-contrib').textContent = (exact ? '' : '≥') + sum.toLocaleString(L.locale);
      const first = new Date(days[0].date + 'T00:00:00').getDay();
      $('heat').innerHTML = '<i style="visibility:hidden"></i>'.repeat(first) + days.map(d => `<i data-l="${d.level}" title="${d.count} · ${d.date}"></i>`).join('');
      const best = days.reduce((a, b) => b.count > a.count ? b : a, days[0]);
      if (best.count) $('heat-best').textContent = `${L.best}: ${best.count} · ${new Date(best.date + 'T12:00:00').toLocaleDateString(L.locale, { day: '2-digit', month: 'short' })}`;
      let streak = 0;
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) streak++; else if (i === days.length - 1) continue; else break;
      }
      $('s-streak').textContent = streak;
    } catch (err) {
      $('gh-sync').textContent = L.down;
      $('gh').querySelector('.gh-cols').innerHTML = `<div class="gh-err" style="grid-column:1/-1">${L.err} <a style="color:var(--accent)" href="https://github.com/${USER}">github.com/${USER}</a>.</div>`;
    }
  }

  const gh = $('github');
  if ('IntersectionObserver' in window) {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); load(); } }, { rootMargin: '600px 0px' });
    o.observe(gh);
  } else load();
})();
