import { LEADS_COLUMNS } from "../columns";
import { QUARTER_COLUMNS } from "../columns";

export function createHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number,
  startCol: number
): number {
  const headerTitle = `📈 ${year} Leads Breakdown`;
  const totalTableWidth = LEADS_COLUMNS.length + QUARTER_COLUMNS.length;
  // Write the title in row 1, spanning `colSpan` columns
  const titleRange = sheet.getRange(1, startCol, 2, totalTableWidth);
  titleRange.merge();
  titleRange.setValue(headerTitle);
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(14);
  titleRange.setFontColor("white");
  titleRange.setBackground("#1A237E");
  titleRange.setHorizontalAlignment("center");
  titleRange.setVerticalAlignment("middle");

  // Return the row after the header (row 3)
  return 3;
}
