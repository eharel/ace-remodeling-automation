import type { FieldContext } from "./types";
import * as NR from "../constants/named-ranges";
import * as COL from "../constants/column-headers";
import { getNamedRange } from "./utils";
import { LEGACY_CELLS } from "./project-fields";
import { calculateAdvanceMax } from "./utils";
import { getFieldValue } from "./utils";
import { toNumber } from "../utils";
import { EXPECTED_PROFIT_PERCENTAGE } from "../constants";
import { getValueFromNamedOrLegacy } from "./utils";

export function getProjectNumber({
  sheet,
  namedRangeMap,
}: FieldContext): string {
  const nr = namedRangeMap.get(NR.NR_PROJECT_NUMBER);
  if (nr) return nr.getValue();

  const name = sheet.getName();
  const match = name.trim().match(/^(\d+)\s+/);
  return match ? match[1] : "N/A";
}

export function getClientName({ sheet, namedRangeMap }: FieldContext): string {
  const nr = namedRangeMap.get(NR.NR_CLIENT_NAME);
  if (nr) return nr.getValue();

  const name = sheet.getName();
  const match = name.trim().match(/^\d+\s+(.+)$/);
  return match ? match[1] : "N/A";
}

export function getContractPrice({
  namedRangeMap,
  directValueMap,
}: FieldContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_CONTRACT_PRICE,
    COL.COL_CONTRACT_PRICE
  );
}

export function getChangeOrders({
  namedRangeMap,
  directValueMap,
}: FieldContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_CHANGE_ORDER_TOTAL,
    COL.COL_CHANGE_ORDERS
  );
}

export function getExpenses({
  namedRangeMap,
  directValueMap,
}: FieldContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_EXPENSE_TOTAL,
    COL.COL_EXPENSES
  );
}

export function getMaxAdvance({ rowData }: FieldContext): number | string {
  // TODO: Do I need to consider legacy cells here?

  const contractPrice = toNumber(
    getFieldValue(rowData, COL.COL_CONTRACT_PRICE)
  );
  const changeOrders = toNumber(getFieldValue(rowData, COL.COL_CHANGE_ORDERS));

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A";

  return calculateAdvanceMax(contractPrice, changeOrders);
}

export function getTotalAdvance({
  namedRangeMap,
  directValueMap,
}: FieldContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_ADVANCE_TOTAL,
    COL.COL_TOTAL_ADVANCE
  );
}

export function getAdvanceBalance({ rowData }: FieldContext): number | string {
  const maxAdvance = toNumber(getFieldValue(rowData, COL.COL_MAX_ADVANCE));
  const totalAdvance = toNumber(getFieldValue(rowData, COL.COL_TOTAL_ADVANCE));

  if (typeof maxAdvance !== "number" || typeof totalAdvance !== "number")
    return "N/A";

  return maxAdvance - totalAdvance;
}

export function getPMAfterAdvance({
  namedRangeMap,
  directValueMap,
}: FieldContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_PM_AFTER_ADVANCE,
    COL.COL_PM_AFTER_ADVANCE
  );
}

export function getExpectedProfit({ rowData }: FieldContext): number | string {
  // 20% of (contract price + change orders)
  const contractPrice = toNumber(
    getFieldValue(rowData, COL.COL_CONTRACT_PRICE)
  );
  const changeOrders = toNumber(getFieldValue(rowData, COL.COL_CHANGE_ORDERS));

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A";

  return ((contractPrice + changeOrders) * EXPECTED_PROFIT_PERCENTAGE) / 100;
}

export function getProfitAfterAdvance({
  rowData,
}: FieldContext): number | string {
  const expectedProfit = toNumber(
    getFieldValue(rowData, COL.COL_EXPECTED_PROFIT)
  );
  const totalAdvance = toNumber(getFieldValue(rowData, COL.COL_TOTAL_ADVANCE));

  if (typeof expectedProfit !== "number" || typeof totalAdvance !== "number")
    return "N/A";

  return expectedProfit - totalAdvance;
}
