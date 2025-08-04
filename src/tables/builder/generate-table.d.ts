import { TableInfo } from "@shared/styles";
import { GenerateTableParams } from "./types";
/**
 * Generates and stylizes a complete table with optional title, headers, data rows, and summary.
 * This is the main entry point that handles both generation and styling.
 */
export declare function generateAndStylizeTableFromRows<RowType extends Record<string, any>, T extends string>(params: GenerateTableParams<RowType, T>): TableInfo;
/**
 * Generates a table structure without applying styling.
 * Returns TableInfo with all the positioning details.
 */
export declare function generateTableFromRows<RowType extends Record<string, any>>({ sheet, rows, startRow, startCol, columns, summaryRowOps, options, title, splitTitle, }: GenerateTableParams<RowType, any>): TableInfo;
