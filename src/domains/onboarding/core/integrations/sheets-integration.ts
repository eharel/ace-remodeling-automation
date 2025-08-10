import { OnboardingFormData } from "../../types";
import { ONBOARDING_SHEET_CONFIG, ONBOARDING_STATUS } from "../../constants";
import { createEmailFormula, createMapsLinkFormula } from "../../../../utils";

/**
 * Saves onboarding data to Google Sheets
 */
export function saveOnboardingDataToSheet(data: OnboardingFormData): void {
  console.log("📊 Saving onboarding data to Google Sheets...");

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(ONBOARDING_SHEET_CONFIG.SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(ONBOARDING_SHEET_CONFIG.SHEET_NAME);
      sheet
        .getRange(1, 1, 1, ONBOARDING_SHEET_CONFIG.HEADERS.length)
        .setValues([ONBOARDING_SHEET_CONFIG.HEADERS]);
      console.log("📋 Created new onboarding sheet with headers");
    }

    // Prepare row data
    const rowData = [
      data.contactInfo.name,
      createEmailFormula(data.contactInfo.email),
      data.contactInfo.phone,
      createMapsLinkFormula(data.contactInfo.address),
      data.contactInfo.company,
      data.paymentDetails.paymentMethod,
      data.paymentDetails.accountNumber,
      data.paymentDetails.routingNumber,
      data.paymentDetails.cardNumber,
      data.paymentDetails.expirationDate,
      data.paymentDetails.cvv,
      data.additionalNotes,
      data.submissionDate,
      ONBOARDING_STATUS.NEW,
    ];

    // Append the new row
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow + 1, 1, 1, rowData.length);
    range.setValues([rowData]);

    console.log("✅ Onboarding data saved successfully");
  } catch (error) {
    console.error("❌ Error saving onboarding data to sheet:", error);
    throw error;
  }
}
