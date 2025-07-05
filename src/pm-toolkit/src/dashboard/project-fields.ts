import * as COL from "../constants/column-headers";
import * as GF from "./field-functions";
import { FieldContext, ProjectField } from "./types";

export const PROJECT_FIELDS: ProjectField[] = [
  {
    dbHeader: COL.COL_PROJECT_NO,
    valueFn: (fieldContext: FieldContext) => GF.getProjectNumber(fieldContext),
  },
  {
    dbHeader: COL.COL_CLIENT_NAME,
    valueFn: (fieldContext: FieldContext) => GF.getClientName(fieldContext),
  },
  {
    dbHeader: COL.COL_CONTRACT_PRICE,
    valueFn: (fieldContext: FieldContext) => GF.getContractPrice(fieldContext),
  },
  {
    dbHeader: COL.COL_CHANGE_ORDERS,
    valueFn: (fieldContext: FieldContext) => GF.getChangeOrders(fieldContext),
  },
  {
    dbHeader: COL.COL_EXPENSES,
    valueFn: (fieldContext: FieldContext) => GF.getExpenses(fieldContext),
  },
  {
    dbHeader: COL.COL_MAX_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getMaxAdvance(fieldContext),
  },
  {
    dbHeader: COL.COL_TOTAL_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getTotalAdvance(fieldContext),
  },
  {
    dbHeader: COL.COL_ADVANCE_BALANCE,
    valueFn: (fieldContext: FieldContext) => GF.getAdvanceBalance(fieldContext),
  },
  {
    dbHeader: COL.COL_PM_AFTER_ADVANCE,
    valueFn: (fieldContext: FieldContext) => GF.getPMAfterAdvance(fieldContext),
  },
  {
    dbHeader: COL.COL_EXPECTED_PROFIT,
    valueFn: (fieldContext: FieldContext) => GF.getExpectedProfit(fieldContext),
  },
  {
    dbHeader: COL.COL_PROFIT_AFTER_ADVANCE,
    valueFn: (fieldContext: FieldContext) =>
      GF.getProfitAfterAdvance(fieldContext),
  },
];

export const PROJECT_DASHBOARD_HEADERS = PROJECT_FIELDS.map((f) => f.dbHeader);
export const headerIndexMap = PROJECT_DASHBOARD_HEADERS.reduce(
  (map, header, i) => {
    map[header] = i;
    return map;
  },
  {} as Record<string, number>
);

export const CURRENCY_COLUMNS = [
  COL.COL_CONTRACT_PRICE,
  COL.COL_CHANGE_ORDERS,
  COL.COL_EXPENSES,
  COL.COL_MAX_ADVANCE,
  COL.COL_TOTAL_ADVANCE,
  COL.COL_ADVANCE_BALANCE,
  COL.COL_PM_AFTER_ADVANCE,
  COL.COL_EXPECTED_PROFIT,
  COL.COL_PROFIT_AFTER_ADVANCE,
];

export const LEGACY_CELLS: Record<string, string> = {
  [COL.COL_CONTRACT_PRICE]: "M2",
  [COL.COL_CHANGE_ORDERS]: "M7",
  [COL.COL_EXPENSES]: "M13",
  [COL.COL_MAX_ADVANCE]: "M19",
  [COL.COL_TOTAL_ADVANCE]: "I21",
  [COL.COL_PM_AFTER_ADVANCE]: "M21",
};
