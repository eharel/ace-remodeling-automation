export const MASTER_INPUT_KEYS = {
  PM: "PM",
  YEAR: "YEAR",
  MONTH: "MONTH",
  TOTAL_LEADS: "TOTAL_LEADS",
  SIGNED: "SIGNED", // or "CLOSED" if you rename it
} as const;

export type MasterInputKey = keyof typeof MASTER_INPUT_KEYS;

export type MasterInputRow = {
  [K in MasterInputKey]: string | number;
};

export const MASTER_INPUT_LABELS = {
  PM: "Project Manager",
  YEAR: "Year",
  MONTH: "Month",
  TOTAL_LEADS: "Total Leads",
  SIGNED: "Signed Proposals", // or "Closed Deals"
} as const;

export type MasterInputLabel = (typeof MASTER_INPUT_LABELS)[MasterInputKey];

// 1. Dashboard Keys
export const MASTER_DASHBOARD_KEYS = {
  ...MASTER_INPUT_KEYS,
  CONVERSION_RATE: "CONVERSION_RATE",
} as const;

export type MasterDashboardKey = keyof typeof MASTER_DASHBOARD_KEYS;

// 2. Dashboard Labels
export const MASTER_DASHBOARD_LABELS = {
  ...MASTER_INPUT_LABELS,
  CONVERSION_RATE: "Conversion Rate (%)",
} as const;

export type MasterDashboardLabel =
  (typeof MASTER_DASHBOARD_LABELS)[MasterDashboardKey];

// 3. Dashboard Row
export type MasterDashboardRow = {
  [K in MasterDashboardKey]: string | number;
};
