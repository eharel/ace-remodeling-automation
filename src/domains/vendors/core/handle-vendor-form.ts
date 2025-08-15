import { parseVendorResponse } from "./parse-vendor-response";
import { saveVendorDataToSheet } from "./integrations/sheets-integration";
import { createFormHandler } from "@/forms/core/base-form-handler";
import type { Vendor } from "../types";

/**
 * Handles vendor form submissions using the shared form handler pattern
 */
export const handleVendorForm = createFormHandler<Vendor>({
  parseFunction: parseVendorResponse,
  saveFunction: saveVendorDataToSheet,
  loggerModule: "Vendor",
  formIdKey: "VENDOR_FORM",
  sheetIdKey: "VENDOR_SHEET",
  tabKey: "VENDOR_TAB",
});
