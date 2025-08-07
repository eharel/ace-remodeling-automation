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
