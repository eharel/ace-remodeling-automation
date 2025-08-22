/**
 * Data extraction for payments pipeline
 */

import { log } from "@/lib/logging";
import { MONTHLY_SHEET_REGEX } from "../constants";
import { PipelineRow, MonthlySheetData } from "../types";

/**
 * Extracts pipeline data from all monthly sheets in the spreadsheet
 */
export function extractPipelineData(): PipelineRow[] {
  log.info("Starting pipeline data extraction");

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = getMonthlySheetNames(ss);

  log.info(
    `Found ${sheetNames.length} monthly sheets: ${sheetNames.join(", ")}`
  );

  let allData: PipelineRow[] = [];

  for (const sheetName of sheetNames) {
    try {
      const sheetData = extractDataFromSheet(ss, sheetName);
      allData = allData.concat(sheetData);
      log.info(`Extracted ${sheetData.length} rows from ${sheetName}`);
    } catch (error) {
      log.error(`Failed to extract data from ${sheetName}:`, error);
    }
  }

  log.info(`Total rows extracted: ${allData.length}`);
  return allData;
}

/**
 * Gets all sheet names that match the monthly pattern
 */
function getMonthlySheetNames(
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet
): string[] {
  return ss
    .getSheets()
    .map((s) => s.getName())
    .filter((name) => MONTHLY_SHEET_REGEX.test(name))
    .sort(); // Sort for consistent ordering
}

/**
 * Extracts data from a single monthly sheet
 */
function extractDataFromSheet(
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string
): PipelineRow[] {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // Validate minimum data requirements
  if (lastRow < 2 || lastCol < 8) {
    log.warn(
      `Sheet ${sheetName} has insufficient data (${lastRow} rows, ${lastCol} columns)`
    );
    return [];
  }

  // Extract data starting from row 2 (skip header)
  const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const values = range.getValues().filter((row) => row[0] !== ""); // Filter empty rows

  return values.map((row) => transformRowData(row, sheetName));
}

/**
 * Transforms raw row data into a structured PipelineRow
 */
function transformRowData(row: any[], sheetName: string): PipelineRow {
  // Ensure 9 columns; pad if needed
  while (row.length < 9) row.push("");

  const date = row[0];
  const murphy = row[8]; // Could be from "Murphy" or "Shay" column

  // Compute month value for grouping
  const monthValue =
    date instanceof Date
      ? new Date(date.getFullYear(), date.getMonth(), 1)
      : "";

  return {
    date: date || "",
    projectName: row[1] || "",
    clientName: row[2] || "",
    amount: row[3] || "",
    status: row[4] || "",
    notes: row[5] || "",
    pm: row[6] || "",
    category: row[7] || "",
    murphy: murphy || "",
    monthValue: monthValue,
  };
}

/**
 * Gets detailed information about monthly sheets
 */
export function getMonthlySheetInfo(): MonthlySheetData[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = getMonthlySheetNames(ss);

  return sheetNames.map((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    const rowCount = sheet ? sheet.getLastRow() - 1 : 0; // Subtract header row

    return {
      sheetName,
      rows: extractDataFromSheet(ss, sheetName),
      rowCount: Math.max(0, rowCount),
    };
  });
}
