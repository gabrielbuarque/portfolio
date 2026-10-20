# nnex.us

Site e blog de Gabriel Buarque. HTML estático gerado por `build.mjs`, servido por nginx no Easypanel.

## Publicar um artigo

Todo artigo sai em pt-BR e em inglês.

1. Crie as duas versões (ou `npm run new -- "Título" "English title"`):
   - `content/blog/AAAA-MM-DD-slug.md` → `https://nnex.us/blog/<slug>/`
   - `content/blog/en/AAAA-MM-DD-english-slug.md` → `https://nnex.us/en/blog/<english-slug>/`, com `translation: <slug-pt>` no frontmatter
2. Faça commit em `main`.
3. O workflow **Build & deploy nnex.us** gera o site, faz o deploy e espera as duas versões responderem.

O formato do artigo (frontmatter e blocos como `callout`, `stats`, `steps`, `youtube`, `embed`, `github`, `link`, `gallery`, `cta`) está em [`skills/update-nnexus-blog/SKILL.md`](skills/update-nnexus-blog/SKILL.md). [`content/blog/_exemplo.md`](content/blog/_exemplo.md) usa todos os blocos. Arquivos que começam com `_` e posts com `draft: true` não são publicados.

## Rodar localmente

```bash
npm install
npm run dev          # build com rascunhos + servidor em http://localhost:8765
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `src/index.html` | home (PT; o EN é gerado a partir de `src/en.json`) |
| `src/site.css`, `src/blog.css` | estilos (inline em cada página) |
| `src/app.js` | widget do GitHub, compartilhar, animações de scroll |
| `src/graph.js`, `src/graph-data.mjs` | grafo 3D do hero (WebGL puro) e a versão estática em SVG |
| `src/markdown.mjs` | Markdown → HTML com os blocos especiais |
| `src/og.mjs` | imagens de compartilhamento (1200×630) geradas no build |
| `content/blog/` | artigos (`.md`) e mídia (`media/<slug>/`) |
| `content/llms.md`, `content/profile.md` | base do `llms.txt` e do `llms-full.txt` |
| `public/` | arquivos copiados como estão (fontes, robots.txt, manifest, favicon) |

O build gera também `sitemap.xml`, `blog/feed.xml` e `en/blog/feed.xml` (RSS), `llms.txt`, `llms-full.txt`, uma cópia `.md` de cada post e os ícones.

## Deploy

`Dockerfile` (build em Node e depois nginx com `nginx.conf`). O workflow chama o webhook de deploy do Easypanel, guardado no secret `EASYPANEL_DEPLOY_URL`:

```bash
gh secret set EASYPANEL_DEPLOY_URL --repo gabrielbuarque/portfolio
```
