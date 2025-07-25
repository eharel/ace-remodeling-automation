import { QUARTER_TO_MONTHS } from "../constants";
import { TableInfo } from "@shared/styles";
import { BaseColumn } from "@shared/columns";
import { quarterlyKeys } from "../columns";
import { QUARTER_COLORS } from "./colors";

// Month name to number
const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

// Month number to quarter (reverse of QUARTER_TO_MONTHS)
const MONTH_NUM_TO_QUARTER: Record<number, keyof typeof QUARTER_COLORS> =
  Object.entries(QUARTER_TO_MONTHS)
    .flatMap(([q, months]) => months.map((m) => [m, q]))
    .reduce(
      (acc, [m, q]) => ({ ...acc, [m]: q }),
      {} as Record<number, keyof typeof QUARTER_COLORS>
    );

export function applyQuarterColoring(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  rowSpanMap: Record<string, number>
) {
  const { dataStartRow, startCol } = table;
  const targetColIndex = columns.findIndex(
    (c) => c.key === quarterlyKeys.QUARTER || c.key === quarterlyKeys.MONTH
  );
  if (targetColIndex === -1) return;

  let currentRow = dataStartRow;
  for (const [quarter, span] of Object.entries(rowSpanMap)) {
    const color = QUARTER_COLORS[quarter as keyof typeof QUARTER_COLORS];
    if (color) {
      sheet
        .getRange(currentRow, startCol + targetColIndex, span, 1)
        .setBackground(color);
    }
    currentRow += span;
  }
}

export function applyQuarterBorders<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  groupKeyField: T,
  opts: { rowSpanMap: Record<string, number> }
): void {
  const { rowSpanMap } = opts;

  const targetColIndex = findGroupingColumnIndex(columns, groupKeyField);
  if (targetColIndex === -1) return;

  const startRow = table.dataStartRow;
  const rowCount = table.dataEndRow - table.dataStartRow + 1;
  const colCount = columns.length;

  const rawValues = extractGroupingValues(
    sheet,
    startRow,
    table.startCol + targetColIndex,
    rowCount
  );

  const groupMap = groupRowsByQuarter(rawValues);

  applyGroupBordersWithMap(
    sheet,
    startRow,
    table.startCol,
    colCount,
    groupMap,
    rowSpanMap
  );
}

function applyGroupBordersWithMap(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  tableStartCol: number,
  colCount: number,
  groupMap: Record<string, number[]>,
  rowSpanMap: Record<string, number>
): void {
  const outerStyle = SpreadsheetApp.BorderStyle.SOLID_MEDIUM;

  for (const [groupKey, rowIndices] of Object.entries(groupMap)) {
    if (rowIndices.length === 0) continue;

    const rowSpan = rowSpanMap[groupKey] ?? 1;
    const rowStart = startRow + rowIndices[0];
    const firstCol = tableStartCol;
    const lastCol = tableStartCol + colCount - 1;

    sheet
      .getRange(rowStart, firstCol, rowSpan, colCount)
      .setBorder(true, null, null, null, null, null, "black", outerStyle);

    sheet
      .getRange(rowStart + rowSpan - 1, firstCol, 1, colCount)
      .setBorder(null, null, true, null, null, null, "black", outerStyle);

    sheet
      .getRange(rowStart, firstCol, rowSpan, 1)
      .setBorder(null, true, null, null, null, null, "black", outerStyle);

    sheet
      .getRange(rowStart, lastCol, rowSpan, 1)
      .setBorder(null, null, null, true, null, null, "black", outerStyle);
  }
}

export function applyVerticalBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  endRow: number,
  startCol: number,
  numCols: number
) {
  clearBordersInRange(sheet, startRow, endRow, startCol, numCols);

  const innerBorderStyle = SpreadsheetApp.BorderStyle.SOLID;
  const lightGray = "#cccccc";
  const numRows = endRow - startRow + 1;

  for (let c = 1; c < numCols; c++) {
    const colRange = sheet.getRange(startRow, startCol + c, numRows, 1);
    colRange.setBorder(
      false,
      true,
      false,
      false,
      false,
      false,
      lightGray,
      innerBorderStyle
    );
  }
}

export function clearBordersInRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  endRow: number,
  startCol: number,
  numCols: number
) {
  const numRows = endRow - startRow + 1;
  const range = sheet.getRange(startRow, startCol, numRows, numCols);
  range.setBorder(false, false, false, false, false, false);
}

function findGroupingColumnIndex<T extends string>(
  columns: BaseColumn<any, any, any>[],
  groupKeyField: T
): number {
  return columns.findIndex((c) => c.key === groupKeyField);
}

function extractGroupingValues(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  rowCount: number
): string[] {
  return sheet
    .getRange(startRow, startCol, rowCount, 1)
    .getValues()
    .map((r) => String(r[0]));
}

function groupRowsByQuarter(rawValues: string[]): Record<string, number[]> {
  const groupMap: Record<string, number[]> = {};
  for (let i = 0; i < rawValues.length; i++) {
    const raw = rawValues[i];
    const monthNum = MONTH_NAME_TO_NUMBER[raw];
    const groupKey =
      monthNum !== undefined ? MONTH_NUM_TO_QUARTER[monthNum] : raw;

    if (!groupKey) continue;
    if (!groupMap[groupKey]) groupMap[groupKey] = [];
    groupMap[groupKey].push(i);
  }
  return groupMap;
}

// Add a top border to the summary row to separate it from the data rows
// I was going crazy with figuring out why the bottom border wasn't showing up, so I added this bandaid fix
// Don't judge me
export function addBottomBorderBandaidFix(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfo: TableInfo
) {
  // Find the summary row (which is right after the data rows)
  const summaryRow = tableInfo.dataEndRow + 1;

  sheet
    .getRange(
      summaryRow,
      tableInfo.startCol,
      1,
      tableInfo.endCol - tableInfo.startCol + 1
    )
    .setBorder(
      true, // top border instead of bottom border
      null,
      null,
      null,
      null,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
}
