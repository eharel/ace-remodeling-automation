/**
 * Main pipeline manager for payments processing
 */

import { log } from "../../../lib/logging";
import {
  PIPELINE_SHEET_NAME,
  BUSINESS_HOURS,
  DATA_COLUMNS,
  PIPELINE_COLUMNS,
} from "../constants";
import { PipelineUpdateOptions } from "../types";
import { extractPipelineData } from "./data-extraction";
import {
  transformPipelineData,
  convertToSpreadsheetFormat,
  sortPipelineData,
} from "./data-transformation";
import {
  applyPipelineFormatting,
  handleCopyDateDown,
  handleClearDateIfRowEmpty,
  applyAsafCheckboxFormatting,
  applyEnhancedFormatting as applyEnhanced,
} from "./formatting";

/**
 * Main function to update the pipeline with current data
 */
export function updatePipeline(options: PipelineUpdateOptions = {}): void {
  log.info("Starting pipeline update");

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pipelineSheet = ss.getSheetByName(PIPELINE_SHEET_NAME);

  if (!pipelineSheet) {
    log.error("No '_pipeline' sheet found");
    return;
  }

  try {
    // Extract data from monthly sheets
    const rawData = extractPipelineData();

    if (rawData.length === 0) {
      log.warn("No data returned from monthly sheets");
      return;
    }

    // Transform and validate data
    const transformedData = transformPipelineData(rawData);

    // Sort data by date and project name
    const sortedData = sortPipelineData(transformedData);

    // Convert to spreadsheet format
    const spreadsheetData = convertToSpreadsheetFormat(sortedData);

    // Clear existing content and write new data
    pipelineSheet.clearContents();
    pipelineSheet
      .getRange(1, 1, spreadsheetData.length, spreadsheetData[0].length)
      .setValues(spreadsheetData);

    // Apply formatting if requested
    if (options.applyFormatting !== false) {
      applyPipelineFormatting(pipelineSheet);
    }

    log.info(
      `Pipeline updated successfully with ${spreadsheetData.length} rows`
    );
  } catch (error) {
    log.error("Failed to update pipeline:", { error: String(error) });
    throw error;
  }
}

/**
 * Auto-update function that respects business hours
 */
export function autoUpdatePipeline(): void {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Check if within business hours
  const isBusinessHour =
    day >= BUSINESS_HOURS.startDay &&
    day <= BUSINESS_HOURS.endDay &&
    hour >= BUSINESS_HOURS.startHour &&
    hour <= BUSINESS_HOURS.endHour;

  if (!isBusinessHour) {
    log.info("Skipped pipeline update: Outside business hours");
    return;
  }

  log.info("Auto-updating pipeline during business hours");
  updatePipeline({ applyFormatting: true });
}

/**
 * Handles edit events on monthly sheets
 */
export function handleMonthlySheetEdit(
  e: GoogleAppsScript.Events.SheetsOnEdit
): void {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  if (!isMonthlyTab(sheetName)) return;

  const startRow = e.range.getRow();
  const numRows = e.range.getNumRows();
  const col = e.range.getColumn();

  // Check for Asaf checkbox edits (column B)
  if (col === PIPELINE_COLUMNS.ASAF) {
    log.info(`Processing Asaf checkbox edit in column ${col}`);
  }

  // Process edits in columns C–H (3–8) for date copying and clearing
  if (col >= DATA_COLUMNS.start && col <= DATA_COLUMNS.end) {
    for (let i = 0; i < numRows; i++) {
      const row = startRow + i;
      handleCopyDateDown(sheet, row);
      handleClearDateIfRowEmpty(sheet, row);
    }
  }

  // Execute Asaf formatting work
  if (col === PIPELINE_COLUMNS.ASAF) {
    // Column B - Asaf checkbox
    for (let i = 0; i < numRows; i++) {
      const row = startRow + i;
      applyAsafCheckboxFormatting(sheet, row);
    }
  }

  // Apply date group borders (always needed for visual consistency)
  applyDateGroupBorders(sheet);
}

/**
 * Checks if a sheet name matches the monthly pattern
 */
function isMonthlyTab(name: string): boolean {
  return /^\w+ \d{4}$/.test(name);
}

/**
 * Applies date group borders to a sheet
 */
function applyDateGroupBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void {
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  const dateValues = sheet
    .getRange(2, 1, lastRow - 1)
    .getValues()
    .map((row) => row[0]);

  // Clear previous borders
  sheet
    .getRange("A2:I" + lastRow)
    .setBorder(false, null, false, null, false, false);

  // Add borders between different dates
  for (let i = 1; i < dateValues.length - 1; i++) {
    const current = dateValues[i];
    const next = dateValues[i + 1];

    if (current && next && current.toString() !== next.toString()) {
      sheet
        .getRange(i + 2, 1, 1, 9)
        .setBorder(
          false,
          false,
          true,
          false,
          false,
          false,
          "black",
          SpreadsheetApp.BorderStyle.SOLID_MEDIUM
        );
    }
  }
}

/**
 * Sets up the spreadsheet menu
 */
export function setupPipelineMenu(): void {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Ace Remodeling")
    .addItem("Refresh Pipeline", "updatePipeline")
    .addItem("Auto Update Pipeline", "autoUpdatePipeline")
    .addItem("Apply Formatting", "applyPipelineFormatting")
    .addSeparator()
    .addItem("Enhanced Formatting", "applyEnhancedFormatting")
    .addToUi();
}

/**
 * Applies enhanced formatting with all options enabled
 */
export function applyEnhancedFormatting(): void {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pipelineSheet = ss.getSheetByName(PIPELINE_SHEET_NAME);

  if (!pipelineSheet) {
    log.error("No '_pipeline' sheet found");
    return;
  }

  // Apply enhanced formatting directly
  applyEnhanced(pipelineSheet, {
    alternateRowColors: true,
    highlightToday: true,
    boldAmounts: true,
    colorCodePMs: true,
  });

  log.info("Enhanced formatting applied");
}

/**
 * Gets pipeline statistics
 */
export function getPipelineStats(): {
  totalRows: number;
  totalAmount: number;
  byStatus: Record<string, number>;
  byPM: Record<string, number>;
} {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pipelineSheet = ss.getSheetByName(PIPELINE_SHEET_NAME);

  if (!pipelineSheet) {
    return { totalRows: 0, totalAmount: 0, byStatus: {}, byPM: {} };
  }

  const lastRow = pipelineSheet.getLastRow();
  if (lastRow < 2) {
    return { totalRows: 0, totalAmount: 0, byStatus: {}, byPM: {} };
  }

  const data = pipelineSheet.getRange(2, 1, lastRow - 1, 9).getValues();

  let totalAmount = 0;
  const byStatus: Record<string, number> = {};
  const byPM: Record<string, number> = {};

  data.forEach((row) => {
    // Calculate total amount
    const amount = parseFloat(row[3]) || 0;
    totalAmount += amount;

    // Count by status
    const status = row[4] || "Unknown";
    byStatus[status] = (byStatus[status] || 0) + 1;

    // Count by PM
    const pm = row[6] || "Unknown";
    byPM[pm] = (byPM[pm] || 0) + 1;
  });

  return {
    totalRows: data.length,
    totalAmount,
    byStatus,
    byPM,
  };
}
