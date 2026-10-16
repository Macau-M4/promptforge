// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// PUBLIC_SITE  : canonical URL, e.g. https://USER.github.io/REPO  (used for sitemap/og/atom)
// PUBLIC_BASE  : base path, default "/" for a *.github.io user site or a custom root;
//                set to "/repo/" when hosted as a GitHub Pages *project* site.
export default defineConfig({
  site: process.env.PUBLIC_SITE || 'https://promptforge.pages.dev',
  base: process.env.PUBLIC_BASE || '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [tailwind()],
});
