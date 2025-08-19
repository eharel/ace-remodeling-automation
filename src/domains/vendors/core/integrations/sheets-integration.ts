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
  const normalizedTargetHeader = normalizeString(
    SMART_CHIP_COLUMNS[columnName]
  );
  const columnIndex = normalizedHeaders.indexOf(normalizedTargetHeader) + 1;
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

  console.log("🔍 Starting vendor sheet save process", {
    vendorSheetId,
    vendorTabName,
    uuid,
    companyName: vendorData.companyName,
  });

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

    console.log("🔍 All products for vendor:", allProducts);

    // Determine which tables to create entries for based on the categorized products
    const destinations = decideDestinations(allProducts);

    console.log("🔍 Destinations determined:", destinations);

    // Create entries for each destination
    for (const destination of destinations) {
      console.log("🔍 Processing destination:", destination);
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
      console.log("🔍 No destinations found for vendor");
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

  console.log(
    "🔍 Looking for sheet:",
    sheetName,
    "in spreadsheet:",
    vendorSheetId
  );

  const sheet =
    spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  console.log(
    "🔍 Sheet found/created:",
    sheet.getName(),
    "with",
    sheet.getLastRow(),
    "rows"
  );

  // Find the actual last row with content (not just empty rows)
  const lastRowWithContent = findLastRowWithContent(
    sheet,
    PLACEHOLDER_KEYWORDS
  );

  console.log("🔍 Last row with content:", lastRowWithContent);

  // Read existing headers from the sheet (order-independent)
  const existingHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0] as string[];

  console.log("🔍 Existing headers:", existingHeaders);

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
  console.log("🔍 Writing data to sheet:", sheet.getName());
  console.log("🔍 Transformed data:", transformedData);

  // Write headers if sheet is empty (only header row exists)
  if (lastRowWithContent <= 1) {
    const expectedHeaders = Object.keys(transformedData);
    console.log("🔍 Writing headers:", expectedHeaders);
    sheet
      .getRange(1, 1, 1, expectedHeaders.length)
      .setValues([expectedHeaders]);
  }

  // Prepare effective headers for mapping
  const expectedHeaders = Object.keys(transformedData);
  const effectiveNormalizedHeaders =
    normalizedHeaders && normalizedHeaders.length
      ? normalizedHeaders
      : expectedHeaders.map((h) => normalizeString(h));

  // Map data to match the actual header order in the sheet using normalized key matching
  const rowData = effectiveNormalizedHeaders.map((normalizedHeader) => {
    const matchingKey = Object.keys(transformedData).find(
      (key) => normalizeString(key) === normalizedHeader
    );
    const value = matchingKey
      ? (transformedData[
          matchingKey as keyof VendorTableRow
        ] as unknown as string)
      : "";
    return value ?? "";
  });

  console.log("🔍 Row data to write:", rowData);

  // Insert the new row AFTER the last row with content (not at the very end)
  const insertRowNumber = lastRowWithContent + 1;

  console.log("🔍 Inserting at row:", insertRowNumber);

  // Insert a new row at the correct position
  sheet.insertRowAfter(lastRowWithContent);

  // Write the data to the newly inserted row
  const targetRange = sheet.getRange(insertRowNumber, 1, 1, rowData.length);
  targetRange.setValues([rowData]);

  console.log("🔍 Data written successfully to row:", insertRowNumber);

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
    console.log(
      "🔍 Transforming for ROUGH with products:",
      vendorData.roughProducts
    );
    transformedData = transformVendorToTable(
      vendorData,
      vendorData.roughProducts || [],
      mapProductsToRoughTypes,
      uuid,
      submittedAt
    );
  } else if (destinationSheet === TABLE_NAMES.OTHER) {
    console.log(
      "🔍 Transforming for OTHER with products:",
      vendorData.otherProducts
    );
    transformedData = transformVendorToTable(
      vendorData,
      vendorData.otherProducts || [],
      mapProductsToOtherTypes,
      uuid,
      submittedAt
    );
  } else {
    console.log(
      "🔍 Transforming for FINISH with products:",
      vendorData.finishProducts
    );
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
