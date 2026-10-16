import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? 'https://promptforge.pages.dev';
  const base = import.meta.env.BASE_URL || '/';
  const prompts = await getCollection('prompt');
  const items = prompts
    .sort((a, b) => (a.data.updated < b.data.updated ? 1 : -1))
    .slice(0, 50)
    .map((p) => `  <item>
    <title>${p.data.title}</title>
    <link>${origin}${base}prompts/${p.id}</link>
    <guid>${origin}${base}prompts/${p.id}</guid>
    <pubDate>${new Date(p.data.updated + 'T00:00:00Z').toUTCString()}</pubDate>
    <description>${p.data.description}</description>
  </item>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>PromptForge</title>
    <link>${origin}${base}</link>
    <description>The free, open-source library of AI prompts, commands, tools and workflows.</description>
${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
