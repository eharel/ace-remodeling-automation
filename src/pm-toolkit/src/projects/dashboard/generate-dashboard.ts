// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./project-columns";
import { generateAndStylizeTable } from "../../utils";
import { getProjectRowData } from "./project-data";
import { addTimestamp } from "../../styles";

export function generateProjectDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = getOrCreateDashboardSheet(ss);
  const { activeSheets, closedSheets } = getCategorizedProjectSheets(ss);

  const startRow = 1;
  const startColActive = 1;
  const startColClosed = DASHBOARD_COLUMNS.length + COL_GAP_BETWEEN_TABLES;

  // Columns to sum in the dashboard summary row
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

  generateAndStylizeTable(
    dashboardSheet,
    activeSheets,
    startRow,
    startColActive,
    "🟢 Active Projects",
    DASHBOARD_COLUMNS,
    PROJECT_KEYS_TO_SUM,
    getProjectRowData,
    PROJECT_COLOR_KEYS
  );

  generateAndStylizeTable(
    dashboardSheet,
    closedSheets,
    startRow,
    startColClosed,
    "🔴 Closed Projects",
    DASHBOARD_COLUMNS,
    PROJECT_KEYS_TO_SUM,
    getProjectRowData,
    PROJECT_COLOR_KEYS
  );

  // Add timestamp just below the title of Active Projects
  const lastRow =
    Math.max(activeSheets.length, closedSheets.length) + startRow + 5;
  addTimestamp(dashboardSheet, lastRow, 1, "Dashboard last updated:");
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
