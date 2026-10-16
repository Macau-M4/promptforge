// GitHub OAuth "Device Flow" login — runs fully client-side, no backend,
// no client secret. Only needs a public GitHub OAuth App "Client ID".

const TOKEN_KEY = 'pf.github.token';
const USER_KEY = 'pf.github.user';
const SCOPE = 'read:user';

type GitHubUser = { login: string; avatar_url: string; name?: string; html_url: string };

function getClientId(): string {
  // PUBLIC_GITHUB_CLIENT_ID is inlined at build time by Astro.
  const fromEnv = (import.meta as any).env?.PUBLIC_GITHUB_CLIENT_ID as string | undefined;
  const fromLocal = localStorage.getItem('pf.github.clientId');
  return (fromEnv || fromLocal || '').trim();
}

export function isSignedIn(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getUser(): GitHubUser | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

async function startDeviceFlow(clientId: string, el: HTMLElement) {
  el.innerHTML = '<span class="text-sm text-zinc-300">Contacting GitHub…</span>';
  try {
    const res = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, scope: SCOPE })
    });
    const data = await res.json();
    if (!data.device_code) {
      el.innerHTML = `<span class="text-sm text-zinc-300">GitHub error: ${esc(data.error_description || data.error || 'unknown')}</span>`;
      return;
    }
    const codeEl = document.createElement('span');
    codeEl.innerHTML = `
      <div class="flex flex-col gap-2 text-sm">
        <div class="font-semibold text-zinc-100">Enter code <span class="font-mono text-zinc-300 text-base">${esc(data.user_code)}</span></div>
        <a href="${esc(data.verification_uri)}" target="_blank" rel="noopener" class="btn-primary">Open GitHub โ’</a>
        <div class="text-xs text-zinc-400">Waiting for authorization…</div>
      </div>`;
    el.appendChild(codeEl);
    window.open(data.verification_uri, '_blank');
    await pollToken(clientId, data, el);
  } catch (e: any) {
    el.innerHTML = `<span class="text-sm text-zinc-300">Network error: ${esc(String(e))}</span>`;
  }
}

async function pollToken(clientId: string, data: any, el: HTMLElement) {
  let interval = Math.max(5, data.interval || 5);
  const deadline = Date.now() + (data.expires_in || 900) * 1000;
  while (Date.now() < deadline) {
    await sleep(interval * 1000);
    try {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          device_code: data.device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        })
      });
      const tok = await res.json();
      if (tok.access_token) {
        await loadUser(tok.access_token);
        render();
        return;
      }
      if (tok.error === 'authorization_pending') continue;
      if (tok.error === 'slow_down') {
        interval += 5;
        continue;
      }
      el.innerHTML = `<span class="text-sm text-zinc-300">Login error: ${esc(tok.error_description || tok.error)}</span>`;
      return;
    } catch (e: any) {
      el.innerHTML = `<span class="text-sm text-zinc-300">Network error: ${esc(String(e))}</span>`;
      return;
    }
  }
  el.innerHTML = '<span class="text-sm text-zinc-300">Timed out — please try again.</span>';
}

async function loadUser(token: string) {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    const user = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function render() {
  const el = document.getElementById('auth-widget');
  if (!el) return;
  const user = getUser();
  if (user) {
    el.innerHTML = `
      <div class="flex items-center gap-2">
        <img src="${esc(user.avatar_url)}" alt="" class="w-7 h-7 rounded-full ring-1 ring-white/20" referrerpolicy="no-referrer" />
        <span class="text-sm text-zinc-200 hidden sm:inline">${esc(user.login)}</span>
        <button data-logout class="btn-ghost px-2.5 py-1.5 text-xs">Sign out</button>
      </div>`;
    el.querySelector('[data-logout]')?.addEventListener('click', () => {
      signOut();
      render();
    });
  } else {
    const clientId = getClientId();
    if (!clientId) {
      el.innerHTML = `
        <button data-login class="btn-ghost px-3 py-2 text-xs" title="Login requires a GitHub OAuth Client ID (free to create)">Sign in with GitHub</button>`;
      el.querySelector('[data-login]')?.addEventListener('click', () => {
        el.innerHTML = `
          <div class="panel p-3 text-xs text-zinc-300 max-w-xs">
            <p class="font-semibold text-zinc-100 mb-1">Login isn't configured yet</p>
            <p class="leading-relaxed">Set <code class="bg-white/10 px-1 rounded">PUBLIC_GITHUB_CLIENT_ID</code> (a free GitHub OAuth App Client ID with Device Flow enabled).</p>
            <a href="https://github.com/settings/developers" target="_blank" rel="noopener" class="text-zinc-300 underline">Create one โ’</a>
          </div>`;
      });
    } else {
      el.innerHTML = `<button data-login class="btn-ghost px-3 py-2 text-xs">Sign in with GitHub</button>`;
      el.querySelector('[data-login]')?.addEventListener('click', () => {
        const box = document.createElement('div');
        box.className = 'panel p-3 flex flex-col gap-2 max-w-xs';
        el.innerHTML = '';
        el.appendChild(box);
        startDeviceFlow(clientId, box);
      });
    }
  }
}

export function initAuth() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
}
