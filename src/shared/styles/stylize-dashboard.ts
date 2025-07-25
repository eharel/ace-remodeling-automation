import { BaseColumn } from "../columns";
import { StylizeOptions, TableInfo } from "./types";
import {
  applyTitleStyle,
  applyHeaderStyle,
  applyDescriptionRow,
  applyZebraStriping,
  applyCurrencyFormatting,
  applyPercentFormatting,
  applyConditionalFormatting,
  applyBorders,
  resizeColumns,
  applySummaryRowStyle,
  applyAlignment,
} from "./";

export function stylizeDashboard<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfoArray: TableInfo[],
  columns: BaseColumn<any, any, any>[],
  options: StylizeOptions<T> = {}
) {
  // Build key→index map once
  const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));

  for (const table of tableInfoArray) {
    stylizeTable(sheet, table, columns, keyToIndex, options);
  }
}

export function stylizeTable<T extends string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  columns: BaseColumn<any, any, any>[],
  keyToIndex: Map<string, number>,
  options: StylizeOptions<T> = {}
) {
  const {
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow,
  } = table;

  const {
    zebra = true,
    colorKeys = [],
    showDescription = true,
    hasTitle = true,
  } = options;

  const numRows = dataEndRow - dataStartRow + 1;
  const zebraStart = dataStartRow - 1;
  const zebraRows = dataEndRow - zebraStart + 1;
  const totalTableRows = dataEndRow - (headerRow ?? startRow) + 1;

  hasTitle && applyTitleStyle(sheet, startRow, startCol, columns);
  if (headerRow !== undefined) {
    applyHeaderStyle(sheet, headerRow, startCol, columns);

    if (showDescription && headerRow !== undefined) {
      applyDescriptionRow(sheet, headerRow + 1, startCol, columns);
    }
  }
  zebra && applyZebraStriping(sheet, zebraStart, startCol, zebraRows, columns);
  applyCurrencyFormatting(sheet, dataStartRow, startCol, columns, numRows);
  applyPercentFormatting(sheet, dataStartRow, startCol, columns, numRows);
  applyConditionalFormatting(
    sheet,
    dataStartRow,
    startCol,
    numRows,
    keyToIndex,
    colorKeys
  );
  applyBorders(sheet, headerRow ?? startRow, startCol, totalTableRows, columns);
  applyAlignment(table, sheet, columns);
  resizeColumns(sheet, startCol, columns, options.columnWidths);

  if (summaryRow !== undefined) {
    applySummaryRowStyle(sheet, summaryRow, startCol, columns);
  }
}
