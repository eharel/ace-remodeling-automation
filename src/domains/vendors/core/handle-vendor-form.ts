import { parseVendorResponse } from "./parse-vendor-response";
import { saveVendorDataToSheet } from "./integrations/sheets-integration";
import type { FormsIds } from "@/forms/config/config";
import { createLogger, errFields } from "@lib/logging/log";

/**
 * Handles vendor form submissions
 * Currently using TEST MODE with placeholder mappings
 */
export function handleVendorForm(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  ids: FormsIds
) {
  const vendorsLog = createLogger("Vendor", {
    bound: { formId: ids.VENDOR_FORM },
  });
  const span = vendorsLog.start("Handle vendor form");

  let error: Error | undefined;
  try {
    // Extract raw form data
    vendorsLog.info("Extracting raw form data");
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
    vendorsLog.debug("Parsed vendor data", { name: vendorData.companyName }); // avoid full PII
    vendorsLog.info("Saved vendor to sheet", {
      sheetId: ids.VENDOR_SHEET,
      tab: ids.VENDOR_TAB,
    });
  } catch (err) {
    error = err as Error;
    vendorsLog.error("Error processing vendor form", errFields(error));
    throw error;
  } finally {
    span.end({ success: !error });
  }
}
