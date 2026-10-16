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
  writing: '✍️ Writing',
  coding: '💻 Coding',
  productivity: '⚡ Productivity',
  analysis: '🔬 Analysis',
  creative: '🎨 Creative',
  learning: '📚 Learning',
  marketing: '📣 Marketing',
  automation: '🤖 Automation'
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
    <div class="space-y-6">
      <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input id="search" type="search" placeholder="Search prompts, tags, categories…"
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>
        <div class="flex items-center gap-2">
          <select id="sort" class="py-2.5 px-3 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="trending">🔥 Trending</option>
            <option value="top">⭐ Top rated</option>
            <option value="newest">🕒 Newest</option>
          </select>
          <select id="difficulty" class="py-2.5 px-3 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div id="cats" class="flex flex-wrap gap-2"></div>
      <div class="flex items-center justify-between text-sm text-slate-400">
        <span id="count"></span>
      </div>
      <div id="grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
      <div id="empty" class="hidden panel p-10 text-center text-slate-400">No prompts match. Try a different search or clear filters.</div>
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
        `<button data-cat="${c}" class="chip border ${c === 'all' ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}">${
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
      <article class="panel card-lift p-5 flex flex-col gap-3" ${reveal}>
        <div class="flex items-start gap-3">
          <div class="flex flex-col items-center gap-1 shrink-0">
            <button data-vote="${p.id}" data-dir="1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${v === 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40'} transition-colors" aria-label="upvote">▲</button>
            <span class="text-sm font-semibold text-slate-100" data-score="${p.id}">${up - down}</span>
            <button data-vote="${p.id}" data-dir="-1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${v === -1 ? 'bg-rose-500/20 border-rose-500/50 text-rose-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/40'} transition-colors" aria-label="downvote">▼</button>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="chip bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">${esc(CATEGORY_LABELS[p.category] || p.category)}</span>
              <span class="chip bg-white/5 border border-white/10 text-slate-400 capitalize">${esc(p.difficulty)}</span>
            </div>
            <h3 class="font-semibold text-slate-100 leading-snug"><a href="${base}prompts/${p.id}" class="hover:text-indigo-300">${esc(p.title)}</a></h3>
            <p class="text-sm text-slate-400 mt-1 line-clamp-2">${esc(p.description)}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          ${p.tags.map((t) => `<span class="chip bg-white/5 border border-white/10 text-slate-500">#${esc(t)}</span>`).join('')}
        </div>
        <div class="mt-auto flex items-center gap-2 pt-1 border-t border-white/5 text-xs">
          <button data-copy="${p.id}" class="btn-ghost px-2.5 py-1.5 text-xs">📋 Copy</button>
          <a href="${base}run?prompt=${p.id}" class="btn-ghost px-2.5 py-1.5 text-xs">▶ Run</a>
          ${vars > 0 ? `<span class="text-slate-500 ml-auto">${vars} variable${vars > 1 ? 's' : ''}</span>` : `<span class="text-slate-500 ml-auto">${esc(p.model)}</span>`}
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
          b.textContent = '✅ Copied';
          setTimeout(() => (b.textContent = '📋 Copy'), 1500);
        } catch {
          b.textContent = '⚠️ Copy failed';
        }
      })
    );
  }

  render();
}
