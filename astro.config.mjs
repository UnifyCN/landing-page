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
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const { result = [] } = await res.json();
    return result.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastmod: new Date(p.updatedAt ?? p.publishedAt).toISOString(),
    }));
  } catch {
    return [];
  }
}

const blogEntries = await blogSitemapEntries();
const blogLastmod = new Map(blogEntries.map((e) => [e.url, e.lastmod]));

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      customPages: blogEntries.map((e) => e.url),
      serialize(item) {
        const lastmod = blogLastmod.get(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  adapter: cloudflare()
});