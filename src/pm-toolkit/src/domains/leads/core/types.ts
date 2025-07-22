import {
  InputKey,
  QuarterlyKey,
  QuarterlyLabel,
} from "@pm/domains/leads/core/constants";
import { BaseColumn } from "@pm/columns";
import { DashboardKey, DashboardLabel } from "@pm/domains/leads/core/constants";

export type LeadsInputRow = {
  [K in InputKey]: number;
};

// Full dashboard row (input + derived)
export type LeadsDashboardRow = {
  [K in DashboardKey]: number | string;
};

// Aggregated quarterly row
export type QuarterDashboardRow = Record<string, string | number>;

// Context passed into valueFn() for each column
export interface LeadsRowContext {
  inputRowData: LeadsInputRow;
}

export interface QuarterRowContext {
  inputRowData: QuarterDashboardRow;
}

// Column metadata for monthly dashboard
export type LeadsColumn = BaseColumn<
  LeadsRowContext,
  DashboardKey,
  DashboardLabel
>;

// Column metadata for quarterly dashboard
export type LeadsQuarterColumn = BaseColumn<
  QuarterRowContext,
  QuarterlyKey,
  QuarterlyLabel
>;
