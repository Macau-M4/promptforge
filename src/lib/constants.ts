// Shared client + build constants. Keep in sync with content.config.ts.

export const CATEGORIES = [
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'productivity', label: 'Productivity', emoji: '⚡' },
  { id: 'analysis', label: 'Analysis & Research', emoji: '🔬' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
  { id: 'marketing', label: 'Marketing', emoji: '📣' },
  { id: 'automation', label: 'Automation', emoji: '🤖' }
] as const;

export const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'intermediate', label: 'Intermediate', color: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
  { id: 'advanced', label: 'Advanced', color: 'text-rose-300 bg-rose-500/10 border-rose-500/30' }
] as const;

export function categoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: id, emoji: '📦' };
}

export function difficultyMeta(id: string) {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}
