// Voting + copy + run behavior for the prompt detail page.

const VOTES_KEY = 'pf.votes';

interface DetailData {
  id: string;
  upvotes: number;
  downvotes: number;
  prompt: string;
  runUrl: string;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export function initDetail() {
  const el = document.getElementById('detail-data');
  const app = document.getElementById('detail-widget');
  if (!el || !app) return;
  const d: DetailData = JSON.parse(el.textContent || '{}');

  let votes: Record<string, 1 | -1 | 0> = {};
  try {
    votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  } catch {
    /* noop */
  }
  const myVote = votes[d.id] || 0;

  function render() {
    const up = d.upvotes + (myVote === 1 ? 1 : 0);
    const down = d.downvotes + (myVote === -1 ? 1 : 0);
    app.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <button data-vote="1" class="grid place-items-center w-10 h-10 rounded-xl border ${myVote === 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-indigo-300'} transition-colors" aria-label="upvote">▲</button>
          <span class="text-lg font-semibold text-slate-100 w-10 text-center">${up - down}</span>
          <button data-vote="-1" class="grid place-items-center w-10 h-10 rounded-xl border ${myVote === -1 ? 'bg-rose-500/20 border-rose-500/50 text-rose-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-300'} transition-colors" aria-label="downvote">▼</button>
        </div>
        <div class="text-xs text-slate-500">${up} ▲ · ${down} ▼</div>
        <button data-copy class="btn-ghost px-4 py-2">📋 Copy prompt</button>
        <a href="${esc(d.runUrl)}" class="btn-primary px-4 py-2">▶ Run</a>
      </div>`;
    app.querySelector('[data-vote="1"]')?.addEventListener('click', () => {
      votes[d.id] = myVote === 1 ? 0 : 1;
      save();
    });
    app.querySelector('[data-vote="-1"]')?.addEventListener('click', () => {
      votes[d.id] = myVote === -1 ? 0 : -1;
      save();
    });
    app.querySelector('[data-copy]')?.addEventListener('click', async (e) => {
      try {
        await navigator.clipboard.writeText(d.prompt);
        (e.currentTarget as HTMLElement).textContent = '✅ Copied';
        setTimeout(() => ((e.currentTarget as HTMLElement).textContent = '📋 Copy prompt'), 1500);
      } catch {
        (e.currentTarget as HTMLElement).textContent = '⚠️ Copy failed';
      }
    });
  }

  function save() {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    render();
  }

  render();
}
