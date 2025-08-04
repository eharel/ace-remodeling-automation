import { BaseColumn } from "@shared/columns";
import { StylizeOptions } from "@shared/styles";
/**
 * Renders data rows with optional rowSpan merging for grouped data.
 */
export declare function renderRows<RowType extends Record<string, any>>(sheet: GoogleAppsScript.Spreadsheet.Sheet, startRow: number, startCol: number, rows: RowType[], columns: BaseColumn<any, any, any>[], options?: StylizeOptions<any>): number;
