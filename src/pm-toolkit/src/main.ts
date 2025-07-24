import { buildMainMenu } from "./menu";
import { buildExecutiveMenu } from "./menu";
import { generateProjectDashboard } from "./domains/projects/dashboard";
import { generateLeadsDashboard } from "./domains/leads";
import { startsWithProjectNumber } from "./domains/projects/utils";
import { PROJECT_DASHBOARD_SHEET_NAME } from "./constants";
import { INPUT_SHEET } from "./domains/leads/pm/core/constants";
import { createDebouncedOperation } from "../../utils/debounce";
import { FILE_IDS } from "./constants/general";

// Create debounced dashboard updaters
const leadsDashboardUpdater = createDebouncedOperation({
  keyPrefix: "leadsDashboard",
  operation: () => generateLeadsDashboard(false), // Don't show toast from generator
  operationName: "Leads Dashboard",
  showToasts: true,
  scheduledToastDuration: 3,
  completedToastDuration: 3,
});

const projectDashboardUpdater = createDebouncedOperation({
  keyPrefix: "projectDashboard",
  operation: () => generateProjectDashboard(false), // Don't show toast from generator
  operationName: "Project Dashboard",
  showToasts: true,
  scheduledToastDuration: 3,
  completedToastDuration: 3,
});

export function onOpen() {
  Logger.log("🚀 onOpen triggered");

  const ui = SpreadsheetApp.getUi();
  const fileId = SpreadsheetApp.getActiveSpreadsheet().getId();
  Logger.log(`📄 File ID: ${fileId}`);

  if (fileId === FILE_IDS.EXECUTIVE_FILE) {
    Logger.log("🧠 Loading Executive menu");
    buildExecutiveMenu(ui);
  } else {
    Logger.log("🛠️ Loading PM menu");
    buildMainMenu(ui).addToUi();
  }
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();
  const range = e.range;
  const value = range.getValue();

  if (sheetName === PROJECT_DASHBOARD_SHEET_NAME) return;

  if (startsWithProjectNumber(sheetName)) {
    // Use the debounced project dashboard updater
    projectDashboardUpdater.trigger();
  }

  if (sheetName === INPUT_SHEET) {
    // Use the debounced leads dashboard updater
    leadsDashboardUpdater.trigger();
  }
}
