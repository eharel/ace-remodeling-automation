export type StylizeOptions<T extends string = string> = {
  colorKeys?: readonly T[];
  zebra?: boolean;
  showDescription?: boolean;
  rowSpan?: number;
  rowSpanMap?: Record<string, number>;
  customStylizers?: ((
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    table: TableInfo
  ) => void)[];
  columnWidths?: Partial<Record<string, number>>;
  summaryTitle?: string; // Optional title for summary row, defaults to "Summary" if not provided
};

export type TableInfo = {
  title?: string;
  startRow: number;
  startCol: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number;

  endRow: number;
  endCol: number;
};

export type SummaryOperation = "sum" | "avg" | "none";
export const OPERATION_SYMBOLS: Record<SummaryOperation, string> = {
  sum: "Σ",
  avg: "x̄", // Using the Greek letter mu (μ) which is more visible than "AVG"
  none: "",
};

// Format types for summary values
export type ValueFormat = "currency" | "percent" | "number" | "text";

// Configuration for a summary operation
export interface SummaryOperationConfig {
  operation: SummaryOperation;
  format?: ValueFormat;
  decimals?: number;
}

export type SummaryOperationsMap = Partial<
  Record<string, SummaryOperation | SummaryOperationConfig>
>;
