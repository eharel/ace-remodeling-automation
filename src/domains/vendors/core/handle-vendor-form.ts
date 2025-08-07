import { parseVendorResponse } from "./parse-vendor-response";
import {
  saveVendorDataToSheetTest,
  determineDestinationSheet,
} from "./integrations/sheets-integration";

/**
 * Handles vendor form submissions
 * Currently using TEST MODE with placeholder mappings
 */
export function handleVendorForm(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  console.log("🛠️ Processing vendor form submission...");

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

    console.log("📋 Raw form data extracted");

    // Parse the raw data into our Vendor type
    const vendorData = parseVendorResponse(rawFormData);
    console.log("✅ Vendor data parsed successfully");

    // Determine which sheet to write to
    const destinationSheet = determineDestinationSheet(vendorData);
    console.log(`🎯 Destination sheet determined: ${destinationSheet}`);

    // Save to Google Sheets (TEST MODE)
    saveVendorDataToSheetTest(vendorData, destinationSheet);
    console.log("📊 Vendor data saved to Google Sheets (TEST MODE)");

    console.log("🎉 Vendor form processed successfully");
  } catch (error) {
    console.error("❌ Error processing vendor form:", error);
    throw error;
  }
}
