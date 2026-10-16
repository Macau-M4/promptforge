import { extractVariables, fillVariables } from '../lib/markdown';

interface RunPrompt {
  id: string;
  title: string;
  category: string;
  prompt: string;
}

type ProviderId = 'pollinations' | 'gemini' | 'groq' | 'openrouter';

interface Provider {
  id: ProviderId;
  label: string;
  models: string[];
  needsKey: boolean;
  keyLabel?: string;
  keyUrl?: string;
  help: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'pollinations',
    label: 'Pollinations — free, no key',
    models: ['openai', 'mistral', 'llama', 'deepseek', 'phi'],
    needsKey: false,
    help: 'Runs instantly with zero setup. Fair-use limits apply.'
  },
  {
    id: 'gemini',
    label: 'Google Gemini — free tier',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'],
    needsKey: true,
    keyLabel: 'Gemini API key',
    keyUrl: 'https://aistudio.google.com/apikey',
    help: 'Free tier, no credit card. Key is stored only in your browser.'
  },
  {
    id: 'groq',
    label: 'Groq — free tier',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    needsKey: true,
    keyLabel: 'Groq API key',
    keyUrl: 'https://console.groq.com/keys',
    help: 'Very fast open models. Free tier, no credit card.'
  },
  {
    id: 'openrouter',
    label: 'OpenRouter — free models',
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-chat:free',
      'mistralai/mistral-7b-instruct:free',
      'google/gemma-2-9b-it:free'
    ],
    needsKey: true,
    keyLabel: 'OpenRouter API key',
    keyUrl: 'https://openrouter.ai/keys',
    help: 'Many free models behind one API. Free tier, no credit card.'
  }
];

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

const KEY_PREFIX = 'pf.llm.key.';

function getKey(provider: string): string {
  return localStorage.getItem(KEY_PREFIX + provider) || '';
}
function setKey(provider: string, key: string) {
  localStorage.setItem(KEY_PREFIX + provider, key);
}

async function runPrompt(provider: Provider, model: string, finalPrompt: string): Promise<string> {
  if (provider.id === 'pollinations') {
    const url =
      'https://text.pollinations.ai/' +
      encodeURIComponent(finalPrompt) +
      `?model=${encodeURIComponent(model)}&system=${encodeURIComponent('You are a helpful, capable assistant.')}&private=true`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`Pollinations ${res.status}`);
    return await res.text();
  }

  if (provider.id === 'gemini') {
    const key = getKey('gemini');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: finalPrompt }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Gemini error');
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.map((p: any) => p.text || '').join('').trim() || '(empty response)';
  }

  // OpenAI-compatible (Groq + OpenRouter)
  const key = getKey(provider.id);
  const endpoint =
    provider.id === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`
  };
  if (provider.id === 'openrouter') {
    headers['HTTP-Referer'] = location.origin;
    headers['X-Title'] = 'PromptForge';
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful, capable assistant.' },
        { role: 'user', content: finalPrompt }
      ]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'API error');
  return data.choices?.[0]?.message?.content?.trim() || '(empty response)';
}

export function initRun() {
  const dataEl = document.getElementById('run-data');
  const app = document.getElementById('run-app');
  if (!dataEl || !app) return;
  const prompts: RunPrompt[] = JSON.parse(dataEl.textContent || '[]');

  const params = new URLSearchParams(location.search);
  const preselect = params.get('prompt') || prompts[0]?.id || '';

  let current = prompts.find((p) => p.id === preselect) || prompts[0];
  let providerId: ProviderId = 'pollinations';
  let running = false;

  const catLabel = (c: string) =>
    ({ writing: 'Writing', coding: 'Coding', productivity: 'Productivity', analysis: 'Analysis', creative: 'Creative', learning: 'Learning', marketing: 'Marketing', automation: 'Automation' }[c] || c);

  function provider(): Provider {
    return PROVIDERS.find((p) => p.id === providerId)!;
  }

  function render() {
    const prov = provider();
    const vars = current ? extractVariables(current.prompt) : [];
    const grouped = prompts.reduce<Record<string, RunPrompt[]>>((acc, p) => {
      (acc[p.category] ||= []).push(p);
      return acc;
    }, {});

    const options = Object.entries(grouped)
      .map(
        ([cat, list]) =>
          `<optgroup label="${esc(catLabel(cat))}">` +
          list.map((p) => `<option value="${p.id}" ${p.id === (current?.id || '') ? 'selected' : ''}>${esc(p.title)}</option>`).join('') +
          `</optgroup>`
      )
      .join('');

    app.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-6">
        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-zinc-100">1 ยท Pick a prompt</h2>
          <select id="prompt-sel" class="w-full py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">${options}</select>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm text-zinc-300">Prompt text</label>
              <span id="var-count" class="text-xs text-zinc-500"></span>
            </div>
            <textarea id="prompt-preview" readonly class="w-full h-48 p-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-300 text-sm font-mono focus:outline-none"></textarea>
          </div>
          <div id="vars" class="space-y-2"></div>
        </section>

        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-zinc-100">2 ยท Choose a free provider</h2>
          <div>
            <label class="text-sm text-zinc-300">Provider</label>
            <select id="provider-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${PROVIDERS.map((p) => `<option value="${p.id}" ${p.id === providerId ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}
            </select>
            <p class="text-xs text-zinc-500 mt-1">${esc(prov.help)}</p>
          </div>
          <div>
            <label class="text-sm text-zinc-300">Model</label>
            <select id="model-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${prov.models.map((m) => `<option>${esc(m)}</option>`).join('')}
            </select>
          </div>
          <div id="key-wrap" class="${prov.needsKey ? '' : 'hidden'}">
            <label class="text-sm text-zinc-300">${esc(prov.keyLabel || 'API key')}</label>
            <input id="key-input" type="password" placeholder="Paste your key (stored locally)" value="${esc(getKey(providerId))}"
              class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
            ${prov.keyUrl ? `<a href="${esc(prov.keyUrl)}" target="_blank" rel="noopener" class="text-xs text-zinc-300 underline">Get a free key →</a>` : ''}
          </div>
          <button id="run-btn" class="btn-primary w-full py-3">โ–ถ Run prompt</button>
          <div id="status" class="text-sm text-zinc-400"></div>
          <div id="output" class="hidden panel p-4 whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed max-h-96 overflow-y-auto"></div>
        </section>
      </div>`;

    bind(prov, vars);
  }

  function bind(prov: Provider, vars: string[]) {
    const promptSel = app.querySelector('#prompt-sel') as HTMLSelectElement;
    const preview = app.querySelector('#prompt-preview') as HTMLTextAreaElement;
    const varCount = app.querySelector('#var-count') as HTMLSpanElement;
    const varsBox = app.querySelector('#vars') as HTMLDivElement;
    const providerSel = app.querySelector('#provider-sel') as HTMLSelectElement;
    const modelSel = app.querySelector('#model-sel') as HTMLSelectElement;
    const keyWrap = app.querySelector('#key-wrap') as HTMLDivElement;
    const keyInput = app.querySelector('#key-input') as HTMLInputElement;
    const runBtn = app.querySelector('#run-btn') as HTMLButtonElement;
    const status = app.querySelector('#status') as HTMLDivElement;
    const output = app.querySelector('#output') as HTMLDivElement;

    preview.value = current?.prompt || '';
    varCount.textContent = vars.length ? `${vars.length} variable${vars.length > 1 ? 's' : ''}` : '';
    varsBox.innerHTML = vars
      .map(
        (v) => `
        <div>
          <label class="text-xs text-zinc-400 font-mono">{{${esc(v)}}}</label>
          <input data-var="${esc(v)}" type="text" placeholder="value for ${esc(v)}"
            class="w-full mt-1 py-2 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
        </div>`
      )
      .join('');

    promptSel.addEventListener('change', () => {
      current = prompts.find((p) => p.id === promptSel.value)!;
      render();
    });
    providerSel.addEventListener('change', () => {
      providerId = providerSel.value as ProviderId;
      setKey(providerId, keyInput?.value || '');
      render();
    });
    keyInput?.addEventListener('change', () => setKey(providerId, keyInput.value));

    runBtn.addEventListener('click', async () => {
      if (running) return;
      const key = provider().needsKey && !keyInput?.value ? '' : (keyInput?.value || '');
      if (provider().needsKey && !key) {
        status.innerHTML = `<span class="text-zinc-300">Please paste a free API key for ${esc(provider().label)}.</span>`;
        return;
      }
      setKey(providerId, key);
      const values: Record<string, string> = {};
      varsBox.querySelectorAll<HTMLInputElement>('[data-var]').forEach((i) => (values[i.dataset.var!] = i.value));
      const finalPrompt = current ? fillVariables(current.prompt, values) : '';

      running = true;
      runBtn.disabled = true;
      runBtn.textContent = 'Running…';
      status.innerHTML = '<span class="text-zinc-400">Generating with ' + esc(provider().label) + ' (' + esc(modelSel.value) + ')…</span>';
      output.classList.add('hidden');
      try {
        const text = await runPrompt(provider(), modelSel.value, finalPrompt);
        output.textContent = text;
        output.classList.remove('hidden');
        status.innerHTML = '<span class="text-zinc-300">Done โ“</span>';
      } catch (e: any) {
        status.innerHTML = `<span class="text-zinc-300">Error: ${esc(String(e?.message || e))}. If a keyed provider fails, it may be a CORS or key issue — try Pollinations (no key).</span>`;
      } finally {
        running = false;
        runBtn.disabled = false;
        runBtn.textContent = 'โ–ถ Run prompt';
      }
    });
  }

  render();
}
