// Markdown helpers shared by pages and scripts.

/** Extract the first fenced code block (the copyable "prompt"). */
export function extractPromptBlock(md: string): string {
  const m = md.match(/```[^\n]*\n([\s\S]*?)\n?```/);
  return m ? m[1].trim() : md.trim();
}

/** Find all {{variable}} placeholders in a prompt. */
export function extractVariables(text: string): string[] {
  const set = new Set<string>();
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) set.add(m[1]);
  return [...set];
}

/** Substitute {{variables}} with values. */
export function fillVariables(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k: string) =>
    values[k] !== undefined && values[k] !== '' ? values[k] : `{{${k}}}`
  );
}
