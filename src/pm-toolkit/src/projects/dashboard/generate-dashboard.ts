// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { generateAndStylizeTableFromRows } from "../../utils";
import { getProjectRowData } from "./project-data";
import { addTimestamp } from "../../styles";

export function generateProjectDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboardSheet = getOrCreateDashboardSheet(ss);
    dashboardSheet.activate();

    // ⏳ Initial status message
    setDashboardStatus(dashboardSheet, "⏳ Generating dashboard...");

    const { activeSheets, closedSheets } = getCategorizedProjectSheets(ss);

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

    const activeRows = activeSheets.map((s) => {
      const row = getProjectRowData(s);
      Logger.log(
        `Active project row for ${s.getName()}: ${JSON.stringify(row)}`
      );
      return row;
    });

    setDashboardStatus(dashboardSheet, "📊 Generating Active Projects...");
    Logger.log("Generating Active Projects table...");
    generateAndStylizeTableFromRows(
      dashboardSheet,
      activeRows,
      startRow,
      startColActive,
      "🟢 Active Projects",
      DASHBOARD_COLUMNS,
      PROJECT_KEYS_TO_SUM,
      PROJECT_COLOR_KEYS
    );

    const closedRows = closedSheets.map((s) => {
      const row = getProjectRowData(s);
      Logger.log(
        `Closed project row for ${s.getName()}: ${JSON.stringify(row)}`
      );
      return row;
    });

    setDashboardStatus(dashboardSheet, "📊 Generating Closed Projects...");
    Logger.log("Generating Closed Projects table...");
    generateAndStylizeTableFromRows(
      dashboardSheet,
      closedRows,
      startRow,
      startColClosed,
      "🔴 Closed Projects",
      DASHBOARD_COLUMNS,
      PROJECT_KEYS_TO_SUM,
      PROJECT_COLOR_KEYS
    );

    const lastRow =
      Math.max(activeSheets.length, activeSheets.length) + startRow + 5;
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
  let sheet = ss.getSheetByName(PROJECT_DASHBOARD_SHEET_NAME);
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

function setDashboardStatus(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  message: string
) {
  sheet.getRange("A1").setValue(message);
  SpreadsheetApp.flush();
}
