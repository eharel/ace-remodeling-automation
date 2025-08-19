import { parseVendorResponseById } from "./parse-vendor-response-id";
import { saveVendorDataToSheet } from "./integrations/sheets-integration";
import { createLogger, errFields } from "@lib/logging/log";
import type { Vendor } from "../types";
import type { FormsIds } from "@/forms/config/config";

export interface FormDataWithMetadata<T> {
  data: T;
  uuid: string;
  submittedAt: string;
}

/**
 * Handles vendor form submissions using ID-based field matching
 */
export function handleVendorFormById(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  ids: FormsIds,
  environment: "development" | "production" = "development"
) {
  const log = createLogger("Vendor", {
    bound: { formId: ids.VENDOR_FORM as string },
  });
  const span = log.start("Handle vendor form submission (ID-based)");

  let error: Error | undefined;
  try {
    log.info("Processing form response with ID-based matching", {
      environment,
    });

    // Use the ID-based parser directly with the form response
    const parsedData = parseVendorResponseById(e.response, environment);

    const formDataWithMetadata: FormDataWithMetadata<Vendor> = {
      data: parsedData,
      uuid: Utilities.getUuid(),
      submittedAt: new Date().toISOString(),
    };

    // Save to Google Sheets
    const sheetId = ids.VENDOR_SHEET as string;
    const tabName = ids.VENDOR_TAB as string;

    saveVendorDataToSheet(formDataWithMetadata, sheetId, tabName);

    log.info("Saved vendor data to sheet", {
      sheetId,
      tab: tabName,
      environment,
    });
  } catch (err) {
    error = err as Error;
    log.error("Error processing vendor form", errFields(error));
    throw error;
  } finally {
    span.end({ success: !error });
  }
}
