import { BaseColumn } from "@shared/columns";
import { CellStyling, StylizeOptions, SummaryOperationsMap } from "@shared/styles";

/**
 * Parameters for generating a table with data rows, headers, and optional summary.
 */
export type GenerateTableParams<
  RowType extends Record<string, any>,
  T extends string
> = {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  rows: RowType[];
  startRow: number;
  startCol: number;
  columns: BaseColumn<any, any, any>[];
  summaryRowOps: SummaryOperationsMap;
  options?: StylizeOptions<T>;
  title?: string;
  /**
   * If provided, will render the title using a split-merge row for frozen layouts.
   * Allows the title to be centered across the scrollable area.
   */
  splitTitle?: {
    frozenColumns: number;
    styling?: CellStyling;
  };
};
