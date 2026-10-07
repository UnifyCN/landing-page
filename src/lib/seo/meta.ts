// Length guards for <title> and meta descriptions built from data. Google cuts
// titles near 60 characters and descriptions near 160; past that the end of the
// sentence, often the useful part, is replaced by an ellipsis.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/** The first candidate that fits in a title, else the last (shortest) one. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((c) => c.length <= TITLE_MAX) ?? candidates[candidates.length - 1];
}

/**
 * A description that fits. Returns `text` unchanged when it is short enough;
 * otherwise keeps whole sentences if that leaves a useful amount, and failing
 * that cuts at a word and ends with an ellipsis. A safety net for data-driven
 * pages: prefer writing a short `seoDescription` in the data file.
 */
export function fitDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const sentences = clean.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];
  let kept = "";
  for (const sentence of sentences) {
    if ((kept + sentence).trim().length > max) break;
    kept += sentence;
  }
  kept = kept.trim();
  if (kept.length >= max * 0.6) return kept;

  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-]+$/, "")}…`;
}

/** The first candidate that fits in a description, else the last one, fitted. */
export function pickDescription(...candidates: string[]): string {
  return candidates.find((c) => c.length <= DESCRIPTION_MAX) ?? fitDescription(candidates[candidates.length - 1]);
}
