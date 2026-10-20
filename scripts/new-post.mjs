// Creates content/blog/YYYY-MM-DD-<slug>.md with the frontmatter skeleton.
// Usage: npm run new -- "Título do artigo"
import fs from 'node:fs';
const title = process.argv.slice(2).join(' ').trim() || 'Novo artigo';
const date = new Date().toISOString().slice(0, 10);
const slug = title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const file = `content/blog/${date}-${slug}.md`;
if (fs.existsSync(file)) { console.error(`${file} already exists`); process.exit(1); }
fs.writeFileSync(file, `---
title: "${title.replace(/"/g, '\\"')}"
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
console.log(`created ${file}`);
