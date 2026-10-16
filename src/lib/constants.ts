// Shared client + build constants. Keep in sync with content.config.ts.

export const CATEGORIES = [
  { id: 'writing', label: 'Writing' },
  { id: 'coding', label: 'Coding' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'creative', label: 'Creative' },
  { id: 'learning', label: 'Learning' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'automation', label: 'Automation' }
] as const;

export const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', color: 'text-zinc-300 bg-zinc-800/60 border-zinc-700' },
  { id: 'intermediate', label: 'Intermediate', color: 'text-zinc-200 bg-zinc-800 border-zinc-600' },
  { id: 'advanced', label: 'Advanced', color: 'text-zinc-100 bg-zinc-700 border-zinc-500' }
] as const;

export function categoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: id };
}

export function difficultyMeta(id: string) {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}
