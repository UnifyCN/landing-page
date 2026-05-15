// Safely serialize a JSON-LD object for embedding inside a <script> tag.
// Replaces </script with <\/script so user content can never break out.
export function serializeLd(ld: Record<string, unknown>): string {
  return JSON.stringify(ld).replace(/<\/script/gi, '<\\/script');
}
