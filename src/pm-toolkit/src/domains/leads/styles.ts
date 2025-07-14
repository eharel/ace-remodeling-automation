import {
  QUARTER_COLORS,
  QUARTER_TO_MONTHS,
  quarterlyKeys,
  quarterlyLabels,
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
      if (color) cell.setBackground(color);
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

export function applyQuarterBorders<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  groupKeyField: T,
  rowSpan = 1
) {
  const isMonthly = rowSpan === 1;

  const targetColIndex = columns.findIndex((c) =>
    isMonthly ? c.key === groupKeyField : c.key === quarterlyKeys.QUARTER
  );
  if (targetColIndex === -1) return;

  const startRow = table.dataStartRow;
  const rowCount = table.dataEndRow - table.dataStartRow + 1;
  const colCount = columns.length;

  const rawValues = sheet
    .getRange(startRow, table.startCol + targetColIndex, rowCount, 1)
    .getValues()
    .map((r) => String(r[0]));

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

  // Draw thick outer box around each group — do not touch inner borders
  Object.values(groupMap).forEach((rowIndices) => {
    if (rowIndices.length === 0) return;

    const rowStart = startRow + rowIndices[0];
    const rowEnd = startRow + rowIndices[rowIndices.length - 1];

    sheet
      .getRange(rowStart, table.startCol, rowEnd - rowStart + 1, colCount)
      .setBorder(
        true, // top
        true, // left
        true, // bottom
        true, // right
        false, // inner horizontal
        false, // inner vertical
        "black",
        SpreadsheetApp.BorderStyle.SOLID_MEDIUM
      );
  });
}

export function applyBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  numRows: number,
  startCol: number,
  numCols: number,
  rowSpan: number = 1
) {
  const outerBorderStyle = SpreadsheetApp.BorderStyle.SOLID_MEDIUM;
  const innerBorderStyle = SpreadsheetApp.BorderStyle.SOLID;
  const lightGray = "#cccccc";

  for (let r = 0; r < numRows; r += rowSpan) {
    const range = sheet.getRange(startRow + r, startCol, rowSpan, numCols);

    // Outer border
    range.setBorder(
      true, // top
      true, // left
      true, // bottom
      true, // right
      false, // innerHorizontal
      false, // innerVertical
      "black",
      outerBorderStyle
    );

    // Inner vertical borders
    for (let c = 1; c < numCols; c++) {
      const colRange = sheet.getRange(startRow + r, startCol + c, rowSpan, 1);
      colRange.setBorder(
        false,
        true, // left
        false,
        false,
        false,
        false,
        lightGray,
        innerBorderStyle
      );
    }

    // Optional: inner horizontal borders if you want light rows
    // (Remove or comment if not wanted for monthly table)
    for (let i = 1; i < rowSpan; i++) {
      const row = startRow + r + i;
      const rowRange = sheet.getRange(row, startCol, 1, numCols);
      rowRange.setBorder(
        true, // top
        false,
        false,
        false,
        false,
        false,
        lightGray,
        innerBorderStyle
      );
    }
  }
}
