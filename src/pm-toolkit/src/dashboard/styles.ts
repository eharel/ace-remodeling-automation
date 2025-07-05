import { headerIndexMap, PROJECT_DASHBOARD_HEADERS } from "./project-fields";
import { CURRENCY_COLUMNS } from "./project-fields";
import * as COL from "../constants/column-headers";

export function stylizeDashboard(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfoArray: any[]
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  for (const table of tableInfoArray) {
    const { startRow, startCol, headerRow, dataStartRow, dataEndRow } = table;

    const numRows = dataEndRow - dataStartRow + 1;

    // Title row
    sheet
      .getRange(startRow, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
      .setFontWeight("bold")
      .setFontSize(12)
      .setHorizontalAlignment("center")
      .setBackground("#e0e0e0");

    // Header row
    sheet
      .getRange(headerRow, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#f1f3f4")
      .setHorizontalAlignment("center");

    // Zebra striping (exclude header)
    sheet
      .getRange(
        dataStartRow - 1,
        startCol,
        numRows,
        PROJECT_DASHBOARD_HEADERS.length
      )
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

    // Currency formatting
    CURRENCY_COLUMNS.forEach((header) => {
      const colIndex = headerIndexMap[header];
      const range = sheet.getRange(dataStartRow, startCol + colIndex, numRows);
      range.setNumberFormat("$#,##0.00");
    });

    // Stylize "Advance Balance" column
    {
      const col = startCol + headerIndexMap[COL.COL_ADVANCE_BALANCE];
      stylizeColumnByValueColor(sheet, dataStartRow, col, numRows, {
        positiveColor: "green",
        negativeColor: "red",
        zeroColor: undefined,
        nonNumericColor: undefined,
      });
    }

    // Stylize "PM After Advance" column (if present)
    if (headerIndexMap[COL.COL_PM_AFTER_ADVANCE] !== undefined) {
      const col = startCol + headerIndexMap[COL.COL_PM_AFTER_ADVANCE];
      stylizeColumnByValueColor(sheet, dataStartRow, col, numRows, {
        positiveColor: "green",
        negativeColor: "red",
        zeroColor: undefined,
        nonNumericColor: undefined,
      });
    }

    // Borders
    sheet
      .getRange(
        headerRow,
        startCol,
        numRows + 1,
        PROJECT_DASHBOARD_HEADERS.length
      )
      .setBorder(true, true, true, true, true, true);

    // Column resizing with padding
    for (let i = 0; i < PROJECT_DASHBOARD_HEADERS.length; i++) {
      const header = PROJECT_DASHBOARD_HEADERS[i];
      const col = startCol + i;

      if (header === COL.COL_PROJECT_NO) {
        sheet.setColumnWidth(col, 75);
      } else if (header === COL.COL_CLIENT_NAME) {
        sheet.setColumnWidth(col, 140);
      } else {
        sheet.setColumnWidth(col, 120);
      }
    }
  }

  function stylizeColumnByValueColor(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    dataStartRow: number,
    colIndex: number,
    numRows: number,
    options: {
      positiveColor?: string;
      negativeColor?: string;
      zeroColor?: string;
      nonNumericColor?: string;
    } = {}
  ) {
    const {
      positiveColor = "green",
      negativeColor = "red",
      zeroColor = undefined,
      nonNumericColor = undefined,
    } = options;

    const range = sheet.getRange(dataStartRow, colIndex, numRows, 1);
    const values = range.getValues();

    values.forEach((row: any[], i: number) => {
      const cell = range.getCell(i + 1, 1);
      const val = row[0];

      if (typeof val === "number") {
        if (val > 0) {
          cell.setFontColor(positiveColor);
        } else if (val < 0) {
          cell.setFontColor(negativeColor);
        } else {
          cell.setFontColor(zeroColor ?? null);
        }
      } else {
        cell.setFontColor(nonNumericColor ?? null);
      }
    });
  }

  // Center align the "Project No" column for each table
  tableInfoArray.forEach(({ dataStartRow, dataEndRow, startCol }) => {
    const projectNoCol = startCol + headerIndexMap[COL.COL_PROJECT_NO];
    const numRows = dataEndRow - dataStartRow + 1;

    sheet
      .getRange(dataStartRow, projectNoCol, numRows, 1)
      .setHorizontalAlignment("center");
  });

  // Timestamp to the right of active table
  if (tableInfoArray.length > 0) {
    const activeStartCol = tableInfoArray[0].startCol;
    const timestampCol = activeStartCol + PROJECT_DASHBOARD_HEADERS.length + 1;
    const timestampCell = sheet.getRange(1, timestampCol);
    timestampCell
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

    // Freeze header row
    sheet.setFrozenRows(tableInfoArray[0].headerRow);
  }
}
