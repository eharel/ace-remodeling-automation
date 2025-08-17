/**
 * Canonicalizes form question titles by normalizing spacing around the bilingual slash.
 *
 * Converts variations like:
 * - "Email/ Correo electrónico"
 * - "Email /Correo electrónico"
 * - "Email /  Correo electrónico"
 * - "Email／Correo electrónico" (full-width slash)
 *
 * All to the standard format: "Email / Correo electrónico"
 */
export function canonicalizeTitle(title: string): string {
  return String(title ?? "")
    .replace(/[\/\uFF0F]/g, "/") // normalize full-width slash to ASCII
    .replace(/\s*\/\s*/g, " / ") // normalize spaces around slash
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}
