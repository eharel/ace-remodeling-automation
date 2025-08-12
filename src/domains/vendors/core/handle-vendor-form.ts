import { parseVendorResponse } from "./parse-vendor-response";
import { saveVendorDataToSheet } from "./integrations/sheets-integration";
import type { FormsIds } from "@/forms/config/config";

/**
 * Handles vendor form submissions
 * Currently using TEST MODE with placeholder mappings
 */
export function handleVendorForm(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  ids: FormsIds
) {
  try {
    // Extract raw form data
    const rawFormData = e.response
      .getItemResponses()
      .reduce((acc, itemResponse) => {
        const question = itemResponse.getItem().getTitle();
        const answer = itemResponse.getResponse();

        // Handle different response types
        let answerString: string;
        if (Array.isArray(answer)) {
          answerString = answer.join(", ");
        } else {
          answerString = String(answer);
        }

        acc[question] = answerString;
        return acc;
      }, {} as Record<string, string>);

    // Parse the raw data into our Vendor type
    const vendorData = parseVendorResponse(rawFormData);

    // Save to Google Sheets
    saveVendorDataToSheet(vendorData, ids.VENDOR_SHEET, ids.VENDOR_TAB);
  } catch (error) {
    console.error("❌ Error processing vendor form:", error);
    throw error;
  }
}
