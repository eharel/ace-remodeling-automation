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
  sheet.setFrozenColumns(1);
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

    createPMNameSection(
      sheet,
      monthlyInfo.dataStartRow,
      monthlyInfo.endRow,
      pmName
    );

    currentRow = monthlyInfo.endRow;

    if (!isLast) {
      currentRow += 1;
      createSeparator(sheet, currentRow, quarterlyInfo.endCol);
      currentRow += 1;
    }
  }
}

function createMasterSummary(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  currentRow: number
) {
  // At the current row, create a summary row with the title "Master Summary (Placeholder)"
  const summaryRow = sheet.getRange(currentRow, 2, 1, 1);
  summaryRow.setValue("Master Summary (Placeholder)");

  return currentRow + 1;
}

export function applyBottomBorder(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number,
  numCols: number
) {
  sheet
    .getRange(row, startCol, 1, numCols)
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
  
  // Define header positioning (Google Sheets API: row, column, numRows, numColumns)
  const row = 1;
  const column = 2;
  const numRows = 2;
  const numColumns = totalTableWidth;
  
  const a1Range = sheet.getRange(row, 1, numRows, 1);
  const nextRow = createHeader(sheet, year, row, column, numRows, numColumns);

  a1Range.merge();
  a1Range.setBackground(TITLE_BACKGROUND_COLOR);

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
  endCol: number
): void {
  // Separate first column from merged section to allow column freezing
  // Column 1 gets the same background but remains unmerged for freeze compatibility
  const firstColRange = sheet.getRange(row, 1, 1, 1);
  firstColRange.setBackground("#a0a0a0");
  firstColRange.setFontWeight("bold");
  firstColRange.setValue("");

  // Merge columns 2 through endCol for the main separator
  const mergedRange = sheet.getRange(row, 2, 1, endCol - 1);
  mergedRange.merge();
  mergedRange.setBackground("#a0a0a0");
  mergedRange.setFontWeight("bold");
  mergedRange.setValue("");
}

export function createPMNameSection(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  endRow: number,
  pmName: string
) {
  const col = 1; // Leftmost column
  const numRows = endRow - startRow + 1;
  const range = sheet.getRange(startRow, col, numRows, 1);

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
  rowStart: number = 3,
  rowEnd: number = 5,
  col: number = 1
) {
  const range = sheet.getRange(rowStart, col, rowEnd - rowStart + 1, 1);
  range.merge();
  range.setValue("PM");
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  range.setBackground("#e0e0e0");
  range.setFontSize(10);
}
