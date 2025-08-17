/**
 * Formats phone numbers to a consistent format
 * Options: "raw" (XXXXXXXXXX), "dashed" (XXX-XXX-XXXX), "simple" (XXX-XXXXXXX), "parentheses" ((XXX) XXX-XXXX)
 */
export function formatPhoneNumber(
  phone: string,
  format: "raw" | "dashed" | "simple" | "parentheses" = "parentheses"
): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If not enough digits, return as-is
  if (digits.length < 10) return phone;

  switch (format) {
    case "raw":
      return digits;
    case "simple":
      // Format as XXX-XXXXXXX (area code + 7 digits)
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    case "dashed":
      // Format as XXX-XXX-XXXX (standard US format)
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    case "parentheses":
    default:
      // Format as (XXX) XXX-XXXX (most human-friendly)
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
  }
}

/**
 * Safely normalizes phone numbers for sheet cells
 *
 * If input contains exactly one US phone number (with optional +1 and extension),
 * formats it nicely. Otherwise, leaves the input unchanged.
 */
export function normalizePhoneCell(raw: string): string {
  if (!raw) return "";
  const text = String(raw).trim();

  // Match US phone numbers with optional +1 and extensions
  const re =
    /(?:\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}(?:\s*(?:x|ext\.?|#)\s*\d{1,6})?/gi;
  const matches = [...text.matchAll(re)];
  if (matches.length !== 1) return text;

  const full = matches[0][0];

  // Extract extension first
  const extMatch = full.match(/(?:x|ext\.?|#)\s*(\d{1,6})/i);
  const ext = extMatch ? extMatch[1] : "";

  // Remove extension from the phone part for digit extraction
  const phonePart = extMatch ? full.substring(0, extMatch.index) : full;
  const digits = phonePart.replace(/\D/g, "");

  // Handle 11-digit numbers starting with 1
  const core =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (core.length !== 10) return text;

  // Check if anything meaningful remains after removing the phone number
  const without = text
    .replace(full, "")
    .replace(/[\s\-\.\(\)\+]/g, "")
    .replace(/(ext|x|#)\d{0,6}/gi, "")
    .trim();

  if (without.length > 0) return text;

  const formatted = formatPhoneNumber(core, "parentheses");
  return ext ? `${formatted} x${ext}` : formatted;
}
