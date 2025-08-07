import { Vendor } from "../../types";
import { VENDOR_SHEET_ID, VENDOR_TABLES } from "../../constants";
import {
  transformVendorToRoughTableTest,
  RoughTableRow,
} from "../transformations/vendor-to-sheets";

/**
 * Configuration for Google Sheets table operations
 */
export interface SheetsTableConfig {
  spreadsheetId: string;
  sheetName: string;
  headers: string[];
}

/**
 * TEST MODE: Saves vendor data using placeholder mappings
 * Use this to test the pipeline before getting real mappings from employees
 */
export function saveVendorDataToSheetTest(vendorData: Vendor) {
  console.log(
    `🧪 TEST MODE: Saving vendor data to sheet ID: ${VENDOR_SHEET_ID}`
  );

  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheet =
    spreadsheet.getSheetByName(VENDOR_TABLES.ROUGH.name) ||
    spreadsheet.insertSheet(VENDOR_TABLES.ROUGH.name);

  // Find the actual last row with content (not just empty rows)
  const lastRowWithContent = findLastRowWithContent(sheet);
  console.log(`🧪 TEST MODE: Last row with content: ${lastRowWithContent}`);

  // Use test transformation with placeholder mappings
  const roughTableRow = transformVendorToRoughTableTest(vendorData);

  // Get headers from the transformed data
  const headers = Object.keys(roughTableRow) as (keyof RoughTableRow)[];

  // Write headers if sheet is empty (only header row exists)
  if (lastRowWithContent <= 1) {
    console.log(`🧪 TEST MODE: Writing headers`);
    sheet.appendRow(headers);
  }

  // Format the row data using the transformed structure
  const row = headers.map((key) => {
    const value = roughTableRow[key];
    return value ?? "";
  });

  // Insert the new row AFTER the last row with content (not at the very end)
  const insertRowNumber = lastRowWithContent + 1;
  console.log(`🧪 TEST MODE: Inserting row at position ${insertRowNumber}`);

  // Insert a new row at the correct position
  sheet.insertRowAfter(lastRowWithContent);

  // Write the data to the newly inserted row
  const targetRange = sheet.getRange(insertRowNumber, 1, 1, row.length);
  targetRange.setValues([row]);

  console.log(`🧪 TEST MODE: Added vendor data: ${vendorData.companyName}`);
}

/**
 * Finds the last row that actually contains vendor data by checking column A (Names)
 */
function findLastRowWithContent(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): number {
  const lastRow = sheet.getLastRow();

  if (lastRow === 0) return 0;

  // Start from the last row and work backwards
  for (let row = lastRow; row >= 1; row--) {
    // Only check column A (Names)
    const nameCell = sheet.getRange(row, 1);
    const nameValue = String(nameCell.getValue()).trim();

    // Skip empty cells
    if (!nameValue) continue;

    // Skip header row (row 1)
    if (row === 1) continue;

    // Skip placeholder/smart table content in Names column
    const isPlaceholder = [
      "Sample",
      "Example",
      "Test",
      "Demo",
      "Placeholder",
      "N/A",
      "TBD",
      "Click to edit",
      "Enter data",
      "Type here",
      "Add data",
      "Names", // Skip if someone accidentally put "Names" in the data
    ].some((placeholder) =>
      nameValue.toLowerCase().includes(placeholder.toLowerCase())
    );

    if (isPlaceholder) continue;

    // Skip cells that look like formulas
    const isFormula =
      nameValue.startsWith("=") ||
      nameValue.includes("{{") ||
      nameValue.includes("}}");
    if (isFormula) continue;

    // If we get here, it's a real company name
    console.log(`📊 Found vendor data in row ${row}: "${nameValue}"`);
    return row;
  }

  // If no vendor data found, return 1 (header row)
  console.log(`📊 No vendor data found, using header row (1)`);
  return 1;
}
