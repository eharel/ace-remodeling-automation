import { Vendor } from "../../types";
import {
  VENDOR_SHEET_ID,
  VENDOR_TABLES,
  TABLE_NAMES,
  VENDOR_CATEGORIES,
} from "../../constants";
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
import { PRODUCT_BY_LABEL } from "../../products";

// Helper function to extract English part from bilingual labels
function english(label: string): string {
  return label.split("/")[0].trim();
}

/**
 * Determines which tables a vendor should appear in based on their products
 */
export function decideDestinations(
  products?: string[]
): (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES][] {
  if (!products?.length) return [TABLE_NAMES.FINISH]; // safe default
  let rough = false,
    finish = false;
  for (const p of products) {
    const def = PRODUCT_BY_LABEL[english(p)];
    if (!def) continue;
    if (
      def.category === VENDOR_CATEGORIES.ROUGH ||
      def.category === VENDOR_CATEGORIES.BOTH
    )
      rough = true;
    if (
      def.category === VENDOR_CATEGORIES.FINISH ||
      def.category === VENDOR_CATEGORIES.BOTH
    )
      finish = true;
  }
  if (rough && finish) return [TABLE_NAMES.ROUGH, TABLE_NAMES.FINISH];
  if (rough) return [TABLE_NAMES.ROUGH];
  return [TABLE_NAMES.FINISH];
}

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
): (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES] {
  // For now, always use Finish table for testing
  // TODO: Add logic based on employee input
  return TABLE_NAMES.FINISH;
}

/**
 * TEST MODE: Saves vendor data to the appropriate sheets based on their products
 * Creates entries for both Rough and Finish tables if the vendor has products in both categories
 */
export function saveVendorDataToSheetTest(vendorData: Vendor) {
  console.log(
    `🧪 TEST MODE: Processing vendor data for ${vendorData.companyName}`
  );

  // Get all products from both arrays (these are the categorized products)
  const allProducts = [
    ...(vendorData.roughProducts || []),
    ...(vendorData.finishProducts || []),
  ];

  console.log(
    `🧪 TEST MODE: All products: ${allProducts.join(", ") || "None"}`
  );

  // Determine which tables to create entries for based on the categorized products
  const destinations = decideDestinations(allProducts);
  console.log(`🧪 TEST MODE: Destinations: ${destinations.join(", ")}`);

  // Create entries for each destination
  for (const destination of destinations) {
    console.log(`🧪 TEST MODE: Creating ${destination} table entry`);
    saveVendorDataToSheetTestInternal(vendorData, destination);
  }

  if (destinations.length === 0) {
    console.warn(
      `⚠️ No destinations found for vendor: ${vendorData.companyName}`
    );
  }
}

/**
 * Internal function to save vendor data to a specific sheet
 */
function saveVendorDataToSheetTestInternal(
  vendorData: Vendor,
  destinationSheet: (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES]
) {
  console.log(
    `🧪 TEST MODE: Saving vendor data to ${destinationSheet} sheet, ID: ${VENDOR_SHEET_ID}`
  );

  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheetName =
    destinationSheet === TABLE_NAMES.ROUGH
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

  if (destinationSheet === TABLE_NAMES.ROUGH) {
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
  if (destinationSheet === TABLE_NAMES.FINISH) {
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
