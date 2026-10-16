import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'https://promptforge.pages.dev';
  const base = import.meta.env.BASE_URL || '/';
  const prompts = await getCollection('prompt');
  const paths = await getCollection('path');
  const tools = await getCollection('tool');

  const staticRoutes = ['', 'paths', 'tools', 'run', 'contribute', 'about'];
  const urls = [
    ...staticRoutes.map((r) => ({ loc: `${origin}${base}${r}`, lastmod: new Date().toISOString().slice(0, 10) })),
    ...prompts.map((p) => ({ loc: `${origin}${base}prompts/${p.id}`, lastmod: p.data.updated })),
    ...paths.map((p) => ({ loc: `${origin}${base}paths/${p.id}`, lastmod: new Date().toISOString().slice(0, 10) })),
    ...tools.map((t) => ({ loc: `${origin}${base}tools/${t.id}`, lastmod: new Date().toISOString().slice(0, 10) }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
