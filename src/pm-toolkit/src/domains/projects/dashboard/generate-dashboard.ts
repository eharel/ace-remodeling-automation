// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "../../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { generateAndStylizeTableFromRows } from "../../../utils";
import { extractAllProjectData } from "./data-extraction";
import { transformExtractedDataToDashboardRows } from "./data-transformation";
import { setDashboardStatus } from "./utils";
import { addTimestamp } from "../../../styles";
import { toA1Notation } from "../../../utils/helpers";

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

export function generateProjectDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboardSheet = getOrCreateDashboardSheet(ss);
    dashboardSheet.activate();
    setDashboardStatus(dashboardSheet, "⏳ Generating dashboard...");

    const { activeSheets, closedSheets } = getCategorizedProjectSheets(ss);
    const namedRangesBySheet = mapNamedRangesBySheet(ss.getNamedRanges());

    const startRow = 1;
    const startColActive = 1;
    const startColClosed = DASHBOARD_COLUMNS.length + COL_GAP_BETWEEN_TABLES;

    const activeTableInfo = generateProjectSection({
      dashboardSheet,
      projectSheets: activeSheets,
      namedRangesBySheet,
      title: "🟢 Active Projects",
      startingRow: startRow,
      startingCol: startColActive,
    });

    const closedTableInfo = generateProjectSection({
      dashboardSheet,
      projectSheets: closedSheets,
      namedRangesBySheet,
      title: "🔴 Closed Projects",
      startingRow: startRow,
      startingCol: startColClosed,
    });

    // ✅ Add timestamp two rows below the end of the active table
    addTimestamp(
      dashboardSheet,
      activeTableInfo.endRow + 2,
      1,
      "Dashboard last updated:"
    );

    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Projects Dashboard ready ✅",
      "Ace Toolkit"
    );
  } catch (err) {
    // Logger.log("⚠️ Error in generateProjectDashboard:");
    // Logger.log((err as Error).message);
    // Logger.log((err as Error).stack);
  }
}

function generateProjectSection({
  dashboardSheet,
  projectSheets,
  namedRangesBySheet,
  title,
  startingRow,
  startingCol,
}: {
  dashboardSheet: GoogleAppsScript.Spreadsheet.Sheet;
  projectSheets: GoogleAppsScript.Spreadsheet.Sheet[];
  namedRangesBySheet: Map<
    string,
    Map<string, GoogleAppsScript.Spreadsheet.Range>
  >;
  title: string;
  startingRow: number;
  startingCol: number;
}) {
  setDashboardStatus(dashboardSheet, `${title} — extracting project data...`);

  const extractedRows = extractAllProjectData(
    projectSheets,
    namedRangesBySheet,
    dashboardSheet,
    startingRow,
    startingCol
  );

  const dashboardRows = transformExtractedDataToDashboardRows(
    extractedRows,
    projectSheets
  );

  const tableInfo = generateAndStylizeTableFromRows(
    dashboardSheet,
    dashboardRows,
    startingRow,
    startingCol,
    title,
    DASHBOARD_COLUMNS,
    PROJECT_KEYS_TO_SUM,
    { colorKeys: PROJECT_COLOR_KEYS }
  );

  return tableInfo;
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
) {
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

function mapNamedRangesBySheet(
  namedRanges: GoogleAppsScript.Spreadsheet.NamedRange[]
): Map<string, Map<string, GoogleAppsScript.Spreadsheet.Range>> {
  const map = new Map<
    string,
    Map<string, GoogleAppsScript.Spreadsheet.Range>
  >();

  for (const nr of namedRanges) {
    const range = nr.getRange();
    const sheetName = range.getSheet().getName();
    const name = nr.getName();
    const normalizedName = normalizeNamedRange(name);

    if (!map.has(sheetName)) {
      map.set(sheetName, new Map());
    }

    map.get(sheetName)!.set(normalizedName, range);
  }

  return map;
}

function normalizeNamedRange(name: string): string {
  if (name.includes("!")) {
    return name.split("!")[1].replace(/^'/, "").replace(/'$/, "");
  }
  const doubleUnderscoreIndex = name.indexOf("__");
  if (doubleUnderscoreIndex > 0) {
    return name.substring(doubleUnderscoreIndex + 2);
  }
  return name;
}
