import {
  EXPECTED_PROFIT_PERCENTAGE,
  MAX_ADVANCE_PERCENTAGE,
} from "../../../constants";
import * as GF from "./transform-functions";
import { ProjectColumn, ProjectContext } from "./types";

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
  TOTAL_ADVANCE: "Advance So Far",
  ADVANCE_BALANCE: "Advance Balance",
  PM_AFTER_ADVANCE: "PM After Advance",
  EXPECTED_PROFIT: "Expected Profit",
  PROFIT_AFTER_ADVANCE: "Profit After Advance",
} as const;

export type DashboardColumnLabel =
  (typeof DASHBOARD_LABELS)[keyof typeof DASHBOARD_LABELS];

export type DashboardColumnKey =
  (typeof DASHBOARD_KEYS)[keyof typeof DASHBOARD_KEYS];

export const DASHBOARD_COLUMNS: ProjectColumn[] = [
  {
    key: DASHBOARD_KEYS.PROJECT_NO,
    label: DASHBOARD_LABELS.PROJECT_NO,
    valueFn: (ctx: ProjectContext) => GF.getProjectNumber(ctx),
    format: "text",
    align: "center",
  },
  {
    key: DASHBOARD_KEYS.CLIENT_NAME,
    label: DASHBOARD_LABELS.CLIENT_NAME,
    valueFn: (ctx: ProjectContext) => GF.getClientName(ctx),
    format: "text",
    align: "left",
  },
  {
    key: DASHBOARD_KEYS.CONTRACT_PRICE,
    label: DASHBOARD_LABELS.CONTRACT_PRICE,
    valueFn: (ctx: ProjectContext) => GF.getContractPrice(ctx),
    description: "CP",
    format: "currency",
    legacyCell: "M2",
  },
  {
    key: DASHBOARD_KEYS.CHANGE_ORDERS,
    label: DASHBOARD_LABELS.CHANGE_ORDERS,
    valueFn: (ctx: ProjectContext) => GF.getChangeOrders(ctx),
    description: "CO",
    format: "currency",
    legacyCell: "M7",
  },
  {
    key: DASHBOARD_KEYS.EXPECTED_PROFIT,
    label: DASHBOARD_LABELS.EXPECTED_PROFIT,
    description: `${EXPECTED_PROFIT_PERCENTAGE}% of (CP + COs)`,
    valueFn: (ctx: ProjectContext) => GF.getExpectedProfit(ctx),
    help: "What the PM is expected to keep after all subs and materials are paid",
    format: "currency",
  },
  {
    key: DASHBOARD_KEYS.MAX_ADVANCE,
    label: DASHBOARD_LABELS.MAX_ADVANCE,
    valueFn: (ctx: ProjectContext) => GF.getMaxAdvance(ctx),
    description: `${MAX_ADVANCE_PERCENTAGE}% of (CP + COs)`,
    help: "Maximum allowed advance = 10% of Contract Price + Change Orders",
    format: "currency",
    legacyCell: "I15",
  },
  {
    key: DASHBOARD_KEYS.TOTAL_ADVANCE,
    label: DASHBOARD_LABELS.TOTAL_ADVANCE,
    valueFn: (ctx: ProjectContext) => GF.getTotalAdvance(ctx),
    format: "currency",
    legacyCell: "I21",
  },
  {
    key: DASHBOARD_KEYS.ADVANCE_BALANCE,
    label: DASHBOARD_LABELS.ADVANCE_BALANCE,
    description: "Max Advance - Advance So Far",
    help: "Remaining room before exceeding the allowed advance limit",
    valueFn: (projectContext: ProjectContext) =>
      GF.getAdvanceBalance(projectContext),
    format: "currency",
  },
  // {
  //   key: DASHBOARD_KEYS.EXPENSES,
  //   label: DASHBOARD_LABELS.EXPENSES,
  //   description: "Bills / PO",
  //   valueFn: (projectContext: ProjectContext) => GF.getExpenses(projectContext),
  //   format: "currency",
  //   legacyCell: "M13",
  // },
  // {
  //   key: DASHBOARD_KEYS.PROFIT_AFTER_ADVANCE,
  //   label: DASHBOARD_LABELS.PROFIT_AFTER_ADVANCE,
  //   description: "Expected Profit - Total Advance",
  //   valueFn: (projectContext: ProjectContext) =>
  //     GF.getProfitAfterAdvance(projectContext),
  //   format: "currency",
  //   help: "Expected profit once the advance is paid out",
  // },
  {
    key: DASHBOARD_KEYS.PM_AFTER_ADVANCE,
    label: DASHBOARD_LABELS.PM_AFTER_ADVANCE,
    help: "Amount the PM keeps after the total advance is paid out",
    valueFn: (projectContext: ProjectContext) =>
      GF.getPMAfterAdvance(projectContext),
    format: "currency",
    legacyCell: "M21",
  },
];

import { buildLabelKeyMaps } from "../../../../../shared/columns/utils";

const labelMaps = buildLabelKeyMaps<DashboardColumnKey, DashboardColumnLabel>(
  DASHBOARD_COLUMNS
);
export const COLUMN_LABELS_BY_KEY = labelMaps.labelsByKey;
export const COLUMN_KEYS_BY_LABEL = labelMaps.keysByLabel;
