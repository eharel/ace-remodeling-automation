import {
  QUARTER_COLORS,
  QUARTER_TO_MONTHS,
  LEADS_LABELS,
  QUARTER_KEYS,
  QUARTER_LABELS,
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
    isMonthly ? c.label === LEADS_LABELS.MONTH : c.key === QUARTER_KEYS.QUARTER
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
  monthKey: T,
  rowSpan = 1
) {
  const isMonthly = rowSpan === 1;

  const targetColIndex = columns.findIndex((c) =>
    isMonthly ? c.key === monthKey : c.key === QUARTER_KEYS.QUARTER
  );
  if (targetColIndex === -1) return;

  const rowCount = table.dataEndRow - table.dataStartRow + 1;
  const colCount = columns.length;
  const startRow = table.dataStartRow;

  const rawValues = sheet
    .getRange(startRow, table.startCol + targetColIndex, rowCount, 1)
    .getValues()
    .map((r) => r[0]);

  const groupMap: Record<string, number[]> = {};

  for (let i = 0; i < rawValues.length; i++) {
    const raw = String(rawValues[i]);
    const groupKey = isMonthly
      ? MONTH_NUM_TO_QUARTER[MONTH_NAME_TO_NUMBER[raw] ?? -1] ?? "Other"
      : raw;

    if (!groupMap[groupKey]) groupMap[groupKey] = [];
    groupMap[groupKey].push(i);
  }

  Object.values(groupMap).forEach((rowIndices) => {
    if (rowIndices.length === 0) return;
    const start = startRow + rowIndices[0];
    const end = startRow + rowIndices[rowIndices.length - 1];
    sheet.getRange(start, table.startCol, end - start + 1, colCount).setBorder(
      true, // top
      true, // left
      true, // bottom
      true, // right
      false,
      false,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  });
}
