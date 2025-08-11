/**
 * Creates an email HYPERLINK formula
 */
export function createEmailLinkFormula(email: string): string {
  if (!email) return "";
  return `=HYPERLINK("mailto:${email}", "${email}")`;
}

/**
 * Creates a Google Maps HYPERLINK formula for an address
 */
export function createMapsLinkFormula(address: string): string {
  if (!address) return "";
  const encodedAddress = encodeURIComponent(address);
  return `=HYPERLINK("https://www.google.com/maps/search/?api=1&query=${encodedAddress}", "${address}")`;
}

/**
 * Creates a website HYPERLINK formula
 */
export function createWebsiteLinkFormula(website: string): string {
  if (!website) return "";

  // Ensure the URL has a protocol
  let url = website.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Extract display name (remove protocol for cleaner display)
  const displayName = url.replace(/^https?:\/\//, "");

  return `=HYPERLINK("${url}", "${displayName}")`;
}

/**
 * Returns the email link formula if the email is valid, otherwise empty string
 */
export function getEmailLinkFormula(email: string): string {
  if (!email || !email.includes("@")) return "";
  return createEmailLinkFormula(email);
}

/**
 * Returns the Google Maps link formula if the location is valid, otherwise empty string
 */
export function getLocationLinkFormula(location: string): string {
  if (!location || !location.trim()) return "";
  return createMapsLinkFormula(location);
}

/**
 * Returns the website link formula if the website is valid, otherwise empty string
 */
export function getWebsiteLinkFormula(website: string): string {
  if (!website || !website.trim()) return "";
  return createWebsiteLinkFormula(website);
}

/**
 * Finds the last row that actually contains data by checking column A
 * Ignores empty cells, headers, placeholders, and formulas
 */
export function findLastRowWithContent(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  placeholderKeywords: string[]
): number {
  const lastRow = sheet.getLastRow();

  if (lastRow === 0) return 0;

  // Start from the last row and work backwards
  for (let row = lastRow; row >= 1; row--) {
    // Only check column A (Names)
    const nameCell = sheet.getRange(row, 1);
    const nameValue = String(nameCell.getValue()).trim();

    // Skip empty cells
    if (!nameValue) continue;

    // Skip header row (row 1)
    if (row === 1) continue;

    // Skip placeholder/smart table content in Names column
    const isPlaceholder = placeholderKeywords.some((placeholder) =>
      nameValue.toLowerCase().includes(placeholder.toLowerCase())
    );

    if (isPlaceholder) continue;

    // Skip cells that look like formulas
    const isFormula =
      nameValue.startsWith("=") ||
      nameValue.includes("{{") ||
      nameValue.includes("}}");
    if (isFormula) continue;

    // If we get here, it's a real company name
    return row;
  }

  // If no data found, return 1 (header row)
  return 1;
}
