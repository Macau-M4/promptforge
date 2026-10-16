# ⚒️ PromptForge

> The free, open-source library of AI prompts, commands, tools and workflows — and the
> guides that teach you how to use them.

**Zero paid services. Zero credit card. Zero recurring cost.** A fully static site:
content is markdown in git, votes live in your browser, auth is GitHub OAuth, and the
LLM backends are all free tiers or keyless.

## ✨ Features

| # | Feature | How it works |
|---|---|---|
| 1 | **Prompt browser** | Card grid, live search, filter by category + difficulty |
| 2 | **Voting** | Up/down votes persisted in `localStorage` (seeded scores in frontmatter) |
| 3 | **Trending sort** | `score × recency` decay, alongside "top" and "newest" |
| 4 | **Learning paths** | 3 tracks — *Start here → Advance → Master* |
| 5 | **Run in page** | Execute any prompt against a free LLM, directly in the browser |
| 6 | **Contributions** | Submit via GitHub PR; CI validates + auto-tags |
| 7 | **Auth** | GitHub OAuth **Device Flow** — no backend, no client secret |
| 8 | **Auto-tagging** | Free keyword scoring assigns categories to new submissions |

## 🧱 Tech stack (all free / open source)

- **Frontend:** [Astro](https://astro.build) (static export)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Content:** markdown files in `src/content/{prompts,paths,tools}/`
- **Schema:** [Zod](https://zod.dev) (validated at build time and in CI)
- **Hosting:** GitHub Pages (workflow included) — also Cloudflare/Vercel/Netlify free tiers
- **CI:** GitHub Actions (validate + auto-tag + deploy)
- **LLM:** [Pollinations](https://text.pollinations.ai/) (keyless), Google AI Studio, Groq, OpenRouter free models, or local WebLLM
- **Auth:** GitHub OAuth Device Flow (free)

## 🚀 Quick start (fork + self-host)

### 1. Fork & clone

1. Click **Fork** on this repo.
2. Clone your fork and install:

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

### 2. Configure (optional, for login)

Create a free GitHub OAuth App (no credit card):

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set *Homepage URL* to your site URL and *Authorization callback URL* to the same URL.
3. Under your new app → **General**, check **"Enable Device Flow"**.
4. Copy the **Client ID** (public, safe to commit) into `.env`:

```bash
# .env
PUBLIC_GITHUB_CLIENT_ID=your_client_id
PUBLIC_REPO=your-username/your-repo-name
```

Without a Client ID, the "Sign in" button shows friendly setup instructions instead —
everything else still works.

### 3. Deploy to GitHub Pages (free)

1. Push to `main`.
2. In the repo, go to **Settings → Pages** → set *Source* to **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` builds and deploys automatically.

Your site is live at `https://<you>.github.io/<repo>/` (or `https://<you>.github.io/`
if the repo is named `<you>.github.io`).

> **One-command alternative:** `scripts/deploy-github.mjs` creates the repo, pushes
> everything, enables Pages and triggers the deploy workflow via the GitHub REST API —
> no local git needed. Run it with a classic PAT that has `repo` + `workflow` scope:
>
> ```bash
> node scripts/deploy-github.mjs ghp_xxx promptforge
> ```

#### Alternative free hosts

| Host | How |
|---|---|
| **Cloudflare Pages** | Build command `pnpm build`, output `dist`, set `PUBLIC_BASE=/` |
| **Vercel** | Import repo, framework preset "Other", build `pnpm build`, output `dist` |
| **Netlify** | Import repo, build `pnpm build`, publish dir `dist` |

All are free tiers with no credit card. For any of them set the env vars from
`.env.example` in the host's build settings.

## ▶️ Run in page — free LLM backends

The **Run** page sends the prompt straight from your browser to a free API. Your key
(if any) is stored in `localStorage` and never touches a PromptForge server (there
isn't one).

| Provider | Key required | Notes |
|---|---|---|
| **Pollinations** | ❌ none | Default. Works instantly, fair-use limits. |
| **Google AI Studio** | free key | `gemini-2.0-flash` etc. No card needed. |
| **Groq** | free key | Very fast open models. No card needed. |
| **OpenRouter** | free key | Many `:free` models behind one API. |

## 🗳️ Voting & trending

- Each prompt's `upvotes`/`downvotes` in frontmatter are the **seed**.
- A visitor's vote is stored in `localStorage` (`pf.votes`) and merged on render.
- **Trending** = `(upvotes − downvotes) × 1/(1 + ageDays/7)` — recency-weighted so fresh
  prompts can surface without burying evergreen quality.

To make voting persist **globally** (shared across visitors), swap the localStorage
layer in `src/scripts/browser.ts` for a free Supabase project or a small KV/API. The
data model is a simple `{ promptId: {up, down} }` map.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short:

1. Fork the repo.
2. Add a markdown file to `src/content/prompts/` (template in CONTRIBUTING).
3. `pnpm run validate` locally.
4. Open a PR — a GitHub Action validates the Zod schema and auto-tags the category.

## 📁 Project structure

```
src/
  content.config.ts        # Astro content collections + Zod schema
  content/
    prompts/*.md           # the prompt library
    paths/*.md             # learning paths
    tools/*.md             # free LLM providers/tools
  lib/                     # shared helpers (trending, markdown, constants)
  scripts/                 # client-side TS (browser, run, auth, voting)
  pages/                   # Astro routes
  layouts/Layout.astro     # site chrome
scripts/
  validate.mjs             # standalone Zod validation (CI)
  auto-tag.mjs             # keyword-based category inference
  ci-annotate.mjs          # PR comment + label glue (CI)
.github/workflows/
  validate.yml             # schema validation on PR
  auto-tag.yml             # auto-tagging on PR
  deploy.yml               # GitHub Pages deploy
```

## 💸 Cost

- **Total monthly cost: 0.** No server, no database, no paid auth, no paid LLM.
- The only optional "credentials" are free-tier API keys you create yourself.

## 📄 License

MIT — see [LICENSE](LICENSE). Content (prompts) is also MIT so anyone can fork and reuse.
