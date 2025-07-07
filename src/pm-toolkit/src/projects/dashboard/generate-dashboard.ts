import { PROJECT_DASHBOARD_SHEET_NAME } from "../../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import { COL_GAP_BETWEEN_TABLES } from "../../constants";
import { IS_ASCENDING_ORDER } from "../../constants";
import { FieldContext } from "./types";
import { stylizeDashboard } from "./styles";
import { DASHBOARD_COLUMNS, DASHBOARD_KEYS } from "./columns";

export function generateProjectDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  let projectDashboard = ss.getSheetByName(PROJECT_DASHBOARD_SHEET_NAME);
  if (!projectDashboard) {
    projectDashboard = ss.insertSheet(PROJECT_DASHBOARD_SHEET_NAME);
  } else {
    projectDashboard.clear();
  }

  const activeSheets = [];
  const closedSheets = [];

  for (const sheet of allSheets) {
    const name = sheet.getName();
    if (!startsWithProjectNumber(name)) continue;

    if (isClosedTabName(name)) {
      closedSheets.push(sheet);
    } else {
      activeSheets.push(sheet);
    }
  }

  const startRow = 1;
  const startColActive = 1;
  const startColClosed = DASHBOARD_COLUMNS.length + COL_GAP_BETWEEN_TABLES;

  const tableInfo = [];

  tableInfo.push(
    generateProjectTable(
      projectDashboard,
      activeSheets,
      startRow,
      startColActive,
      "🟢 Active Projects"
    )
  );

  tableInfo.push(
    generateProjectTable(
      projectDashboard,
      closedSheets,
      startRow,
      startColClosed,
      "🔴 Closed Projects"
    )
  );

  stylizeDashboard(projectDashboard, tableInfo);
}

export function generateProjectTable(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  projectSheets: GoogleAppsScript.Spreadsheet.Sheet[],
  startRow: number,
  startCol: number,
  title: string = ""
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let rowIndex = startRow;

  // Title row
  if (title) {
    sheet.getRange(rowIndex, startCol).setValue(title).setFontWeight("bold");
    sheet
      .getRange(rowIndex, startCol, 1, DASHBOARD_COLUMNS.length)
      .merge()
      .setHorizontalAlignment("center")
      .setFontSize(12)
      .setFontWeight("bold");
    rowIndex++;
  }

  const headerRow = rowIndex;
  sheet
    .getRange(headerRow, startCol, 1, DASHBOARD_COLUMNS.length)
    .setValues([DASHBOARD_COLUMNS.map((col) => col.label)]);

  const descriptionRow = headerRow + 1;
  const dataStartRow = descriptionRow + 1;
  let dataEndRow = dataStartRow - 1;

  for (const sheetTab of projectSheets) {
    const rowData = getProjectRowData(sheetTab);
    sheet
      .getRange(
        dataStartRow + (dataEndRow - dataStartRow + 1),
        startCol,
        1,
        rowData.length
      )
      .setValues([rowData]);
    dataEndRow++;
  }

  const numRows = dataEndRow - dataStartRow + 1;
  if (numRows > 0) {
    sheet
      .getRange(dataStartRow, startCol, numRows, DASHBOARD_COLUMNS.length)
      .sort({ column: startCol, ascending: IS_ASCENDING_ORDER });
  }

  Logger.log(
    `Wrote ${projectSheets.length} rows at row ${startRow}, col ${startCol} for "${title}"`
  );

  return {
    title,
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
  };
}

export function getProjectRowData(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet
) {
  const sheetName = sheetTab.getName();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const namedRangeMap = buildNamedRangeMap(ss, sheetName);
  const directValueMap = buildDirectValueMap(sheetTab); // Support legacy projects by getting values of specific cells
  const rowData = buildProjectRowData(sheetTab, namedRangeMap, directValueMap);

  return rowData.map((val) => (val === null ? "N/A" : val));
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

function buildProjectRowData(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet,
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>,
  directValueMap: Map<string, any>
) {
  const rowData = [];

  for (const field of DASHBOARD_COLUMNS) {
    const fieldContext: FieldContext = {
      sheet: sheetTab,
      rowData, // built progressively
      namedRangeMap,
      directValueMap,
    };

    let value = field.valueFn?.(fieldContext) ?? "N/A";

    // Force Project No to be a string to prevent auto-formatting
    if (field.key === DASHBOARD_KEYS.PROJECT_NO && typeof value === "number") {
      value = value.toString();
    }

    rowData.push(value);
  }

  return rowData;
}
