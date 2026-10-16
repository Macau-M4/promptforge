// Auto-tagger: infer a category for new/edited prompt submissions from their
// title, description, tags and body using free keyword scoring (no LLM required).
//
// As a CLI:   node scripts/auto-tag.mjs <file1> [file2 ...]
// As a module: import { inferCategory, CATEGORIES } from './auto-tag.mjs'

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

export const CATEGORIES = [
  'writing',
  'coding',
  'productivity',
  'analysis',
  'creative',
  'learning',
  'marketing',
  'automation'
];

// Ordered keyword → category map.
const KEYWORDS = [
  ['coding', ['code', 'debug', 'refactor', 'function', 'programming', 'python', 'javascript', 'typescript', 'api', 'regex', 'terminal', 'shell', 'cli', 'sql', 'react', 'git', 'unit test', 'testing']],
  ['automation', ['automate', 'automation', 'bot', 'pipeline', 'cron', 'workflow', 'script', 'integration', 'scaffold']],
  ['analysis', ['data', 'analyz', 'analyse', 'research', 'summariz', 'insight', 'swot', 'report', 'statistics', 'csv', 'survey', 'synthes']],
  ['learning', ['learn', 'teach', 'tutor', 'explain', 'quiz', 'flashcard', 'study', 'education', 'concept', 'socratic']],
  ['marketing', ['market', 'social', 'post', 'landing', 'email', 'campaign', 'seo', 'brand', 'audience', 'conversion', 'copywrit', 'advert']],
  ['writing', ['write', 'writ', 'blog', 'essay', 'article', 'edit', 'proofread', 'grammar', 'rewrite', 'copy', 'tone', 'story', 'fiction', 'worldbuild', 'headline']],
  ['creative', ['creative', 'art', 'image', 'character', 'design', 'poem', 'music', 'style']],
  ['productivity', ['task', 'todo', 'plan', 'schedule', 'meeting', 'notes', 'prioritiz', 'decision', 'productivity', 'time', 'eisenhower']]
];

function score(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  const scores = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const [cat, words] of KEYWORDS) {
    for (const w of words) {
      if (t.includes(w)) scores[cat] += 1;
    }
  }
  return scores;
}

export function inferCategory(text, existing) {
  if (CATEGORIES.includes(existing)) return { category: existing, inferred: false };
  const scores = score(text);
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  if (best[1] === 0) return { category: null, inferred: false };
  const runnerUp = ranked[1]?.[1] ?? 0;
  const confident = best[1] >= 2 || best[1] > runnerUp;
  return { category: confident ? best[0] : null, inferred: confident, scores };
}

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node scripts/auto-tag.mjs <file1> [file2 ...]');
    process.exit(1);
  }
  const results = [];
  for (const file of files) {
    let raw;
    try {
      raw = readFileSync(file, 'utf8');
    } catch {
      console.error(`  ⚠️  cannot read ${file}`);
      continue;
    }
    const { data, content } = matter(raw);
    const text = [data.title, data.description, (data.tags || []).join(' '), content].join(' ');
    const r = inferCategory(text, data.category);
    results.push({ file, ...r });
  }

  if (process.env.GITHUB_ACTIONS) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const r of results) {
      console.log(`${r.file} → ${r.category ?? 'unclassified'}${r.inferred ? ' (auto-inferred)' : ''}`);
    }
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();
