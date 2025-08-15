/**
 * General-purpose string normalization utilities
 */

/**
 * Normalizes a string for case-insensitive, whitespace-insensitive matching.
 * Handles accents, diacritics, dashes, colons, and whitespace variations.
 */
export function normalizeString(label: string): string {
  return (label || "")
    .normalize("NFKD") // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[‐-–—]/g, "-") // normalize all dashes
    .replace(/[:：]/g, "") // remove colons
    .replace(/\s+/g, " ") // collapse internal whitespace
    .toLowerCase()
    .trim();
}
