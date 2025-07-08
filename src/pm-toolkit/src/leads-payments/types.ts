import { BaseColumn } from "../columns";
import { LeadsColumnKey, LeadsColumnLabel } from "./columns";

export type PaymentEntry = {
  date: Date;
  amount: number;
  transaction: string;
};

export type LeadsInputRow = {
  year: number;
  month: number;
  totalLeads: number;
  signedProposals: number;
  approvedRevenue: number;
};

export type LeadsDashboardRow = Record<LeadsColumnKey, number | string>;

export interface LeadsContext {
  rowData: LeadsDashboardRow;
}

export type LeadsColumn = BaseColumn<
  LeadsContext,
  LeadsColumnKey,
  LeadsColumnLabel
>;
