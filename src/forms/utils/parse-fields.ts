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
