import { extractResponse } from "@/forms/core/extract-response";
import { parseVendorResponse } from "./parse-vendor-response";
/**
 * Dumps parsed vendor form data to a scratch tab for inspection.
 */
export function handleVendorForm(e) {
    const raw = extractResponse(e);
    const parsed = parseVendorResponse(raw);
    const sheetName = "Vendor Form Dump";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName) ?? ss.insertSheet(sheetName);
    const headers = [
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
    // Format the row
    const row = headers.map((key) => {
        const value = parsed[key];
        if (Array.isArray(value))
            return value.join(", ");
        if (value instanceof Date)
            return value.toISOString().slice(0, 10); // YYYY-MM-DD
        return value ?? "";
    });
    sheet.appendRow(row);
}
