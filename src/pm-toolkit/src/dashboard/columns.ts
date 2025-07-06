export const DASHBOARD_KEYS = {
  PROJECT_NO: "COL_PROJECT_NO",
  CLIENT_NAME: "COL_CLIENT_NAME",
  CONTRACT_PRICE: "COL_CONTRACT_PRICE",
  CHANGE_ORDERS: "COL_CHANGE_ORDERS",
  EXPENSES: "COL_EXPENSES",
  MAX_ADVANCE: "COL_MAX_ADVANCE",
  TOTAL_ADVANCE: "COL_TOTAL_ADVANCE",
  ADVANCE_BALANCE: "COL_ADVANCE_BALANCE",
  PM_AFTER_ADVANCE: "COL_PM_AFTER_ADVANCE",
  EXPECTED_PROFIT: "COL_EXPECTED_PROFIT",
  PROFIT_AFTER_ADVANCE: "COL_PROFIT_AFTER_ADVANCE",
} as const;

export const DASHBOARD_LABELS = {
  PROJECT_NO: "Project No",
  CLIENT_NAME: "Client Name",
  CONTRACT_PRICE: "Contract Price",
  CHANGE_ORDERS: "Change Orders",
  EXPENSES: "Expenses",
  MAX_ADVANCE: "Max Advance",
  TOTAL_ADVANCE: "Total Advance",
  ADVANCE_BALANCE: "Advance Balance",
  PM_AFTER_ADVANCE: "PM After Advance",
  EXPECTED_PROFIT: "Expected Profit",
  PROFIT_AFTER_ADVANCE: "Profit After Advance",
} as const;

export type DashboardColumnLabel =
  (typeof DASHBOARD_LABELS)[keyof typeof DASHBOARD_LABELS];

export type DashboardColumnKey =
  (typeof DASHBOARD_KEYS)[keyof typeof DASHBOARD_KEYS];

export type DashboardColumn = {
  key: DashboardColumnKey;
  label: string;
  description?: string;
  help?: string;
};

export const DASHBOARD_COLUMNS: DashboardColumn[] = [
  {
    key: DASHBOARD_KEYS.PROJECT_NO,
    label: DASHBOARD_LABELS.PROJECT_NO,
  },
  {
    key: DASHBOARD_KEYS.CLIENT_NAME,
    label: DASHBOARD_LABELS.CLIENT_NAME,
  },
  {
    key: DASHBOARD_KEYS.CONTRACT_PRICE,
    label: DASHBOARD_LABELS.CONTRACT_PRICE,
  },
  {
    key: DASHBOARD_KEYS.CHANGE_ORDERS,
    label: DASHBOARD_LABELS.CHANGE_ORDERS,
  },
  {
    key: DASHBOARD_KEYS.TOTAL_ADVANCE,
    label: DASHBOARD_LABELS.TOTAL_ADVANCE,
  },
  {
    key: DASHBOARD_KEYS.MAX_ADVANCE,
    label: DASHBOARD_LABELS.MAX_ADVANCE,
    description: "10% × (Contract + COs)",
    help: "Maximum allowed advance = 10% of Contract Price + Change Orders",
  },
  {
    key: DASHBOARD_KEYS.ADVANCE_BALANCE,
    label: DASHBOARD_LABELS.ADVANCE_BALANCE,
    description: "Max Advance - Total Advance",
    help: "Remaining room before exceeding the allowed advance limit",
  },
  {
    key: DASHBOARD_KEYS.EXPENSES,
    label: DASHBOARD_LABELS.EXPENSES,
  },
  {
    key: DASHBOARD_KEYS.EXPECTED_PROFIT,
    label: DASHBOARD_LABELS.EXPECTED_PROFIT,
    description: "Contract + COs - Expenses",
    help: "What the PM is expected to keep after all subs and materials are paid",
  },
  {
    key: DASHBOARD_KEYS.PROFIT_AFTER_ADVANCE,
    label: DASHBOARD_LABELS.PROFIT_AFTER_ADVANCE,
    description: "Expected Profit - Advance",
    help: "Expected profit once the advance is paid out",
  },
  {
    key: DASHBOARD_KEYS.PM_AFTER_ADVANCE,
    label: DASHBOARD_LABELS.PM_AFTER_ADVANCE,
    description: "Final Payment - Sub Expenses",
    help: "Amount the PM keeps after paying subs from final payment",
  },
];

export const COLUMN_LABELS_BY_KEY: Record<
  DashboardColumnKey,
  DashboardColumnLabel
> = DASHBOARD_COLUMNS.reduce((acc, col) => {
  acc[col.key] = col.label as DashboardColumnLabel;
  return acc;
}, {} as Record<DashboardColumnKey, DashboardColumnLabel>);

export const COLUMN_KEYS_BY_LABEL: Record<
  DashboardColumnLabel,
  DashboardColumnKey
> = DASHBOARD_COLUMNS.reduce((acc, col) => {
  acc[col.label as DashboardColumnLabel] = col.key;
  return acc;
}, {} as Record<DashboardColumnLabel, DashboardColumnKey>);

export function getColumnLabel(key: DashboardColumnKey): DashboardColumnLabel {
  return COLUMN_LABELS_BY_KEY[key];
}

export function getColumnKey(label: DashboardColumnLabel): DashboardColumnKey {
  return COLUMN_KEYS_BY_LABEL[label];
}

export function getColumnDescription(
  key: DashboardColumnKey
): string | undefined {
  return DASHBOARD_COLUMNS.find((col) => col.key === key)?.description;
}
