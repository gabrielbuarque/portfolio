// Builds the static site into dist/:
//   /            home (PT)          /en/          home (EN)
//   /blog/       blog index (PT)    /en/blog/     blog index (EN)
//   /blog/<slug>/  one page per post in content/blog/*.md  (+ /blog/<slug>.md raw copy for LLMs)
//   og images, sitemap.xml, robots.txt, llms.txt, llms-full.txt, feed.xml, manifest, icons, 404
// Usage: node build.mjs [--drafts]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { parse } from 'node-html-parser';
import { minify } from 'html-minifier-terser';
import { minify as minifyJS } from 'terser';
import { Resvg } from '@resvg/resvg-js';
import { render, prefetch, esc, slugify } from './src/markdown.mjs';
import { homeOG, postOG, fontFiles } from './src/og.mjs';
import { memoryGraph, graphSVG } from './src/graph-data.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');
const SITE = 'https://nnex.us';
const DRAFTS = process.argv.includes('--drafts');
const TODAY = new Date().toISOString().slice(0, 10);
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, data) => { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };

const EN = JSON.parse(read('src/en.json'));
const ICONS = JSON.parse(read('src/icons.json'));
const SITE_CSS = read('src/site.css');
const BLOG_CSS = read('src/blog.css');
const AVATAR_REMOTE = 'https://avatars.githubusercontent.com/u/93205912?v=4';
let AVATAR = AVATAR_REMOTE; // replaced by a self-hosted copy at build time when GitHub is reachable

const UI = {
  pt: {
    locale: 'pt-BR', og: 'pt_BR', home: '/', blog: '/blog/', other: 'en',
    blogTitle: 'Blog — Gabriel Buarque', blogH1: 'Notas da <em>semana</em>',
    blogDesc: 'Notas semanais de Gabriel Buarque sobre automações, agentes de IA e engenharia de software: o que construí, quebrei e aprendi na prática.',
    all: 'Todos', min: 'min de leitura', listen: 'Ouça na minha voz', toc: 'Neste artigo', tldr: 'Em 30 segundos',
    share: 'Compartilhe este artigo', shareProfile: 'Compartilhe este perfil', copy: 'Copiar link', more: 'Mais opções', copied: 'Link copiado',
    bio: 'Software Architect, AI Builder e CTO da IndiqAI. Escrevo sobre o que construo toda semana com automações e IA.',
    aboutLink: 'Sobre mim', related: 'Continue lendo', prev: 'Anterior', next: 'Próximo', rss: 'RSS', allPosts: 'Ver todos os artigos',
    empty: '<b>O primeiro artigo sai em breve.</b> Assine o <a href="/blog/feed.xml" style="color:var(--accent);text-decoration:underline">RSS</a> para receber quando sair.',
    updated: 'Atualizado em', skip: 'Pular para o conteúdo', projects: 'Projetos', contact: 'Contato', crumbsHome: 'Início',
    callout: { tip: 'Dica', info: 'Nota', note: 'Nota', warn: 'Atenção', success: 'Resultado' },
    play: 'Assistir', xpost: 'Ver post no X', open: 'Abrir', readIn: 'Read in English', langName: 'Português',
    nf: 'Página não encontrada', nfText: 'O link pode ter mudado. Volte para o início ou veja o blog.'
  },
  en: {
    locale: 'en-US', og: 'en_US', home: '/en/', blog: '/en/blog/', other: 'pt',
    blogTitle: 'Blog — Gabriel Buarque', blogH1: 'Notes from the <em>week</em>',
    blogDesc: 'Weekly notes by Gabriel Buarque on automation, AI agents and software engineering: what I built, broke and learned in practice.',
    all: 'All', min: 'min read', listen: 'Listen in my voice', toc: 'In this article', tldr: 'In 30 seconds',
    share: 'Share this article', shareProfile: 'Share this profile', copy: 'Copy link', more: 'More options', copied: 'Link copied',
    bio: 'Software Architect, AI Builder and CTO at IndiqAI. I write about what I build every week with automation and AI.',
    aboutLink: 'About me', related: 'Keep reading', prev: 'Previous', next: 'Next', rss: 'RSS', allPosts: 'See all articles',
    empty: '<b>The first article is coming soon.</b> Subscribe to the <a href="/blog/feed.xml" style="color:var(--accent);text-decoration:underline">RSS feed</a> to get it.',
    updated: 'Updated', skip: 'Skip to content', projects: 'Projects', contact: 'Contact', crumbsHome: 'Home',
    callout: { tip: 'Tip', info: 'Note', note: 'Note', warn: 'Heads up', success: 'Result' },
    play: 'Play', xpost: 'View post on X', open: 'Open', readIn: 'Ler em português', langName: 'English',
    nf: 'Page not found', nfText: 'The link may have changed. Go back home or read the blog.'
  }
};
const fmtDate = (d, lang) => new Date(d + 'T12:00:00Z').toLocaleDateString(UI[lang].locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtShort = (d, lang) => new Date(d + 'T12:00:00Z').toLocaleDateString(UI[lang].locale, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

// ---------- structured data ----------
const PERSON = {
  '@type': 'Person', '@id': `${SITE}/#person`, name: 'Gabriel Buarque', url: `${SITE}/`, image: AVATAR,
  email: 'mailto:buarquegabriel01@gmail.com',
  jobTitle: ['Software Architect', 'AI Builder', 'Automation Architect', 'CTO'],
  description: 'Software Architect, AI Builder and co-founder/CTO of IndiqAI. Builds software, AI agents, agent memory systems and automations.',
  worksFor: [
    { '@type': 'Organization', name: 'IndiqAI', url: 'https://indiqai.com/', description: 'SaaS loyalty and referral-marketing platform' },
    { '@type': 'Organization', name: 'Volanos' }
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidade Federal do Rio Grande do Norte (UFRN)' },
    { '@type': 'CollegeOrUniversity', name: 'Descomplica Faculdade Digital' }
  ],
  homeLocation: { '@type': 'Place', name: 'Natal, RN, Brasil' },
  knowsLanguage: ['pt-BR', 'en'],
  knowsAbout: ['Software architecture', 'AI agents', 'Model Context Protocol (MCP)', 'Retrieval-augmented generation (RAG)', 'Context engineering', 'Persistent memory for AI agents', 'Automation', 'n8n', 'Dify', 'Python', 'TypeScript', 'FastAPI', 'React', 'PostgreSQL', 'Supabase', 'Docker', 'Multitenant SaaS', 'Row Level Security', 'DevSecOps', 'Privacy-enhancing technologies'],
  award: ['4th place (international), IEEE/I3E Entrepreneurship Challenge LATAM — IndiqAI', '2nd place (regional), IEEE/I3E — IndiqAI', '16th of 60 selected, Startup Nordeste 3 — ChatCont'],
  sameAs: ['https://github.com/gabrielbuarque', 'https://br.linkedin.com/in/gabrielbuarque-cto']
};
const WEBSITE = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Gabriel Buarque', inLanguage: ['pt-BR', 'en'], publisher: { '@id': `${SITE}/#person` } };
const ld = obj => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...obj }).replace(/</g, '\\u003c')}</script>`;

// ---------- shared fragments ----------
const shareHTML = (url, text, lang, label) => {
  const U = UI[lang], u = encodeURIComponent(url), t = encodeURIComponent(text);
  return `<div class="share"><span>${label}</span><div class="share-btns">
<a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">${ICONS.linkedin}</a>
<a href="https://twitter.com/intent/tweet?url=${u}&amp;text=${t}" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" title="X">${ICONS.x}</a>
<a href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">${ICONS.whatsapp}</a>
<a href="mailto:?subject=${t}&amp;body=${u}" aria-label="E-mail" title="E-mail">${ICONS.email}</a>
<button type="button" id="copy-link" data-url="${esc(url)}" aria-label="${U.copy}" title="${U.copy}">${ICONS.copy}</button>
<button type="button" id="native-share" hidden aria-label="${U.more}" title="${U.more}">${ICONS.share}</button>
</div><span class="copied" id="copied" role="status" data-msg="${U.copied}"></span></div>`;
};

const header = (lang, switchTo) => {
  const U = UI[lang], other = U.other;
  const sw = l => `<a href="${switchTo[l]}" hreflang="${l === 'pt' ? 'pt-BR' : 'en'}" lang="${l === 'pt' ? 'pt-BR' : 'en'}" title="${UI[l].langName}"${l === lang ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a>`;
  return `<header><div class="wrap nav">
<a href="${U.home}" class="logo" aria-label="Gabriel Buarque">gb<i>/</i>nnex.us</a>
<nav aria-label="Menu"><a href="${U.home}#projetos">${U.projects}</a><a href="${U.blog}" class="keep">Blog</a><a href="${U.home}#contato">${U.contact}</a>
<span class="lang">${sw('pt')}${sw('en')}</span></nav></div></header>`;
};
const footer = () => `<footer><div class="wrap foot"><span>Gabriel Buarque · Natal, RN</span><span><a href="/blog/feed.xml">RSS</a> · <a href="/llms.txt">llms.txt</a> · nnex.us · © ${TODAY.slice(0, 4)}</span></div></footer>`;

function page({ lang, title, desc, url, alternates = {}, image = `${SITE}/og.png`, imageAlt = title, type = 'website', jsonld = '', css = '', body, script = '', extraHead = '' }) {
  const U = UI[lang];
  const alt = Object.entries(alternates).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${href}">`).join('');
  return `<!DOCTYPE html><html lang="${U.locale === 'pt-BR' ? 'pt-BR' : 'en'}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0e0e0d"><meta name="color-scheme" content="dark">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="author" content="Gabriel Buarque">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"><link rel="canonical" href="${url}">${alt}
<link rel="alternate" type="application/rss+xml" title="Blog — Gabriel Buarque" href="${SITE}/blog/feed.xml"><link rel="alternate" type="text/markdown" title="llms.txt" href="/llms.txt">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="Gabriel Buarque"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(imageAlt)}"><meta property="og:locale" content="${U.og}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${image}">
${extraHead}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
${jsonld}
<style>${SITE_CSS}${css}</style></head><body>
<a class="skip" href="#conteudo">${U.skip}</a>${body}${footer()}${script}</body></html>`;
}

const postRow = (p, lang, h = 'h2') => `<li class="post-row" data-tags="${esc(p.tags.map(slugify).join(','))}"><a href="${p.path}">
<time datetime="${p.date}">${fmtShort(p.date, lang)}</time>
<div><${h} lang="${p.lang === 'pt' ? 'pt-BR' : 'en'}">${esc(p.title)}</${h}><p lang="${p.lang === 'pt' ? 'pt-BR' : 'en'}">${esc(p.description)}</p>${p.tags.length ? `<div class="tags">${p.tags.map(t => `<span class="tag-chip">${esc(t)}</span>`).join('')}</div>` : ''}</div>
<span class="rt">${p.minutes} min</span></a></li>`;

// ---------- posts ----------
async function loadPosts() {
  const dir = path.join(ROOT, 'content/blog');
  if (!fs.existsSync(dir)) return [];
  const cache = new Map();
  const posts = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const isTemplate = file.startsWith('_');
    if ((data.draft || isTemplate) && !DRAFTS) continue;
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date || TODAY).slice(0, 10);
    const updated = data.updated ? (data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated).slice(0, 10)) : null;
    const slug = slugify(data.slug || file.replace(/^_/, '').replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    const lang = data.lang === 'en' ? 'en' : 'pt';
    for (const k of ['title', 'description']) if (!data[k]) throw new Error(`${file}: frontmatter "${k}" is required`);
    await prefetch(content, cache);
    const r = render(content, { cache, root: ROOT, L: UI[lang] });
    posts.push({
      file, slug, lang, date, updated, raw: content, ...r,
      title: String(data.title), description: String(data.description),
      tags: (data.tags || []).map(String), summary: (data.summary || []).map(String),
      cover: data.cover || null, coverAlt: data.cover_alt || data.title, coverCaption: data.cover_caption || '',
      audio: data.audio || null, translation: data.translation ? slugify(data.translation) : null,
      draft: !!data.draft || isTemplate,
      path: `/blog/${slug}/`, url: `${SITE}/blog/${slug}/`, image: `${SITE}/blog/${slug}/og.png`
    });
  }
  const slugs = new Set();
  for (const p of posts) { if (slugs.has(p.slug)) throw new Error(`duplicate slug: ${p.slug}`); slugs.add(p.slug); }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

async function buildPost(p, posts) {
  const lang = p.lang, U = UI[lang];
  const tr = p.translation && posts.find(x => x.slug === p.translation);
  const switchTo = { pt: lang === 'pt' ? p.path : (tr ? tr.path : '/blog/'), en: lang === 'en' ? p.path : (tr ? tr.path : '/en/blog/') };
  const alternates = tr ? { [lang === 'pt' ? 'pt-BR' : 'en']: p.url, [tr.lang === 'pt' ? 'pt-BR' : 'en']: tr.url } : {};
  const idx = posts.indexOf(p), newer = posts[idx - 1], older = posts[idx + 1];
  const related = posts.filter(x => x !== p && x.tags.some(t => p.tags.includes(t))).slice(0, 3);
  const more = (related.length ? related : posts.filter(x => x !== p).slice(0, 3));
  const blogHome = lang === 'en' ? '/en/blog/' : '/blog/';

  const jsonld = ld({
    '@graph': [
      {
        '@type': 'BlogPosting', '@id': `${p.url}#article`, mainEntityOfPage: p.url, url: p.url, headline: p.title, description: p.description,
        datePublished: p.date, dateModified: p.updated || p.date, inLanguage: lang === 'pt' ? 'pt-BR' : 'en',
        author: { '@id': `${SITE}/#person` }, publisher: { '@id': `${SITE}/#person` }, image: p.image,
        keywords: p.tags.join(', '), wordCount: p.words, timeRequired: `PT${p.minutes}M`, isPartOf: { '@id': `${SITE}/blog/#blog` },
        ...(p.audio ? { audio: { '@type': 'AudioObject', contentUrl: new URL(p.audio, SITE).href, name: p.title, inLanguage: lang === 'pt' ? 'pt-BR' : 'en' } } : {}),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.article-head h1', '.article-head .dek', '.tldr'] }
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: U.crumbsHome, item: `${SITE}${U.home}` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}${blogHome}` },
        { '@type': 'ListItem', position: 3, name: p.title, item: p.url }] },
      PERSON
    ]
  });

  const body = `<div class="progress" aria-hidden="true"></div>${header(lang, switchTo)}
<main id="conteudo"><article lang="${lang === 'pt' ? 'pt-BR' : 'en'}">
<div class="wrap"><header class="article-head">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${U.home}">${U.crumbsHome}</a><span aria-hidden="true">/</span><a href="${blogHome}">Blog</a>${p.tags[0] ? `<span aria-hidden="true">/</span><a href="${blogHome}?tag=${encodeURIComponent(slugify(p.tags[0]))}">${esc(p.tags[0])}</a>` : ''}</nav>
<h1>${esc(p.title)}</h1><p class="dek">${esc(p.description)}</p>
<div class="meta-row"><span class="byline"><img src="${AVATAR_SMALL}" alt="" width="28" height="28">Gabriel Buarque</span>
<time datetime="${p.date}">${fmtDate(p.date, lang)}</time><span>${p.minutes} ${U.min}</span>${p.updated ? `<span>${U.updated} <time datetime="${p.updated}">${fmtDate(p.updated, lang)}</time></span>` : ''}${tr ? `<a href="${tr.path}" lang="${tr.lang === 'pt' ? 'pt-BR' : 'en'}" style="color:var(--accent)">${U.readIn} →</a>` : ''}</div>
${p.audio ? `<div class="listen"><span>▶ ${U.listen}</span><audio controls preload="none" src="${esc(p.audio)}"></audio></div>` : ''}
</header>
${p.cover ? `<figure class="cover"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" fetchpriority="high" decoding="async">${p.coverCaption ? `<figcaption>${esc(p.coverCaption)}</figcaption>` : ''}</figure>` : ''}
<div class="article-grid"><div>
${p.summary.length ? `<aside class="tldr"><b>${U.tldr}</b><ul>${p.summary.map(s => `<li>${esc(s)}</li>`).join('')}</ul></aside>` : ''}
<div class="prose">${p.html}</div>
<div class="post-foot">
${p.tags.length ? `<div class="tags" style="margin-top:40px">${p.tags.map(t => `<a class="tag-chip" href="${blogHome}?tag=${encodeURIComponent(slugify(t))}">#${esc(t)}</a>`).join('')}</div>` : ''}
${shareHTML(p.url, p.title, lang, U.share)}
<div class="author"><img src="${AVATAR_SMALL}" alt="Gabriel Buarque" width="64" height="64" loading="lazy"><div><b>Gabriel Buarque</b><p>${U.bio} <a href="${U.home}">${U.aboutLink} →</a></p></div></div>
</div></div>
${p.toc.length >= 3 ? `<nav class="toc" aria-label="${U.toc}"><b>${U.toc}</b><ol>${p.toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : '<div></div>'}
</div></div></article>
${more.length ? `<section class="more"><div class="wrap"><h2>${U.related}</h2><ul class="posts">${more.map(x => postRow(x, lang, 'h3')).join('')}</ul>
<div class="pn">${newer ? `<a href="${newer.path}" class="next" style="grid-column:2"><small>${U.next} →</small>${esc(newer.title)}</a>` : ''}${older ? `<a href="${older.path}" style="grid-column:1;grid-row:1"><small>← ${U.prev}</small>${esc(older.title)}</a>` : ''}</div></div></section>` : ''}
</main>`;

  write(`blog/${p.slug}/index.html`, await page({
    lang, title: `${p.title} — Gabriel Buarque`, desc: p.description, url: p.url, alternates, image: p.image, imageAlt: p.title, type: 'article', jsonld, css: BLOG_CSS, body,
    script: `<script>${BLOG_JS}</script>`,
    extraHead: `<meta property="article:published_time" content="${p.date}"><meta property="article:modified_time" content="${p.updated || p.date}"><meta property="article:author" content="${SITE}/">${p.tags.map(t => `<meta property="article:tag" content="${esc(t)}">`).join('')}`
  }));
  write(`blog/${p.slug}.md`, `# ${p.title}\n\n> ${p.description}\n\nAuthor: Gabriel Buarque · Published: ${p.date}${p.updated ? ` · Updated: ${p.updated}` : ''} · URL: ${p.url}\n\n${p.summary.length ? p.summary.map(s => `- ${s}`).join('\n') + '\n\n' : ''}${p.raw.trim()}\n`);
  write(`blog/${p.slug}/og.png`, await postOG({ title: p.title, date: fmtShort(p.date, lang), minutes: p.minutes, tags: p.tags, L: { min: lang === 'pt' ? 'min' : 'min' } }));
}

async function buildBlogIndex(lang, posts) {
  const U = UI[lang], url = `${SITE}${U.blog}`;
  const tags = [...new Set(posts.flatMap(p => p.tags))];
  const body = `${header(lang, { pt: '/blog/', en: '/en/blog/' })}<main id="conteudo">
<div class="wrap"><div class="blog-hero"><div class="tag">Blog · ${lang === 'pt' ? 'automações · IA · engenharia' : 'automation · AI · engineering'}</div>
<h1>${U.blogH1}</h1><p>${U.blogDesc}</p>
<div class="row"><a class="btn" href="/blog/feed.xml">${U.rss} ↗</a></div></div>
${posts.length ? `${tags.length > 1 ? `<div class="filters" role="group" aria-label="Tags"><button type="button" data-tag="*" aria-pressed="true">${U.all}</button>${tags.map(t => `<button type="button" data-tag="${esc(slugify(t))}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>` : ''}
<ul class="posts">${posts.map(p => postRow(p, lang)).join('')}</ul>` : `<div class="empty">${U.empty}</div>`}
<div style="height:96px"></div></div></main>`;
  const jsonld = ld({ '@graph': [
    { '@type': 'Blog', '@id': `${SITE}/blog/#blog`, url, name: U.blogTitle, description: U.blogDesc, inLanguage: lang === 'pt' ? 'pt-BR' : 'en', author: { '@id': `${SITE}/#person` },
      blogPost: posts.slice(0, 20).map(p => ({ '@type': 'BlogPosting', headline: p.title, url: p.url, datePublished: p.date, description: p.description })) },
    PERSON] });
  write(`${U.blog.slice(1)}index.html`, await page({
    lang, title: U.blogTitle, desc: U.blogDesc, url, alternates: { 'pt-BR': `${SITE}/blog/`, en: `${SITE}/en/blog/`, 'x-default': `${SITE}/blog/` },
    jsonld, css: BLOG_CSS, body, script: `<script>${BLOG_JS}</script>`
  }));
}

// ---------- home ----------
async function buildHome(lang, posts) {
  const U = UI[lang], url = `${SITE}${U.home}`;
  const shareText = 'Gabriel Buarque — Software Architect · AI Builder · CTO';
  const latest = posts.slice(0, 3);
  const blogHome = latest.length
    ? `<ul class="posts home-posts">${latest.map(p => postRow(p, lang, 'h3')).join('')}</ul><div class="home-blog-foot"><a class="btn" href="${U.blog}">${U.allPosts} →</a><a class="btn" href="/blog/feed.xml">RSS ↗</a></div>`
    : `<div class="empty">${U.empty}</div>`;
  let html = read('src/index.html')
    .replaceAll('%CSS%', SITE_CSS + BLOG_CSS.slice(BLOG_CSS.indexOf('/* ---------- blog index ---------- */'), BLOG_CSS.indexOf('/* ---------- article ---------- */')) + '.home-posts .post-row a{grid-template-columns:140px 1fr auto}.home-blog-foot{margin-top:28px;display:flex;gap:12px;flex-wrap:wrap}.tags{display:flex;gap:6px;flex-wrap:wrap}.tag-chip{font-family:var(--mono);font-size:11px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:3px 10px}@media (max-width:700px){.post-row a,.home-posts .post-row a{grid-template-columns:1fr;gap:6px}.post-row .rt{display:none}}')
    .replaceAll('%BLOG_HOME%', blogHome)
    .replaceAll('%BLOG_URL%', U.blog)
    .replaceAll('%SHARE%', shareHTML(url, shareText, lang, U.shareProfile))
    .replaceAll('%CUR_PT%', lang === 'pt' ? ' aria-current="page"' : '')
    .replaceAll('%CUR_EN%', lang === 'en' ? ' aria-current="page"' : '')
    .replaceAll('%URLENC%', encodeURIComponent(url))
    .replaceAll('%TEXTENC%', encodeURIComponent(shareText))
    .replaceAll('%URL%', url)
    .replace('%HERO_SVG%', HERO_SVG)
    .replaceAll('%NODES%', GRAPH.pos.length).replaceAll('%EDGES%', GRAPH.edges.length)
    .replace('%SCRIPTS%', `<script>${APP_JS}</script>${process.env.NOGRAPH ? "" : `<script>${GRAPH_JS}</script>`}`);

  const doc = parse(html, { comment: true });
  if (lang === 'en') {
    doc.querySelector('html').setAttribute('lang', 'en');
    for (const el of doc.querySelectorAll('[data-i18n]')) { const v = EN[el.getAttribute('data-i18n')]; if (v != null) el.set_content(v); }
    for (const el of doc.querySelectorAll('[data-i18n-attr]')) {
      for (const pair of el.getAttribute('data-i18n-attr').split(';')) { const [attr, key] = pair.split(':'); if (EN[key] != null) el.setAttribute(attr, EN[key].replace(/&amp;/g, '&')); }
    }
  }
  doc.querySelectorAll('[data-i18n]').forEach(el => el.removeAttribute('data-i18n'));
  doc.querySelectorAll('[data-i18n-attr]').forEach(el => el.removeAttribute('data-i18n-attr'));

  const text = el => el.textContent.replace(/\s+/g, ' ').trim();
  const faq = doc.querySelectorAll('.faq details').map(d => ({ '@type': 'Question', name: text(d.querySelector('summary')), acceptedAnswer: { '@type': 'Answer', text: text(d.querySelector('p')) } }));
  const jsonld = ld({ '@graph': [
    WEBSITE,
    { '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: doc.querySelector('title').textContent, inLanguage: lang === 'pt' ? 'pt-BR' : 'en', isPartOf: { '@id': `${SITE}/#website` }, mainEntity: { '@id': `${SITE}/#person` }, dateModified: TODAY },
    PERSON,
    { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: lang === 'pt' ? 'pt-BR' : 'en', mainEntity: faq }
  ] });
  html = doc.toString().replace('<!--JSONLD-->', jsonld);
  write(`${U.home.slice(1)}index.html`, html);
}

// ---------- SEO / GEO files ----------
function seoFiles(posts) {
  const urls = [
    { loc: `${SITE}/`, alt: { 'pt-BR': `${SITE}/`, en: `${SITE}/en/`, 'x-default': `${SITE}/` }, lastmod: TODAY, pr: '1.0' },
    { loc: `${SITE}/en/`, alt: { 'pt-BR': `${SITE}/`, en: `${SITE}/en/`, 'x-default': `${SITE}/` }, lastmod: TODAY, pr: '0.9' },
    { loc: `${SITE}/blog/`, alt: { 'pt-BR': `${SITE}/blog/`, en: `${SITE}/en/blog/`, 'x-default': `${SITE}/blog/` }, lastmod: posts[0]?.date || TODAY, pr: '0.8' },
    { loc: `${SITE}/en/blog/`, alt: { 'pt-BR': `${SITE}/blog/`, en: `${SITE}/en/blog/`, 'x-default': `${SITE}/blog/` }, lastmod: posts[0]?.date || TODAY, pr: '0.6' },
    ...posts.map(p => ({ loc: p.url, lastmod: p.updated || p.date, pr: '0.7' }))
  ];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(u => `  <url><loc>${u.loc}</loc>${u.alt ? Object.entries(u.alt).map(([l, h]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${h}"/>`).join('') : ''}<lastmod>${u.lastmod}</lastmod><priority>${u.pr}</priority></url>`).join('\n')}\n</urlset>\n`);

  const x = s => esc(s);
  write('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n<title>Blog — Gabriel Buarque</title>\n<link>${SITE}/blog/</link>\n<atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>\n<description>${x(UI.pt.blogDesc)}</description>\n<language>pt-BR</language>\n<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${posts.slice(0, 30).map(p => `<item><title>${x(p.title)}</title><link>${p.url}</link><guid isPermaLink="true">${p.url}</guid><pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate><description>${x(p.description)}</description>${p.tags.map(t => `<category>${x(t)}</category>`).join('')}<content:encoded><![CDATA[${p.html.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded></item>`).join('\n')}\n</channel>\n</rss>\n`);

  const postList = posts.length ? posts.map(p => `- [${p.title}](${SITE}/blog/${p.slug}.md): ${p.description} (${p.date}, ${p.lang === 'pt' ? 'pt-BR' : 'en'})`).join('\n') : '- No posts yet.';
  const llms = read('content/llms.md').replace('{{POSTS}}', postList).replace('{{UPDATED}}', TODAY);
  write('llms.txt', llms);
  write('llms-full.txt', `${read('content/profile.md').trim()}\n\n---\n\n# Blog posts\n\n${posts.map(p => `## ${p.title}\n\nURL: ${p.url} · Published: ${p.date} · Language: ${p.lang}\n\n> ${p.description}\n\n${p.raw.trim()}`).join('\n\n---\n\n') || 'No posts yet.'}\n`);
}

// ---------- icons ----------
function icons() {
  const svg = read('public/favicon.svg');
  const opts = w => ({ fitTo: { mode: 'width', value: w }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Geist Mono' } });
  for (const [name, w] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) write(name, new Resvg(svg, opts(w)).render().asPng());
}

// ---------- run ----------
let APP_JS, GRAPH_JS, BLOG_JS, GRAPH, HERO_SVG;
const t0 = Date.now();
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });
if (fs.existsSync(path.join(ROOT, 'content/blog/media'))) fs.cpSync(path.join(ROOT, 'content/blog/media'), path.join(OUT, 'blog/media'), { recursive: true });
APP_JS = (await minifyJS(read('src/app.js'))).code;
GRAPH = memoryGraph();
GRAPH_JS = (await minifyJS(read('src/graph.js').replace('__GRAPH__', JSON.stringify(GRAPH)))).code;
HERO_SVG = graphSVG({ attrs: ' class="hero-static" aria-hidden="true" focusable="false"' });
BLOG_JS = (await minifyJS(read('src/blog.js'))).code;

let AVATAR_SMALL = AVATAR_REMOTE + '&s=128';
try {
  const r = await fetch(AVATAR_REMOTE + '&s=128');
  if (r.ok) {
    const img = Buffer.from(await r.arrayBuffer()), ext = img[0] === 0xff ? 'jpg' : 'png';
    write(`avatar.${ext}`, img); AVATAR_SMALL = `/avatar.${ext}`; AVATAR = SITE + AVATAR_SMALL; PERSON.image = AVATAR;
  }
} catch {}
const posts = await loadPosts();
for (const p of posts) await buildPost(p, posts);
await buildBlogIndex('pt', posts);
await buildBlogIndex('en', posts);
await buildHome('pt', posts);
await buildHome('en', posts);
write('404.html', page({ lang: 'pt', title: '404 — Gabriel Buarque', desc: UI.pt.nfText, url: `${SITE}/404`, body: `${header('pt', { pt: '/', en: '/en/' })}<main id="conteudo"><div class="wrap blog-hero" style="min-height:60vh"><div class="tag">404</div><h1>${UI.pt.nf}</h1><p>${UI.pt.nfText}<br><span lang="en">${UI.en.nfText}</span></p><div class="row"><a class="btn primary" href="/">Início</a><a class="btn" href="/blog/">Blog</a><a class="btn" href="/en/" lang="en">English</a></div></div></main>`, css: BLOG_CSS }).replace('content="index, follow, max-image-preview:large, max-snippet:-1"', 'content="noindex"'));
write('og.png', await homeOG());
icons();
seoFiles(posts);

// minify every html page
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(OUT).filter(f => f.endsWith('.html'))) {
  fs.writeFileSync(f, await minify(fs.readFileSync(f, 'utf8'), { collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: false, removeRedundantAttributes: true, useShortDoctype: true, keepClosingSlash: false }));
}
console.log(`built ${posts.length} post(s)${DRAFTS ? ' (drafts included)' : ''} in ${Date.now() - t0}ms → dist/`);
