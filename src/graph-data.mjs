// The memory graph is deterministic, so it is computed once at build time:
// - inlined into the hero script (no work in the browser),
// - drawn as a static SVG (first paint, and the fallback without a GPU),
// - reused by the social share images.
const round = v => Math.round(v * 1000) / 1000;

export function memoryGraph() {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 240, HUBS = 14, pos = [], golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i, R = 1.75 * (0.62 + 0.42 * rnd());
    pos.push([round(Math.cos(th) * r * R), round(y * R * 0.92), round(Math.sin(th) * r * R)]);
  }
  const hubSet = new Set(); while (hubSet.size < HUBS) hubSet.add(Math.floor(rnd() * N));
  const hubs = [...hubSet];
  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const edges = [], seen = new Set();
  for (let i = 0; i < N; i++) {
    const near = []; for (let j = 0; j < N; j++) if (j !== i) near.push([j, d2(pos[i], pos[j])]);
    near.sort((a, b) => a[1] - b[1]);
    for (let m = 0; m < (hubSet.has(i) ? 6 : 3); m++) {
      const [j, dd] = near[m]; if (dd > 0.9) break;
      const key = Math.min(i, j) + '-' + Math.max(i, j); if (seen.has(key)) continue;
      seen.add(key); edges.push([i, j]);
    }
  }
  // core: icosahedron subdivided once, radius .55
  const t = (1 + Math.sqrt(5)) / 2;
  let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const mid = {}; const mp = (a, b) => { const k = Math.min(a, b) + '_' + Math.max(a, b); if (mid[k] == null) { V.push([(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2]); mid[k] = V.length - 1; } return mid[k]; };
  const F2 = []; F.forEach(([a, b, c]) => { const ab = mp(a, b), bc = mp(b, c), ca = mp(c, a); F2.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); });
  V = V.map(v => { const l = Math.hypot(...v); return v.map(x => round(x / l * .55)); });
  const ce = new Set(), coreEdges = [];
  F2.forEach(f => [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(([a, b]) => { const k = Math.min(a, b) + '_' + Math.max(a, b); if (!ce.has(k)) { ce.add(k); coreEdges.push([a, b]); } }));
  return { pos, hubs, edges, core: V, coreEdges };
}

// Projects the graph like the WebGL camera does on its first frame (rotation x = .25, camera z = 6.2, fov 42°).
export function graphSVG({ size = 640, rotX = .25, rotY = 0, camZ = 6.2, background = false, attrs = '' } = {}) {
  const g = memoryGraph();
  const t = 1 / Math.tan(21 * Math.PI / 180);
  const proj = ([x, y, z]) => {
    const x1 = x * Math.cos(rotY) + z * Math.sin(rotY), z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX), z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
    const w = camZ - z2;
    return [size / 2 + t * x1 / w * size / 2, size / 2 - t * y2 / w * size / 2, z2];
  };
  const P = g.pos.map(proj), C = g.core.map(proj), hub = new Set(g.hubs);
  const f = v => Math.round(v);
  const seg = (list, pts) => list.map(([a, b]) => `M${f(pts[a][0])} ${f(pts[a][1])}L${f(pts[b][0])} ${f(pts[b][1])}`).join('');
  const hot = g.edges.filter(([a, b]) => hub.has(a) || hub.has(b)), dim = g.edges.filter(([a, b]) => !hub.has(a) && !hub.has(b));
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"${attrs}>`;
  s += `<defs><radialGradient id="hg-g"><stop offset="0" stop-color="#f28b54" stop-opacity=".32"/><stop offset="1" stop-color="#f28b54" stop-opacity="0"/></radialGradient><radialGradient id="hg-h"><stop offset="0" stop-color="#ffb38a"/><stop offset=".35" stop-color="#f28b54" stop-opacity=".6"/><stop offset="1" stop-color="#f28b54" stop-opacity="0"/></radialGradient></defs>`;
  if (background) s += `<rect width="${size}" height="${size}" fill="#0e0e0d"/>`;
  s += `<circle cx="${size / 2}" cy="${size / 2}" r="${size * .2}" fill="url(#hg-g)"/>`;
  s += `<g fill="none" stroke-width="1"><path stroke="#6b5e52" stroke-opacity=".32" d="${seg(dim, P)}"/><path stroke="#f28b54" stroke-opacity=".4" d="${seg(hot, P)}"/><path stroke="#f28b54" stroke-opacity=".45" d="${seg(g.coreEdges, C)}"/></g>`;
  s += `<path fill="none" stroke="#f2f0ea" stroke-opacity=".8" stroke-width="3.2" stroke-linecap="round" d="${P.filter((_, i) => !hub.has(i)).map(([x, y]) => `M${f(x)} ${f(y)}h0`).join('')}"/>`;
  g.hubs.forEach(i => { s += `<circle cx="${f(P[i][0])}" cy="${f(P[i][1])}" r="9" fill="url(#hg-h)"/>`; });
  return s + '</svg>';
}
