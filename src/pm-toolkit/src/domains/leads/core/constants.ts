// 📄 SHEET INFO
export const INPUT_SHEET = "Leads Input";
export const INPUT_ANCHOR = "A1";

export const DASHBOARD_SHEET = "Leads Dashboard";

// 📌 NAMED RANGES
// NR_DASHBOARD_* — Dashboard named ranges
export const NR_MONTHLY_GOALS = "leads_monthly_goals";
export const NR_MONTHLY_TABLE = "leads_monthly_dashboard_table";
export const NR_QUARTERLY_TABLE = "leads_quarterly_dashboard_table";

// NR_INPUT_* — Input sheet named ranges
export const NR_INPUT_YEAR_COL = "leads_input_year_column";
export const NR_INPUT_MONTH_COL = "leads_input_month_column";
export const NR_INPUT_GOAL_COL = "leads_input_goal_column";
export const NR_INPUT_REVENUE_COL = "leads_input_revenue_column";

export const QUARTERS_ROW_SPAN = 3;

// 🧾 TEMPLATE
export const BLANK_SHEET_TEMPLATE = "Blank Sheet Template";

// 🔢 QUARTER → MONTH
export const QUARTER_TO_MONTHS = {
  Q1: [1, 2, 3],
  Q2: [4, 5, 6],
  Q3: [7, 8, 9],
  Q4: [10, 11, 12],
};

// 🔑 INPUT TABLE KEYS
export const inputKeys = {
  YEAR: "YEAR",
  MONTH: "MONTH",
  TOTAL_LEADS: "TOTAL_LEADS",
  SIGNED: "SIGNED",
  REVENUE: "REVENUE",
  REVENUE_GOAL: "REVENUE_GOAL",
  PROP_NOT_SENT: "PROP_NOT_SENT",
} as const;

// 🔑 DASHBOARD KEYS (input + derived)
export const dashboardKeys = {
  ...inputKeys,
  REVENUE_DIFF: "REVENUE_DIFF",
  CONVERSION_RATE: "CONVERSION_RATE",
} as const;

// 🔖 HUMAN-FRIENDLY LABELS
export const labels: Record<keyof typeof dashboardKeys, string> = {
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
  ...labels,
  QUARTER: "Quarter",
};

// 🧠 TYPE ALIASES
export type InputKey = keyof typeof inputKeys;
export type DashboardKey = keyof typeof dashboardKeys;
export type DashboardLabel = (typeof labels)[DashboardKey];

// 🔁 MAPPINGS
export const KEYS_BY_LABEL: Record<DashboardLabel, DashboardKey> =
  Object.fromEntries(Object.entries(labels).map(([k, v]) => [v, k])) as Record<
    DashboardLabel,
    DashboardKey
  >;

export const LABELS_BY_KEY: Record<DashboardKey, DashboardLabel> = labels;
export type QuarterlyKey = keyof typeof quarterlyKeys;
export type QuarterlyLabel = (typeof quarterlyLabels)[QuarterlyKey];

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
