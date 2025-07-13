import { BaseColumn } from "../../columns";
import { LeadsColumnKey, LeadsColumnLabel } from "./columns-months";
import { LEADS_KEYS } from "./constants";
import { QuarterColumnKey, QuarterColumnLabel } from "./columns-quarters";

export type PaymentEntry = {
  date: Date;
  amount: number;
  transaction: string;
};

// export type LeadsInputRow = {
//   year: number;
//   month: number;
//   totalLeads: number;
//   signedProposals: number;
//   approvedRevenue: number;
// };

export type LeadsInputRow = {
  [LEADS_KEYS.YEAR]: number;
  [LEADS_KEYS.MONTH]: number;
  [LEADS_KEYS.TOTAL_LEADS]: number;
  [LEADS_KEYS.SIGNED]: number;
  [LEADS_KEYS.REVENUE]: number;
  [LEADS_KEYS.PROP_NOT_SENT]: number;
};

export type LeadsDashboardRow = Record<LeadsColumnKey, number | string>;

export type QuarterDashboardRow = Record<string, string | number>;

export interface LeadsRowContext {
  inputRowData: LeadsInputRow;
  existingGoals: Map<string, number>;
}

export interface QuarterRowContext {
  inputRowData: QuarterDashboardRow;
}

export type LeadsColumn = BaseColumn<
  LeadsRowContext,
  LeadsColumnKey,
  LeadsColumnLabel
>;

export type LeadsQuarterColumn = BaseColumn<
  QuarterRowContext,
  QuarterColumnKey,
  QuarterColumnLabel
>;
