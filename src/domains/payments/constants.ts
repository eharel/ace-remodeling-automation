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
  ASAF: 2, // Column B (checkbox)
  NAME: 3, // Column C
  PROJECT: 4, // Column D
  AMOUNT: 5, // Column E
  HOW: 6, // Column F
  COMMENT: 7, // Column G
  CONFIRMATION: 8, // Column H
  MURPHY: 9, // Column I
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
