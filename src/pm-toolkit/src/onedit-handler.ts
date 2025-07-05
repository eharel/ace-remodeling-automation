import { PROJECT_DASHBOARD_SHEET_NAME } from "./constants";
import { generateProjectDashboard } from "./dashboard/generate-dashboard";
import { startsWithProjectNumber } from "./utils";

declare global {
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  if (sheetName === PROJECT_DASHBOARD_SHEET_NAME) return;

  if (startsWithProjectNumber(sheetName)) {
    generateProjectDashboard();
  }
}

// 👇 Export globally for Apps Script triggers
globalThis.onEdit = onEdit;
