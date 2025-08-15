export * from "./debounce";
export * from "./sheets";
export * from "./register-globals";
export * from "./format-phone";
export * from "./normalize";

// Helper function to extract English part from bilingual labels
export function toEnglish(label: string): string {
  return label.split("/")[0].trim();
}
