import { extractResponse } from "../../../forms/core/extract-response";
import { parseVendorResponse } from "./parse-vendor-response";
import { Vendor } from "../types";

// Vendor sheet configuration
const VENDOR_SHEET_ID = "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0"; // Copy for testing
const VENDOR_SHEET_NAME = "Vendor Form Responses";

/**
 * Handles vendor form submissions
 */
export function handleVendorForm(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  console.log("🛠️ Processing vendor form submission...");
  // Add an alert here to see that the function is being called

  try {
    // Write a simple test log
    writeTestLog("Form submission received");

    // Extract the raw form response
    const raw = extractResponse(e);
    writeTestLog("Raw keys:\n" + Object.keys(raw).join("\n"));
    console.log("📋 Raw form data extracted");
    writeTestLog("Raw form data extracted");

    // Parse the vendor-specific response
    const parsed = parseVendorResponse(raw);
    console.log("✅ Vendor data parsed successfully");
    writeTestLog("Vendor data parsed successfully");

    // Log the actual parsed object for inspection
    writeTestLog("Parsed data:\n" + JSON.stringify(parsed, null, 2));

    // Save to Google Sheets
    saveVendorDataToSheet(parsed);
    console.log("📊 Vendor data saved to Google Sheets");
    writeTestLog("Vendor data saved to Google Sheets");

    console.log("🎉 Vendor form processed successfully");
    writeTestLog("Form processing completed successfully");
    return parsed;
  } catch (error) {
    console.error("❌ Error processing vendor form:", error);
    writeTestLog(
      `ERROR: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}

/**
 * Saves vendor data to the Google Sheet
 */
function saveVendorDataToSheet(vendorData: Vendor) {
  const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
  const sheet =
    spreadsheet.getSheetByName(VENDOR_SHEET_NAME) ||
    spreadsheet.insertSheet(VENDOR_SHEET_NAME);

  // Define headers based on the VendorFormResponse type
  const headers: (keyof Vendor)[] = [
    "companyName",
    "tradeType",
    "contactName",
    "phone",
    "email",
    "website",
    "bio",
    "materials",
    "certifications",
    "submittedAt",
    "uploads",
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
  console.log(`✅ Added vendor data to sheet: ${vendorData.companyName}`);
}

/**
 * Writes a simple test log entry to a "Test Log" tab
 */
function writeTestLog(message: string) {
  try {
    const spreadsheet = SpreadsheetApp.openById(VENDOR_SHEET_ID);
    let testLogSheet = spreadsheet.getSheetByName("Test Log");

    // Create the sheet if it doesn't exist
    if (!testLogSheet) {
      testLogSheet = spreadsheet.insertSheet("Test Log");
      testLogSheet.appendRow(["Timestamp", "Message"]);
    }

    // Add timestamp and message
    const timestamp = new Date().toISOString();
    testLogSheet.appendRow([timestamp, message]);

    console.log(`📝 Test Log: ${message}`);
  } catch (error) {
    console.error("❌ Error writing test log:", error);
  }
}
