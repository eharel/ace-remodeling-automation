import { BaseColumn } from "../columns";
import { stylizeTable } from "../styles";
import { StylizeOptions, TableInfo } from "../types";

export function generateAndStylizeTableFromRows<
  RowType extends Record<string, any>,
  T extends string
>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rows: RowType[],
  startRow: number,
  startCol: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[],
  options: StylizeOptions<T> = {}
): TableInfo {
  const table = generateTableFromRows(
    sheet,
    rows,
    startRow,
    startCol,
    title,
    columns,
    keysToSum,
    options
  );

  const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));
  stylizeTable(sheet, table, columns, keyToIndex, options);

  for (const stylizer of options.customStylizers ?? []) {
    stylizer(sheet, table);
  }

  return table;
}

function generateTableFromRows<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rows: RowType[],
  startRow: number,
  startCol: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[],
  options?: StylizeOptions
): TableInfo {
  let rowIndex = startRow;

  if (title) {
    addTableTitle(sheet, rowIndex, startCol, title, columns);
    rowIndex++;
  }

  const headerRow = rowIndex;
  addTableHeaders(sheet, headerRow, startCol, columns);

  const hasDescription = options?.showDescription ?? true;
  const descriptionRow = headerRow + 1;
  const dataStartRow = hasDescription ? descriptionRow + 1 : headerRow + 1;

  const fallbackRowSpan = options?.rowSpan ?? 1;
  const rowSpanMap = options?.rowSpanMap;

  const values = rows.map((row) => columns.map((col) => row[col.key] ?? ""));

  // 1. Determine span per row
  const rowSpans = rows.map((row) => {
    const key = row.quarter ?? row.groupKey ?? ""; // fallback logic
    return rowSpanMap?.[key] ?? fallbackRowSpan;
  });

  // 2. Write rows using cumulative row index
  let currentRow = dataStartRow;
  for (let i = 0; i < values.length; i++) {
    const rowValues = values[i];
    const span = rowSpans[i];

    sheet
      .getRange(currentRow, startCol, 1, columns.length)
      .setValues([rowValues]);

    if (span > 1) {
      for (let j = 0; j < columns.length; j++) {
        sheet
          .getRange(currentRow, startCol + j, span, 1)
          .mergeVertically()
          .setVerticalAlignment("middle");
      }
    }

    currentRow += span;
  }

  // 3. Final row after all written values
  const dataEndRow = currentRow - 1;

  const summaryRow =
    keysToSum.length > 0
      ? addTableSummaryRow(
          sheet,
          dataStartRow,
          dataEndRow,
          startCol,
          columns,
          keysToSum
        )
      : undefined;

  return {
    title,
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow,
    endRow: summaryRow ?? dataEndRow,
    endCol: startCol + columns.length - 1,
  };
}

function addTableTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  title: string,
  columns: BaseColumn<any, any, any>[]
) {
  sheet.getRange(row, col).setValue(title).setFontWeight("bold");
  sheet
    .getRange(row, col, 1, columns.length)
    .merge()
    .setHorizontalAlignment("center")
    .setFontSize(12)
    .setFontWeight("bold");
}

function addTableHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  columns: BaseColumn<any, any, any>[]
) {
  const labels = columns.map((col) => col.label);
  sheet.getRange(row, col, 1, labels.length).setValues([labels]);
}

function addTableSummaryRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dataStartRow: number,
  dataEndRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[]
): number {
  const numRows = dataEndRow - dataStartRow + 1;
  const colMap = Object.fromEntries(columns.map((col, i) => [col.key, i]));

  const getSum = (key: string) => {
    const colIdx = colMap[key];
    if (colIdx === undefined) return "";
    return sheet
      .getRange(dataStartRow, startCol + colIdx, numRows, 1)
      .getValues()
      .flat()
      .reduce((acc, val) => acc + (Number(val) || 0), 0);
  };

  const summaryRow = Array(columns.length).fill("");
  summaryRow[0] = "🔢 Totals";

  for (const key of keysToSum) {
    summaryRow[colMap[key]] = getSum(key);
  }

  const summaryRowIndex = dataEndRow + 1;
  sheet
    .getRange(summaryRowIndex, startCol, 1, columns.length)
    .setValues([summaryRow]);
  return summaryRowIndex;
}
