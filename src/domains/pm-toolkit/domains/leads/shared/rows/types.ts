import { InputKey } from "../columns/types";

import { QuarterlyKey } from "../columns/labels";
import { DashboardRow } from "@sheets/rows/types";

export type QuarterDashboardRow = DashboardRow<QuarterlyKey>;

// Input row shape
export type LeadsInputRow = {
  [K in InputKey]: number | undefined;
};

// Context passed into valueFn() for each column
export interface LeadsRowContext {
  inputRowData: LeadsInputRow;
}

// If you keep a shared version of Quarter rows
export interface QuarterRowContext {
  inputRowData: Record<string, string | number>; // or type-safe later
}
