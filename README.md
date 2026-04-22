# Unify Landing Page

Marketing and content website for [Unify](https://unifysocial.ca) — a newcomer settlement app for Canada.

Built with Astro 6, Tailwind CSS v4, and deployed on Cloudflare Workers.

---

## Prerequisites

- **Node.js** >= 22.12.0 — [download](https://nodejs.org)
- **npm** (comes with Node)

---

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd landing-page

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

---

## Available Commands

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start local dev server at port 4321  |
| `npm run build`    | Build for production                 |
| `npm run preview`  | Preview the production build locally |

---

## Environment Variables

The contact and partner inquiry forms require these variables to send emails. They are **optional for local dev** — the forms will show a success state without actually sending anything if the keys are absent.

Create a `.dev.vars` file in the project root (never commit this):

```
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=...
CONTACT_TO_EMAIL=contact@unifysocial.ca
```

For production, add these as Cloudflare Workers secrets via the Cloudflare dashboard or `wrangler secret put`.

---

## Deployment

This project deploys to **Cloudflare Workers** via Wrangler.

```bash
# Build and deploy
npm run build
npx wrangler deploy
```

Make sure you're logged into Wrangler (`npx wrangler login`) and have the correct account configured in `wrangler.jsonc`.

---

## Stack

- [Astro 6](https://astro.build) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling (tokens in `src/styles/global.css`)
- [Cloudflare Workers](https://workers.cloudflare.com) — serverless deployment
- [Resend](https://resend.com) — transactional email (contact + partner forms)
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) — spam protection on forms
