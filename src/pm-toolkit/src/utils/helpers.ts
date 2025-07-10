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

export function getNamedRange(
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>,
  key: string
): GoogleAppsScript.Spreadsheet.Range | undefined {
  return (
    namedRangeMap.get(key) ??
    [...namedRangeMap.entries()].find(
      ([name]) => name.endsWith(`__${key}`) || name.endsWith(`!${key}`)
    )?.[1]
  );
}

export function formatPercent(numerator: number, denominator: number): number {
  return denominator > 0
    ? Math.round((numerator / denominator) * 10000) / 100
    : 0;
}

export function toA1Notation(col: number, row: number): string {
  let letter = "";
  while (col > 0) {
    const mod = (col - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    col = Math.floor((col - mod) / 26);
  }
  return `${letter}${row}`;
}
