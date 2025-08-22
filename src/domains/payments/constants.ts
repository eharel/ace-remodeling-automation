/**
 * Payments domain constants
 */

// Sheet naming patterns
export const MONTHLY_SHEET_REGEX = /^\w+ \d{4}$/; // Matches e.g. "May 2025"
export const PIPELINE_SHEET_NAME = "_pipeline";

// Business hours configuration
export const BUSINESS_HOURS = {
  startHour: 7,
  endHour: 18,
  startDay: 1, // Monday
  endDay: 5, // Friday
} as const;

// Column configurations
export const PIPELINE_COLUMNS = {
  DATE: 1, // Column A
  PROJECT_NAME: 2, // Column B
  CLIENT_NAME: 3, // Column C
  AMOUNT: 4, // Column D
  STATUS: 5, // Column E
  NOTES: 6, // Column F
  PM: 7, // Column G
  CATEGORY: 8, // Column H
  MURPHY: 9, // Column I (formerly "Shay")
} as const;

// Data processing columns (C-H for validation)
export const DATA_COLUMNS = {
  start: 3, // Column C
  end: 8, // Column H
} as const;

// Formatting constants
export const BORDER_STYLE = {
  color: "black",
  style: SpreadsheetApp.BorderStyle.SOLID_MEDIUM,
} as const;

// Menu configuration
export const MENU_CONFIG = {
  title: "Ace Remodeling",
  items: [
    { name: "Refresh Pipeline", function: "updatePipeline" },
    { name: "Auto Update Pipeline", function: "autoUpdatePipeline" },
    { name: "Apply Formatting", function: "applyPipelineFormatting" },
  ],
} as const;
