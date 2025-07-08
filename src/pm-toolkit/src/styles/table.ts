import { BaseColumn } from "../columns";

export function applyTitleStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
) {
  sheet
    .getRange(startRow, startCol, 1, columns.length)
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setBackground("#e0e0e0");
}

export function applyHeaderStyle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
) {
  sheet
    .getRange(headerRow, startCol, 1, columns.length)
    .setFontWeight("bold")
    .setBackground("#f1f3f4")
    .setHorizontalAlignment("center");
}

export function applyDescriptionRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
) {
  const descriptions = columns.map((col) => {
    return col.description
      ? col.help
        ? `📘 ${col.description}`
        : col.description
      : "";
  });

  const range = sheet.getRange(row, startCol, 1, columns.length);
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

  columns.forEach((col, i) => {
    if (col.help) {
      range.getCell(1, i + 1).setNote(col.help);
    }
  });
}

export function applyZebraStriping(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  numRows: number,
  columns: BaseColumn<any, any, any>[]
) {
  sheet
    .getRange(row, col, numRows, columns.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
}

export function applyBorders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number,
  totalRows: number,
  columns: BaseColumn<any, any, any>[]
) {
  sheet
    .getRange(headerRow, startCol, totalRows, columns.length)
    .setBorder(true, true, true, true, true, true);
}

export function resizeColumns(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  customWidths: Partial<Record<string, number>> = {}
) {
  columns.forEach((column, i) => {
    const col = startCol + i;
    const width = customWidths[column.key] ?? 136;
    sheet.setColumnWidth(col, width);
  });
}

export function getHeaderIndexMap(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headerRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
): Record<string, number> {
  const headers = sheet
    .getRange(headerRow, startCol, 1, columns.length)
    .getValues()[0];
  const map: Record<string, number> = {};

  headers.forEach((label, i) => {
    map[label] = i;
  });

  return map;
}

export function addTimestamp(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  label = "Last updated:"
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timezone = ss.getSpreadsheetTimeZone();
  const formatted = Utilities.formatDate(
    new Date(),
    timezone,
    "yyyy-MM-dd HH:mm"
  );

  sheet
    .getRange(row, col)
    .setValue(`${label} ${formatted}`)
    .setFontStyle("italic")
    .setFontSize(9)
    .setFontColor("#555")
    .setHorizontalAlignment("left");
}
