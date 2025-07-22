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
