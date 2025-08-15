import { OnboardingData } from "../../types";
import { findLastRowWithContent } from "@utils/sheets";
import { normalizeString } from "@utils/normalize";
import { createLogger, maskPII } from "@lib/logging/log";
import type { FormDataWithMetadata } from "@/forms/core/base-form-handler";
import {
  transformOnboardingToTable,
  OnboardingTableRow,
} from "../transformations";

/**
 * Saves onboarding data to Google Sheets with thread safety and traceability
 */
export function saveOnboardingDataToSheet(
  formData: FormDataWithMetadata<OnboardingData>,
  spreadsheetId: string,
  tabName: string // This is now the base tab name, we'll use data.targetTab
): void {
  const log = createLogger("OnboardingSheets");
  const { data, uuid, submittedAt } = formData;
  const targetTabName = data.targetTab;

  // Use LockService to prevent concurrent write conflicts
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for the lock
    if (!lock.tryLock(10000)) {
      throw new Error("Could not acquire lock for sheet write operation");
    }

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

    const normalizedHeaders = existingHeaders.map(normalizeString);

    // Transform data to sheet row format
    const transformedData = transformOnboardingToTable(data, uuid, submittedAt);

    // Map data to match the actual header order in the sheet
    const rowData = normalizedHeaders.map((header) => {
      const value = transformedData[header as keyof OnboardingTableRow];
      return value ?? "";
    });

    // Insert the data
    sheet.getRange(insertRow, 1, 1, rowData.length).setValues([rowData]);

    log.info("Onboarding data saved successfully", {
      row: insertRow,
      uuid,
      name: data.name,
      company: data.companyName,
      targetTab: targetTabName,
    });
  } catch (error) {
    log.error("Failed to save onboarding data to sheet", {
      error: String(error),
      spreadsheetId,
      targetTab: targetTabName,
      uuid,
    });
    throw error;
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}
