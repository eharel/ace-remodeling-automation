import { OnboardingData } from "../../types";
import { findLastRowWithContent } from "@utils/sheets";
import { createLogger, maskPII } from "@lib/logging/log";
import type { FormDataWithMetadata } from "@/forms/core/base-form-handler";

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

    // Prepare the row data with UUID and timestamp for traceability
    const rowData = [
      data.name,
      data.companyName,
      data.profession,
      data.hasInsurance ? "Yes" : "No",
      maskPII(data.phone),
      maskPII(data.email),
      data.address,
      data.paymentMethod,
      data.paymentInfo,
      data.comments || "",
      uuid, // UUID for future two-way sync
      submittedAt, // ISO timestamp for traceability
    ];

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
