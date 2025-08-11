import { Vendor } from "../../types";
import {
  VENDOR_SHEET_ID,
  VENDOR_TABLES,
  TABLE_NAMES,
  VENDOR_CATEGORIES,
  PLACEHOLDER_KEYWORDS,
} from "../../constants";
import {
  transformVendorToTable,
  VendorTableRow,
  mapProductsToRoughTypes,
  mapProductsToFinishTypes,
  mapProductsToOtherTypes,
} from "../transformations/vendor-to-sheets";
import {
  findLastRowWithContent,
  getEmailLinkFormula,
  getLocationLinkFormula,
  getWebsiteLinkFormula,
} from "@utils/sheets";
import { PRODUCT_BY_LABEL } from "../../products";

// Helper function to extract English part from bilingual labels
function toEnglish(label: string): string {
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
    finish = false,
    other = false;
  for (const p of products) {
    const def = PRODUCT_BY_LABEL[toEnglish(p)];
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
    if (def.category === VENDOR_CATEGORIES.OTHER) other = true;
  }

  // Build the list of destinations
  const destinations: (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES][] = [];

  if (rough) destinations.push(TABLE_NAMES.ROUGH);
  if (finish) destinations.push(TABLE_NAMES.FINISH);
  if (other) destinations.push(TABLE_NAMES.OTHER);

  // If no destinations found, default to Finish
  if (destinations.length === 0) return [TABLE_NAMES.FINISH];

  return destinations;
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
  // Get all products from all arrays (these are the categorized products)
  const allProducts = [
    ...(vendorData.roughProducts || []),
    ...(vendorData.finishProducts || []),
    ...(vendorData.otherProducts || []),
  ];

  // Determine which tables to create entries for based on the categorized products
  const destinations = decideDestinations(allProducts);

  // Create entries for each destination
  for (const destination of destinations) {
    saveVendorDataToSheetTestInternal(vendorData, destination);
  }

  if (destinations.length === 0) {
    // No destinations found for vendor
  }
}

/**
 * Internal function to save vendor data to a specific sheet
 */
function saveVendorDataToSheetTestInternal(
  vendorData: Vendor,
  destinationSheet: (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES]
) {
  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheetName =
    destinationSheet === TABLE_NAMES.ROUGH
      ? VENDOR_TABLES.ROUGH.name
      : destinationSheet === TABLE_NAMES.OTHER
      ? VENDOR_TABLES.OTHER.name
      : VENDOR_TABLES.FINISH.name;
  const sheet =
    spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  // Find the actual last row with content (not just empty rows)
  const lastRowWithContent = findLastRowWithContent(
    sheet,
    PLACEHOLDER_KEYWORDS
  );

  // Transform data based on destination sheet using the appropriate type mapper
  let transformedData: VendorTableRow;

  if (destinationSheet === TABLE_NAMES.ROUGH) {
    transformedData = transformVendorToTable(vendorData, (products) =>
      mapProductsToRoughTypes(vendorData.roughProducts)
    );
  } else if (destinationSheet === TABLE_NAMES.OTHER) {
    transformedData = transformVendorToTable(vendorData, (products) =>
      mapProductsToOtherTypes(vendorData.otherProducts)
    );
  } else {
    transformedData = transformVendorToTable(vendorData, (products) =>
      mapProductsToFinishTypes(vendorData.finishProducts)
    );
  }

  // Read existing headers from the sheet (order-independent)
  const existingHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0] as string[];

  // Normalize headers to handle Google Sheets Smart Table formatting
  const normalizedHeaders = existingHeaders.map((header) =>
    header.replace(/[:：]/g, "").trim()
  );

  // Write headers if sheet is empty (only header row exists)
  if (lastRowWithContent <= 1) {
    const expectedHeaders = Object.keys(transformedData);
    sheet
      .getRange(1, 1, 1, expectedHeaders.length)
      .setValues([expectedHeaders]);
  }

  // Map data to match the actual header order in the sheet
  const rowData = normalizedHeaders.map((header) => {
    const value = transformedData[header as keyof typeof transformedData];
    return value ?? "";
  });

  // Insert the new row AFTER the last row with content (not at the very end)
  const insertRowNumber = lastRowWithContent + 1;

  // Insert a new row at the correct position
  sheet.insertRowAfter(lastRowWithContent);

  // Write the data to the newly inserted row
  const targetRange = sheet.getRange(insertRowNumber, 1, 1, rowData.length);
  targetRange.setValues([rowData]);

  // Apply Smart Chip formatting (email links, location chips, etc.)
  // All tables have identical structure, so apply to all
  const tableData = transformedData as VendorTableRow;

  // Apply email link - find column by name instead of position
  const emailColumnIndex = normalizedHeaders.indexOf("Email") + 1;
  if (emailColumnIndex > 0) {
    const emailFormula = getEmailLinkFormula(tableData.Email);
    if (emailFormula) {
      const emailCell = sheet.getRange(insertRowNumber, emailColumnIndex);
      emailCell.setFormula(emailFormula);
    }
  }

  // Apply location link - find column by name instead of position
  const locationColumnIndex = normalizedHeaders.indexOf("Location") + 1;
  if (locationColumnIndex > 0) {
    const locationFormula = getLocationLinkFormula(tableData.Location);
    if (locationFormula) {
      const locationCell = sheet.getRange(insertRowNumber, locationColumnIndex);
      locationCell.setFormula(locationFormula);
    }
  }

  // Apply website link - find column by name instead of position
  const websiteColumnIndex = normalizedHeaders.indexOf("Website / Social") + 1;
  if (websiteColumnIndex > 0) {
    const websiteFormula = getWebsiteLinkFormula(tableData["Website / Social"]);
    if (websiteFormula) {
      const websiteCell = sheet.getRange(insertRowNumber, websiteColumnIndex);
      websiteCell.setFormula(websiteFormula);
    }
  }
}
