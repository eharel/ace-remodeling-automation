import { BaseColumn } from "@sheets/columns";

/**
 * Renders table headers and optional description row.
 */
export function renderHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  columns: BaseColumn<any, any, any>[]
): void {
  const headerValues = columns.map((column) => column.label);
  const headerRange = sheet.getRange(row, col, 1, columns.length);
  headerRange.setValues([headerValues]);
}

/**
 * Gets the number of rows that headers will occupy.
 * This includes the main header row and optional description row.
 */
export function getHeaderRowCount(hasDescription: boolean): number {
  return hasDescription ? 2 : 1;
}
