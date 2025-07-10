import { BaseColumn } from "../columns";
import {
  applyTitleStyle,
  applyHeaderStyle,
  applyDescriptionRow,
  applyZebraStriping,
  applyCurrencyFormatting,
  applyConditionalFormatting,
  applyBorders,
  resizeColumns,
  applySummaryRowStyle,
  applyAlignment,
} from "./";

export type TableInfo = {
  startRow: number;
  startCol: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number;
};

export function stylizeDashboard<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfoArray: TableInfo[],
  columns: BaseColumn<any, any, any>[],
  colorKeys: T[] = []
) {
  // Build key→index map once
  const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));

  for (const table of tableInfoArray) {
    stylizeTable(sheet, table, columns, keyToIndex, colorKeys);
  }
}

export function stylizeTable<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  keyToIndex: Map<string, number>,
  colorKeys: readonly T[] = []
) {
  const {
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow,
  } = table;

  const numRows = dataEndRow - dataStartRow + 1;
  const zebraStart = dataStartRow - 1;
  const zebraRows = dataEndRow - zebraStart + 1;
  const totalTableRows = dataEndRow - headerRow + 1;

  applyTitleStyle(sheet, startRow, startCol, columns);
  applyHeaderStyle(sheet, headerRow, startCol, columns);
  applyDescriptionRow(sheet, headerRow + 1, startCol, columns);
  applyZebraStriping(sheet, zebraStart, startCol, zebraRows, columns);
  applyCurrencyFormatting(sheet, dataStartRow, startCol, columns, numRows);
  applyConditionalFormatting(
    sheet,
    dataStartRow,
    startCol,
    numRows,
    keyToIndex,
    colorKeys
  );
  applyBorders(sheet, headerRow, startCol, totalTableRows, columns);
  applyAlignment(table, sheet, columns);
  resizeColumns(sheet, startCol, columns);

  if (summaryRow !== undefined) {
    applySummaryRowStyle(sheet, summaryRow, startCol, columns);
  }
}
