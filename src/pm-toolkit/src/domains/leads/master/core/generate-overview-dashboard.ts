import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "./data-extraction";
import { transformData } from "./data-transformation";
import { PMDashboardData } from "./data-transformation";
import { createHeader } from "../../shared/dashboard";
import { renderMonthlyAndQuarterlyBreakdowns } from "../../shared/dashboard/render-dual-tables";
import { MONTHLY_TITLE, QUARTERLY_TITLE } from "../../shared/constants";

export function generateOverviewDashboard() {
  const year = 2025; // TODO: make this dynamic
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const inputRowsByPM = extractData();
  const dashboardRowsByPM = transformData(inputRowsByPM, year);
  renderDashboard(year, sheet, dashboardRowsByPM);
  sheet.setFrozenRows(5);
}

function renderDashboard(
  year: number,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dashboardRowsByPM: Record<string, PMDashboardData>
) {
  let currentRow = createHeader(sheet, year, 1);
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
  const summaryRow = sheet.getRange(currentRow, 1, 1, 1);
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
  const startCol = 1;
  const range = sheet.getRange(row, startCol, 1, endCol - startCol + 1);
  range.merge();
  range.setBackground("#a0a0a0");
  range.setFontWeight("bold");
  range.setValue("");
}
