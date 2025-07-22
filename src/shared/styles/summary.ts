export type SummaryOperation = "sum" | "avg" | "none";

export const OPERATION_SYMBOLS: Record<SummaryOperation, string> = {
  sum: "Σ",
  avg: "x̄",
  none: "",
};

export type ValueFormat = "currency" | "percent" | "number" | "text";

export interface SummaryOperationConfig {
  operation: SummaryOperation;
  format?: ValueFormat;
  decimals?: number;
}

export type SummaryOperationsMap = Partial<
  Record<string, SummaryOperation | SummaryOperationConfig>
>;
