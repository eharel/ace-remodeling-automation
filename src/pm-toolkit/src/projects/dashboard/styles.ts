import { getColumnLabel } from "../../columns";
import {
  COLUMN_LABELS_BY_KEY,
  DASHBOARD_COLUMNS,
  DASHBOARD_KEYS,
  DashboardColumnKey,
  DashboardColumnLabel,
} from "./project-columns";

export type TableInfo = {
  startRow: number;
  startCol: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number; // optional to avoid breakage
};

export function stylizeDashboard(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfoArray: TableInfo[]
) {
  for (const table of tableInfoArray) {
    const localHeaderMap = getHeaderIndexMap(
      sheet,
      table.headerRow,
      table.startCol
    );
    stylizeTable(sheet, table, localHeaderMap);
    alignProjectNoColumn(sheet, table, localHeaderMap);
  }

  if (tableInfoArray.length > 0) {
    addTimestamp(sheet, tableInfoArray[0]);
  }
}

export function stylizeTable(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  headerIndexMap: Record<string, number>
) {
  const {
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow,
  } = table;

  const numRows = dataEndRow - dataStartRow + 1;
  const zebraStriping = getZebraStripingBounds(table);
  const totalTableRows = dataEndRow - headerRow + 1;

  applyCoreTableStyle(sheet, {
    startRow,
    startCol,
    headerRow,
    descriptionRow: headerRow + 1,
    zebraRow: zebraStriping.row,
    zebraRows: zebraStriping.numRows,
    dataStartRow,
    numRows,
    totalTableRows,
    headerIndexMap,
  });

  if (summaryRow !== undefined) {
    applySummaryRowStyle(sheet, summaryRow, startCol);
  }
}

function applyCoreTableStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  config: {
    startRow: number;
    startCol: number;
    headerRow: number;
    descriptionRow: number;
    zebraRow: number;
    zebraRows: number;
    dataStartRow: number;
    numRows: number;
    totalTableRows: number;
    headerIndexMap: Record<string, number>;
  }
) {
  const {
    startRow,
    startCol,
    headerRow,
    descriptionRow,
    zebraRow,
    zebraRows,
    dataStartRow,
    numRows,
    totalTableRows,
    headerIndexMap,
  } = config;

  applyTitleStyle(sheet, startRow, startCol);
  applyHeaderStyle(sheet, headerRow, startCol);
  applyDescriptionRow(sheet, descriptionRow, startCol);
  applyZebraStriping(sheet, zebraRow, startCol, zebraRows);
  applyCurrencyFormatting(sheet, dataStartRow, startCol, numRows);
  applyConditionalFormatting(
    sheet,
    dataStartRow,
    startCol,
    numRows,
    headerIndexMap
  );
  applyBorders(sheet, headerRow, startCol, totalTableRows);
  resizeColumns(sheet, startCol);
}

export function getHeaderIndexMap(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number
): Record<string, number> {
  const headers = sheet
    .getRange(headerRow, startCol, 1, DASHBOARD_COLUMNS.length)
    .getValues()[0];
  const map: Record<string, number> = {};

  headers.forEach((label, i) => {
    map[label] = i;
  });

  return map;
}

export function applyTitleStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number
) {
  sheet
    .getRange(startRow, startCol, 1, DASHBOARD_COLUMNS.length)
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setBackground("#e0e0e0");
}

export function applyHeaderStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number
) {
  sheet
    .getRange(headerRow, startCol, 1, DASHBOARD_COLUMNS.length)
    .setFontWeight("bold")
    .setBackground("#f1f3f4")
    .setHorizontalAlignment("center");
}

function applyDescriptionRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number
) {
  const descriptions = DASHBOARD_COLUMNS.map((col) => {
    return col.description
      ? col.help
        ? `📘 ${col.description}`
        : col.description
      : "";
  });

  const range = sheet.getRange(row, startCol, 1, DASHBOARD_COLUMNS.length);
  range
    .setValues([descriptions])
    .setFontSize(7)
    .setFontStyle("italic")
    .setBackground("#f9f9f9")
    .setWrap(true)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center");

  sheet.setRowHeight(row, 22);

  range.setBorder(
    false, // top
    false, // left
    true, // bottom
    false, // right
    false, // vertical
    false, // horizontal
    "#d0d0d0", // color
    SpreadsheetApp.BorderStyle.SOLID // style
  );

  DASHBOARD_COLUMNS.forEach((col, i) => {
    if (col.help) {
      range.getCell(1, i + 1).setNote(col.help);
    }
  });
}

function getZebraStripingBounds(table: TableInfo) {
  const row = table.dataStartRow - 1;
  const numRows = table.dataEndRow - row + 1;
  return { row, numRows };
}

function applyZebraStriping(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  numRows: number
) {
  sheet
    .getRange(row, col, numRows, DASHBOARD_COLUMNS.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
}

function applyCurrencyFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  numRows: number
) {
  DASHBOARD_COLUMNS.forEach((col, i) => {
    if (col.format === "currency") {
      const range = sheet.getRange(startRow, startCol + i, numRows);
      range.setNumberFormat("$#,##0.00");
    }
  });
}

function applyConditionalFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  numRows: number,
  headerIndexMap: Record<string, number>
) {
  const applyColorForKey = (key: DashboardColumnKey) => {
    const header = getColumnLabel(key, COLUMN_LABELS_BY_KEY);
    const colIndex = headerIndexMap[header];
    if (colIndex !== undefined) {
      const col = startCol + colIndex;
      stylizeColumnByValueColor(sheet, startRow, col, numRows, {
        positiveColor: "green",
        negativeColor: "red",
      });
    }
  };

  applyColorForKey(DASHBOARD_KEYS.EXPECTED_PROFIT);
  applyColorForKey(DASHBOARD_KEYS.ADVANCE_BALANCE);
  applyColorForKey(DASHBOARD_KEYS.PM_AFTER_ADVANCE);
}

function stylizeColumnByValueColor(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  colIndex: number,
  numRows: number,
  options: {
    positiveColor?: string;
    negativeColor?: string;
    zeroColor?: string;
    nonNumericColor?: string;
  }
) {
  const {
    positiveColor = "green",
    negativeColor = "red",
    zeroColor,
    nonNumericColor,
  } = options;

  const range = sheet.getRange(startRow, colIndex, numRows, 1);
  const values = range.getValues();

  values.forEach((row: any[], i: number) => {
    const cell = range.getCell(i + 1, 1);
    const val = row[0];

    if (typeof val === "number") {
      if (val > 0) cell.setFontColor(positiveColor);
      else if (val < 0) cell.setFontColor(negativeColor);
      else cell.setFontColor(zeroColor ?? null);
    } else {
      cell.setFontColor(nonNumericColor ?? null);
    }
  });
}

function applyBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number,
  totalRows: number
) {
  sheet
    .getRange(headerRow, startCol, totalRows, DASHBOARD_COLUMNS.length)
    .setBorder(true, true, true, true, true, true);
}

function resizeColumns(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startCol: number
) {
  DASHBOARD_COLUMNS.forEach((column, i) => {
    const col = startCol + i;

    if (column.key === DASHBOARD_KEYS.PROJECT_NO) {
      sheet.setColumnWidth(col, 75);
    } else if (column.key === DASHBOARD_KEYS.CLIENT_NAME) {
      sheet.setColumnWidth(col, 140);
    } else {
      sheet.setColumnWidth(col, 136);
    }
  });
}

function alignProjectNoColumn(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo,
  headerIndexMap: Record<string, number>
) {
  const colIndex =
    headerIndexMap[
      getColumnLabel(DASHBOARD_KEYS.PROJECT_NO, COLUMN_LABELS_BY_KEY)
    ];
  if (colIndex !== undefined) {
    const col = table.startCol + colIndex;
    const numRows = table.dataEndRow - table.dataStartRow + 1;

    sheet.getRange(table.dataStartRow, col, numRows).setNumberFormat("@");
    sheet
      .getRange(table.dataStartRow, col, numRows)
      .setHorizontalAlignment("center");
  }
}

function addTimestamp(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  table: TableInfo
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestampCol = table.startCol + DASHBOARD_COLUMNS.length + 1;
  const cell = sheet.getRange(1, timestampCol);

  cell
    .setValue(
      `Last updated: ${Utilities.formatDate(
        new Date(),
        ss.getSpreadsheetTimeZone(),
        "yyyy-MM-dd HH:mm"
      )}`
    )
    .setFontStyle("italic")
    .setFontSize(10)
    .setHorizontalAlignment("left");

  const frozenRowCount = table.dataStartRow - 1;
  sheet.setFrozenRows(frozenRowCount);
}

function applySummaryRowStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number
) {
  const range = sheet.getRange(row, startCol, 1, DASHBOARD_COLUMNS.length);

  range.setFontWeight("bold").setBackground("#e8e8e8");

  range.setBorder(
    true,
    false,
    false,
    false,
    false,
    false,
    "black",
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  DASHBOARD_COLUMNS.forEach((col, i) => {
    const cell = sheet.getRange(row, startCol + i);

    if (col.format === "currency") {
      cell.setNumberFormat("$#,##0.00").setHorizontalAlignment("right");
    } else if (col.format !== "text") {
      cell.setHorizontalAlignment("right");
    }
  });
}
