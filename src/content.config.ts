import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const categories = [
  'writing',
  'coding',
  'productivity',
  'analysis',
  'creative',
  'learning',
  'marketing',
  'automation'
] as const;

export const difficulties = ['beginner', 'intermediate', 'advanced'] as const;

const prompt = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prompts' }),
  schema: z.object({
    title: z.string().min(3).max(140),
    description: z.string().min(10).max(320),
    category: z.enum(categories),
    tags: z.array(z.string().min(2).max(40)).min(1).max(8),
    difficulty: z.enum(difficulties),
    model: z.string().min(1).max(80).default('any'),
    author: z.string().min(1).max(80).default('community'),
    created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    upvotes: z.number().int().min(0).default(0),
    downvotes: z.number().int().min(0).default(0),
    version: z.number().int().positive().default(1)
  })
});

const path = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paths' }),
  schema: z.object({
    title: z.string().min(3).max(140),
    description: z.string().min(10).max(320),
    level: z.enum(['start', 'advance', 'master']),
    order: z.number().int().min(1),
    // prompt ids (filenames without extension) that belong to this path
    prompts: z.array(z.string()).min(1).max(60)
  })
});

const tool = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string().min(3).max(140),
    description: z.string().min(10).max(320),
    category: z.enum(categories),
    kind: z.enum(['free-api', 'local', 'platform', 'utility']),
    url: z.string().url().optional(),
    free: z.boolean().default(true)
  })
});

export const collections = { prompt, path, tool };
