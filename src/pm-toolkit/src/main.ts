import { buildMainMenu } from "./menu/main-menu";
import { generateProjectDashboard } from "./projects/dashboard";
import { startsWithProjectNumber } from "./projects/utils";
import { PROJECT_DASHBOARD_SHEET_NAME } from "./constants";

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = buildMainMenu(ui);
  menu.addToUi();
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  if (sheetName === PROJECT_DASHBOARD_SHEET_NAME) return;

  if (startsWithProjectNumber(sheetName)) {
    generateProjectDashboard();
  }
}
