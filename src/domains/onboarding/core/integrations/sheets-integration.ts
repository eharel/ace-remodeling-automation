import { OnboardingData } from "../../types";
import { findLastRowWithContent, getLocationLinkFormula } from "@utils/sheets";
import { normalizeString } from "@utils/normalize";
import { createLogger, maskPII } from "@lib/logging/log";
import type { FormDataWithMetadata } from "@/forms/core/base-form-handler";
import {
  transformOnboardingToTable,
  OnboardingTableRow,
} from "../transformations";

// Smart chip column configuration for onboarding
const SMART_CHIP_COLUMNS = {
  ADDRESS: "Address",
} as const;

/**
 * Applies smart chip formatting to a specific column
 */
function applySmartChipToColumn(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  insertRowNumber: number,
  normalizedHeaders: string[],
  columnName: keyof typeof SMART_CHIP_COLUMNS,
  tableData: OnboardingTableRow,
  formulaGetter: (value: string) => string
): void {
  const columnIndex =
    normalizedHeaders.indexOf(SMART_CHIP_COLUMNS[columnName]) + 1;
  if (columnIndex > 0) {
    const formula = formulaGetter(
      tableData[
        SMART_CHIP_COLUMNS[columnName] as keyof OnboardingTableRow
      ] as string
    );
    if (formula) {
      const cell = sheet.getRange(insertRowNumber, columnIndex);
      cell.setFormula(formula);
    }
  }
}

/**
 * Saves onboarding data to Google Sheets with thread safety and traceability
 * Creates entries for all target tabs if the person has multiple professions
 */
export function saveOnboardingDataToSheet(
  formData: FormDataWithMetadata<OnboardingData>,
  spreadsheetId: string,
  tabName: string // This is now the base tab name, we'll use data.targetTabs
): void {
  const log = createLogger("OnboardingSheets");
  const { data, uuid, submittedAt } = formData;
  const targetTabNames = data.targetTabs;

  // Use LockService to prevent concurrent write conflicts
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for the lock
    if (!lock.tryLock(10000)) {
      throw new Error("Could not acquire lock for sheet write operation");
    }

    // Create entries for each target tab
    for (const targetTabName of targetTabNames) {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheetByName(targetTabName);

      if (!sheet) {
        throw new Error(
          `Sheet "${targetTabName}" not found in spreadsheet ${spreadsheetId}`
        );
      }

      // Find the next available row
      const lastRow = findLastRowWithContent(sheet, []);
      const insertRow = lastRow + 1;

      // Read existing headers and normalize them
      const existingHeaders = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0] as string[];

      console.log("🔍 Existing headers in sheet:", existingHeaders);
      const normalizedHeaders = existingHeaders.map(normalizeString);
      console.log("🔍 Normalized headers:", normalizedHeaders);

      // Transform data to sheet row format for this specific tab
      const transformedData = transformOnboardingToTable(
        data,
        targetTabName,
        uuid,
        submittedAt
      );
      console.log(
        "🔍 Transformed data:",
        JSON.stringify(transformedData, null, 2)
      );

      // Map data to match the actual header order in the sheet
      const rowData = normalizedHeaders.map((header) => {
        // Find the matching key in transformedData by normalizing both sides
        const matchingKey = Object.keys(transformedData).find(
          (key) => normalizeString(key) === header
        );
        const value = matchingKey
          ? transformedData[matchingKey as keyof OnboardingTableRow]
          : "";
        return value ?? "";
      });
      console.log("🔍 Normalized headers:", normalizedHeaders);
      console.log("🔍 Final row data:", JSON.stringify(rowData, null, 2));

      // Insert the data
      sheet.getRange(insertRow, 1, 1, rowData.length).setValues([rowData]);

      // Apply Smart Chip formatting for address links
      const addressColumnIndex = normalizedHeaders.indexOf("address") + 1;
      if (addressColumnIndex > 0) {
        const addressFormula = getLocationLinkFormula(transformedData.Address);
        if (addressFormula) {
          const addressCell = sheet.getRange(insertRow, addressColumnIndex);
          addressCell.setFormula(addressFormula);
        }
      }

      log.info("Onboarding data saved successfully", {
        row: insertRow,
        uuid,
        name: data.name,
        company: data.companyName,
        targetTab: targetTabName,
      });
    }
  } catch (error) {
    log.error("Failed to save onboarding data to sheet", {
      error: String(error),
      spreadsheetId,
      targetTabs: targetTabNames,
      uuid,
    });
    throw error;
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}
