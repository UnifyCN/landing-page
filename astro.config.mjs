// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

const SITE = 'https://unifysocial.ca';

// Blog routes are SSR (live Sanity fetch), so @astrojs/sitemap can't see them at
// build time. Fetch the published posts from Sanity here and inject them into the
// sitemap via `customPages`, then stamp each one's <lastmod> in `serialize`.
async function blogSitemapEntries() {
  const groq = `*[_type == "post" && defined(slug.current)]{"slug": slug.current, publishedAt, updatedAt}`;
  const url = `https://j4gu2dbr.apicdn.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(groq)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000); // don't hang the build on a slow Sanity
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const { result = [] } = await res.json();
    return result.map((p) => {
      const entry = { url: `${SITE}/blog/${p.slug}` };
      // Per-entry date safety: a missing/invalid date must not drop every URL.
      const d = new Date(p.updatedAt ?? p.publishedAt ?? '');
      if (!Number.isNaN(d.getTime())) entry.lastmod = d.toISOString();
      return entry;
    });
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

const blogEntries = await blogSitemapEntries();
const blogLastmod = new Map(blogEntries.map((e) => [e.url, e.lastmod]));

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  output: 'server',
  // Inline each page's CSS into its HTML: the 2–3 small stylesheets per page
  // were render-blocking round trips (~0.35–0.5s on mobile, Lighthouse 2026-09-26).
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    // Dev only. Vite pre-bundles a dependency the first time a page asks for
    // it, then reloads every open page. A cold `astro dev` (CI, or the e2e
    // run) did that mid-test and wiped page state, so the form and nav tests
    // failed at random. Listing our late deps here bundles them at startup.
    optimizeDeps: {
      include: [
        'astro/virtual-modules/transitions.js',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-types.js',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-swap-functions.js',
        'posthog-js',
      ],
    },
    environments: {
      // Pages and API routes render in the workerd `ssr` environment:
      // ClientRouter imports transitions.js there, the forms' API routes zod
      // and resend.
      ssr: {
        optimizeDeps: {
          include: ['astro/virtual-modules/transitions.js', 'zod', 'resend'],
        },
      },
    },
  },
  integrations: [
    sitemap({
      // /events is SSR too (live Supabase). Its /events/<id>-<slug> detail pages
      // churn weekly, so they are left to discovery through the hub's links.
      customPages: [`${SITE}/events`, ...blogEntries.map((e) => e.url)],
      // /download is noindex: it forwards phones to their app store.
      filter: (page) => !/\/download\/?$/.test(page),
      serialize(item) {
        const lastmod = blogLastmod.get(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  adapter: cloudflare()
});