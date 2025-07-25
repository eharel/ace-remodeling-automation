// 📁 projects/dashboard/generate-dashboard.ts

import {
  PROJECT_DASHBOARD_SHEET_NAME,
  COL_GAP_BETWEEN_TABLES,
} from "@pm/constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";
import { generateAndStylizeTableFromRows } from "@tables/builder";
import { SummaryOperationsMap } from "@shared/styles";
import { extractAllProjectData } from "./data-extraction";
import { transformExtractedDataToDashboardRows } from "./data-transformation";
import { setDashboardStatus } from "./utils";
import { addTimestamp } from "@shared/styles";
import { toA1Notation } from "@pm/utils/helpers";

// Summary row operations for project dashboard
const PROJECT_SUMMARY_OPERATIONS: SummaryOperationsMap = {
  [DASHBOARD_KEYS.CONTRACT_PRICE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [DASHBOARD_KEYS.CHANGE_ORDERS]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [DASHBOARD_KEYS.MAX_ADVANCE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [DASHBOARD_KEYS.TOTAL_ADVANCE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [DASHBOARD_KEYS.ADVANCE_BALANCE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
};

const PROJECT_COLOR_KEYS = [
  DASHBOARD_KEYS.EXPECTED_PROFIT,
  DASHBOARD_KEYS.ADVANCE_BALANCE,
  DASHBOARD_KEYS.PM_AFTER_ADVANCE,
];

/**
 * Generates the project dashboard
 * @param showToast Whether to show a toast notification when complete (default: true)
 */
export function generateProjectDashboard(showToast = true) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboardSheet = getOrCreateDashboardSheet(ss);
    // Removed dashboardSheet.activate() to prevent disrupting user's workflow
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

    // Show toast notification if requested
    if (showToast) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        "Projects Dashboard ready ✅",
        "Ace Toolkit"
      );
    }
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
  setDashboardStatus(
    dashboardSheet,
    `${title} — extracting project data...`,
    toA1Notation(startingCol, startingRow)
  );

  const extractedRows = extractAllProjectData(
    projectSheets,
    namedRangesBySheet,
    dashboardSheet,
    startingRow,
    startingCol,
    title
  );

  const dashboardRows = transformExtractedDataToDashboardRows(
    extractedRows,
    projectSheets
  );

  const tableInfo = generateAndStylizeTableFromRows({
    sheet: dashboardSheet,
    rows: dashboardRows,
    startRow: startingRow,
    startCol: startingCol,
    columns: DASHBOARD_COLUMNS,
    summaryRowOps: PROJECT_SUMMARY_OPERATIONS,
    options: {
      colorKeys: PROJECT_COLOR_KEYS,
      columnWidths: {
        [DASHBOARD_KEYS.PROJECT_NO]: 75, // Set project number column width to 75
      },
    },
    title,
  });

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
