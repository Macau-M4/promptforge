// CI glue for the auto-tagger. Runs inside GitHub Actions on pull requests:
// finds changed prompt files, infers categories, posts a PR comment and adds
// "category:*" labels. Uses only the auto-provided GITHUB_TOKEN (no secrets).
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import { inferCategory, CATEGORIES } from './auto-tag.mjs';

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const baseRef = process.env.GITHUB_BASE_REF || 'main';

if (!token || !repo) {
  console.error('Missing GITHUB_TOKEN or GITHUB_REPOSITORY.');
  process.exit(1);
}

let prNumber = null;
try {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  prNumber = event.pull_request?.number || event.number || null;
} catch {
  /* noop */
}
if (!prNumber) {
  console.log('Not a pull_request event; skipping.');
  process.exit(0);
}

let changed = [];
try {
  changed = execSync(`git diff --name-only origin/${baseRef}...HEAD -- 'src/content/prompts/*.md'`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
} catch {
  changed = [];
}

if (changed.length === 0) {
  console.log('No prompt files changed; nothing to tag.');
  process.exit(0);
}

const results = changed.map((file) => {
  const { data, content } = matter(readFileSync(file, 'utf8'));
  const text = [data.title, data.description, (data.tags || []).join(' '), content].join(' ');
  const r = inferCategory(text, data.category);
  return { file: file.replace(/^src\/content\/prompts\//, ''), ...r };
});

const labels = [...new Set(results.filter((r) => r.inferred).map((r) => `category:${r.category}`))];
const lines = results.map((r) => {
  const icon = r.inferred ? '✅' : r.category ? 'ℹ️' : '⚠️';
  const status = r.inferred
    ? `auto-tagged **${r.category}**`
    : r.category
      ? `already tagged **${r.category}**`
      : 'could not auto-tag — please add a `category` manually';
  return `- ${icon} \`${r.file}\` → ${status}`;
});

const body = `🤖 **Auto-tagger** reviewed the prompt file(s) in this PR:\n\n${lines.join('\n')}\n\n> Categories: ${CATEGORIES.map((c) => '`' + c + '`').join(', ')}. To override, edit the \`category\` field in your frontmatter.`;

async function api(path, method, payload) {
  const res = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${t}`);
  }
  return res;
}

try {
  await api(`issues/${prNumber}/comments`, 'POST', { body });
  if (labels.length) {
    await api(`issues/${prNumber}/labels`, 'POST', { labels });
  }
  console.log('Annotated PR with auto-tag results and labels:', labels.join(', ') || '(none)');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
