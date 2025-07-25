import { SummaryOperationsMap } from "@shared/styles";
import { dashboardKeys, inputKeys, quarterlyKeys } from "../columns";

// Summary row operations for monthly table
export const MONTHLY_SUMMARY_OPERATIONS: SummaryOperationsMap = {
  [dashboardKeys.REVENUE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [dashboardKeys.REVENUE_GOAL]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [dashboardKeys.REVENUE_DIFF]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [inputKeys.TOTAL_LEADS]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [inputKeys.SIGNED]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [dashboardKeys.CONVERSION_RATE]: {
    operation: "avg",
    format: "percent",
    decimals: 2,
  },
};

// Summary row operations for quarterly table
export const QUARTERLY_SUMMARY_OPERATIONS: SummaryOperationsMap = {
  [quarterlyKeys.REVENUE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.REVENUE_GOAL]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.REVENUE_DIFF]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.TOTAL_LEADS]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [quarterlyKeys.SIGNED]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [quarterlyKeys.CONVERSION_RATE]: {
    operation: "avg",
    format: "percent",
    decimals: 2,
  },
};
