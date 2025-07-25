import { LEADS_COLUMNS } from "../columns";
import { QUARTER_COLUMNS } from "../columns";
import { TITLE_BACKGROUND_COLOR } from "../constants";

/**
 * Creates a header for the leads dashboard with the specified year and positioning.
 * 
 * @param sheet - The Google Sheets worksheet to modify
 * @param year - The year to display in the header title
 * @param row - Starting row position for the header
 * @param column - Starting column position for the header
 * @param numRows - Number of rows the header spans
 * @param numColumns - Number of columns the header spans
 * @returns The row number after the header (row + numRows)
 */
export function createHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number,
  row: number,
  column: number,
  numRows: number,
  numColumns: number
): number {
  const headerTitle = `📈 ${year} Leads Breakdown`;

  const titleRange = sheet.getRange(
    row,
    column,
    numRows,
    numColumns
  );
  titleRange.merge();
  titleRange.setValue(headerTitle);
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(14);
  titleRange.setFontColor("white");
  titleRange.setBackground(TITLE_BACKGROUND_COLOR);
  titleRange.setHorizontalAlignment("center");
  titleRange.setVerticalAlignment("middle");

  return row + numRows;
}
