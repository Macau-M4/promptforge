// One-shot deployment helper: push this repo to GitHub and enable Pages —
// entirely via the GitHub REST API (no local git required).
//
// Usage:
//   node scripts/deploy-github.mjs <repo-name> [--org ORG]     (GITHUB_TOKEN env var)
//   node scripts/deploy-github.mjs <GITHUB_TOKEN> <repo-name>
//
// The token needs: repo scope (classic) or "Contents: read & write",
// "Administration: read & write", "Pages: read & write" (fine-grained).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const args = process.argv.slice(2);
let token = process.env.GITHUB_TOKEN || '';
let repoName = '';
const orgIdx = args.indexOf('--org');
const org = orgIdx >= 0 ? args[orgIdx + 1] : null;

for (const a of args) {
  if (a === '--org' || a === org) continue;
  if (!token && (a.startsWith('ghp_') || a.startsWith('github_pat_'))) {
    token = a;
    continue;
  }
  if (!repoName) {
    repoName = a;
    continue;
  }
}

if (!token || !repoName) {
  console.error('Usage: node scripts/deploy-github.mjs <repo-name> [--org ORG]   (set GITHUB_TOKEN env var)');
  console.error('   or: node scripts/deploy-github.mjs <GITHUB_TOKEN> <repo-name>');
  process.exit(1);
}

const root = process.cwd();

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
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return { status: res.status, data };
}

const EXCLUDE = new Set(['node_modules', 'dist', '.astro', '.tools', '.git']);

function collectFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (EXCLUDE.has(name)) continue;
    if (name === '.env' || (name.startsWith('.env.') && name !== '.env.example')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectFiles(full, out);
    else if (st.isFile()) out.push(full);
  }
  return out;
}

async function main() {
  // 1. Who am I?
  const me = (await gh('/user')).data;
  const owner = org || me.login;
  console.log(`Authenticated as ${me.login}. Owner: ${owner}, repo: ${repoName}`);

  // 2. Ensure the repo exists, initialized with at least one commit.
  const repoUrl = org ? `/orgs/${owner}/repos` : '/user/repos';
  const existing = await gh(`/repos/${owner}/${repoName}`).catch(() => null);
  if (!existing) {
    await gh(repoUrl, 'POST', {
      name: repoName,
      description: 'PromptForge — free, open-source library of AI prompts, commands, tools and workflows.',
      homepage: `https://${owner}.github.io/${repoName}/`,
      private: false,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      auto_init: true
    });
    console.log(`Created repo ${owner}/${repoName} (auto-initialized).`);
  } else {
    console.log(`Repo ${owner}/${repoName} already exists.`);
  }

  // 3. Ensure there is a HEAD commit on main (seed one if the repo is empty).
  let mainRef = await gh(`/repos/${owner}/${repoName}/git/refs/heads/main`).catch(() => null);
  if (!mainRef) {
    // Empty repository: seed an initial commit via the contents API.
    await gh(`/repos/${owner}/${repoName}/contents/README.md`, 'PUT', {
      message: 'Initial commit',
      content: Buffer.from('# promptforge\n').toString('base64')
    });
    mainRef = await gh(`/repos/${owner}/${repoName}/git/refs/heads/main`);
    console.log('Seeded initial commit on main.');
  }
  const parentSha = mainRef.data.object.sha;

  // 4. Build the git tree from all project files.
  const files = collectFiles(root);
  const tree = files.map((f) => {
    const rel = relative(root, f).split(sep).join('/');
    const content = readFileSync(f);
    if (content.length > 90_000_000) throw new Error(`file too large: ${rel}`);
    return { path: rel, mode: '100644', type: 'blob', content: content.toString('utf8') };
  });
  console.log(`Preparing ${tree.length} files…`);
  const treeRes = await gh(`/repos/${owner}/${repoName}/git/trees`, 'POST', { base_tree: null, tree });
  const treeSha = treeRes.data.sha;

  // 5. Create the commit on top of the parent, then update main.
  const commitRes = await gh(`/repos/${owner}/${repoName}/git/commits`, 'POST', {
    message: 'PromptForge static site',
    tree: treeSha,
    parents: [parentSha]
  });
  const commitSha = commitRes.data.sha;

  await gh(`/repos/${owner}/${repoName}/git/refs/heads/main`, 'PATCH', { sha: commitSha, force: true });
  console.log(`Pushed ${tree.length} files to main @ ${commitSha.slice(0, 7)}`);

  // 6. Enable GitHub Pages via the Actions workflow.
  try {
    await gh(`/repos/${owner}/${repoName}/pages`, 'POST', { build_type: 'workflow' });
    console.log('GitHub Pages enabled (build_type: workflow).');
  } catch (e) {
    console.warn('Pages setup note:', e.message);
  }

  // 7. Ensure the deploy workflow runs (the API push usually triggers it; dispatch as fallback).
  await new Promise((r) => setTimeout(r, 4000));
  try {
    const runs = await gh(`/repos/${owner}/${repoName}/actions/runs?branch=main&per_page=10`);
    const already = (runs.data.workflow_runs || []).some((r) => r.name === 'Deploy to GitHub Pages');
    if (already) {
      console.log('Deploy workflow already triggered by the push.');
    } else {
      await gh(`/repos/${owner}/${repoName}/actions/workflows/deploy.yml/dispatches`, 'POST', { ref: 'main' });
      console.log('Triggered deploy workflow via workflow_dispatch.');
    }
  } catch (e) {
    console.warn('Workflow trigger note:', e.message);
  }

  console.log(`\nRepo:      https://github.com/${owner}/${repoName}`);
  console.log(`Actions:   https://github.com/${owner}/${repoName}/actions`);
  console.log(`Site URL:  https://${owner}.github.io/${repoName}/`);
  console.log('The deploy workflow takes 1–3 minutes; the site is live once it completes.');
}

main().catch((e) => {
  console.error('\nDeploy failed:', e.message);
  process.exit(1);
});
