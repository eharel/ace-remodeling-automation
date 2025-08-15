export function getCheckboxValues(field: string): string[] {
  return field
    .split(",")
    .map((val) => val.trim())
    .filter(Boolean);
}

export function parseDateField(input: string): Date | null {
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

export function getFileUploadUrls(field: string): string[] {
  return field
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http"));
}

export function parseYesNo(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  return normalized === "yes" || normalized === "true" || normalized === "1";
}

export function validateRequiredFields(
  data: Record<string, string>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter((field) => !data[field]?.trim());
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}
