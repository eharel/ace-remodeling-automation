import { extractResponse } from "@forms/core/extract-response";
import { parseVendorResponse } from "@domains/vendors/core/parse-vendor-response";
import { VendorFormResponse } from "@domains/vendors/types";

// Vendor sheet configuration
const VENDOR_SHEET_ID = "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w";
const VENDOR_SHEET_NAME = "Vendor Form Responses";

/**
 * Handles vendor form submissions
 */
export function handleVendorForm(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  console.log("🛠️ Processing vendor form submission...");

  try {
    // Extract the raw form response
    const raw = extractResponse(e);
    console.log("📋 Raw form data extracted");

    // Parse the vendor-specific response
    const parsed = parseVendorResponse(raw);
    console.log("✅ Vendor data parsed successfully");

    // Save to Google Sheets
    saveVendorDataToSheet(parsed);
    console.log("📊 Vendor data saved to Google Sheets");

    console.log("🎉 Vendor form processed successfully");
    return parsed;
  } catch (error) {
    console.error("❌ Error processing vendor form:", error);
    throw error;
  }
}

/**
 * Saves vendor data to the Google Sheet
 */
function saveVendorDataToSheet(vendorData: VendorFormResponse) {
  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheet =
    spreadsheet.getSheetByName(VENDOR_SHEET_NAME) ||
    spreadsheet.insertSheet(VENDOR_SHEET_NAME);

  // Define headers based on the VendorFormResponse type
  const headers: (keyof VendorFormResponse)[] = [
    "Company Name",
    "Type of Trade",
    "Contact Name",
    "Phone Number",
    "Email",
    "Website (if applicable)",
    "Company Bio",
    "Type of Materials",
    "Are you Insured, Licensed, or New?",
    "Date of Submission",
    "Upload License and/or Insurance",
  ];

  // Write headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  // Format the row data
  const row = headers.map((key) => {
    const value = vendorData[key];
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof Date) return value.toISOString().slice(0, 10); // YYYY-MM-DD
    return value ?? "";
  });

  // Append the new row
  sheet.appendRow(row);
  console.log(`✅ Added vendor data to sheet: ${vendorData["Company Name"]}`);
}
