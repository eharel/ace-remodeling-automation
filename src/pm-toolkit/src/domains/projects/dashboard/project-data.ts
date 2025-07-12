// 📁 projects/dashboard/project-data.ts

import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { ProjectContext, ProjectDashboardRow } from "./types";

export function getProjectRowData(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet,
  namedRanges: GoogleAppsScript.Spreadsheet.NamedRange[]
): ProjectDashboardRow {
  const namedRangeMap = buildNamedRangeMapFromList(namedRanges);
  const directValueMap = buildDirectValueMap(sheetTab);

  const rowData: ProjectDashboardRow = {};

  const tabName = sheetTab.getName();
  const projectMatch = tabName.match(/^(\d+)\s+/);
  const clientMatch = tabName.match(/^\d+\s+(.+)$/);

  rowData[DASHBOARD_KEYS.PROJECT_NO] = projectMatch?.[1] ?? "N/A";
  rowData[DASHBOARD_KEYS.CLIENT_NAME] = clientMatch?.[1] ?? "N/A";

  for (const field of DASHBOARD_COLUMNS) {
    const ctx: ProjectContext = {
      sheet: sheetTab,
      namedRangeMap,
      directValueMap,
      rowData,
    };

    let value = field.valueFn?.(ctx) ?? "N/A";
    if (field.key === DASHBOARD_KEYS.PROJECT_NO && typeof value === "number") {
      value = value.toString();
    }

    rowData[field.key] ??= value;
  }

  return rowData;
}

// 🆕 helper:
function buildNamedRangeMapFromList(
  namedRanges: GoogleAppsScript.Spreadsheet.NamedRange[]
): Map<string, GoogleAppsScript.Spreadsheet.Range> {
  const map = new Map<string, GoogleAppsScript.Spreadsheet.Range>();
  for (const nr of namedRanges) {
    map.set(nr.getName(), nr.getRange());
  }
  return map;
}

/**
 * Builds a map of named range name -> Range for the current sheet only.
 */
function buildNamedRangeMap(
  namedRanges: GoogleAppsScript.Spreadsheet.NamedRange[]
): Map<string, GoogleAppsScript.Spreadsheet.Range> {
  const map = new Map<string, GoogleAppsScript.Spreadsheet.Range>();

  for (const nr of namedRanges) {
    map.set(nr.getName(), nr.getRange());
  }

  return map;
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

  return map;
}
