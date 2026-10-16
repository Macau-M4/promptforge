// Core-logic tests for PromptForge (run with `pnpm test`, uses Node's built-in runner).
// Imports the real TypeScript modules directly (Node 24 strips types natively).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { score, recencyFactor, trending, sortByTrending, sortByTop, sortByNewest, ageInDays } from '../src/lib/trending.ts';
import { extractPromptBlock, extractVariables, fillVariables } from '../src/lib/markdown.ts';
import { inferCategory } from '../scripts/auto-tag.mjs';

test('score = upvotes - downvotes', () => {
  assert.equal(score({ upvotes: 10, downvotes: 3 }), 7);
  assert.equal(score({ upvotes: 0, downvotes: 5 }), -5);
});

test('recencyFactor decays with age and is 1 for fresh content', () => {
  const now = new Date('2025-04-01T00:00:00Z');
  assert.equal(recencyFactor('2025-04-01', now), 1);
  const older = recencyFactor('2025-03-25', now);
  const oldest = recencyFactor('2024-01-01', now);
  assert.ok(older < 1 && oldest < older, 'older content must have a lower recency factor');
});

test('trending = score x recency', () => {
  const now = new Date('2025-04-01T00:00:00Z');
  const item = { id: 'a', upvotes: 10, downvotes: 0, updated: '2025-04-01' };
  assert.equal(trending(item, now), 10);
});

test('ageInDays is non-negative', () => {
  const now = new Date('2025-04-01T00:00:00Z');
  assert.equal(ageInDays('2025-04-01', now), 0);
  assert.equal(ageInDays('2025-03-27', now), 5);
});

test('sortByTrending orders by score x recency (fresh beats older with same score)', () => {
  const a = { id: 'a', upvotes: 50, downvotes: 0, updated: '2025-03-30' };
  const b = { id: 'b', upvotes: 50, downvotes: 0, updated: '2024-01-01' };
  const sorted = sortByTrending([b, a]);
  assert.equal(sorted[0].id, 'a');
});

test('sortByNewest orders by updated desc', () => {
  const list = [
    { id: 'old', upvotes: 0, downvotes: 0, updated: '2024-01-01' },
    { id: 'new', upvotes: 0, downvotes: 0, updated: '2025-04-01' },
    { id: 'mid', upvotes: 0, downvotes: 0, updated: '2024-12-01' }
  ];
  assert.deepEqual(sortByNewest(list).map((x) => x.id), ['new', 'mid', 'old']);
});

test('extractPromptBlock returns the first fenced code block contents', () => {
  const md = '# Title\n\n## The prompt\n\n```text\nHello {{name}}\n```\n\n## Notes\n';
  assert.equal(extractPromptBlock(md), 'Hello {{name}}');
});

test('extractPromptBlock falls back to trimmed body when no fence', () => {
  assert.equal(extractPromptBlock('plain text'), 'plain text');
});

test('extractVariables finds unique {{placeholders}}', () => {
  assert.deepEqual(extractVariables('a {{x}} and {{x}} plus {{y}}'), ['x', 'y']);
});

test('fillVariables substitutes and leaves missing ones intact', () => {
  const out = fillVariables('Hi {{name}}, from {{city}}', { name: 'Ada' });
  assert.equal(out, 'Hi Ada, from {{city}}');
});

test('auto-tagger infers categories from text', () => {
  assert.equal(inferCategory('Generate a unit test for this python function and review the code').category, 'coding');
  assert.equal(inferCategory('Rewrite this blog article and improve the tone for my audience').category, 'writing');
  assert.equal(inferCategory('Explain quantum physics to a beginner').category, 'learning');
  // Already-valid category is respected (not overridden).
  assert.deepEqual(inferCategory('something', 'marketing'), { category: 'marketing', inferred: false });
});

test('auto-tagger returns null when no keyword matches', () => {
  const r = inferCategory('zzzz qqqq');
  assert.equal(r.category, null);
  assert.equal(r.inferred, false);
});
