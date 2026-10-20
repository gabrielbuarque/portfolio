// Social share images (1200x630 PNG) rendered at build time with satori + resvg.
import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const F = p => fs.readFileSync(new URL(`../assets/og-fonts/${p}`, import.meta.url));
const fonts = [
  { name: 'Geist', data: F('geist-400.ttf'), weight: 400, style: 'normal' },
  { name: 'Geist', data: F('geist-600.ttf'), weight: 600, style: 'normal' },
  { name: 'Geist Mono', data: F('geist-mono-400.ttf'), weight: 400, style: 'normal' },
  { name: 'Instrument Serif', data: F('instrument-serif-italic.ttf'), weight: 400, style: 'italic' }
];
export const fontFiles = ['geist-600.ttf', 'geist-mono-400.ttf'].map(f => new URL(`../assets/og-fonts/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const h = (type, style, ...children) => ({ type, props: { style: { display: 'flex', ...style }, children: children.flat().filter(c => c !== null && c !== false) } });

// the same seeded memory graph as the hero, projected to 2D
function graphSVG(w, hgt, scale) {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 240, pts = [], golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i, R = 1.75 * (0.62 + 0.42 * rnd());
    pts.push([Math.cos(th) * r * R, y * R * 0.92, Math.sin(th) * r * R]);
  }
  const hubs = new Set(); while (hubs.size < 14) hubs.add(Math.floor(rnd() * N));
  const a = .5, b = .35, P = pts.map(([x, y, z]) => { const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a); const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b); const k = 6 / (6 - z2); return [w / 2 + x1 * k * scale, hgt / 2 + y2 * k * scale, z2]; });
  let lines = '', dots = '';
  const seen = new Set();
  for (let i = 0; i < N; i++) {
    const near = pts.map((p, j) => [j, (p[0] - pts[i][0]) ** 2 + (p[1] - pts[i][1]) ** 2 + (p[2] - pts[i][2]) ** 2]).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]);
    for (let m = 0; m < (hubs.has(i) ? 6 : 3); m++) {
      const [j, d] = near[m]; if (d > .9) break; const key = Math.min(i, j) + '-' + Math.max(i, j); if (seen.has(key)) continue; seen.add(key);
      const hot = hubs.has(i) || hubs.has(j);
      lines += `<line x1="${P[i][0].toFixed(1)}" y1="${P[i][1].toFixed(1)}" x2="${P[j][0].toFixed(1)}" y2="${P[j][1].toFixed(1)}" stroke="${hot ? '#f28b54' : '#6b5e52'}" stroke-opacity="${hot ? .45 : .35}" stroke-width="1"/>`;
    }
  }
  P.forEach(([x, y], i) => { dots += hubs.has(i) ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#f28b54"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#f28b54" fill-opacity=".18"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#f2f0ea" fill-opacity=".75"/>`; });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}"><defs><radialGradient id="g"><stop offset="0" stop-color="#f28b54" stop-opacity=".35"/><stop offset="1" stop-color="#f28b54" stop-opacity="0"/></radialGradient></defs><circle cx="${w / 2}" cy="${hgt / 2}" r="${scale * 1.1}" fill="url(#g)"/>${lines}${dots}</svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}
const BRAIN = (() => {
  const b64 = fs.readFileSync(new URL('../assets/brand/brain.png', import.meta.url)).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512"><image width="512" height="512" xlink:href="data:image/png;base64,${b64}"/></svg>`;
  return 'data:image/png;base64,' + new Resvg(svg, { fitTo: { mode: 'width', value: 160 } }).render().asPng().toString('base64');
})();
const brain = size => ({ type: 'img', props: { src: BRAIN, width: size, height: size, style: { width: size, height: size } } });
const GRAPH_HOME = graphSVG(640, 640, 150);
const GRAPH_POST = graphSVG(520, 520, 120);

async function png(el) {
  const svg = await satori(el, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

const base = { width: 1200, height: 630, background: '#0e0e0d', color: '#f2f0ea', fontFamily: 'Geist', position: 'relative', overflow: 'hidden' };

export function homeOG() {
  return png(h('div', base,
    { type: 'img', props: { src: GRAPH_HOME, width: 640, height: 640, style: { position: 'absolute', right: -60, top: -5 } } },
    h('div', { flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', width: '100%', height: '100%' },
      h('div', { fontFamily: 'Geist Mono', fontSize: 22, color: '#f28b54', letterSpacing: 2 }, 'SOFTWARE ARCHITECT · AI BUILDER · CTO'),
      h('div', { flexDirection: 'column' },
        h('div', { fontSize: 112, lineHeight: 1, letterSpacing: -5 }, 'Gabriel'),
        h('div', { fontSize: 124, lineHeight: 1, fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#f28b54', letterSpacing: -2 }, 'Buarque'),
        h('div', { marginTop: 28, fontSize: 30, color: '#c9c6be', maxWidth: 620, lineHeight: 1.3 }, 'Software, AI agents & automations that solve real problems.')
      ),
      h('div', { alignItems: 'center', gap: 12, fontFamily: 'Geist Mono', fontSize: 24, color: '#c9c6be' }, brain(40), 'gb/nnex.us')
    )
  ));
}

export function postOG({ title, date, minutes, tags = [], L }) {
  const size = title.length > 80 ? 52 : title.length > 50 ? 60 : 70;
  return png(h('div', base,
    { type: 'img', props: { src: GRAPH_POST, width: 520, height: 520, style: { position: 'absolute', right: -150, top: 55, opacity: .9 } } },
    h('div', { position: 'absolute', left: 0, top: 0, width: 8, height: 630, background: '#f28b54' }),
    h('div', { flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px', width: '100%', height: '100%' },
      h('div', { fontFamily: 'Geist Mono', fontSize: 22, color: '#f28b54', letterSpacing: 1 }, 'gb/nnex.us/blog'),
      h('div', { flexDirection: 'column', maxWidth: 860 },
        h('div', { fontSize: size, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2 }, title),
        tags.length ? h('div', { marginTop: 26, gap: 10 }, ...tags.slice(0, 3).map(t => h('div', { fontFamily: 'Geist Mono', fontSize: 20, color: '#c9c6be', border: '1px solid #3a3a35', borderRadius: 999, padding: '6px 16px' }, t))) : null
      ),
      h('div', { justifyContent: 'space-between', alignItems: 'center', fontSize: 24 },
        h('div', { alignItems: 'center', gap: 14 },
          brain(48),
          h('div', {}, 'Gabriel Buarque')
        ),
        h('div', { fontFamily: 'Geist Mono', fontSize: 20, color: '#9a978f' }, `${date} · ${minutes} ${L.min}`)
      )
    )
  ));
}
