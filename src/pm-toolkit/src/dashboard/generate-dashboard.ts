import { PROJECT_DASHBOARD_SHEET_NAME } from "../constants";
import { isClosedTabName, startsWithProjectNumber } from "../utils";
import {
  LEGACY_CELLS,
  PROJECT_DASHBOARD_HEADERS,
  PROJECT_FIELDS,
} from "./project-fields";
import { COL_GAP_BETWEEN_TABLES } from "../constants";
import { IS_ASCENDING_ORDER } from "../constants";
import { FieldContext } from "./types";
import { stylizeDashboard } from "./styles";

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
  const startColClosed =
    PROJECT_DASHBOARD_HEADERS.length + COL_GAP_BETWEEN_TABLES;

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

  if (title) {
    sheet.getRange(rowIndex, startCol).setValue(title).setFontWeight("bold");
    sheet
      .getRange(rowIndex, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
      .merge()
      .setHorizontalAlignment("center")
      .setFontSize(12)
      .setFontWeight("bold");
    rowIndex++;
  }

  sheet
    .getRange(rowIndex, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
    .setValues([PROJECT_DASHBOARD_HEADERS]);
  rowIndex++;

  const tableStartRow = rowIndex;

  for (const sheetTab of projectSheets) {
    const rowData = getProjectRowData(sheetTab);
    sheet.getRange(rowIndex, startCol, 1, rowData.length).setValues([rowData]);
    rowIndex++;
  }

  const numRows = rowIndex - tableStartRow;
  if (numRows > 0) {
    sheet
      .getRange(
        tableStartRow,
        startCol,
        numRows,
        PROJECT_DASHBOARD_HEADERS.length
      )
      .sort({ column: startCol, ascending: IS_ASCENDING_ORDER });
  }

  Logger.log(
    `Wrote ${projectSheets.length} rows at row ${startRow}, col ${startCol} for "${title}"`
  );
  return {
    title,
    startRow,
    startCol,
    headerRow: startRow + 1,
    dataStartRow: startRow + 2,
    dataEndRow: rowIndex - 1,
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
) {
  const namedRangeMap = new Map();

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

  for (const cellRef of Object.values(LEGACY_CELLS)) {
    try {
      const value = sheet.getRange(cellRef).getValue();
      map.set(cellRef, value); // ✅ Use M2, M7, etc. as the map key
    } catch (e) {
      map.set(cellRef, "N/A");
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

  for (const field of PROJECT_FIELDS) {
    const fieldContext: FieldContext = {
      sheet: sheetTab,
      rowData, // built progressively
      namedRangeMap,
      directValueMap,
    };

    const value = field.valueFn?.(fieldContext) ?? "N/A";
    rowData.push(value);
  }

  return rowData;
}
