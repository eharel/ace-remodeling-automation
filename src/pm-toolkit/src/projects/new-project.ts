import {
  NR_PM_NAME,
  NR_PROJECT_NUMBER,
  NR_CLIENT_NAME,
  NR_DATE_START,
  TEMPLATE_PROJECT_TAB_NAME,
  NR_ADVANCE_MAX,
  ADVANCE_MAX_FORMULA,
} from "../constants";
import { TEMPLATE_SPREADSHEET_ID } from "../constants";
import { setNamedValue } from "../utils";

export function promptForNewProject() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Add New Project",
    "Enter the new project tab name (e.g., '999 Joe'):",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const input = response.getResponseText().trim();
  if (!input) return;

  const match = input.match(/^(\d+)\s*[-\s]\s*(.+)$/);

  if (!match) {
    ui.alert(
      "Please start with a project number followed by a client name. E.g., '123 John Doe'"
    );
    return;
  }

  const projectNumber = match[1].trim();
  const clientName = match[2].trim();

  if (!projectNumber || !clientName) {
    ui.alert("Please provide both a project number and a client name.");
    return;
  }

  const tabName = `${projectNumber} ${clientName}`;
  createProjectTabFromTemplate(tabName, projectNumber, clientName);
}

export function createProjectTabFromTemplate(
  tabName: string,
  projectNumber: string,
  clientName: string
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const templateFile = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const templateSheet = templateFile.getSheetByName(TEMPLATE_PROJECT_TAB_NAME);
  const newSheet = templateSheet?.copyTo(ss).setName(tabName) || null;

  if (!newSheet) {
    Logger.log(`🚨 Error creating new sheet: ${tabName}`);
    return;
  }

  // Auto-fill header cells
  const todayDate = Utilities.formatDate(
    new Date(),
    ss.getSpreadsheetTimeZone(),
    "yyyy-MM-dd"
  );
  const ssName = SpreadsheetApp.getActiveSpreadsheet().getName().trim();

  setNamedValue(newSheet!, NR_PM_NAME, ssName);
  setNamedValue(newSheet!, NR_PROJECT_NUMBER, projectNumber);
  setNamedValue(newSheet!, NR_CLIENT_NAME, clientName);
  setNamedValue(newSheet!, NR_DATE_START, todayDate);

  // Inject formula into named range 'advance_max'
  try {
    const advanceMaxRange = ss.getRangeByName(`${tabName}!${NR_ADVANCE_MAX}`);
    if (advanceMaxRange) {
      advanceMaxRange.setFormula(ADVANCE_MAX_FORMULA);
    } else {
      Logger.log(
        `⚠️ Named range '${NR_ADVANCE_MAX}' not found in '${tabName}'`
      );
    }
  } catch (err) {
    Logger.log(`🚨 Error setting formula in '${NR_ADVANCE_MAX}': ${err}`);
  }

  ss.setActiveSheet(newSheet!);
}
