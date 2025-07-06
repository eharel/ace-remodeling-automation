import * as COL from "./columns";
import * as GF from "./field-functions";
import { FieldContext, ProjectField } from "./types";
import { getColumnLabel } from "./columns";

export const PROJECT_FIELDS: ProjectField[] = [
  {
    key: COL.DASHBOARD_KEYS.PROJECT_NO,
    valueFn: (fieldContext: FieldContext) => GF.getProjectNumber(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.CLIENT_NAME,
    valueFn: (fieldContext: FieldContext) => GF.getClientName(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.CONTRACT_PRICE,
    valueFn: (fieldContext: FieldContext) => GF.getContractPrice(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.CHANGE_ORDERS,
    valueFn: (fieldContext: FieldContext) => GF.getChangeOrders(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.EXPENSES,
    valueFn: (fieldContext: FieldContext) => GF.getExpenses(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.MAX_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getMaxAdvance(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.TOTAL_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getTotalAdvance(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.ADVANCE_BALANCE,
    valueFn: (fieldContext: FieldContext) => GF.getAdvanceBalance(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.PM_AFTER_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getPMAfterAdvance(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.EXPECTED_PROFIT,
    valueFn: (fieldContext: FieldContext) => GF.getExpectedProfit(fieldContext),
  },
  {
    key: COL.DASHBOARD_KEYS.PROFIT_AFTER_ADVANCE,
    valueFn: (fieldContext: FieldContext) =>
      GF.getProfitAfterAdvance(fieldContext),
  },
];

export const PROJECT_DASHBOARD_HEADERS = PROJECT_FIELDS.map((f) =>
  getColumnLabel(f.key)
);

export const headerIndexMap = PROJECT_DASHBOARD_HEADERS.reduce(
  (map, header, i) => {
    map[header] = i;
    return map;
  },
  {} as Record<string, number>
);

export const CURRENCY_COLUMNS = [
  COL.DASHBOARD_KEYS.CONTRACT_PRICE,
  COL.DASHBOARD_KEYS.CHANGE_ORDERS,
  COL.DASHBOARD_KEYS.EXPENSES,
  COL.DASHBOARD_KEYS.MAX_ADVANCE,
  COL.DASHBOARD_KEYS.TOTAL_ADVANCE,
  COL.DASHBOARD_KEYS.ADVANCE_BALANCE,
  COL.DASHBOARD_KEYS.PM_AFTER_ADVANCE,
  COL.DASHBOARD_KEYS.EXPECTED_PROFIT,
  COL.DASHBOARD_KEYS.PROFIT_AFTER_ADVANCE,
];

export const LEGACY_CELLS: Record<string, string> = {
  [COL.DASHBOARD_KEYS.CONTRACT_PRICE]: "M2",
  [COL.DASHBOARD_KEYS.CHANGE_ORDERS]: "M7",
  [COL.DASHBOARD_KEYS.EXPENSES]: "M13",
  [COL.DASHBOARD_KEYS.MAX_ADVANCE]: "M19",
  [COL.DASHBOARD_KEYS.TOTAL_ADVANCE]: "I21",
  [COL.DASHBOARD_KEYS.PM_AFTER_ADVANCE]: "M21",
};
