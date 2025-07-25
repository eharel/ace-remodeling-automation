import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "./data-extraction";
import { transformData } from "./data-transformation";
import { PMDashboardData } from "./data-transformation";
import { createHeader } from "../../shared/dashboard";
import { renderMonthlyAndQuarterlyBreakdowns } from "../../shared/dashboard/render-dual-tables";
import {
  MONTHLY_TITLE,
  QUARTERLY_TITLE,
  TITLE_BACKGROUND_COLOR,
} from "../../shared/constants";
import { LEADS_COLUMNS, QUARTER_COLUMNS } from "../../shared/columns";

export function generateOverviewDashboard() {
  const year = 2025; // TODO: make this dynamic
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const inputRowsByPM = extractData();
  const dashboardRowsByPM = transformData(inputRowsByPM, year);
  renderDashboard(year, sheet, dashboardRowsByPM);
  sheet.setFrozenRows(5);
  sheet.setFrozenColumns(2);
}

function renderDashboard(
  year: number,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dashboardRowsByPM: Record<string, PMDashboardData>
) {
  let currentRow = createMasterHeader(sheet, year);
  createPMHeader(sheet);
  currentRow = createMasterSummary(sheet, currentRow);
  const entries = Object.entries(dashboardRowsByPM);

  for (const [
    index,
    [pmName, { monthly, quarterly, rowSpanMap }],
  ] of entries.entries()) {
    const isFirst = index === 0;
    const isLast = index === entries.length - 1;

    const { monthlyInfo, quarterlyInfo } = renderMonthlyAndQuarterlyBreakdowns({
      sheet,
      year,
      startRow: currentRow,
      startCol: 2,
      monthlyDashboardRows: monthly,
      quarterlyDashboardRows: quarterly,
      quarterRowSpanMap: rowSpanMap,
      showDescription: false,
      monthlyTitle: isFirst ? MONTHLY_TITLE : undefined,
      quarterlyTitle: isFirst ? QUARTERLY_TITLE : undefined,
      hasHeaders: isFirst,
    });

    // Create PM name section (Google Sheets API: row, column, numRows, numColumns)
    const pmNameRow = monthlyInfo.dataStartRow;
    const pmNameColumn = 1; // Leftmost column
    const pmNameNumRows = monthlyInfo.endRow - monthlyInfo.dataStartRow + 1;
    const pmNameNumColumns = 1;

    createPMNameSection(
      sheet,
      pmNameRow,
      pmNameColumn,
      pmNameNumRows,
      pmNameNumColumns,
      pmName
    );

    currentRow = monthlyInfo.endRow;

    if (!isLast) {
      currentRow += 1;
      // Create separator (Google Sheets API: row, column, numRows, numColumns)
      const separatorRow = currentRow;
      const separatorColumn = 2;
      const separatorNumRows = 1;
      const separatorNumColumns = quarterlyInfo.endCol - 1;

      createSeparator(
        sheet,
        separatorRow,
        separatorColumn,
        separatorNumRows,
        separatorNumColumns
      );
      currentRow += 1;
    }
  }
}

function createMasterSummary(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  currentRow: number
) {
  // At the current row, create a summary row with the title "Master Summary (Placeholder)"
  // Google Sheets API: (row, column, numRows, numColumns)
  const row = currentRow;
  const column = 2;
  const numRows = 1;
  const numColumns = 1;

  const summaryRow = sheet.getRange(row, column, numRows, numColumns);
  summaryRow.setValue("Master Summary (Placeholder)");

  return currentRow + 1;
}

export function applyBottomBorder(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  numRows: number,
  numColumns: number
) {
  sheet
    .getRange(row, column, numRows, numColumns)
    .setBorder(
      true,
      false,
      false,
      false,
      false,
      false,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
}

function createMasterHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number
) {
  // End row should be the width of the tables
  const totalTableWidth = LEADS_COLUMNS.length + QUARTER_COLUMNS.length;
  const frozenColumns = 2; // Number of columns we're freezing
  
  // Balance the layout: exclude frozen columns from both sides for proper centering
  // Define header positioning (Google Sheets API: row, column, numRows, numColumns)
  const row = 1;
  const column = frozenColumns + 1; // Start after frozen columns
  const numRows = 2;
  const numColumns = totalTableWidth - (frozenColumns * 2); // Subtract frozen columns from both sides

  // Handle left frozen columns manually
  const leftRange = sheet.getRange(row, 1, numRows, frozenColumns);
  leftRange.setBackground(TITLE_BACKGROUND_COLOR);
  
  // Create centered header in the middle section
  const nextRow = createHeader(sheet, year, row, column, numRows, numColumns);
  
  // Handle right columns manually to balance the layout
  const rightStartCol = column + numColumns;
  const rightRange = sheet.getRange(row, rightStartCol, numRows, frozenColumns);
  rightRange.setBackground(TITLE_BACKGROUND_COLOR);

  return nextRow;
}

/**
 * Inserts a visual separator row into the sheet to divide PM sections.
 * Adds a light gray background and merges the cells across the dual table width.
 *
 * @param sheet - The active dashboard sheet
 * @param row - The row index to insert the separator
 * @param endCol - The end column index to merge across (usually endCol of quarterly table)
 */
export function createSeparator(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  numRows: number,
  numColumns: number
): void {
  // Apply separator background to entire row - no merging needed for visual separator
  // This allows column freezing without any merge conflicts
  const separatorRange = sheet.getRange(row, 1, numRows, numColumns + 1);
  separatorRange.setBackground("#a0a0a0");
  separatorRange.setFontWeight("bold");
  separatorRange.setValue("");
}

export function createPMNameSection(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  numRows: number,
  numColumns: number,
  pmName: string
) {
  const range = sheet.getRange(row, column, numRows, numColumns);

  range.merge();
  range.setValue(pmName);
  range.setFontWeight("bold");
  range.setFontSize(12);
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  range.setWrap(true);
  range.setBackground("#e8e8e8");
}

export function createPMHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number = 3,
  column: number = 1,
  numRows: number = 3,
  numColumns: number = 1
) {
  const range = sheet.getRange(row, column, numRows, numColumns);
  range.merge();
  range.setValue("PM");
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  range.setBackground("#e0e0e0");
  range.setFontSize(10);
}
