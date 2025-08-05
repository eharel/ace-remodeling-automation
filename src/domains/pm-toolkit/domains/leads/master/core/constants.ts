// MASTER LEADS TABLE
export const LEADS_MASTER_KEYS = {
  PM: "PM",
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed",
  REVENUE: "Revenue",
  REVENUE_GOAL: "Revenue Goal",
} as const;

export type LeadsMasterKey =
  (typeof LEADS_MASTER_KEYS)[keyof typeof LEADS_MASTER_KEYS];

export const LEADS_MASTER_TABLE_NAME = "Leads Master Table";

export const LEADS_MASTER_LABELS = {
  PM: "PM",
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed",
};

export const REVENUE_MASTER_TABLE_NAME = "Project Revenue";
export const REVENUE_LABELS = {
  PM: "PM",
  YEAR: "Year",
  MONTH: "Month",
  REVENUE: "Revenue",
  PROJECT_NUMBER: "Project Number",
};
