import { Vendor } from "../../types";
import { VENDOR_SHEET_ID, VENDOR_TABLES } from "../../constants";
import {
  transformVendorToRoughTable,
  RoughTableRow,
  transformVendorToFinishTable,
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
 * Saves vendor data to the Rough table in the Google Sheet
 */
export function saveVendorDataToSheet(vendorData: Vendor) {
  console.log(`📊 Attempting to save to sheet ID: ${VENDOR_SHEET_ID}`);

  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  console.log(`📊 Opened spreadsheet: ${spreadsheet.getName()}`);
  console.log(`📊 Spreadsheet URL: ${spreadsheet.getUrl()}`);

  const sheet =
    spreadsheet.getSheetByName(VENDOR_TABLES.ROUGH.name) ||
    spreadsheet.insertSheet(VENDOR_TABLES.ROUGH.name);

  console.log(`📊 Using sheet: ${sheet.getName()}`);
  console.log(
    `📊 Sheet URL: ${sheet.getParent().getUrl()}#gid=${sheet.getSheetId()}`
  );

  // Transform vendor data to Rough table format
  const roughTableRow = transformVendorToRoughTable(vendorData);
  console.log(`📊 Transformed data:`, roughTableRow);

  // Get headers from the transformed data
  const headers = Object.keys(roughTableRow) as (keyof RoughTableRow)[];

  // Write headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    console.log(`📊 Writing headers: ${headers.join(", ")}`);
    sheet.appendRow(headers);
  } else {
    console.log(
      `📊 Sheet already has ${sheet.getLastRow()} rows, skipping headers`
    );
  }

  // Format the row data using the transformed structure
  const row = headers.map((key) => {
    const value = roughTableRow[key];
    return value ?? "";
  });

  console.log(`📊 Appending row: ${row.join(" | ")}`);

  // Append the new row
  sheet.appendRow(row);
  console.log(`✅ Added vendor data to Rough table: ${vendorData.companyName}`);
  console.log(`✅ Final row count: ${sheet.getLastRow()}`);
}

/**
 * Inserts vendor data into a specific table in Google Sheets
 * Uses the appropriate transformation based on table type
 */
export function insertVendorIntoSheetsTable(
  vendor: Vendor,
  config: SheetsTableConfig
): void {
  console.log(`📊 Inserting vendor into sheets table: ${config.sheetName}`);

  const spreadsheet = SpreadsheetApp.openById(config.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(config.sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${config.sheetName}' not found`);
  }

  // Determine which transformation to use based on table name
  let transformedData: any;
  if (config.sheetName === VENDOR_TABLES.ROUGH.name) {
    transformedData = transformVendorToRoughTable(vendor);
    console.log(`📊 Transformed vendor data for Rough table:`, transformedData);
  } else if (config.sheetName === VENDOR_TABLES.FINISH.name) {
    transformedData = transformVendorToFinishTable(vendor);
    console.log(
      `📊 Transformed vendor data for Finish table:`,
      transformedData
    );
  } else {
    throw new Error(
      `No transformation available for table: ${config.sheetName}`
    );
  }

  // Get headers from the transformed data
  const headers = Object.keys(transformedData);

  // Validate that our headers match the table structure
  const tableHeaders = getSheetsTableHeaders(sheet);
  console.log(`📊 Table headers: ${tableHeaders.join(", ")}`);
  console.log(`📊 Our headers: ${headers.join(", ")}`);

  // Create row data in the correct order
  const row = headers.map((key) => transformedData[key] ?? "");

  // Append the new row
  sheet.appendRow(row);
  console.log(`✅ Vendor inserted into table: ${vendor.companyName}`);
}

/**
 * Gets the headers from an existing Google Sheets table
 * Useful for validation and dynamic field mapping
 */
export function getSheetsTableHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): string[] {
  const headerRow = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];
  return headerRow.filter((cell: any) => cell !== ""); // Remove empty cells
}
