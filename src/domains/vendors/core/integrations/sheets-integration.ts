import { Vendor } from "../../types";
import { VENDOR_SHEET_ID, VENDOR_TABLES } from "../../constants";
import {
  transformVendorToRoughTableTest,
  transformVendorToFinishTableTest,
  RoughTableRow,
  FinishTableRow,
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
 * Determines which sheet the vendor data should be written to
 * TODO: Add employee logic here when they provide the rules
 */
export function determineDestinationSheet(
  vendorData: Vendor
): "Rough" | "Finish" {
  // For now, always use Rough table for testing
  // TODO: Add logic based on employee input
  return "Rough";
}

/**
 * TEST MODE: Saves vendor data to the specified sheet using appropriate transformation
 */
export function saveVendorDataToSheetTest(
  vendorData: Vendor,
  destinationSheet: "Rough" | "Finish" = "Rough"
) {
  console.log(
    `🧪 TEST MODE: Saving vendor data to ${destinationSheet} sheet, ID: ${VENDOR_SHEET_ID}`
  );

  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheetName =
    destinationSheet === "Rough"
      ? VENDOR_TABLES.ROUGH.name
      : VENDOR_TABLES.FINISH.name;
  const sheet =
    spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  // Find the actual last row with content (not just empty rows)
  const lastRowWithContent = findLastRowWithContent(sheet);
  console.log(`🧪 TEST MODE: Last row with content: ${lastRowWithContent}`);

  // Transform data based on destination sheet
  let transformedData: RoughTableRow | FinishTableRow;
  let headers: string[];

  if (destinationSheet === "Rough") {
    transformedData = transformVendorToRoughTableTest(vendorData);
    headers = Object.keys(transformedData) as (keyof RoughTableRow)[];
  } else {
    transformedData = transformVendorToFinishTableTest(vendorData);
    headers = Object.keys(transformedData) as (keyof FinishTableRow)[];
  }

  // Write headers if sheet is empty (only header row exists)
  if (lastRowWithContent <= 1) {
    console.log(`🧪 TEST MODE: Writing headers`);
    sheet.appendRow(headers);
  }

  // Format the row data using the transformed structure
  const row = headers.map((key) => {
    const value = transformedData[key as keyof typeof transformedData];
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

  console.log(
    `🧪 TEST MODE: Added vendor data to ${destinationSheet} sheet: ${vendorData.companyName}`
  );
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
