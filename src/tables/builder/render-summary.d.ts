import { BaseColumn } from "@shared/columns";
import { StylizeOptions, SummaryOperationsMap, ValueFormat } from "@shared/styles";
/**
 * Renders a summary row with calculated values based on the provided operations.
 * Returns the row index of the rendered summary row.
 */
export declare function renderSummaryRow(sheet: GoogleAppsScript.Spreadsheet.Sheet, dataStartRow: number, dataEndRow: number, startCol: number, columns: BaseColumn<any, any, any>[], summaryRowOps: SummaryOperationsMap, options?: StylizeOptions<any>): number;
/**
 * Formats a summary value based on the specified format and decimal places.
 */
export declare function formatSummaryValue(value: number | string, format: ValueFormat, decimals: number): string;
