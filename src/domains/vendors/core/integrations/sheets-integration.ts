import { Vendor } from "../../types";
import {
  VENDOR_TABLES,
  TABLE_NAMES,
  VENDOR_CATEGORIES,
  PLACEHOLDER_KEYWORDS,
} from "../../constants";
import type { FormDataWithMetadata } from "@/forms/core/base-form-handler";
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
import { toEnglish } from "@utils/index";
import { normalizeString } from "@utils/normalize";
import { SMART_CHIP_COLUMNS } from "../../constants";

/**
 * Applies smart chip formatting to a specific column
 */
function applySmartChipToColumn(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  insertRowNumber: number,
  normalizedHeaders: string[],
  columnName: keyof typeof SMART_CHIP_COLUMNS,
  tableData: VendorTableRow,
  formulaGetter: (value: string) => string
): void {
  const columnIndex =
    normalizedHeaders.indexOf(SMART_CHIP_COLUMNS[columnName]) + 1;
  if (columnIndex > 0) {
    const formula = formulaGetter(
      tableData[
        SMART_CHIP_COLUMNS[columnName] as keyof VendorTableRow
      ] as string
    );
    if (formula) {
      const cell = sheet.getRange(insertRowNumber, columnIndex);
      cell.setFormula(formula);
    }
  }
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
 * Saves vendor data to the appropriate sheets based on their products
 * Creates entries for both Rough and Finish tables if the vendor has products in both categories
 * Uses LockService for thread safety and includes UUID/timestamp for traceability
 */
export function saveVendorDataToSheet(
  formData: FormDataWithMetadata<Vendor>,
  vendorSheetId: string,
  vendorTabName: string
) {
  const { data: vendorData, uuid, submittedAt } = formData;

  // Use LockService to prevent concurrent write conflicts
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for the lock
    if (!lock.tryLock(10000)) {
      throw new Error("Could not acquire lock for sheet write operation");
    }

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
      saveVendorDataToSheetInternal(
        vendorData,
        destination,
        vendorSheetId,
        vendorTabName,
        uuid,
        submittedAt
      );
    }

    if (destinations.length === 0) {
      // No destinations found for vendor
    }
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}

/**
 * Gets the sheet and headers for a specific destination
 */
function getSheetAndHeaders(
  destinationSheet: (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES],
  vendorSheetId: string,
  vendorTabName: string
): {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  lastRowWithContent: number;
  normalizedHeaders: string[];
} {
  const spreadsheet = SpreadsheetApp.openById(vendorSheetId);
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

  // Read existing headers from the sheet (order-independent)
  const existingHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0] as string[];

  // Normalize headers to handle Google Sheets Smart Table formatting
  const normalizedHeaders = existingHeaders.map(normalizeString);

  return { sheet, lastRowWithContent, normalizedHeaders };
}

/**
 * Writes vendor data to the sheet and returns the insert row number
 */
function writeDataToSheet(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  lastRowWithContent: number,
  normalizedHeaders: string[],
  transformedData: VendorTableRow
): number {
  // Write headers if sheet is empty (only header row exists)
  if (lastRowWithContent <= 1) {
    const expectedHeaders = Object.keys(transformedData);
    sheet
      .getRange(1, 1, 1, expectedHeaders.length)
      .setValues([expectedHeaders]);
  }

  // Map data to match the actual header order in the sheet
  const rowData = normalizedHeaders.map((header) => {
    const value = transformedData[header as keyof VendorTableRow];
    return value ?? "";
  });

  // Insert the new row AFTER the last row with content (not at the very end)
  const insertRowNumber = lastRowWithContent + 1;

  // Insert a new row at the correct position
  sheet.insertRowAfter(lastRowWithContent);

  // Write the data to the newly inserted row
  const targetRange = sheet.getRange(insertRowNumber, 1, 1, rowData.length);
  targetRange.setValues([rowData]);

  return insertRowNumber;
}

/**
 * Internal function to save vendor data to a specific sheet
 */
function saveVendorDataToSheetInternal(
  vendorData: Vendor,
  destinationSheet: (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES],
  vendorSheetId: string,
  vendorTabName: string,
  uuid: string,
  submittedAt: string
) {
  const { sheet, lastRowWithContent, normalizedHeaders } = getSheetAndHeaders(
    destinationSheet,
    vendorSheetId,
    vendorTabName
  );

  // Transform data based on destination sheet using the appropriate type mapper
  let transformedData: VendorTableRow;

  if (destinationSheet === TABLE_NAMES.ROUGH) {
    transformedData = transformVendorToTable(
      vendorData,
      vendorData.roughProducts || [],
      mapProductsToRoughTypes,
      uuid,
      submittedAt
    );
  } else if (destinationSheet === TABLE_NAMES.OTHER) {
    transformedData = transformVendorToTable(
      vendorData,
      vendorData.otherProducts || [],
      mapProductsToOtherTypes,
      uuid,
      submittedAt
    );
  } else {
    transformedData = transformVendorToTable(
      vendorData,
      vendorData.finishProducts || [],
      mapProductsToFinishTypes,
      uuid,
      submittedAt
    );
  }

  // Write data to sheet
  const insertRowNumber = writeDataToSheet(
    sheet,
    lastRowWithContent,
    normalizedHeaders,
    transformedData
  );

  // Apply Smart Chip formatting (email links, location chips, etc.)
  // All tables have identical structure, so apply to all
  const tableData = transformedData as VendorTableRow;

  applySmartChipToColumn(
    sheet,
    insertRowNumber,
    normalizedHeaders,
    "EMAIL",
    tableData,
    getEmailLinkFormula
  );
  applySmartChipToColumn(
    sheet,
    insertRowNumber,
    normalizedHeaders,
    "LOCATION",
    tableData,
    getLocationLinkFormula
  );
  applySmartChipToColumn(
    sheet,
    insertRowNumber,
    normalizedHeaders,
    "WEBSITE",
    tableData,
    getWebsiteLinkFormula
  );
}
