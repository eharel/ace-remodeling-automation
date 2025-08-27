/**
 * Main entry point for payments domain
 * This file exports all functions that need to be accessible from Google Apps Script
 */

import { log } from "@/lib/logging";
import {
  updatePipeline,
  autoUpdatePipeline,
  handleMonthlySheetEdit,
  setupPipelineMenu,
  getPipelineStats,
} from "./core/pipeline-manager";
import {
  applyPipelineFormatting,
  applyAsafCheckboxFormatting,
} from "./core/formatting";
import { showWeeklySummary, refreshSummary } from "./core/weekly-summary";

// Google Apps Script event handlers (like PM toolkit)
export function onOpen() {
  log.info("🚀 onOpen triggered for payments domain");
  setupPipelineMenu();

  // Auto-open weekly summary sidebar if on a monthly sheet
  const activeSheet = SpreadsheetApp.getActiveSheet();
  const sheetName = activeSheet.getName();

  if (isMonthlySheet(sheetName)) {
    log.info("Auto-opening weekly summary for monthly sheet", { sheetName });
    showWeeklySummary();
  }
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  // Handle edits in monthly sheets
  if (isMonthlySheet(sheetName)) {
    handleMonthlySheetEdit(e);
  }
}

// Note: Google Apps Script doesn't have a built-in onSelectionChange trigger
// The sidebar will open automatically on spreadsheet open if on a monthly sheet
// Users can also manually open it via the menu

// Helper function to check if a sheet is a monthly sheet
function isMonthlySheet(sheetName: string): boolean {
  return /^\w+ \d{4}$/.test(sheetName);
}

// Export functions for Google Apps Script (simplified like PM toolkit)
export {
  updatePipeline,
  applyAsafCheckboxFormatting,
  getPipelineStats,
  showWeeklySummary,
  refreshSummary,
};
