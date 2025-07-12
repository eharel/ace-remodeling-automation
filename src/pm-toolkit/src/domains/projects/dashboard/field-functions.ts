import type { ProjectContext } from "./types";
import * as NR from "../../../constants/named-ranges";
import { calculateAdvanceMax } from "./utils";
import { getFieldValue } from "./utils";
import { toNumber } from "../../../utils/helpers";
import { EXPECTED_PROFIT_PERCENTAGE } from "../../../constants";
import { getValueFromNamedOrLegacy } from "./utils";
import { DASHBOARD_KEYS as KEYS } from "./columns";

export function getProjectNumberFromRow(
  rowData: Record<string, unknown>
): string {
  return String(rowData[KEYS.PROJECT_NO] ?? "N/A");
}

export function getClientNameFromRow(rowData: Record<string, unknown>): string {
  return String(rowData[KEYS.CLIENT_NAME] ?? "N/A");
}

export function getClientName({
  sheet,
  namedRangeMap,
}: ProjectContext): string {
  const nr = namedRangeMap.get(NR.NR_CLIENT_NAME);
  if (nr) return nr.getValue();

  const name = sheet.getName();
  const match = name.trim().match(/^\d+\s+(.+)$/);
  return match ? match[1] : "N/A";
}

export function getContractPrice({
  namedRangeMap,
  directValueMap,
}: ProjectContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_CONTRACT_PRICE,
    KEYS.CONTRACT_PRICE
  );
}

export function getChangeOrders({
  namedRangeMap,
  directValueMap,
}: ProjectContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_CHANGE_ORDER_TOTAL,
    KEYS.CHANGE_ORDERS
  );
}

export function getExpenses({
  namedRangeMap,
  directValueMap,
}: ProjectContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_EXPENSE_TOTAL,
    KEYS.EXPENSES
  );
}

export function getMaxAdvance({ rowData }: ProjectContext): number | string {
  const contractPrice = toNumber(getFieldValue(rowData, KEYS.CONTRACT_PRICE));
  const changeOrders = toNumber(getFieldValue(rowData, KEYS.CHANGE_ORDERS));

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A";

  return calculateAdvanceMax(contractPrice, changeOrders);
}

// export function getMaxAdvance({
//   namedRangeMap,
//   directValueMap,
// }: ProjectContext): number | string {
//   return getValueFromNamedOrLegacy(
//     namedRangeMap,
//     directValueMap,
//     NR.NR_ADVANCE_MAX,
//     KEYS.MAX_ADVANCE
//   );
// }

export function getTotalAdvance({
  namedRangeMap,
  directValueMap,
}: ProjectContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_ADVANCE_TOTAL,
    KEYS.TOTAL_ADVANCE
  );
}

export function getAdvanceBalance({
  rowData,
}: ProjectContext): number | string {
  const maxAdvance = toNumber(getFieldValue(rowData, KEYS.MAX_ADVANCE));
  const totalAdvance = toNumber(getFieldValue(rowData, KEYS.TOTAL_ADVANCE));

  if (typeof maxAdvance !== "number" || typeof totalAdvance !== "number")
    return "N/A";

  return maxAdvance - totalAdvance;
}

export function getPMAfterAdvance({
  namedRangeMap,
  directValueMap,
}: ProjectContext): number | string {
  return getValueFromNamedOrLegacy(
    namedRangeMap,
    directValueMap,
    NR.NR_PM_AFTER_ADVANCE,
    KEYS.PM_AFTER_ADVANCE
  );
}

export function getExpectedProfit({
  rowData,
}: ProjectContext): number | string {
  // 20% of (contract price + change orders)
  const contractPrice = toNumber(getFieldValue(rowData, KEYS.CONTRACT_PRICE));
  const changeOrders = toNumber(getFieldValue(rowData, KEYS.CHANGE_ORDERS));

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A";

  return ((contractPrice + changeOrders) * EXPECTED_PROFIT_PERCENTAGE) / 100;
}

export function getProfitAfterAdvance({
  rowData,
}: ProjectContext): number | string {
  const expectedProfit = toNumber(getFieldValue(rowData, KEYS.EXPECTED_PROFIT));
  const totalAdvance = toNumber(getFieldValue(rowData, KEYS.TOTAL_ADVANCE));

  if (typeof expectedProfit !== "number" || typeof totalAdvance !== "number")
    return "N/A";

  return expectedProfit - totalAdvance;
}
