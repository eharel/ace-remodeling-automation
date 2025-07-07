// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS } from "./project-columns";
import { generateAndStylizeTable } from "./generate-table";

export function generateProjectDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = getOrCreateDashboardSheet(ss);
  const { activeSheets, closedSheets } = getCategorizedProjectSheets(ss);

  const startRow = 1;
  const startColActive = 1;
  const startColClosed = DASHBOARD_COLUMNS.length + COL_GAP_BETWEEN_TABLES;

  generateAndStylizeTable(
    dashboardSheet,
    activeSheets,
    startRow,
    startColActive,
    "🟢 Active Projects"
  );

  generateAndStylizeTable(
    dashboardSheet,
    closedSheets,
    startRow,
    startColClosed,
    "🔴 Closed Projects"
  );
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
