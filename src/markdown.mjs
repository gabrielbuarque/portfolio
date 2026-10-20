// Markdown -> HTML for blog posts, with "widget" code fences.
// A fence whose language is a widget name renders as that widget; any other fence is highlighted code.
// The full syntax is documented in skills/update-nnexus-blog/SKILL.md.
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import sizeOf from 'image-size';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const slugify = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const isExternal = href => /^https?:\/\//.test(href) && !href.startsWith('https://nnex.us');
const lines = t => t.split('\n').map(l => l.trim()).filter(Boolean);
const cells = l => l.split('|').map(c => c.trim());
const kv = t => { const o = {}; lines(t).forEach(l => { const m = l.match(/^([a-z_]+):\s*(.*)$/i); if (m) o[m[1].toLowerCase()] = m[2]; }); return o; };

const WIDGETS = ['callout', 'youtube', 'video', 'audio', 'embed', 'github', 'link', 'bookmark', 'stats', 'steps', 'gallery', 'cta', 'x', 'tweet'];

// ---------- build-time data for cards (GitHub repos, link previews) ----------
async function fetchJSON(url, timeout = 6000) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), timeout);
  try { const r = await fetch(url, { signal: ac.signal, headers: { 'User-Agent': 'nnex.us-build', Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } }); return r.ok ? await r.json() : null; }
  catch { return null; } finally { clearTimeout(t); }
}
async function fetchMeta(url, timeout = 6000) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ac.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; nnex.us-build)' } });
    if (!r.ok) return null;
    const html = (await r.text()).slice(0, 200000);
    const pick = re => { const m = html.match(re); return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : null; };
    return {
      title: pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || pick(/<title[^>]*>([^<]+)/i),
      description: pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i) || pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)
    };
  } catch { return null; } finally { clearTimeout(t); }
}

export async function prefetch(md, cache) {
  const re = /```(github|link|bookmark)[^\n]*\n([\s\S]*?)```/g; let m;
  const jobs = [];
  while ((m = re.exec(md))) {
    const kind = m[1], first = lines(m[2])[0];
    if (!first || cache.has(kind + ':' + first)) continue;
    cache.set(kind + ':' + first, null);
    jobs.push((kind === 'github' ? fetchJSON(`https://api.github.com/repos/${first}`) : fetchMeta(first)).then(d => cache.set(kind + ':' + first, d)));
  }
  await Promise.all(jobs);
}

// ---------- images ----------
function imgDims(src, root) {
  if (!src.startsWith('/')) return null;
  const file = path.join(root, src.replace(/^\/blog\/media\//, 'content/blog/media/'));
  try { if (fs.existsSync(file)) return sizeOf(fs.readFileSync(file)); } catch {}
  return null;
}
function imgTag(src, alt, root, { eager = false } = {}) {
  const d = imgDims(src, root);
  const wh = d ? ` width="${d.width}" height="${d.height}"` : '';
  return `<img src="${esc(src)}" alt="${esc(alt)}"${wh} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

// ---------- widgets ----------
function widget(kind, info, body, ctx) {
  const L = ctx.L;
  switch (kind) {
    case 'callout': {
      const [variant = 'tip', ...rest] = info.split(/\s+/).filter(Boolean);
      const title = rest.join(' ') || L.callout[variant] || L.callout.tip;
      return `<aside class="callout ${esc(variant)}"><div class="callout-title">${esc(title)}</div>${ctx.parse(body)}</aside>`;
    }
    case 'youtube': {
      const src = lines(body)[0] || '';
      const id = (src.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1] || src;
      const start = (src.match(/[?&]t=(\d+)/) || [])[1] || '';
      const title = kv(body).title || 'YouTube';
      return `<div class="embed ratio"><button type="button" class="yt" data-id="${esc(id)}" data-start="${esc(start)}" data-title="${esc(title)}" aria-label="${esc(L.play)}: ${esc(title)}"><img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"><span></span><em>${esc(title)}</em></button></div>`;
    }
    case 'video': {
      const [src, poster] = cells(lines(body)[0] || '');
      return `<div class="embed"><video controls preload="none" playsinline${poster ? ` poster="${esc(poster)}"` : ''} src="${esc(src)}"></video></div>`;
    }
    case 'audio': {
      const [src, label] = cells(lines(body)[0] || '');
      return `<div class="audio-block"><span>${esc(label || L.listen)}</span><audio controls preload="none" src="${esc(src)}"></audio></div>`;
    }
    case 'embed': {
      const o = kv(body); const src = lines(body).find(l => /^https?:\/\//.test(l)) || '';
      const h = parseInt(o.height, 10);
      const attrs = `title="${esc(o.title || 'Embed')}"${h ? ` height="${h}"` : ''} allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"`;
      // the iframe only gets its src when it comes near the viewport (src/blog.js)
      return `<div class="embed${h ? '' : ' ratio'}"${h ? ` style="min-height:${h}px"` : ''}><iframe data-src="${esc(src)}" ${attrs}></iframe><noscript><iframe src="${esc(src)}" ${attrs}></iframe></noscript></div>`;
    }
    case 'github': {
      const repo = lines(body)[0] || ''; const d = ctx.cache.get('github:' + repo);
      return `<a class="card-link gh-card" href="https://github.com/${esc(repo)}" target="_blank" rel="noopener noreferrer"><span><b>${esc(repo)}</b>${d && d.description ? `<small>${esc(d.description)}</small>` : ''}<span class="meta">${d && d.language ? `<span>${esc(d.language)}</span>` : ''}${d ? `<span>★ ${d.stargazers_count}</span>` : ''}<span>GitHub</span></span></span><span class="arrow" aria-hidden="true">↗</span></a>`;
    }
    case 'link': case 'bookmark': case 'x': case 'tweet': {
      const url = lines(body).find(l => /^https?:\/\//.test(l)) || ''; const o = kv(body);
      const d = ctx.cache.get('link:' + url) || ctx.cache.get('bookmark:' + url) || {};
      const host = (() => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } })();
      const title = o.title || d.title || (kind === 'x' || kind === 'tweet' ? L.xpost : host);
      const desc = o.description || d.description || '';
      return `<a class="card-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span><b>${esc(title)}</b>${desc ? `<small>${esc(desc.slice(0, 180))}</small>` : ''}<em>${esc(host)}</em></span><span class="arrow" aria-hidden="true">↗</span></a>`;
    }
    case 'stats':
      return `<div class="kpi-row">${lines(body).map(l => { const [v, label] = cells(l); return `<div><b>${esc(v)}</b><span>${esc(label)}</span></div>`; }).join('')}</div>`;
    case 'steps':
      return `<ol class="steps">${lines(body).map(l => { const [t, d] = cells(l); return `<li><b>${ctx.inline(t)}</b>${d ? `<span>${ctx.inline(d)}</span>` : ''}</li>`; }).join('')}</ol>`;
    case 'gallery':
      return `<div class="gallery">${lines(body).map(l => { const [src, alt, cap] = cells(l); return `<figure>${imgTag(src, alt || cap || '', ctx.root)}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`; }).join('')}</div>`;
    case 'cta': {
      const [text, url, label] = cells(lines(body)[0] || '');
      const ext = isExternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<div class="cta-block"><p>${ctx.inline(text)}</p><a class="btn primary" href="${esc(url)}"${ext}>${esc(label || L.open)} ↗</a></div>`;
    }
  }
  return '';
}

// ---------- renderer ----------
export function render(md, { cache, root, L }) {
  const toc = [];
  const used = new Set();
  const marked = new Marked({ gfm: true });
  const ctx = { cache, root, L, parse: s => marked.parse(s), inline: s => marked.parseInline(s) };
  marked.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(text) || 'secao'; let n = 2; while (used.has(id)) id = `${slugify(text)}-${n++}`; used.add(id);
        if (depth === 2) toc.push({ id, text: html.replace(/<[^>]+>/g, '') });
        const d = Math.min(Math.max(depth, 2), 4);
        return `<h${d} id="${id}">${html}<a class="anchor" href="#${id}" aria-label="Link: ${esc(text)}">#</a></h${d}>\n`;
      },
      code({ text, lang = '' }) {
        const [kind, ...info] = lang.trim().split(/\s+/);
        if (WIDGETS.includes(kind)) return widget(kind, info.join(' '), text, ctx) + '\n';
        const language = hljs.getLanguage(kind) ? kind : null;
        const code = language ? hljs.highlight(text, { language }).value : esc(text);
        const label = info.join(' ');
        return `${label ? `<div class="code-label">${esc(label)}</div>` : ''}<pre><code${language ? ` class="hljs language-${language}"` : ''}>${code}</code></pre>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext}>${text}</a>`;
      },
      image({ href, title, text }) {
        const img = imgTag(href, text, root);
        return title ? `<figure>${img}<figcaption>${esc(title)}</figcaption></figure>` : `<figure>${img}</figure>`;
      },
      paragraph({ tokens }) {
        const real = tokens.filter(t => !(t.type === 'text' && !t.text.trim()));
        if (real.length === 1 && real[0].type === 'image') return this.parser.parseInline(real) + '\n';
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
      blockquote({ tokens }) {
        let html = this.parser.parse(tokens);
        // "— Author" as last line becomes a <cite>
        html = html.replace(/<p>(?:—|--)\s*([^<]+)<\/p>\s*$/, '<cite>— $1</cite>')
          .replace(/\n(?:—|--)\s*([^<\n]+)<\/p>\s*$/, '</p><cite>— $1</cite>');
        return `<blockquote>${html}</blockquote>\n`;
      },
      table(token) {
        const head = token.header.map(c => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
        const body = token.rows.map(r => `<tr>${r.map(c => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
        return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>\n`;
      }
    }
  });
  const html = marked.parse(md);
  const text = md.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`\[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return { html, toc, words, minutes: Math.max(1, Math.round(words / 220)) };
}
