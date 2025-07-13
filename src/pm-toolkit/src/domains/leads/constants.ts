import { LEADS_COLUMNS } from "./columns-months";

export const PAYMENTS_INPUT_SHEET = "(WIP) Payments Input";
export const PAYMENTS_INPUT_TABLE_ANCHOR = "A1";

export const LEADS_INPUT_SHEET = "(WIP) Leads Input";
export const LEADS_INPUT_TABLE_ANCHOR = "A1";

export const LEADS_DASHBOARD_SHEET = "(WIP) Leads Dashboard";

export const NR_LEADS_INPUT_TABLE = "leads_input_table";
export const NR_LEADS_MONTHLY_GOALS = "leads_monthly_goals";

export const BLANK_SHEET_TEMPLATE = "Blank Sheet Template";

// Softer quarterly color coding for dashboard visualization
export const QUARTER_COLORS = {
  Q1: "#D2E3FC", // Soft Blue for Q1 (Winter)
  Q2: "#D9F5DD", // Soft Green for Q2 (Spring)
  Q3: "#FEF3C0", // Soft Yellow for Q3 (Summer)
  Q4: "#FAD2CF", // Soft Red for Q4 (Fall)
};

// Quarter to month mapping
export const QUARTER_TO_MONTHS = {
  Q1: [1, 2, 3],
  Q2: [4, 5, 6],
  Q3: [7, 8, 9],
  Q4: [10, 11, 12],
};

export const LEADS_KEYS = {
  YEAR: "COL_LEADS_YEAR",
  MONTH: "COL_LEADS_MONTH",
  TOTAL_LEADS: "COLs_TOTAL_LEADS",
  SIGNED: "COL_SIGNED_PROPOSALS",
  REVENUE: "COL_APPROVED_REVENUE",
  REVENUE_GOAL: "COL_REVENUE_GOAL",
  REVENUE_DIFF: "COL_REVENUE_DIFF",
  CONVERSION_RATE: "COL_CONVERSION_RATE",
  PROP_NOT_SENT: "COL_PROP_NOT_SENT",
} as const;

export const LEADS_LABELS = {
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed Proposals",
  REVENUE: "Approved Revenue",
  REVENUE_GOAL: "Revenue Goal",
  REVENUE_DIFF: "Revenue Difference",
  CONVERSION_RATE: "Conversion Rate (%)",
  PROP_NOT_SENT: "Proposals Not Sent",
} as const;

export const QUARTER_KEYS = {
  ...LEADS_KEYS,
  QUARTER: "COL_QUARTER",
} as const;

export const QUARTER_LABELS = {
  ...LEADS_LABELS,
  QUARTER: "Quarter",
} as const;

export const NR_LEADS_MONTHLY_DASHBOARD_TABLE = "leads_monthly_dashboard_table";
export const NR_LEADS_QUARTERLY_DASHBOARD_TABLE =
  "leads_quarterly_dashboard_table";
