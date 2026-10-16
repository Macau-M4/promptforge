// Push the built `dist/` folder to the `gh-pages` branch and serve it via
// branch-based GitHub Pages (no GitHub Actions required).
// Usage: node scripts/deploy-pages-branch.mjs  (GITHUB_TOKEN env var)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const token = process.env.GITHUB_TOKEN || process.argv[2];
if (!token) {
  console.error('Set GITHUB_TOKEN (or pass it as an argument).');
  process.exit(1);
}
const repo = process.argv[3] || 'promptforge';
const root = join(process.cwd(), 'dist');

async function gh(path, method = 'GET', body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  return { status: res.status, data };
}

function collect(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collect(full, out);
    else out.push(full);
  }
  return out;
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.webmanifest': 'application/manifest+json'
};

async function main() {
  const me = (await gh('/user')).data;
  const owner = me.login;
  console.log(`Authenticated as ${owner}. Pushing dist/ to gh-pages of ${owner}/${repo}`);

  const files = collect(root);
  const tree = files.map((f) => {
    const rel = relative(root, f).split(sep).join('/');
    return { path: rel, mode: '100644', type: 'blob', content: readFileSync(f).toString('utf8') };
  });
  // GitHub Pages runs Jekyll by default and ignores `_`-prefixed dirs (e.g. _astro).
  // A .nojekyll file at the root disables Jekyll so assets are served as-is.
  tree.push({ path: '.nojekyll', mode: '100644', type: 'blob', content: '' });
  console.log(`Preparing ${tree.length} files from dist/ (+.nojekyll)`);

  const treeRes = await gh(`/repos/${owner}/${repo}/git/trees`, 'POST', { base_tree: null, tree });
  const treeSha = treeRes.data.sha;

  // Existing gh-pages ref (if any) becomes the parent.
  const ref = await gh(`/repos/${owner}/${repo}/git/refs/heads/gh-pages`).catch(() => null);
  const parents = ref ? [ref.data.object.sha] : [];
  const commitRes = await gh(`/repos/${owner}/${repo}/git/commits`, 'POST', {
    message: 'Deploy PromptForge (static)',
    tree: treeSha,
    parents
  });
  const commitSha = commitRes.data.sha;

  if (ref) {
    await gh(`/repos/${owner}/${repo}/git/refs/heads/gh-pages`, 'PATCH', { sha: commitSha, force: true });
  } else {
    await gh(`/repos/${owner}/${repo}/git/refs`, 'POST', { ref: 'refs/heads/gh-pages', sha: commitSha });
  }
  console.log(`Pushed ${tree.length} files to gh-pages @ ${commitSha.slice(0, 7)}`);

  // Point Pages at the gh-pages branch.
  try {
    await gh(`/repos/${owner}/${repo}/pages`, 'PUT', { source: { branch: 'gh-pages', path: '/' } });
    console.log('GitHub Pages source set to gh-pages branch.');
  } catch (e) {
    console.warn('Pages config note:', e.message);
  }

  console.log(`\nSite URL: https://${owner.toLowerCase()}.github.io/${repo}/`);
  console.log('It can take 1–3 minutes for the first build to go live.');
}

main().catch((e) => {
  console.error('\nDeploy failed:', e.message);
  process.exit(1);
});
