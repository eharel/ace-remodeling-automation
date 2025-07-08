import { BaseColumn } from "../columns";
import { getHeaderIndexMap } from "../styles/table";
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

export function generateAndStylizeTable<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[],
  getRowData: (tab: GoogleAppsScript.Spreadsheet.Sheet) => RowType
): TableInfo {
  const table = generateTable(
    sheet,
    tabs,
    startRow,
    startCol,
    title,
    columns,
    keysToSum,
    getRowData
  );
  const headerMap = getHeaderIndexMap(
    sheet,
    table.headerRow,
    table.startCol,
    columns
  );
  stylizeTable(sheet, table, columns, headerMap, keysToSum);

  return table;
}

function generateTable<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  keysToSum: string[],
  getRowData: (tab: GoogleAppsScript.Spreadsheet.Sheet) => RowType
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

  const dataEndRow = addTableRows(
    sheet,
    tabs,
    dataStartRow,
    startCol,
    columns,
    getRowData
  );

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

function addTableRows<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tabs: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  getRowData: (tab: GoogleAppsScript.Spreadsheet.Sheet) => RowType
): number {
  if (tabs.length === 0) return startRow - 1;

  let rowIndex = startRow;

  for (const tab of tabs) {
    const rowData = getRowData(tab);
    const rowValues = columns.map((col) => rowData[col.key]);
    sheet
      .getRange(rowIndex, startCol, 1, rowValues.length)
      .setValues([rowValues]);
    rowIndex++;
  }

  const numRows = rowIndex - startRow;
  if (numRows > 0) {
    sheet
      .getRange(startRow, startCol, numRows, columns.length)
      .sort({ column: startCol, ascending: IS_ASCENDING_ORDER });
  }

  return rowIndex - 1;
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
