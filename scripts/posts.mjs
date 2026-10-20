// Lists published posts in both languages (skips drafts and files starting with "_").
// PT posts live in content/blog/, EN posts in content/blog/en/.
// --markdown prints a table for the GitHub Actions summary; otherwise prints JSON.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const dir = path.resolve('content/blog');
const slugify = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export function publishedPosts() {
  const sources = [[dir, 'pt'], [path.join(dir, 'en'), 'en']].filter(([d]) => fs.existsSync(d));
  return sources.flatMap(([d, folderLang]) => fs.readdirSync(d).filter(f => f.endsWith('.md') && !f.startsWith('_')).map(f => {
    const { data } = matter(fs.readFileSync(path.join(d, f), 'utf8'));
    if (data.draft) return null;
    const lang = data.lang ? (data.lang === 'en' ? 'en' : 'pt') : folderLang;
    const slug = slugify(data.slug || f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date || '');
    return { file: f, lang, slug, title: data.title, date, url: `https://nnex.us${lang === 'en' ? '/en' : ''}/blog/${slug}/` };
  }).filter(Boolean)).sort((a, b) => b.date.localeCompare(a.date));
}

if (process.argv[1] && process.argv[1].endsWith('posts.mjs')) {
  const posts = publishedPosts();
  if (process.argv.includes('--markdown')) {
    console.log(posts.length ? `| Data | Idioma | Post |\n| --- | --- | --- |\n${posts.map(p => `| ${p.date} | ${p.lang} | [${p.title}](${p.url}) |`).join('\n')}` : '_Nenhum post publicado ainda._');
  } else console.log(JSON.stringify(posts, null, 2));
}
