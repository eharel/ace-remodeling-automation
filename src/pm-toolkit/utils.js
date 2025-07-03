function startsWithProjectNumber(name) {
  return /^\d+\s+/.test(name);
}

// Logic constant for script-based calculations
const calculateAdvanceMax = (contractPrice, changeOrders) =>
  (contractPrice + changeOrders) * (MAX_ADVANCE_PERCENTAGE / 100);

function toNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Utility to set a named range's value
function setNamedValue(sheet, rangeName, value) {
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

function getProjectNumber(sheet) {
  const name = sheet.getName();
  const match = name.trim().match(/^(\d+)\s+/);
  return match ? match[1] : "N/A";
}

function getClientName(sheet) {
  const name = sheet.getName();
  const match = name.trim().match(/^\d+\s+(.*)$/);
  return match ? match[1] : "N/A";
}

function getProjectStatusMap() {
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

function extractProjectNumber(name) {
  const match = name.match(/^(\d{3,4})/);
  return match ? match[1] : null;
}

function isClosedTabName(name) {
  const lower = name.toLowerCase();
  return INACTIVE_STATUSES.some(status => new RegExp(`\\b${status}\\b`).test(lower));
}

function logToSheet(message) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Debug") || ss.insertSheet("Debug");
  sheet.appendRow([new Date(), message]);
}