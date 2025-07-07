export function toNumber(value: string) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

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

export function logToSheet(message: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Debug") || ss.insertSheet("Debug");
  sheet.appendRow([new Date(), message]);
}
