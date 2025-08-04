import { getOrCreateLeadsDashboardSheet } from "../../../../utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "./data-extraction";
import { transformData } from "./data-transformation";
import { PMDashboardData } from "./data-transformation";
import { createTitle } from "../../shared/dashboard/table-render-utils";
import { renderMonthlyAndQuarterlyBreakdowns } from "../../shared/dashboard/render-dual-tables";
import {
  MONTHLY_TITLE,
  QUARTERLY_TITLE,
  TITLE_BACKGROUND_COLOR,
} from "../../shared/constants";
import {
  dashboardKeys,
  LEADS_COLUMNS,
  QUARTER_COLUMNS,
} from "../../shared/columns";
import { createMasterSummary } from "./master-summary";
import { LeadsDashboardRow } from "../../shared/types";

export function generateOverviewDashboard() {
  const year = 2025; // TODO: make this dynamic
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const inputRowsByPM = extractData();
  const dashboardRowsByPM = transformData(inputRowsByPM, year);
  const masterSummary = createMasterSummary(dashboardRowsByPM, year);
  renderDashboard(year, sheet, dashboardRowsByPM, masterSummary);
  sheet.setFrozenRows(5);
  sheet.setFrozenColumns(2);
}

function renderDashboard(
  year: number,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dashboardRowsByPM: Record<string, PMDashboardData>,
  masterSummary: LeadsDashboardRow
) {
  let currentRow = createMasterHeader(sheet, year);
  createPMHeader(sheet);
  currentRow = renderMasterSummary(sheet, currentRow, masterSummary);
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

export function renderMasterSummary(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  currentRow: number,
  masterSummary: LeadsDashboardRow
): number {
  const BACKGROUND_COLOR = TITLE_BACKGROUND_COLOR;
  const row = currentRow;
  const column = 3;

  // Total number of columns in the dashboard table (for full-width background)
  const PM_NAME_COLUMNS = 1;
  const fullWidth =
    PM_NAME_COLUMNS + LEADS_COLUMNS.length + QUARTER_COLUMNS.length;

  const visibleColumns = LEADS_COLUMNS.filter(
    (col) => col.key !== dashboardKeys.MONTH
  );

  // Label over A3:B3
  sheet
    .getRange(3, 1, 1, 2)
    .merge()
    .setValue("📊 Master Summary")
    .setFontWeight("bold")
    .setFontStyle("italic")
    .setHorizontalAlignment("center")
    .setBackground(BACKGROUND_COLOR)
    .setFontColor("white");

  // Values
  const values = visibleColumns.map((col) => masterSummary[col.key] ?? "");
  sheet.getRange(row, column, 1, values.length).setValues([values]);

  // Apply visual styling to the *entire row* (A to full width)
  const fullRowRange = sheet.getRange(row, 1, 1, fullWidth);
  fullRowRange
    .setBackground(BACKGROUND_COLOR)
    .setFontColor("white")
    .setBorder(
      true,
      null,
      null,
      null,
      null,
      null,
      "white",
      SpreadsheetApp.BorderStyle.SOLID
    );

  // Apply text styling only to actual summary values
  const valueRange = sheet.getRange(row, column, 1, values.length);
  valueRange.setFontWeight("bold").setFontStyle("italic").setFontSize(10);

  // Apply number formats and alignments to the value cells only
  visibleColumns.forEach((col, i) => {
    const cell = sheet.getRange(row, column + i);
    switch (col.format) {
      case "number":
        cell.setNumberFormat("0.##");
        break;
      case "percent":
        cell.setNumberFormat("0.00%");
        break;
      case "currency":
        cell.setNumberFormat("$#,##0.00");
        break;
      default:
        cell.setNumberFormat("@");
    }
    if (col.align === "center") {
      cell.setHorizontalAlignment("center");
    }
  });

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
  const PM_NAME_COLUMNS = 1;
  const totalTableWidth =
    PM_NAME_COLUMNS + LEADS_COLUMNS.length + QUARTER_COLUMNS.length;
  const frozenColumns = 2; // Number of columns we're freezing

  // Balance the layout: exclude frozen columns from both sides for proper centering
  // Define header positioning (Google Sheets API: row, column, numRows, numColumns)
  const row = 1;
  const column = frozenColumns + 1; // Start after frozen columns
  const numRows = 2;
  const numColumns = totalTableWidth - frozenColumns * 2; // Subtract frozen columns from both sides

  // Handle left frozen columns manually
  const leftRange = sheet.getRange(row, 1, numRows, frozenColumns);
  leftRange.setBackground(TITLE_BACKGROUND_COLOR);

  // Create centered header in the middle section
  const nextRow = createTitle(sheet, year, row, column, numRows, numColumns, {
    frozenColumns,
    numCols: numColumns,
  });

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
  row: number = 4,
  column: number = 1,
  numRows: number = 2,
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

  sheet.setColumnWidth(column, 56);
}
