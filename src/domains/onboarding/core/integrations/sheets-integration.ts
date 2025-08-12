import { OnboardingFormData } from "../../types";
import { ONBOARDING_SHEET_CONFIG, ONBOARDING_STATUS } from "../../constants";
import {
  createEmailLinkFormula,
  createMapsLinkFormula,
} from "../../../../utils";

/**
 * Saves onboarding data to Google Sheets
 */
export function saveOnboardingDataToSheet(
  data: OnboardingFormData,
  onboardingSheetId: string,
  onboardingTabName: string
): void {
  console.log("📊 Saving onboarding data to Google Sheets...");

  try {
    const spreadsheet = SpreadsheetApp.openById(onboardingSheetId);
    let sheet = spreadsheet.getSheetByName(onboardingTabName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(onboardingTabName);
      sheet
        .getRange(1, 1, 1, ONBOARDING_SHEET_CONFIG.HEADERS.length)
        .setValues([[...ONBOARDING_SHEET_CONFIG.HEADERS]]);
      console.log("📋 Created new onboarding sheet with headers");
    }

    // Prepare row data
    const rowData = [
      data.contactInfo.name,
      data.contactInfo.company,
      data.contactInfo.profession.join(", "),
      data.contactInfo.insurance,
      data.contactInfo.phone,
      createEmailLinkFormula(data.contactInfo.email),
      createMapsLinkFormula(data.contactInfo.address),
      data.paymentDetails.paymentMethod.join(", "),
      data.paymentDetails.paymentInfo,
      data.comments || "",
      data.submissionDate,
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
