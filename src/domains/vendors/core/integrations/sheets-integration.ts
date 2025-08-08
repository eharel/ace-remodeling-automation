import { Vendor } from "../../types";
import { VENDOR_SHEET_ID, VENDOR_TABLES } from "../../constants";
import {
  transformVendorToRoughTableTest,
  transformVendorToFinishTableTest,
  RoughTableRow,
  FinishTableRow,
} from "../transformations/vendor-to-sheets";
import {
  findLastRowWithContent,
  getEmailLinkFormula,
  getLocationLinkFormula,
} from "@utils/sheets";

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
  // For now, always use Finish table for testing
  // TODO: Add logic based on employee input
  return "Finish";
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
  const lastRowWithContent = findLastRowWithContent(sheet, [
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
  ]);
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

  console.log(`🔍 Final row data:`, row);

  // Insert the new row AFTER the last row with content (not at the very end)
  const insertRowNumber = lastRowWithContent + 1;
  console.log(`🧪 TEST MODE: Inserting row at position ${insertRowNumber}`);

  // Insert a new row at the correct position
  sheet.insertRowAfter(lastRowWithContent);

  // Write the data to the newly inserted row
  const targetRange = sheet.getRange(insertRowNumber, 1, 1, row.length);
  targetRange.setValues([row]);

  // Apply Smart Chip formatting (email links, location chips, etc.)
  // Only apply to Finish table since Rough table doesn't have Email/Location columns
  if (destinationSheet === "Finish") {
    const finishTableData = transformedData as FinishTableRow;

    // Apply email link
    const emailColumnIndex = headers.indexOf("Email") + 1;
    if (emailColumnIndex > 0) {
      const emailFormula = getEmailLinkFormula(finishTableData.Email);
      if (emailFormula) {
        const emailCell = sheet.getRange(insertRowNumber, emailColumnIndex);
        emailCell.setFormula(emailFormula);
        console.log(`🔗 Created email link for: ${finishTableData.Email}`);
      }
    }

    // Apply location link
    const locationColumnIndex = headers.indexOf("Location") + 1;
    if (locationColumnIndex > 0) {
      const locationFormula = getLocationLinkFormula(finishTableData.Location);
      if (locationFormula) {
        const locationCell = sheet.getRange(
          insertRowNumber,
          locationColumnIndex
        );
        locationCell.setFormula(locationFormula);
        console.log(
          `🗺️ Created Google Maps link for: ${finishTableData.Location}`
        );
      }
    }
  }

  console.log(
    `🧪 TEST MODE: Added vendor data to ${destinationSheet} sheet: ${vendorData.companyName}`
  );
}
