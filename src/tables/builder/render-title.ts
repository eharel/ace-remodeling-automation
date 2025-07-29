import { BaseColumn } from "@shared/columns";
import { CellStyling } from "@shared/styles";
import { applySplitMergeRange } from "@utils/sheets";

/**
 * Renders a table title using standard merge across all columns.
 */
export function renderTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  title: string,
  columns: BaseColumn<any, any, any>[]
): void {
  const titleRange = sheet.getRange(row, col, 1, columns.length);
  titleRange.merge();
  titleRange.setValue(title);
  titleRange.setHorizontalAlignment("center");
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(12);
}

/**
 * Renders a table title using split-merge for frozen column layouts.
 * This allows the title to be centered across the scrollable area.
 */
export function renderSplitTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  title: string,
  columns: BaseColumn<any, any, any>[],
  frozenColumns: number,
  styling?: CellStyling
): void {
  applySplitMergeRange({
    sheet,
    startRow: row,
    startCol: col,
    frozenColumns,
    numCols: columns.length,
    numRows: 1,
    value: title,
    styling,
  });
}
