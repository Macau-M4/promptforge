// Standalone Zod schema validation for all content files.
// Run: node scripts/validate.mjs  (also runs in CI on every PR)
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { z } from 'zod';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'src', 'content');

const categories = [
  'writing',
  'coding',
  'productivity',
  'analysis',
  'creative',
  'learning',
  'marketing',
  'automation'
];
const difficulties = ['beginner', 'intermediate', 'advanced'];

const promptSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(10).max(320),
  category: z.enum(categories),
  tags: z.array(z.string().min(2).max(40)).min(1).max(8),
  difficulty: z.enum(difficulties),
  model: z.string().min(1).max(80).default('any'),
  author: z.string().min(1).max(80).default('community'),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  upvotes: z.number().int().min(0).default(0),
  downvotes: z.number().int().min(0).default(0),
  version: z.number().int().positive().default(1)
});

const pathSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(10).max(320),
  level: z.enum(['start', 'advance', 'master']),
  order: z.number().int().min(1),
  prompts: z.array(z.string()).min(1).max(60)
});

const toolSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(10).max(320),
  category: z.enum(categories),
  kind: z.enum(['free-api', 'local', 'platform', 'utility']),
  url: z.string().url().optional(),
  free: z.boolean().default(true)
});

function listMarkdown(dir) {
  try {
    return readdirSync(dir).filter((f) => extname(f) === '.md');
  } catch {
    return [];
  }
}

const errors = [];
let count = 0;

function validateGroup(dir, schema, label, extraChecks) {
  const files = listMarkdown(dir);
  if (files.length === 0) {
    errors.push(`[${label}] no markdown files found in ${dir}`);
    return;
  }
  for (const file of files) {
    const full = join(dir, file);
    const raw = readFileSync(full, 'utf8');
    const { data, content } = matter(raw);
    const result = schema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`[${label}] ${file}: ${issue.path.join('.') || 'root'} — ${issue.message}`);
      }
    }
    if (extraChecks) {
      const extra = extraChecks(data, content, file);
      if (extra) errors.push(`[${label}] ${file}: ${extra}`);
    }
    count++;
  }
}

validateGroup(
  join(CONTENT, 'prompts'),
  promptSchema,
  'prompts',
  (data, content, file) => {
    if (!/```[\s\S]*?```/.test(content)) {
      return 'missing fenced code block (the copyable prompt)';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.created) || !/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) {
      return 'invalid date format (use YYYY-MM-DD)';
    }
    if (data.created > data.updated) return 'created date is after updated date';
    return null;
  }
);

validateGroup(join(CONTENT, 'paths'), pathSchema, 'paths', (data) => {
  if (!data.prompts || data.prompts.length === 0) return 'paths must reference at least one prompt id';
  return null;
});

validateGroup(join(CONTENT, 'tools'), toolSchema, 'tools');

// Cross-check: every prompt id referenced by a path must exist.
const promptFiles = listMarkdown(join(CONTENT, 'prompts')).map((f) => f.replace(/\.md$/, ''));
for (const file of listMarkdown(join(CONTENT, 'paths'))) {
  const { data } = matter(readFileSync(join(CONTENT, 'paths', file), 'utf8'));
  for (const id of data.prompts || []) {
    if (!promptFiles.includes(id)) {
      errors.push(`[paths] ${file}: references missing prompt "${id}"`);
    }
  }
}

if (errors.length) {
  console.error(`\n❌ Validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error('  • ' + e);
  process.exit(1);
}

console.log(`\n✅ Validated ${count} content files (${promptFiles.length} prompts) — all good.`);
