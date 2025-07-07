import { MAX_ADVANCE_PERCENTAGE } from "../../constants";
import { DASHBOARD_COLUMNS, DashboardColumnKey } from "./project-columns";

export function getFieldValue(rowData: any[], key: DashboardColumnKey) {
  const index = DASHBOARD_COLUMNS.findIndex((col) => col.key === key);
  if (index === -1) throw new Error(`Column key not found: ${key}`);
  return rowData[index];
}

export function getNamedRange(
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>,
  key: string
): GoogleAppsScript.Spreadsheet.Range | undefined {
  return (
    namedRangeMap.get(key) ??
    [...namedRangeMap.entries()].find(
      ([name]) => name.endsWith(`__${key}`) || name.endsWith(`!${key}`)
    )?.[1]
  );
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
