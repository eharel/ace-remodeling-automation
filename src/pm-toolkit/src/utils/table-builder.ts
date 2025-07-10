import { BaseColumn } from "../columns";
import { stylizeTable } from "../styles";
import { IS_ASCENDING_ORDER } from "../constants";

export type TableInfo = {
  title?: string;
  startRow: number;
  startCol: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number;
};

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
  colorKeys: readonly T[] = []
): TableInfo {
  const table = generateTableFromRows(
    sheet,
    rows,
    startRow,
    startCol,
    title,
    columns,
    keysToSum
  );

  const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));
  stylizeTable(sheet, table, columns, keyToIndex, colorKeys);

  return table;
}

function generateTableFromRows<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rows: RowType[],
  startRow: number,
  startCol: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[]
): TableInfo {
  let rowIndex = startRow;

  if (title) {
    addTableTitle(sheet, rowIndex, startCol, title, columns);
    rowIndex++;
  }

  const headerRow = rowIndex;
  addTableHeaders(sheet, headerRow, startCol, columns);

  const descriptionRow = headerRow + 1;
  const dataStartRow = descriptionRow + 1;

  // Write data rows
  const values = rows.map((row) => columns.map((col) => row[col.key] ?? ""));
  const dataEndRow = dataStartRow + values.length - 1;

  if (values.length > 0) {
    sheet
      .getRange(dataStartRow, startCol, values.length, columns.length)
      .setValues(values);
  }

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
