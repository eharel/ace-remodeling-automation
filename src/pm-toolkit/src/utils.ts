import { INACTIVE_STATUSES } from "./constants";
import { getOrCreateProjectStatusSheet } from "./close-project";

export function startsWithProjectNumber(name: string) {
  return /^\d+\s+/.test(name);
}

export function toNumber(value: string) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Utility to set a named range's value
export function setNamedValue(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rangeName: string,
  value: string
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = sheet.getName();
  const fullName = `'${sheetName}'!${rangeName}`;

  try {
    const range = ss.getRangeByName(fullName);

    if (range) {
      range.setValue(value);
    } else {
      Logger.log(`Named range '${rangeName}' not found on ${sheet.getName()}`);
    }
  } catch (e) {
    Logger.log(`Error setting named range '${rangeName}': ${e}`);
  }
}

export function getProjectStatusMap() {
  const sheet = getOrCreateProjectStatusSheet();
  const values = sheet.getDataRange().getValues();
  const map = new Map();

  for (let i = 1; i < values.length; i++) {
    const [projectName, status] = values[i];
    const projectNumber = extractProjectNumber(projectName);
    if (projectNumber) {
      map.set(projectNumber, status);
    }
  }

  return map;
}

export function extractProjectNumber(name: string) {
  const match = name.match(/^(\d{3,4})/);
  return match ? match[1] : null;
}

export function isClosedTabName(name: string) {
  const lower = name.toLowerCase();
  return INACTIVE_STATUSES.some((status) =>
    new RegExp(`\\b${status}\\b`).test(lower)
  );
}

export function logToSheet(message: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Debug") || ss.insertSheet("Debug");
  sheet.appendRow([new Date(), message]);
}
