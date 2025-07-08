import { MAX_ADVANCE_PERCENTAGE } from "../../constants";
import { DASHBOARD_COLUMNS, DashboardColumnKey } from "./project-columns";
import { ProjectDashboardRow } from "./types";
import { getNamedRange } from "../../utils";

export function getFieldValue(
  rowData: ProjectDashboardRow,
  key: DashboardColumnKey
) {
  if (!(key in rowData)) {
    throw new Error(`Key not found in rowData: ${key}`);
  }
  return rowData[key];
}

// Logic constant for script-based calculations
export function calculateAdvanceMax(
  contractPrice: number,
  changeOrders: number
) {
  return (contractPrice + changeOrders) * (MAX_ADVANCE_PERCENTAGE / 100);
}

export function getValueFromNamedOrLegacy(
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>,
  directValueMap: Map<string, any>,
  namedRange: string,
  columnKey: string
): number | string {
  const nr = getNamedRange(namedRangeMap, namedRange); // ✅ robust check
  if (nr) return nr.getValue();

  const column = DASHBOARD_COLUMNS.find((col) => col.key === columnKey);
  const cellRef = column?.legacyCell;

  if (cellRef) {
    const value = directValueMap.get(cellRef);
    if (value !== undefined) return value;
  }

  return "N/A";
}
