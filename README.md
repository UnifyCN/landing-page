# Unify Landing Page

Marketing + content website for **[Unify Social](https://unifysocial.ca)** — a newcomer settlement app for Canada.

Built with **Astro 6**, **Tailwind CSS v4**, and deployed on **Cloudflare Workers**.

> For agent/contributor conventions, design system details, and section-level rules, see [`CLAUDE.md`](./CLAUDE.md).

---

## Prerequisites

- **Node.js** ≥ 22.12.0 — [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node)

---

## Setup

```bash
git clone https://github.com/UnifyCN/landing-page.git
cd landing-page

npm install
npm run dev
```

The site runs at `http://localhost:4321`.

---

## Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Start local dev server (port 4321)             |
| `npm run build`          | Build for production                           |
| `npm run preview`        | Preview the production build locally           |
| `npm run generate-types` | Generate Cloudflare env types via Wrangler     |
| `npx wrangler deploy`    | Deploy the built output to Cloudflare Workers  |

---

## Environment Variables

The contact and partner-inquiry forms use Resend for email and Cloudflare Turnstile for spam protection. All keys are **optional for local dev** — the forms will gracefully skip verification/sending and still show a success state when keys are absent.

Create a `.dev.vars` file at the project root (gitignored):

```
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=...
CONTACT_TO_EMAIL=contact@unifysocial.ca
```

For production, add these as Cloudflare Workers secrets via the dashboard or:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put CONTACT_TO_EMAIL
```

Also: replace the placeholder Turnstile site keys (`0x4AAAAAAA_PLACEHOLDER_KEY`) in `src/components/sections/ContactForm.astro` and `src/components/sections/BecomePartner.astro` with the real site key at deploy time.

---

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). The workflow runs `npm ci`, `npm run build`, and `npx wrangler deploy` using `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

Manual deploy:

```bash
npm run build
npx wrangler login          # first time only
npx wrangler deploy
```

---

## Project Structure

```
src/
├── pages/            # Routes — index, about, community, contact, partners, blog, resources, legal
│   ├── api/          # POST /api/contact, POST /api/partner-inquiry
│   └── blog/         # Blog index + [slug] (Astro Content Collections)
├── layouts/          # BaseLayout (fonts, Navbar/Footer, View Transitions)
├── components/
│   ├── sections/     # Page sections (Hero, Problem, FAQ, CTABand, etc.)
│   ├── common/       # Navbar, Footer
│   └── blog/         # PostCard, PostNav
├── content/blog/     # Markdown blog posts (local, Content Collections)
├── content.config.ts # Zod schema for the blog collection
├── lib/
│   ├── partners.ts   # Typed partners data
│   ├── resources.ts  # Typed resources data
│   └── sanity/       # Sanity client/queries/types (stubbed — not yet wired)
└── styles/           # global.css (Tailwind v4 + @theme tokens), prose.css
public/               # Fonts, images, assets, app badges
```

---

## Content

### Blog

Blog posts live as markdown in `src/content/blog/`. The Zod schema is in `src/content.config.ts`:

```ts
{
  title: string,
  description: string,
  publishedAt: Date,
  updatedAt: Date?,
  thumbnail: string,     // path under /public
  craReference: string?, // optional CRA link for tax posts
  order: number          // sort desc
}
```

To add a post: drop a new `.md` file into `src/content/blog/` with the frontmatter above. Posts sort by `order` descending.

### Sanity

Sanity CMS is **stubbed but not yet integrated** (`src/lib/sanity/*.ts` are placeholders). The intent is to migrate content to Sanity at some point. Until then the blog runs on local markdown.

---

## Stack

- [Astro 6](https://astro.build) — SSR + view transitions
- [Tailwind CSS v4](https://tailwindcss.com) — tokens in `@theme` inside `src/styles/global.css`
- [Cloudflare Workers](https://workers.cloudflare.com) — deployment target
- [Resend](https://resend.com) — transactional email
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) — form spam protection
- [Zod](https://zod.dev) — runtime validation
- [Playwright](https://playwright.dev) — dev-only visual QA

---

## Agent Tooling (Claude Code)

- MCP config at `.mcp.json` — Playwright MCP is available after restart.
- This repo also uses Sanity MCP (for planned CMS integration) and PostHog MCP (for analytics).
- See `CLAUDE.md` for agent conventions, UI/UX skill stacking (`frontend-design` + `ui-ux-pro-max`), and section-level design rules.
