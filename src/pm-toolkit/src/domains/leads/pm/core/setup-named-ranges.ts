import {
  INPUT_SHEET,
  NR_INPUT_YEAR_COL,
  NR_INPUT_MONTH_COL,
  NR_INPUT_GOAL_COL,
  NR_INPUT_REVENUE_COL,
  inputKeys,
} from "./constants";

/**
 * Sets up named ranges for the Leads Input sheet
 * This makes it easier to reference specific columns programmatically
 * and provides a more robust foundation for features like dashboard goal editing
 *
 * @returns {boolean} True if ranges were successfully set up, false otherwise
 */
export function setupLeadsInputNamedRanges(): boolean {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const inputSheet = ss.getSheetByName(INPUT_SHEET);

    if (!inputSheet) {
      Logger.log(`Could not find sheet: ${INPUT_SHEET}`);
      return false;
    }

    // Get headers from the first row
    const headers = inputSheet
      .getRange(1, 1, 1, inputSheet.getLastColumn())
      .getValues()[0];

    // Find column indices based on headers
    const yearColIndex = headers.indexOf(inputKeys.YEAR) + 1;
    const monthColIndex = headers.indexOf(inputKeys.MONTH) + 1;
    const goalColIndex = headers.indexOf(inputKeys.REVENUE_GOAL) + 1;
    const revenueColIndex = headers.indexOf(inputKeys.REVENUE) + 1;

    // Validate that all required columns were found
    if (
      yearColIndex === 0 ||
      monthColIndex === 0 ||
      goalColIndex === 0 ||
      revenueColIndex === 0
    ) {
      Logger.log("Could not find all required columns in Leads Input sheet");
      Logger.log(
        `Year column: ${yearColIndex}, Month column: ${monthColIndex}, Goal column: ${goalColIndex}, Revenue column: ${revenueColIndex}`
      );
      return false;
    }

    // Get the last row with data
    const lastRow = inputSheet.getLastRow();

    // Create named ranges for the entire columns (excluding header)
    if (lastRow > 1) {
      // Only create ranges if there's data beyond the header
      ss.setNamedRange(
        NR_INPUT_YEAR_COL,
        inputSheet.getRange(2, yearColIndex, lastRow - 1, 1)
      );

      ss.setNamedRange(
        NR_INPUT_MONTH_COL,
        inputSheet.getRange(2, monthColIndex, lastRow - 1, 1)
      );

      ss.setNamedRange(
        NR_INPUT_GOAL_COL,
        inputSheet.getRange(2, goalColIndex, lastRow - 1, 1)
      );

      ss.setNamedRange(
        NR_INPUT_REVENUE_COL,
        inputSheet.getRange(2, revenueColIndex, lastRow - 1, 1)
      );
    }

    return true;
  } catch (error) {
    Logger.log(`Error setting up named ranges: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Checks if the Leads Input named ranges exist
 * @returns {boolean} True if all named ranges exist, false otherwise
 */
export function leadsInputNamedRangesExist(): boolean {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // Check if all named ranges exist
    const yearRange = ss.getRangeByName(NR_INPUT_YEAR_COL);
    const monthRange = ss.getRangeByName(NR_INPUT_MONTH_COL);
    const goalRange = ss.getRangeByName(NR_INPUT_GOAL_COL);
    const revenueRange = ss.getRangeByName(NR_INPUT_REVENUE_COL);

    return Boolean(yearRange && monthRange && goalRange && revenueRange);
  } catch (error) {
    return false;
  }
}
