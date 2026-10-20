// After a deploy: waits (up to ~8 min) until https://nnex.us and every published post return 200.
import { publishedPosts } from './posts.mjs';

const urls = ['https://nnex.us/', 'https://nnex.us/blog/', ...publishedPosts().map(p => p.url)];
const deadline = Date.now() + 8 * 60 * 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
// give Easypanel time to start the new build before checking
await sleep(45000);
let pending = [...urls];
while (pending.length && Date.now() < deadline) {
  const next = [];
  for (const u of pending) {
    try { const r = await fetch(u, { cache: 'no-store', redirect: 'follow' }); if (r.status !== 200) next.push(u); } catch { next.push(u); }
  }
  pending = next;
  if (pending.length) { console.log(`waiting for ${pending.length} url(s)…`); await sleep(15000); }
}
if (pending.length) { console.error(`::error::Not live after 8 minutes:\n${pending.join('\n')}`); process.exit(1); }
console.log(`Live ✓\n${urls.join('\n')}`);
