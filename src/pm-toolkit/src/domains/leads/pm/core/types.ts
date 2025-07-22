import { BaseColumn } from "@shared/columns";
import { DashboardKey, DashboardLabel } from "../../shared/columns/types";
import { LeadsRowContext, QuarterRowContext } from "../../shared/rows/types";
import { QuarterlyKey, QuarterlyLabel } from "../../shared/columns/labels";

// Full dashboard row (input + derived)
export type LeadsDashboardRow = {
  [K in DashboardKey]: number | string;
};

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
