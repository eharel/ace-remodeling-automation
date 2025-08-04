import type { ProjectContext } from "./types";
import { calculateAdvanceMax } from "./utils";
import { getFieldValue } from "./utils";
import { toNullableNumber } from "../../../utils/helpers";
import { EXPECTED_PROFIT_PERCENTAGE } from "../../../constants";
import { DASHBOARD_KEYS as KEYS } from "./columns";

export function getProjectNumber({
  extractedProjectData,
}: ProjectContext): string {
  // get it from rowData
  const name = extractedProjectData[KEYS.PROJECT_NO];
  return String(name ?? "N/A");
}

export function getClientName({
  extractedProjectData,
}: ProjectContext): string {
  // get it from rowData
  const name = extractedProjectData[KEYS.CLIENT_NAME];
  return String(name ?? "N/A");
}

export function getContractPrice({
  extractedProjectData,
}: ProjectContext): number | string {
  return (
    getFieldValue(extractedProjectData, KEYS.CONTRACT_PRICE) ??
    "N/A (likely old format)"
  );
}

export function getChangeOrders({
  extractedProjectData,
}: ProjectContext): number | string {
  return (
    getFieldValue(extractedProjectData, KEYS.CHANGE_ORDERS) ??
    "N/A (likely old format)"
  );
}

export function getExpenses({
  extractedProjectData,
}: ProjectContext): number | string {
  return (
    getFieldValue(extractedProjectData, KEYS.EXPENSES) ??
    "N/A (likely old format)"
  );
}

export function getMaxAdvance({
  extractedProjectData,
}: ProjectContext): number | string {
  const contractPrice = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CONTRACT_PRICE)
  );
  const changeOrders = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CHANGE_ORDERS)
  );

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A (likely old format)";

  return calculateAdvanceMax(contractPrice, changeOrders);
}

export function getTotalAdvance({
  extractedProjectData,
}: ProjectContext): number | string {
  return (
    getFieldValue(extractedProjectData, KEYS.TOTAL_ADVANCE) ??
    "N/A (likely old format)"
  );
}

export function getAdvanceBalance({
  extractedProjectData,
}: ProjectContext): number | string {
  const contractPrice = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CONTRACT_PRICE)
  );
  const changeOrders = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CHANGE_ORDERS)
  );
  const totalAdvance = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.TOTAL_ADVANCE)
  );

  if (
    typeof contractPrice !== "number" ||
    typeof changeOrders !== "number" ||
    typeof totalAdvance !== "number"
  )
    return "N/A (likely old format)";

  const maxAdvance = calculateAdvanceMax(contractPrice, changeOrders);
  return maxAdvance - totalAdvance;
}

export function getPMAfterAdvance({
  extractedProjectData,
}: ProjectContext): number | string {
  return (
    getFieldValue(extractedProjectData, KEYS.PM_AFTER_ADVANCE) ??
    "N/A (likely old format)"
  );
}

export function getExpectedProfit({
  extractedProjectData,
}: ProjectContext): number | string {
  // 20% of (contract price + change orders)
  const contractPrice = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CONTRACT_PRICE)
  );
  const changeOrders = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.CHANGE_ORDERS)
  );

  if (typeof contractPrice !== "number" || typeof changeOrders !== "number")
    return "N/A (likely old format)";

  return ((contractPrice + changeOrders) * EXPECTED_PROFIT_PERCENTAGE) / 100;
}

export function getProfitAfterAdvance({
  extractedProjectData,
}: ProjectContext): number | string {
  const expectedProfit = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.EXPECTED_PROFIT)
  );
  const totalAdvance = toNullableNumber(
    getFieldValue(extractedProjectData, KEYS.TOTAL_ADVANCE)
  );

  if (typeof expectedProfit !== "number" || typeof totalAdvance !== "number")
    return "N/A (likely old format)";

  return expectedProfit - totalAdvance;
}
