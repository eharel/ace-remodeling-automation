import { BaseColumn } from "@sheets/columns";
import { DashboardKey, DashboardLabel } from "./columns/types";
import { LeadsRowContext, QuarterRowContext } from "./rows/types";
import { QuarterlyKey, QuarterlyLabel } from "./columns/labels";

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
