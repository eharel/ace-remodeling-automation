// 🔑 INPUT TABLE KEYS
export const inputKeys = {
  MONTH: "MONTH",
  PROP_NOT_SENT: "PROP_NOT_SENT",
  REVENUE: "REVENUE",
  REVENUE_GOAL: "REVENUE_GOAL",
  SIGNED: "SIGNED",
  TOTAL_LEADS: "TOTAL_LEADS",
  YEAR: "YEAR",
} as const;

// 🔑 DASHBOARD KEYS (input + derived)
export const dashboardKeys = {
  ...inputKeys,
  CONVERSION_RATE: "CONVERSION_RATE",
  REVENUE_DIFF: "REVENUE_DIFF",
} as const;
