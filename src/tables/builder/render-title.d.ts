import { BaseColumn } from "@shared/columns";
import { CellStyling } from "@shared/styles";
/**
 * Renders a table title using standard merge across all columns.
 */
export declare function renderTitle(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, col: number, title: string, columns: BaseColumn<any, any, any>[]): void;
/**
 * Renders a table title using split-merge for frozen column layouts.
 * This allows the title to be centered across the scrollable area.
 */
export declare function renderSplitTitle(sheet: GoogleAppsScript.Spreadsheet.Sheet, row: number, col: number, title: string, columns: BaseColumn<any, any, any>[], frozenColumns: number, styling?: CellStyling): void;
