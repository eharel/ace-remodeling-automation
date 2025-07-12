// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "../../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { generateAndStylizeTableFromRows } from "../../../utils";
import { getProjectRowData } from "./project-data";
import { addTimestamp } from "../../../styles";
import { ProjectDashboardRow } from "./types";
import { toA1Notation } from "../../../utils/helpers";

export function generateProjectDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboardSheet = getOrCreateDashboardSheet(ss);
    dashboardSheet.activate();
    setDashboardStatus(dashboardSheet, "⏳ Generating dashboard...");

    const { activeSheets, closedSheets } = getCategorizedProjectSheets(ss);
    const namedRangesBySheet = groupNamedRangesBySheet(ss.getNamedRanges());

    Logger.log(`Found ${activeSheets.length} active sheets`);
    Logger.log(`Found ${closedSheets.length} closed sheets`);

    const startRow = 1;
    const startColActive = 1;
    const startColClosed = DASHBOARD_COLUMNS.length + COL_GAP_BETWEEN_TABLES;

    const PROJECT_KEYS_TO_SUM = [
      DASHBOARD_KEYS.CONTRACT_PRICE,
      DASHBOARD_KEYS.CHANGE_ORDERS,
      DASHBOARD_KEYS.MAX_ADVANCE,
      DASHBOARD_KEYS.TOTAL_ADVANCE,
      DASHBOARD_KEYS.ADVANCE_BALANCE,
    ];

    const PROJECT_COLOR_KEYS = [
      DASHBOARD_KEYS.EXPECTED_PROFIT,
      DASHBOARD_KEYS.ADVANCE_BALANCE,
      DASHBOARD_KEYS.PM_AFTER_ADVANCE,
    ] as const;

    // 🟢 Active Projects Table
    setDashboardStatus(dashboardSheet, "📊 Generating Active Projects...");
    const activeRows: ProjectDashboardRow[] = [];
    let beginningRow = startRow;
    let beginningCol = startColActive;
    for (let i = 0; i < activeSheets.length; i++) {
      const sheet = activeSheets[i];
      setDashboardStatus(
        dashboardSheet,
        `📊 Generating Active Projects... (${i + 1}/${activeSheets.length})`,
        toA1Notation(beginningCol, beginningRow)
      );
      const row = getProjectRowData(
        sheet,
        namedRangesBySheet.get(sheet.getName()) ?? []
      );
      activeRows.push(row);
    }

    generateAndStylizeTableFromRows(
      dashboardSheet,
      activeRows,
      startRow,
      startColActive,
      "🟢 Active Projects",
      DASHBOARD_COLUMNS,
      PROJECT_KEYS_TO_SUM,
      { colorKeys: PROJECT_COLOR_KEYS }
    );

    // 🔴 Closed Projects Table
    const closedRows: ProjectDashboardRow[] = [];
    beginningRow = startRow;
    beginningCol = startColClosed;
    for (let i = 0; i < closedSheets.length; i++) {
      const sheet = closedSheets[i];
      setDashboardStatus(
        dashboardSheet,
        `📊 Generating Closed Projects... (${i + 1}/${closedSheets.length})`,
        toA1Notation(beginningCol, beginningRow)
      );
      const row = getProjectRowData(
        sheet,
        namedRangesBySheet.get(sheet.getName()) ?? []
      );
      closedRows.push(row);
    }
    generateAndStylizeTableFromRows(
      dashboardSheet,
      closedRows,
      startRow,
      startColClosed,
      "🔴 Closed Projects",
      DASHBOARD_COLUMNS,
      PROJECT_KEYS_TO_SUM,
      { colorKeys: PROJECT_COLOR_KEYS }
    );

    // ✅ Done
    const numActiveRows = activeRows.length;
    const extraRows = 3; // title, headers, description
    const lastRow = startRow + numActiveRows + extraRows + 2;
    addTimestamp(dashboardSheet, lastRow, 1, "Dashboard last updated:");

    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Dashboard ready ✅",
      "Ace Toolkit"
    );
  } catch (err) {
    Logger.log("⚠️ Error in generateProjectDashboard:");
    Logger.log((err as Error).message);
    Logger.log((err as Error).stack);
  }
}

function getOrCreateDashboardSheet(
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet
): GoogleAppsScript.Spreadsheet.Sheet {
  const sheet = ss.getSheetByName(PROJECT_DASHBOARD_SHEET_NAME);
  return sheet
    ? (sheet.clear(), sheet)
    : ss.insertSheet(PROJECT_DASHBOARD_SHEET_NAME);
}

function getCategorizedProjectSheets(
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet
): {
  activeSheets: GoogleAppsScript.Spreadsheet.Sheet[];
  closedSheets: GoogleAppsScript.Spreadsheet.Sheet[];
} {
  const activeSheets: GoogleAppsScript.Spreadsheet.Sheet[] = [];
  const closedSheets: GoogleAppsScript.Spreadsheet.Sheet[] = [];

  for (const sheet of ss.getSheets()) {
    const name = sheet.getName();
    if (!startsWithProjectNumber(name)) continue;
    if (isClosedTabName(name)) closedSheets.push(sheet);
    else activeSheets.push(sheet);
  }

  return { activeSheets, closedSheets };
}

function groupNamedRangesBySheet(
  namedRanges: GoogleAppsScript.Spreadsheet.NamedRange[]
): Map<string, GoogleAppsScript.Spreadsheet.NamedRange[]> {
  const map = new Map<string, GoogleAppsScript.Spreadsheet.NamedRange[]>();
  for (const nr of namedRanges) {
    const sheetName = nr.getRange().getSheet().getName();
    if (!map.has(sheetName)) map.set(sheetName, []);
    map.get(sheetName)!.push(nr);
  }
  return map;
}

function setDashboardStatus(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  message: string,
  cell: string = "A1"
) {
  sheet.getRange(cell).setValue(message);
  SpreadsheetApp.flush();
}
