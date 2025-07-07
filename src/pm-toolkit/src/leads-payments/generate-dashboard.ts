import { LEADS_PAYMENTS_SHEET_NAME } from "../constants/general";

export function generateLeadsPaymentsDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LEADS_PAYMENTS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(LEADS_PAYMENTS_SHEET_NAME);
  } else {
    sheet.clear(); // clear contents if it exists
  }

  // Write placeholder content
  sheet.getRange("A1").setValue("Leads/Payments Dashboard");
  sheet.getRange("A2").setValue("Coming soon...");

  // Optional styling
  sheet.getRange("A1").setFontSize(14).setFontWeight("bold");
}
