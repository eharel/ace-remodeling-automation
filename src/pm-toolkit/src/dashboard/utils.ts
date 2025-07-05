import { MAX_ADVANCE_PERCENTAGE } from "../constants";
import { PROJECT_FIELDS } from "./project-fields";
import { LEGACY_CELLS } from "./project-fields";

export function getFieldValue(rowData: any[], header: string) {
  const index = PROJECT_FIELDS.findIndex((f) => f.dbHeader === header);
  return rowData[index];
}

export function getNamedRange(namedRangeMap: any, key: string) {
  return [...namedRangeMap.entries()].find(
    ([name]) => name === key || name.endsWith(`__${key}`)
  )?.[1];
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
  legacyColumnKey: string
): number | string {
  const nr = namedRangeMap.get(namedRange);
  if (nr) return nr.getValue();

  const cellRef = LEGACY_CELLS[legacyColumnKey];
  if (cellRef) {
    const value = directValueMap.get(cellRef);
    if (value !== undefined) return value;
  }

  return "N/A";
}
