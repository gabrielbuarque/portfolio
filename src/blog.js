// Blog pages: click-to-load YouTube, share buttons and tag filters. Everything works without it.
(() => {
  document.querySelectorAll('button.yt').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1${b.dataset.start ? '&start=' + b.dataset.start : ''}`;
    f.title = b.dataset.title || 'YouTube';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceWith(f);
  }));

  const lazy = document.querySelectorAll('iframe[data-src]');
  if (lazy.length) {
    const load = f => { f.src = f.dataset.src; f.removeAttribute('data-src'); };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); load(e.target); } }), { rootMargin: '300px 0px' });
      lazy.forEach(f => io.observe(f));
    } else lazy.forEach(load);
  }

  const copyBtn = document.getElementById('copy-link'), copied = document.getElementById('copied'), nativeBtn = document.getElementById('native-share');
  if (copyBtn) {
    const url = copyBtn.dataset.url;
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); } catch (_) {}
      copied.textContent = copied.dataset.msg; copied.classList.add('on');
      setTimeout(() => copied.classList.remove('on'), 2200);
    });
    if (navigator.share && nativeBtn) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', () => navigator.share({ title: document.title, url }).catch(() => {}));
    }
  }

  const filters = document.querySelector('.filters');
  if (filters) {
    const rows = [...document.querySelectorAll('.post-row')];
    const set = tag => {
      filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tag === tag)));
      rows.forEach(r => { r.hidden = tag !== '*' && !r.dataset.tags.split(',').includes(tag); });
    };
    filters.addEventListener('click', e => { const b = e.target.closest('button'); if (b) set(b.dataset.tag); });
    const q = new URLSearchParams(location.search).get('tag');
    if (q && filters.querySelector(`[data-tag="${CSS.escape(q)}"]`)) set(q);
  }
})();
