import type { SummaryOperationConfig } from "@shared/styles";

export const revenueOps: SummaryOperationConfig = {
  operation: "sum",
  format: "currency",
  decimals: 2,
};

export const leadsOps: SummaryOperationConfig = {
  operation: "sum",
  format: "number",
  decimals: 1,
};

export const signedOps: SummaryOperationConfig = leadsOps;

export const percentAvgOps: SummaryOperationConfig = {
  operation: "avg",
  format: "percent",
  decimals: 2,
};
