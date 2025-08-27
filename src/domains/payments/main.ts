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

// Google Apps Script event handlers (like PM toolkit)
export function onOpen() {
  log.info("🚀 onOpen triggered for payments domain");
  setupPipelineMenu();
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  // Handle edits in monthly sheets
  if (isMonthlySheet(sheetName)) {
    handleMonthlySheetEdit(e);
  }
}

// Helper function to check if a sheet is a monthly sheet
function isMonthlySheet(sheetName: string): boolean {
  return /^\w+ \d{4}$/.test(sheetName);
}

// Export functions for Google Apps Script (simplified like PM toolkit)
export {
  updatePipeline,
  autoUpdatePipeline,
  applyPipelineFormatting,
  applyAsafCheckboxFormatting,
  getPipelineStats,
};
