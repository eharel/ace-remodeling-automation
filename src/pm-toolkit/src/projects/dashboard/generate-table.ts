// 📁 projects/dashboard/generate-table.ts

import { getProjectRowData } from "./project-data";
import { stylizeTable, getHeaderIndexMap } from "./styles";
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_KEYS,
  DashboardColumnKey,
} from "./project-columns";
import { IS_ASCENDING_ORDER } from "../../constants";

export function generateAndStylizeTable(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  title: string
) {
  const table = generateProjectTable(sheet, tabs, startRow, startCol, title);
  const headerMap = getHeaderIndexMap(sheet, table.headerRow, table.startCol);
  stylizeTable(sheet, table, headerMap);
}

export function generateProjectTable(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  title = ""
) {
  let rowIndex = startRow;

  if (title) {
    addTableTitle(sheet, rowIndex, startCol, title);
    rowIndex++;
  }

  const headerRow = rowIndex;
  addTableHeaders(sheet, headerRow, startCol);

  const descriptionRow = headerRow + 1;
  const dataStartRow = descriptionRow + 1;

  const dataEndRow = addProjectRows(sheet, tabs, dataStartRow, startCol);
  const summaryRowIndex = addSummaryRow(
    sheet,
    dataStartRow,
    dataEndRow,
    startCol
  );

  return {
    title,
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow: summaryRowIndex,
  };
}

// ──────────────── Sub-helpers ────────────────

function addTableTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  title: string
) {
  sheet.getRange(row, col).setValue(title).setFontWeight("bold");
  sheet
    .getRange(row, col, 1, DASHBOARD_COLUMNS.length)
    .merge()
    .setHorizontalAlignment("center")
    .setFontSize(12)
    .setFontWeight("bold");
}

function addTableHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number
) {
  const labels = DASHBOARD_COLUMNS.map((col) => col.label);
  sheet.getRange(row, col, 1, labels.length).setValues([labels]);
}

function addProjectRows(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number
): number {
  let rowIndex = startRow;

  for (const tab of tabs) {
    const rowData = getProjectRowData(tab);

    const rowValues = DASHBOARD_COLUMNS.map((col) => rowData[col.key]);

    sheet
      .getRange(rowIndex, startCol, 1, rowValues.length)
      .setValues([rowValues]);

    rowIndex++;
  }

  const numRows = rowIndex - startRow;
  if (numRows > 0) {
    sheet
      .getRange(startRow, startCol, numRows, DASHBOARD_COLUMNS.length)
      .sort({ column: startCol, ascending: IS_ASCENDING_ORDER });
  }

  return rowIndex - 1; // dataEndRow
}

function addSummaryRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dataStartRow: number,
  dataEndRow: number,
  startCol: number
): number {
  const numRows = dataEndRow - dataStartRow + 1;
  const colMap = Object.fromEntries(
    DASHBOARD_COLUMNS.map((col, i) => [col.key, i])
  );

  const getSum = (key: DashboardColumnKey) => {
    const colIdx = colMap[key];
    if (colIdx === undefined) return "";
    return sheet
      .getRange(dataStartRow, startCol + colIdx, numRows, 1)
      .getValues()
      .flat()
      .reduce((acc, val) => acc + (Number(val) || 0), 0);
  };

  const summaryRow = Array(DASHBOARD_COLUMNS.length).fill("");
  summaryRow[0] = "🔢 Totals";

  for (const key of [
    DASHBOARD_KEYS.CONTRACT_PRICE,
    DASHBOARD_KEYS.CHANGE_ORDERS,
    DASHBOARD_KEYS.MAX_ADVANCE,
    DASHBOARD_KEYS.TOTAL_ADVANCE,
    DASHBOARD_KEYS.ADVANCE_BALANCE,
  ]) {
    summaryRow[colMap[key]] = getSum(key);
  }

  const summaryRowIndex = dataEndRow + 1;
  sheet
    .getRange(summaryRowIndex, startCol, 1, DASHBOARD_COLUMNS.length)
    .setValues([summaryRow]);

  return summaryRowIndex;
}
