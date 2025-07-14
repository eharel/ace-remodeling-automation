import {
  QUARTER_COLORS,
  QUARTER_TO_MONTHS,
  quarterlyKeys,
  quarterlyLabels,
  QUARTERS_ROW_SPAN,
} from "./constants";
import { TableInfo } from "../../types";
import { BaseColumn } from "../../columns";

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
  rowSpan = 1
) {
  const { dataStartRow, dataEndRow, startCol } = table;
  const isMonthly = rowSpan === 1;

  const targetColIndex = columns.findIndex((c) =>
    isMonthly
      ? c.label === quarterlyLabels.MONTH
      : c.key === quarterlyKeys.QUARTER
  );
  if (targetColIndex === -1) return;

  if (isMonthly) {
    for (let row = dataStartRow; row <= dataEndRow; row++) {
      const cell = sheet.getRange(row, startCol + targetColIndex);
      const monthName = String(cell.getValue());
      const monthNum = MONTH_NAME_TO_NUMBER[monthName];
      const quarter = MONTH_NUM_TO_QUARTER[monthNum];
      const color = quarter && QUARTER_COLORS[quarter];

      if (color) {
        // Set background
        cell.setBackground(color);

        // Restore expected light left/right borders
        cell.setBorder(
          true, // top
          true, // left
          true, // bottom
          true, // right
          false,
          false,
          "#cccccc",
          SpreadsheetApp.BorderStyle.SOLID
        );
      }
    }
  } else {
    const numGroups = Math.floor((dataEndRow - dataStartRow + 1) / rowSpan);
    for (let i = 0; i < numGroups; i++) {
      const rowStart = dataStartRow + i * rowSpan;
      const cell = sheet.getRange(rowStart, startCol + targetColIndex);
      const quarterLabel = String(
        cell.getValue()
      ) as keyof typeof QUARTER_COLORS;
      const color = QUARTER_COLORS[quarterLabel];
      if (color) {
        sheet
          .getRange(rowStart, startCol + targetColIndex, rowSpan, 1)
          .setBackground(color);
      }
    }
  }
}

/**
 * Find the column index for the grouping field (month or quarter)
 */
function findGroupingColumnIndex<T extends string>(
  columns: BaseColumn<any, any, any>[],
  groupKeyField: T,
  isMonthly: boolean
): number {
  return columns.findIndex((c) =>
    isMonthly ? c.key === groupKeyField : c.key === quarterlyKeys.QUARTER
  );
}

/**
 * Extract raw values from the grouping column
 */
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

/**
 * Group row indices by their quarter
 */
function groupRowsByQuarter(
  rawValues: string[],
  isMonthly: boolean
): Record<string, number[]> {
  const groupMap: Record<string, number[]> = {};

  for (let i = 0; i < rawValues.length; i++) {
    const raw = rawValues[i];

    const groupKey = isMonthly
      ? MONTH_NUM_TO_QUARTER[MONTH_NAME_TO_NUMBER[raw] ?? -1]
      : raw;

    if (!groupKey) continue; // Skip ungrouped/malformed entries

    if (!groupMap[groupKey]) groupMap[groupKey] = [];
    groupMap[groupKey].push(i);
  }

  return groupMap;
}

/**
 * Apply borders around each quarter group in the table
 */
export function applyQuarterBorders<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  groupKeyField: T,
  rowSpan = 1
): void {
  const isMonthly = rowSpan === 1;

  const targetColIndex = findGroupingColumnIndex(
    columns,
    groupKeyField,
    isMonthly
  );
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

  const groupMap = groupRowsByQuarter(rawValues, isMonthly);

  applyGroupBorders(
    sheet,
    startRow,
    table.startCol,
    colCount,
    groupMap,
    rowSpan
  );
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

  // Apply left border to all columns after the first
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

function applyGroupBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  tableStartCol: number,
  colCount: number,
  groupMap: Record<string, number[]>,
  rowSpan = 1
): void {
  const outerStyle = SpreadsheetApp.BorderStyle.SOLID_MEDIUM;

  for (const [groupKey, rowIndices] of Object.entries(groupMap)) {
    if (rowIndices.length === 0) continue;

    const rowStart = startRow + rowIndices[0];
    const rowEnd = startRow + rowIndices[rowIndices.length - 1];

    const firstCol = tableStartCol;
    const lastCol = tableStartCol + colCount - 1;

    // Logger.log(\n--- Group: ${groupKey} ---);
    // Logger.log(
    //   Top:    (${rowStart}, ${firstCol}) height=${rowSpan} width=${colCount}
    // );
    // Logger.log(
    //   Bottom: (${rowEnd}, ${firstCol}) height=${rowSpan} width=${colCount}
    // );
    // Logger.log(Left:   (${rowStart}, ${firstCol}) height=${rowSpan} width=1);
    // Logger.log(Right:  (${rowStart}, ${lastCol}) height=${rowSpan} width=1);

    // Top border
    sheet
      .getRange(rowStart, firstCol, rowSpan, colCount)
      .setBorder(true, null, null, null, null, null, "black", outerStyle);

    // Bottom border
    sheet
      .getRange(rowEnd, firstCol, rowSpan, colCount)
      .setBorder(null, null, true, null, null, null, "black", outerStyle);

    // Left border
    sheet
      .getRange(rowStart, firstCol, rowSpan, 1)
      .setBorder(null, true, null, null, null, null, "black", outerStyle);

    // Right border
    sheet
      .getRange(rowStart, lastCol, rowSpan, 1)
      .setBorder(null, null, null, true, null, null, "black", outerStyle);
  }
}
