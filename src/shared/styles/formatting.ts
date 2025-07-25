import { Alignment, BaseColumn } from "../columns";

export function applyCurrencyFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  numRows: number
) {
  columns.forEach((col, i) => {
    if (col.format === "currency") {
      const range = sheet.getRange(startRow, startCol + i, numRows);
      range.setNumberFormat("$#,##0.00");
    }
  });
}

export function applyConditionalFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  numRows: number,
  keyToIndex: Map<string, number>,
  colorKeys: readonly string[]
) {
  for (const key of colorKeys) {
    const colIndex = keyToIndex.get(key);
    if (colIndex !== undefined) {
      const col = startCol + colIndex;
      stylizeColumnByValueColor(sheet, startRow, col, numRows, {
        positiveColor: "green",
        negativeColor: "red",
      });
    }
  }
}

export function stylizeColumnByValueColor(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  colIndex: number,
  numRows: number,
  options: {
    positiveColor?: string;
    negativeColor?: string;
    zeroColor?: string;
    nonNumericColor?: string;
  }
) {
  const {
    positiveColor = "green",
    negativeColor = "red",
    zeroColor,
    nonNumericColor,
  } = options;

  const range = sheet.getRange(startRow, colIndex, numRows, 1);
  const values = range.getValues();

  values.forEach((row: any[], i: number) => {
    const cell = range.getCell(i + 1, 1);
    const val = row[0];

    const num = Number(val);
    if (!isNaN(num)) {
      if (num > 0) cell.setFontColor(positiveColor);
      else if (num < 0) cell.setFontColor(negativeColor);
      else cell.setFontColor(zeroColor ?? null);
    } else {
      cell.setFontColor(nonNumericColor ?? null);
    }
  });
}

export function applySummaryRowStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
) {
  const range = sheet.getRange(row, startCol, 1, columns.length);

  range.setFontWeight("bold").setBackground("#e8e8e8");

  range.setBorder(
    true,
    false,
    false,
    false,
    false,
    false,
    "black",
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  columns.forEach((col, i) => {
    const cell = sheet.getRange(row, startCol + i);

    if (col.format === "currency") {
      cell.setNumberFormat("$#,##0.00");
    }

    const align: Alignment =
      col.align ?? (col.format === "text" ? "left" : "right");
    cell.setHorizontalAlignment(align);
  });
}

export function applyPercentFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  numRows: number
) {
  columns.forEach((col, i) => {
    if (col.format === "percent") {
      const range = sheet.getRange(startRow, startCol + i, numRows);
      range.setNumberFormat("0.00%");
    }
  });
}
