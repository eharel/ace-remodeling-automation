import { dashboardKeys } from "./keys";

export const inputLabels = {
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed Proposals",
  REVENUE: "Approved Revenue",
  PROP_NOT_SENT: "Prop. Not Sent",
  REVENUE_GOAL: "Revenue Goal",
};

// 🔖 HUMAN-FRIENDLY LABELS
export const dashboardLabels: Record<keyof typeof dashboardKeys, string> = {
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed Proposals",
  REVENUE: "Approved Revenue",
  REVENUE_GOAL: "Revenue Goal",
  REVENUE_DIFF: "Revenue Difference",
  CONVERSION_RATE: "Conversion Rate (%)",
  PROP_NOT_SENT: "Prop. Not Sent",
};

// ➕ FOR QUARTERLY
export const quarterlyKeys = {
  ...dashboardKeys,
  QUARTER: "QUARTER",
} as const;

export const quarterlyLabels = {
  ...dashboardLabels,
  QUARTER: "Quarter",
};

export type QuarterlyKey = keyof typeof quarterlyKeys;
export type QuarterlyLabel = (typeof quarterlyLabels)[QuarterlyKey];
