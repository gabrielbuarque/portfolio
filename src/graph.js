// Hero 3D: a living memory graph (agents = orange hubs exchanging context along a knowledge network).
// Plain WebGL, no dependencies. The graph itself is computed at build time (src/graph-data.mjs) and
// a static SVG of it is shown from first paint; the animation takes over on the first interaction
// (or after a few seconds), and only on devices with a real GPU.
(() => {
  const canvas = document.getElementById('scene');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const G = __GRAPH__;
  let started = false;

  function start() {
    if (started) return; started = true;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) return;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    // software rasterizers would burn the CPU: keep the static picture there
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) { const l = gl.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); return; }

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec3 p;attribute vec4 c;attribute float s;uniform mat4 m;uniform float ps;varying vec4 vc;void main(){vec4 q=m*vec4(p,1.0);gl_Position=q;gl_PointSize=s*ps/q.w;vc=c;}'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec4 vc;uniform float pt;uniform float k;void main(){float a=1.0;if(pt>0.5){float d=length(gl_PointCoord-0.5)*2.0;a=pow(max(0.0,1.0-d),1.7);}float al=vc.a*a*k;gl_FragColor=vec4(vc.rgb*al,al);}'));
    gl.linkProgram(prog); gl.useProgram(prog);
    const A = { p: gl.getAttribLocation(prog, 'p'), c: gl.getAttribLocation(prog, 'c'), s: gl.getAttribLocation(prog, 's') };
    const U = { m: gl.getUniformLocation(prog, 'm'), ps: gl.getUniformLocation(prog, 'ps'), pt: gl.getUniformLocation(prog, 'pt'), k: gl.getUniformLocation(prog, 'k') };
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.disable(gl.DEPTH_TEST);

    // column-major mat4 helpers
    const mul = (a, b) => { const o = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s; } return o; };
    const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov / 2); return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]); };
    const rx = a => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); };
    const ry = a => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); };
    const rz = a => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); };
    const tr = (x, y, z, k) => new Float32Array([k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, x, y, z, 1]);

    const pos = G.pos, edges = G.edges, hubs = new Set(G.hubs), N = pos.length;
    const adj = Array.from({ length: N }, () => []); edges.forEach(([a, b], e) => { adj[a].push(e); adj[b].push(e); });
    const ACC = [0.949, 0.545, 0.329], WARM = [0.949, 0.941, 0.918], DIM = [0.42, 0.37, 0.32], HOT = [1, 0.70, 0.54];
    // interleaved buffers: x y z r g b a size
    const buf = items => { const out = []; items.forEach(([p, c, a, s]) => out.push(p[0], p[1], p[2], c[0], c[1], c[2], a, s)); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.STATIC_DRAW); return { b, n: items.length }; };
    const lines = buf(edges.flatMap(([a, b]) => { const c = hubs.has(a) || hubs.has(b) ? ACC : DIM; return [[pos[a], c, .22, 0], [pos[b], c, .22, 0]]; }));
    const core = buf(G.coreEdges.flatMap(([a, b]) => [[G.core[a], ACC, .3, 0], [G.core[b], ACC, .3, 0]]));
    const ring = []; for (let i = 0; i < 140; i++) { const a = i / 140 * Math.PI * 2; ring.push([[Math.cos(a) * 2.45, 0, Math.sin(a) * 2.45], [.55, .54, .51], .55, .03]); }
    const nodes = buf(pos.map(p => [p, WARM, .7, .07])), ringB = buf(ring);
    const hubB = buf(G.hubs.map(i => [pos[i], ACC, .95, .26])), glow = buf([[[0, 0, 0], ACC, .35, 1.6]]);

    const P = 46, pulses = Array.from({ length: P }, () => { const e = Math.floor(Math.random() * edges.length); return { e, from: edges[e][0], t: Math.random(), v: .35 + Math.random() * .6 }; });
    const pData = new Float32Array(P * 8); for (let i = 0; i < P; i++) pData.set([0, 0, 0, HOT[0], HOT[1], HOT[2], 1, .13], i * 8);
    const pBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pBuf); gl.bufferData(gl.ARRAY_BUFFER, pData, gl.DYNAMIC_DRAW);
    const bind = b => {
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(A.p); gl.vertexAttribPointer(A.p, 3, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(A.c); gl.vertexAttribPointer(A.c, 4, gl.FLOAT, false, 32, 12);
      gl.enableVertexAttribArray(A.s); gl.vertexAttribPointer(A.s, 1, gl.FLOAT, false, 32, 28);
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    addEventListener('pointermove', e => { mouse.tx = (e.clientX / innerWidth - .5) * 2; mouse.ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

    let W = 0, H = 0, proj, camZ = 6.2;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.round(canvas.clientWidth * dpr); H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
      camZ = canvas.clientWidth < 700 ? 7.4 : 6.2;
      proj = persp(42 * Math.PI / 180, W / H, .1, 100);
    };
    new ResizeObserver(resize).observe(canvas); resize();

    let rotY = 0, coreA = 0, time = 0;
    function frame(dt) {
      time += dt; rotY += dt * .09; coreA += dt * .3;
      mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
      const scroll = Math.min(1, scrollY / (innerHeight * .9));
      const model = mul(tr(0, scroll * .9, 0, 1 + scroll * .25), mul(rx(.25 + mouse.y * .25 + scroll * .5), mul(rz(mouse.x * -.12), ry(rotY))));
      const mvp = mul(proj, mul(tr(0, 0, -camZ, 1), model));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(U.m, false, mvp); gl.uniform1f(U.ps, H / 2 / Math.tan(21 * Math.PI / 180));
      gl.uniform1f(U.pt, 0); gl.uniform1f(U.k, 1);
      bind(lines.b); gl.drawArrays(gl.LINES, 0, lines.n);
      gl.uniformMatrix4fv(U.m, false, mul(mvp, mul(rx(-coreA * .8), mul(ry(-coreA), tr(0, 0, 0, 1 + Math.sin(time * 1.6) * .06)))));
      bind(core.b); gl.drawArrays(gl.LINES, 0, core.n);
      gl.uniform1f(U.pt, 1);
      gl.uniformMatrix4fv(U.m, false, mvp); bind(nodes.b); gl.drawArrays(gl.POINTS, 0, nodes.n);
      gl.uniformMatrix4fv(U.m, false, mul(mvp, mul(rx(1.2), rz(.3)))); bind(ringB.b); gl.drawArrays(gl.POINTS, 0, ringB.n);
      gl.uniformMatrix4fv(U.m, false, mvp);
      gl.uniform1f(U.k, .9 + Math.sin(time * 2.2) * .12); bind(hubB.b); gl.drawArrays(gl.POINTS, 0, hubB.n);
      gl.uniform1f(U.k, .8 + Math.sin(time * 1.6) * .25); bind(glow.b); gl.drawArrays(gl.POINTS, 0, 1);
      for (let i = 0; i < P; i++) {
        const p = pulses[i]; p.t += dt * p.v;
        if (p.t >= 1) {
          const [a, b] = edges[p.e], at = p.from === a ? b : a, opts = adj[at].filter(e => e !== p.e);
          if (opts.length) p.e = opts[Math.floor(Math.random() * opts.length)];
          p.from = at; p.t = 0;
        }
        const [a, b] = edges[p.e], S = p.from === a ? pos[a] : pos[b], E = p.from === a ? pos[b] : pos[a];
        pData[i * 8] = S[0] + (E[0] - S[0]) * p.t; pData[i * 8 + 1] = S[1] + (E[1] - S[1]) * p.t; pData[i * 8 + 2] = S[2] + (E[2] - S[2]) * p.t;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, pBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, pData);
      gl.uniform1f(U.k, 1); bind(pBuf); gl.drawArrays(gl.POINTS, 0, P);
    }

    let visible = true, last = performance.now(), raf = 0;
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      const now = performance.now(); frame(Math.min(.05, (now - last) / 1000)); last = now;
      raf = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); loop(); } }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); loop(); } });
    loop();
    canvas.classList.add('on');
    document.documentElement.classList.add('graph-live');
  }

  const kick = () => { ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(t => removeEventListener(t, kick)); requestAnimationFrame(start); };
  ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(t => addEventListener(t, kick, { passive: true, once: true }));
  addEventListener('load', () => setTimeout(kick, 4000), { once: true });
})();
