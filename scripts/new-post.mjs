// Creates both versions of a new post, already linked:
//   content/blog/YYYY-MM-DD-<slug>.md      (pt-BR)
//   content/blog/en/YYYY-MM-DD-<slug>.md   (English)
// Usage: npm run new -- "Título do artigo" ["English title"]
import fs from 'node:fs';

const [ptTitle = 'Novo artigo', enTitle = 'New article'] = process.argv.slice(2);
const date = new Date().toISOString().slice(0, 10);
const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const ptSlug = slugify(ptTitle), enSlug = slugify(enTitle);
const pt = `content/blog/${date}-${ptSlug}.md`, en = `content/blog/en/${date}-${enSlug}.md`;
for (const f of [pt, en]) if (fs.existsSync(f)) { console.error(`${f} already exists`); process.exit(1); }
fs.mkdirSync('content/blog/en', { recursive: true });
const q = s => s.replace(/"/g, '\\"');
fs.writeFileSync(pt, `---
title: "${q(ptTitle)}"
description: ""
date: ${date}
tags: []
summary:
  - ""
draft: true
---

Abertura: o que aconteceu, por que importa.

## Primeira seção
`);
fs.writeFileSync(en, `---
title: "${q(enTitle)}"
description: ""
date: ${date}
tags: []
summary:
  - ""
translation: ${ptSlug}
draft: true
---

Opening: what happened, why it matters.

## First section
`);
console.log(`created\n  ${pt}\n  ${en}`);
