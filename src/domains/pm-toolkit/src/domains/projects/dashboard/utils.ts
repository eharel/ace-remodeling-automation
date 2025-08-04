import { MAX_ADVANCE_PERCENTAGE } from "../../../constants";
import { DASHBOARD_COLUMNS, DashboardColumnKey } from "./columns";
import { ProjectDashboardRow } from "./types";
import { getNamedRange } from "../../../utils/helpers";
import { PROJECT_DATA_FIELDS } from "./fields";

export function getFieldValue(
  rowData: ProjectDashboardRow,
  key: DashboardColumnKey
) {
  if (!(key in rowData)) {
    Logger.log(`❌ getFieldValue: missing key "${key}"`);
    return "N/A from getFieldValue";
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
  const range = namedRangeMap.get(namedRange);
  if (range) {
    const val = range.getValue();
    // Logger.log(`✅ ${namedRange}: found via named range → ${val}`);
    return val;
  }

  const field = PROJECT_DATA_FIELDS.find((f) => f.key === columnKey);

  // If the field is undefined or doesn't have a legacyCell, exit early
  if (!field || !("legacyCell" in field)) {
    // Logger.log(`⚠️ ${columnKey}: missing legacyCell`);
    return "N/A";
  }

  const cellRef = field.legacyCell;
  const value = directValueMap.get(cellRef);
  if (value !== undefined && value !== null) {
    // Logger.log(`🕰️ ${namedRange}: fallback to legacy ${cellRef} → ${value}`);
    return value;
  }

  // Logger.log(`❌ ${namedRange}: not found in named or legacy (${cellRef})`);
  return "N/A";
}

export function setDashboardStatus(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  message: string,
  cell: string = "A1"
) {
  sheet.getRange(cell).setValue(message);
  SpreadsheetApp.flush();
}

/**
 * Fetches values from legacy cell positions using a single batch call where possible.
 */
export function buildDirectValueMap(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): Map<string, any> {
  const map = new Map<string, any>();

  const legacyCells = DASHBOARD_COLUMNS.map((col) => col.legacyCell).filter(
    (cell): cell is string => Boolean(cell)
  );

  // Fast path for empty
  if (legacyCells.length === 0) return map;

  // Slightly faster than getRangeList for sparse cells
  for (const cell of legacyCells) {
    try {
      map.set(cell, sheet.getRange(cell).getValue());
    } catch (e) {
      map.set(cell, "N/A");
    }
  }

  // Logger.log(`📦 Legacy value map for ${sheet.getName()}:`);
  for (const [cell, value] of map.entries()) {
    // Logger.log(`   ${cell} → ${value}`);
  }

  return map;
}
