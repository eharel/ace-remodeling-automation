import { BaseColumn } from "@shared/columns";
/**
 * Renders table headers and optional description row.
 */
export declare function renderHeaders(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, col: number, columns: BaseColumn<any, any, any>[]): void;
/**
 * Gets the number of rows that headers will occupy.
 * This includes the main header row and optional description row.
 */
export declare function getHeaderRowCount(hasDescription: boolean): number;
