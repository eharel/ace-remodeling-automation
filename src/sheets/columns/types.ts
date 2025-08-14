// Note: SummaryOperationConfig moved to @tables/summary - import directly from there when needed

import { SummaryOperationConfig } from "@sheets/columns/summary";

// 📊 Formatting and alignment
export type ColumnFormat = "currency" | "text" | "number" | "percent" | "date";
export type Alignment = "left" | "center" | "right";

// 📋 A generic base column type
export type BaseColumn<
  TContext = any,
  TKey extends string = string,
  TLabel extends string = string
> = {
  key: TKey;
  label: TLabel;
  valueFn: (ctx: TContext) => any;
  format?: ColumnFormat;
  formatDecimals?: number;
  align?: Alignment;
  description?: string;
  help?: string;
  summaryOps?: SummaryOperationConfig;
};

// 🧱 A type-safe dashboard row keyed by a specific set of keys
export type DashboardRow<K extends string> = {
  [Key in K]: string | number;
};
