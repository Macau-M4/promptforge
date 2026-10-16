import { trending, score } from '../lib/trending';
import { extractVariables } from '../lib/markdown';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string;
  model: string;
  author: string;
  created: string;
  updated: string;
  upvotes: number;
  downvotes: number;
  prompt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  writing: 'Writing',
  coding: 'Coding',
  productivity: 'Productivity',
  analysis: 'Analysis',
  creative: 'Creative',
  learning: 'Learning',
  marketing: 'Marketing',
  automation: 'Automation'
};

const VOTES_KEY = 'pf.votes';
const base = (import.meta as any).env?.BASE_URL || '/';

type VoteMap = Record<string, 1 | -1 | 0>;

function loadVotes(): VoteMap {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveVotes(v: VoteMap) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(v));
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function adjusted(p: Prompt, vote: number) {
  const up = p.upvotes + (vote === 1 ? 1 : 0);
  const down = p.downvotes + (vote === -1 ? 1 : 0);
  return { up, down, score: up - down };
}

export function initBrowser() {
  const dataEl = document.getElementById('prompts-data');
  if (!dataEl) return;
  const prompts: Prompt[] = JSON.parse(dataEl.textContent || '[]');

  const root = document.getElementById('browser');
  if (!root) return;

  const votes = loadVotes();

  // Build static shell once.
  root.innerHTML = `
    <div class="space-y-8">
      <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">/</span>
          <input id="search" type="search" placeholder="ค้นหา prompt, tag, หมวดหมู่…"
            class="w-full pl-9 pr-3 py-3 rounded-md bg-[#0f0f11] border border-[#26262b] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-sm" />
        </div>
        <div class="flex items-center gap-2">
          <select id="sort" class="py-3 px-3 rounded-md bg-[#0f0f11] border border-[#26262b] text-zinc-200 text-sm focus:outline-none focus:border-zinc-500">
            <option value="trending">Trending</option>
            <option value="top">Top rated</option>
            <option value="newest">Newest</option>
          </select>
          <select id="difficulty" class="py-3 px-3 rounded-md bg-[#0f0f11] border border-[#26262b] text-zinc-200 text-sm focus:outline-none focus:border-zinc-500">
            <option value="all">ทุกระดับ</option>
            <option value="beginner">เริ่มต้น</option>
            <option value="intermediate">ระดับกลาง</option>
            <option value="advanced">ขั้นสูง</option>
          </select>
        </div>
      </div>
      <div id="cats" class="flex flex-wrap gap-2"></div>
      <div class="flex items-center justify-between font-mono text-xs text-zinc-500">
        <span id="count"></span>
      </div>
      <div id="grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
      <div id="empty" class="hidden panel p-10 text-center text-zinc-500">ไม่พบ Prompt ที่ตรง — ลองเปลี่ยนคำค้นหรือล้างตัวกรอง</div>
    </div>`;

  const searchEl = root.querySelector('#search') as HTMLInputElement;
  const sortEl = root.querySelector('#sort') as HTMLSelectElement;
  const diffEl = root.querySelector('#difficulty') as HTMLSelectElement;
  const catsEl = root.querySelector('#cats') as HTMLDivElement;
  const gridEl = root.querySelector('#grid') as HTMLDivElement;
  const countEl = root.querySelector('#count') as HTMLSpanElement;
  const emptyEl = root.querySelector('#empty') as HTMLDivElement;

  let activeCat = 'all';
  let firstRender = true;

  const categories = ['all', ...Array.from(new Set(prompts.map((p) => p.category)))];
  catsEl.innerHTML = categories
    .map(
      (c) =>
        `<button data-cat="${c}" class="chip ${c === 'all' ? 'bg-zinc-100 border-zinc-100 text-black' : 'text-zinc-400 hover:border-zinc-500 hover:text-zinc-100'}">${
          c === 'all' ? 'All' : CATEGORY_LABELS[c] || c
        }</button>`
    )
    .join('');

  catsEl.querySelectorAll('[data-cat]').forEach((b) =>
    b.addEventListener('click', () => {
      activeCat = (b as HTMLButtonElement).dataset.cat!;
      render();
    })
  );

  searchEl.addEventListener('input', render);
  sortEl.addEventListener('change', render);
  diffEl.addEventListener('change', render);

  function filtered(): Prompt[] {
    const q = searchEl.value.trim().toLowerCase();
    const diff = diffEl.value;
    return prompts.filter((p) => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (diff !== 'all' && p.difficulty !== diff) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function sorted(list: Prompt[]): Prompt[] {
    const sort = sortEl.value;
    const withVote = (p: Prompt) => ({ ...p, upvotes: adjusted(p, votes[p.id] || 0).up, downvotes: adjusted(p, votes[p.id] || 0).down });
    const items = list.map(withVote);
    if (sort === 'top') return items.sort((a, b) => score(b) - score(a));
    if (sort === 'newest') return items.sort((a, b) => (a.updated < b.updated ? 1 : -1));
    return items.sort((a, b) => trending(b) - trending(a) || score(b) - score(a));
  }

  function card(p: Prompt, i: number): string {
    const v = votes[p.id] || 0;
    const { up, down } = adjusted(p, v);
    const vars = extractVariables(p.prompt).length;
    const reveal = firstRender ? `data-reveal data-reveal-delay="${Math.min(i * 45, 300)}"` : '';
    return `
      <article class="panel card-lift p-5 flex flex-col gap-3" ${reveal} data-tilt>
        <div class="flex items-start gap-3">
          <div class="flex flex-col items-center gap-1 shrink-0">
            <button data-vote="${p.id}" data-dir="1" class="vote-btn grid place-items-center w-9 h-9 rounded border ${v === 1 ? 'bg-zinc-100 border-zinc-100 text-black' : 'border-[#2c2c31] text-zinc-500 hover:text-zinc-100 hover:border-zinc-500'} transition-colors" aria-label="upvote">▲</button>
            <span class="text-sm font-semibold text-zinc-100 tabular-nums" data-score="${p.id}">${up - down}</span>
            <button data-vote="${p.id}" data-dir="-1" class="vote-btn grid place-items-center w-9 h-9 rounded border ${v === -1 ? 'bg-zinc-700 border-zinc-600 text-zinc-100' : 'border-[#2c2c31] text-zinc-500 hover:text-zinc-100 hover:border-zinc-500'} transition-colors" aria-label="downvote">▼</button>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="chip bg-zinc-800 border-zinc-700 text-zinc-200">${esc(CATEGORY_LABELS[p.category] || p.category)}</span>
              <span class="chip capitalize">${esc(p.difficulty)}</span>
            </div>
            <h3 class="font-semibold text-zinc-100 leading-snug"><a href="${base}prompts/${p.id}" class="hover:text-zinc-300 transition-colors">${esc(p.title)}</a></h3>
            <p class="text-sm text-zinc-500 mt-1 line-clamp-2">${esc(p.description)}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${p.tags.map((t) => `<span class="chip text-zinc-600">#${esc(t)}</span>`).join('')}
        </div>
        <div class="mt-auto flex items-center gap-2 pt-3 border-t border-[#1c1c20] text-xs">
          <button data-copy="${p.id}" class="btn-ghost px-2.5 py-1.5 text-xs">Copy</button>
          <a href="${base}run?prompt=${p.id}" class="btn-ghost px-2.5 py-1.5 text-xs">Run →</a>
          ${vars > 0 ? `<span class="text-zinc-600 ml-auto font-mono">${vars} var</span>` : `<span class="text-zinc-600 ml-auto font-mono">${esc(p.model)}</span>`}
        </div>
      </article>`;
  }

  function render() {
    const list = sorted(filtered());
    gridEl.innerHTML = list.map((p, i) => card(p, i)).join('');
    countEl.textContent = `${list.length} prompt${list.length === 1 ? '' : 's'}`;
    emptyEl.classList.toggle('hidden', list.length > 0);
    bindGrid();
    if (firstRender) {
      firstRender = false;
      document.dispatchEvent(new CustomEvent('pf:reveal'));
    }
  }

  function bindGrid() {
    gridEl.querySelectorAll<HTMLElement>('[data-vote]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.dataset.vote!;
        const dir = Number(b.dataset.dir) as 1 | -1;
        const cur = votes[id] || 0;
        votes[id] = cur === dir ? 0 : dir;
        saveVotes(votes);
        render();
      })
    );
    gridEl.querySelectorAll<HTMLElement>('[data-copy]').forEach((b) =>
      b.addEventListener('click', async () => {
        const id = b.dataset.copy!;
        const p = prompts.find((x) => x.id === id);
        if (!p) return;
        try {
          await navigator.clipboard.writeText(p.prompt);
          b.textContent = 'Copied ✓';
          setTimeout(() => (b.textContent = 'Copy'), 1500);
        } catch {
          b.textContent = 'Copy failed';
        }
      })
    );

    // Pointer tilt (desktop only, respects reduced-motion).
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) {
      gridEl.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
        card.addEventListener('pointerenter', () => {
          // Fast follow while tracking; the .card-lift 0.25s transition would lag.
          card.style.transition = 'transform 0.08s ease-out';
        });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
          card.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-3px)`;
        });
        card.addEventListener('pointerleave', () => {
          card.style.transition = ''; // restore .card-lift transition for a smooth reset
          card.style.transform = '';
        });
      });
    }
  }

  render();
}
