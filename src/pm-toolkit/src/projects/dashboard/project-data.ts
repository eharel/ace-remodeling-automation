import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { ProjectContext, ProjectDashboardRow } from "./types";

export function getProjectRowData(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet
): ProjectDashboardRow {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const namedRangeMap = buildNamedRangeMap(ss, sheetTab.getName());
  const directValueMap = buildDirectValueMap(sheetTab);

  const rowData: ProjectDashboardRow = {};

  // 👇 Extract project number and client name *before* looping through fields
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
      rowData, // shared and growing
    };

    let value = field.valueFn?.(ctx) ?? "N/A";

    if (field.key === DASHBOARD_KEYS.PROJECT_NO && typeof value === "number") {
      value = value.toString();
    }

    rowData[field.key] ??= value; // don't override if already set
  }

  return rowData;
}

function buildNamedRangeMap(
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetName: string
): Map<string, GoogleAppsScript.Spreadsheet.Range> {
  const namedRangeMap = new Map<string, GoogleAppsScript.Spreadsheet.Range>();

  for (const nr of ss.getNamedRanges()) {
    const range = nr.getRange();
    if (range.getSheet().getName() === sheetName) {
      namedRangeMap.set(nr.getName(), range);
    }
  }

  return namedRangeMap;
}

export function buildDirectValueMap(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): Map<string, any> {
  const map = new Map<string, any>();

  for (const col of DASHBOARD_COLUMNS) {
    if (!col.legacyCell) continue;

    try {
      const value = sheet.getRange(col.legacyCell).getValue();
      map.set(col.legacyCell, value); // Still use cellRef (like "M2") as the key
    } catch (e) {
      map.set(col.legacyCell, "N/A");
    }
  }

  return map;
}
