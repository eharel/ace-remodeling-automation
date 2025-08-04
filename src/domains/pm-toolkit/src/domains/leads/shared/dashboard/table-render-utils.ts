import { TITLE_BACKGROUND_COLOR } from "../constants";
import { applySplitMergeRange } from "@utils/sheets";

/**
 * Creates a title row (optionally split-centered for frozen layouts).
 *
 * @param sheet - The Google Sheets worksheet to modify
 * @param year - The year to include in the title
 * @param row - Starting row position
 * @param column - Starting column position (for fallback merge)
 * @param numRows - Number of rows the title spans (usually 1–2)
 * @param numColumns - Number of columns to merge across (fallback mode)
 * @param splitTitle - Optional split layout config (for frozen panes)
 * @returns The row number after the title row
 */
export function createTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number,
  row: number,
  column: number,
  numRows: number,
  numColumns: number,
  splitTitle?: {
    frozenColumns: number;
    numCols: number;
  }
): number {
  const title = `📈 ${year} Leads Breakdown`;

  if (splitTitle) {
    const { frozenColumns, numCols } = splitTitle;

    applySplitMergeRange({
      sheet,
      startRow: row,
      startCol: column,
      frozenColumns,
      numCols,
      numRows,
      value: title,
      styling: {
        fontWeight: "bold",
        fontSize: 14,
        fontColor: "white",
        background: TITLE_BACKGROUND_COLOR,
      },
    });
  } else {
    const range = sheet.getRange(row, column, numRows, numColumns);
    range
      .merge()
      .setValue(title)
      .setFontWeight("bold")
      .setFontSize(14)
      .setFontColor("white")
      .setBackground(TITLE_BACKGROUND_COLOR)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
  }

  return row + numRows;
}
