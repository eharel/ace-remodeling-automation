import {
  CLOSED_SUFFIX,
  COL_PROJECT_STATUS,
  PROJECT_STATUS_CLOSED,
  PROJECT_STATUS_SHEET_NAME,
  PROJECT_TAB_NAME_REGEX,
} from "./constants";
import { generateProjectDashboard } from "./dashboard/generate-dashboard";

export function closeProject(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const tabName = sheet.getName();
  const newName = `${tabName}${CLOSED_SUFFIX}`;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Rename the tab
  sheet.setName(newName);

  // 2. Update _ProjectStatus
  const statusSheet = getOrCreateProjectStatusSheet();
  const data = statusSheet.getDataRange().getValues();
  const projectRow = data.findIndex((row) => row[0] === tabName);

  if (projectRow !== -1) {
    statusSheet
      .getRange(projectRow + 1, COL_PROJECT_STATUS)
      .setValue(PROJECT_STATUS_CLOSED);
  } else {
    statusSheet.appendRow([tabName, PROJECT_STATUS_CLOSED]);
  }

  // 3. Hide the sheet
  sheet.hideSheet();

  generateProjectDashboard();
}

export function closeActiveProject() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const tabName = sheet.getName();

  if (/closed/i.test(tabName)) {
    SpreadsheetApp.getUi().alert(`This project is already closed.`);
    return;
  }

  if (!isProjectTab(sheet)) {
    SpreadsheetApp.getUi().alert(`This doesn’t look like a project tab.`);
    return;
  }

  closeProject(sheet);
}

export function promptProjectToClose() {
  const ui = SpreadsheetApp.getUi();
  const projectTabs = getAllOpenProjectTabs();

  if (projectTabs.length === 0) {
    ui.alert("No open project tabs found.");
    return;
  }

  const response = ui.prompt(
    "Close Project",
    "Enter the name of the tab you want to close:\n\n" + projectTabs.join("\n"),
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const tabName = response.getResponseText().trim();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);

  if (!sheet || !isProjectTab(sheet)) {
    ui.alert("Invalid tab name or not a project tab.");
    return;
  }

  closeProject(sheet);
}

export function isProjectTab(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const name = sheet.getName();
  return PROJECT_TAB_NAME_REGEX.test(name); // crude check: starts with project number
}

export function getAllOpenProjectTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss
    .getSheets()
    .filter(
      (s) =>
        isProjectTab(s) && !s.isSheetHidden() && !/closed/i.test(s.getName())
    )
    .map((s) => s.getName());
}

export function getOrCreateProjectStatusSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PROJECT_STATUS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(PROJECT_STATUS_SHEET_NAME);
    sheet.hideSheet();
    sheet.getRange("A1:B1").setValues([["Project", "Status"]]); // initial headers
  }

  return sheet;
}
