import { BaseColumn } from "../columns";
import { COLUMN_PADDING } from "../constants";
import { StylizeOptions } from "../types";
import { TableInfo } from "./stylize-dashboard";

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

export function applyAlignment(
  table: TableInfo,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  columns: BaseColumn<any, any, any>[]
) {
  // Apply horizontal alignment based on col.align
  columns.forEach((col, i) => {
    if (!col.align) return;

    const range = sheet.getRange(
      table.dataStartRow,
      table.startCol + i,
      table.dataEndRow - table.dataStartRow + 1
    );
    range.setHorizontalAlignment(col.align);
  });
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
  customWidths?: StylizeOptions["columnWidths"]
) {
  columns.forEach((column, i) => {
    const col = startCol + i;
    const customWidth = customWidths?.[column.key as keyof typeof customWidths];

    if (typeof customWidth === "number") {
      sheet.setColumnWidth(col, customWidth);
    } else {
      sheet.autoResizeColumn(col);
      const currentWidth = sheet.getColumnWidth(col);
      sheet.setColumnWidth(col, currentWidth + COLUMN_PADDING);
    }
  });
}

export function addTimestamp(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  label = "Last updated:"
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timezone = ss.getSpreadsheetTimeZone(); // e.g. "America/Chicago"
  const formatted = Utilities.formatDate(
    new Date(),
    timezone,
    "yyyy-MM-dd HH:mm"
  );

  const tzLabel = timezone.includes("/")
    ? timezone.split("/")[1].replace("_", " ")
    : timezone;

  sheet
    .getRange(row, col)
    .setValue(`${label} ${formatted} (${tzLabel})`)
    .setFontStyle("italic")
    .setFontSize(9)
    .setFontColor("#555")
    .setHorizontalAlignment("left");
}
