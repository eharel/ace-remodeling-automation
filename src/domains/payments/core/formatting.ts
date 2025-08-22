/**
 * Formatting utilities for payments pipeline
 */

import { log } from "@/lib/logging";
import { PIPELINE_COLUMNS, DATA_COLUMNS, BORDER_STYLE } from "../constants";
import { DateGroupBorder } from "../types";

/**
 * Applies comprehensive formatting to the pipeline sheet
 */
export function applyPipelineFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void {
  log.info("Applying pipeline formatting");

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    log.warn("No data to format");
    return;
  }

  // Apply basic formatting
  applyBasicFormatting(sheet, lastRow);

  // Apply date group borders
  applyDateGroupBorders(sheet);

  // Apply conditional formatting
  applyConditionalFormatting(sheet, lastRow);

  // Apply column-specific formatting
  applyColumnFormatting(sheet, lastRow);

  log.info("Pipeline formatting completed");
}

/**
 * Applies basic formatting to the entire sheet
 */
function applyBasicFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  // Set column widths
  const columnWidths = [80, 200, 150, 100, 100, 200, 100, 100, 100];
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 9);
  headerRange
    .setFontWeight("bold")
    .setBackground("#4285f4")
    .setFontColor("white")
    .setHorizontalAlignment("center");

  // Set header values
  const headers = [
    "Date",
    "Project Name",
    "Client Name",
    "Amount",
    "Status",
    "Notes",
    "PM",
    "Category",
    "Murphy",
  ];
  headerRange.setValues([headers]);
}

/**
 * Applies date group borders to separate different dates
 */
export function applyDateGroupBorders(
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
          BORDER_STYLE.color,
          BORDER_STYLE.style
        );
    }
  }
}

/**
 * Applies conditional formatting based on status and other criteria
 */
function applyConditionalFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  // Status-based formatting
  const statusRange = sheet.getRange(
    2,
    PIPELINE_COLUMNS.STATUS,
    lastRow - 1,
    1
  );

  // Create conditional formatting rules
  const rules = [
    // Completed projects - green background
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Completed")
      .setBackground("#d4edda")
      .setFontColor("#155724")
      .setRanges([statusRange])
      .build(),

    // Pending projects - yellow background
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pending")
      .setBackground("#fff3cd")
      .setFontColor("#856404")
      .setRanges([statusRange])
      .build(),

    // Cancelled projects - red background
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Cancelled")
      .setBackground("#f8d7da")
      .setFontColor("#721c24")
      .setRanges([statusRange])
      .build(),
  ];

  sheet.setConditionalFormatRules(rules);
}

/**
 * Applies column-specific formatting
 */
function applyColumnFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  // Date column formatting
  const dateRange = sheet.getRange(2, PIPELINE_COLUMNS.DATE, lastRow - 1, 1);
  dateRange.setNumberFormat("m/d/yyyy");

  // Amount column formatting
  const amountRange = sheet.getRange(
    2,
    PIPELINE_COLUMNS.AMOUNT,
    lastRow - 1,
    1
  );
  amountRange.setNumberFormat("$#,##0.00");

  // Notes column - wrap text
  const notesRange = sheet.getRange(2, PIPELINE_COLUMNS.NOTES, lastRow - 1, 1);
  notesRange.setWrap(true);
}

/**
 * Handles smart date copying when editing data columns
 */
export function handleCopyDateDown(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
): void {
  const dateCell = sheet.getRange(row, PIPELINE_COLUMNS.DATE);
  if (!dateCell.isBlank()) return;

  const aboveDate = sheet.getRange(row - 1, PIPELINE_COLUMNS.DATE).getValue();
  if (aboveDate) {
    dateCell.setValue(aboveDate);
    log.info(`Copied date from row ${row - 1} to row ${row}`);
  }
}

/**
 * Clears date if the row has no data in columns C-H
 */
export function handleClearDateIfRowEmpty(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
): void {
  const range = sheet.getRange(
    row,
    DATA_COLUMNS.start,
    1,
    DATA_COLUMNS.end - DATA_COLUMNS.start + 1
  );
  const values = range.getValues()[0];
  const allEmpty = values.every((cell) => cell === "" || cell === null);

  if (allEmpty) {
    sheet.getRange(row, PIPELINE_COLUMNS.DATE).clearContent();
    log.info(`Cleared date from row ${row} - no data in columns C-H`);
  }
}

/**
 * Applies enhanced formatting options
 */
export function applyEnhancedFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  options: {
    alternateRowColors?: boolean;
    highlightToday?: boolean;
    boldAmounts?: boolean;
    colorCodePMs?: boolean;
  } = {}
): void {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // Alternate row colors
  if (options.alternateRowColors) {
    applyAlternateRowColors(sheet, lastRow);
  }

  // Highlight today's entries
  if (options.highlightToday) {
    highlightTodayEntries(sheet, lastRow);
  }

  // Bold amounts
  if (options.boldAmounts) {
    const amountRange = sheet.getRange(
      2,
      PIPELINE_COLUMNS.AMOUNT,
      lastRow - 1,
      1
    );
    amountRange.setFontWeight("bold");
  }

  // Color code PMs
  if (options.colorCodePMs) {
    applyPMColorCoding(sheet, lastRow);
  }
}

/**
 * Applies alternate row colors for better readability
 */
function applyAlternateRowColors(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 9);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied("=MOD(ROW(),2)=0")
      .setBackground("#f8f9fa")
      .setRanges([dataRange])
      .build(),
  ];

  sheet.setConditionalFormatRules(rules);
}

/**
 * Highlights entries from today
 */
function highlightTodayEntries(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  const today = new Date();
  const dateRange = sheet.getRange(2, PIPELINE_COLUMNS.DATE, lastRow - 1, 1);

  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(
        `=A2=DATE(${today.getFullYear()},${
          today.getMonth() + 1
        },${today.getDate()})`
      )
      .setBackground("#e3f2fd")
      .setFontColor("#1565c0")
      .setRanges([dateRange])
      .build(),
  ];

  sheet.setConditionalFormatRules(rules);
}

/**
 * Applies color coding to different PMs
 */
function applyPMColorCoding(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRow: number
): void {
  const pmRange = sheet.getRange(2, PIPELINE_COLUMNS.PM, lastRow - 1, 1);

  // Define PM colors (you can customize these)
  const pmColors = {
    John: "#ffebee", // Light red
    Sarah: "#e8f5e8", // Light green
    Mike: "#fff3e0", // Light orange
    Lisa: "#f3e5f5", // Light purple
  };

  const rules = Object.entries(pmColors).map(([pm, color]) =>
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(pm)
      .setBackground(color)
      .setRanges([pmRange])
      .build()
  );

  sheet.setConditionalFormatRules(rules);
}
