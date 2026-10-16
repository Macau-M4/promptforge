// Trending = score × recency. score = upvotes - downvotes;
// recency is a decay so newer content ranks higher than old content
// with the same score. Pure function → unit-testable and reused in CI.

export interface Voteable {
  id: string;
  upvotes: number;
  downvotes: number;
  updated: string; // ISO date YYYY-MM-DD
}

export function score(v: Pick<Voteable, 'upvotes' | 'downvotes'>): number {
  return v.upvotes - v.downvotes;
}

/** Days since a YYYY-MM-DD date (0 if in the future). */
export function ageInDays(date: string, now: Date = new Date()): number {
  const t = new Date(date + 'T00:00:00Z').getTime();
  const ms = now.getTime() - t;
  return Math.max(0, ms / 86_400_000);
}

/** Gravity controls how fast older content decays. 7 = "about a week" half-life feel. */
export function recencyFactor(date: string, now: Date = new Date(), gravity = 7): number {
  const days = ageInDays(date, now);
  return 1 / (1 + days / gravity);
}

export function trending(v: Voteable, now: Date = new Date(), gravity = 7): number {
  return score(v) * recencyFactor(v.updated, now, gravity);
}

export function sortByTrending<T extends Voteable>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => trending(b) - trending(a) || score(b) - score(a) || b.upvotes - a.upvotes
  );
}

export function sortByTop<T extends Voteable>(items: T[]): T[] {
  return [...items].sort((a, b) => score(b) - score(a));
}

export function sortByNewest<T extends Voteable>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0));
}
