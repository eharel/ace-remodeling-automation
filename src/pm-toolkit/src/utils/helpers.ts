import { BaseColumn } from "../columns/types";
import { MONTH_NAMES } from "../constants";

export function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  return isNaN(num) ? null : num;
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
      // Logger.log(`Named range '${rangeName}' not found on ${sheet.getName()}`);
    }
  } catch (e) {
    // Logger.log(`Error setting named range '${rangeName}': ${e}`);
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
  return denominator > 0 ? numerator / denominator : 0;
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

// 📁 src/utils/mapInputToDashboardRows.ts

export function mapInputToDashboardRows<
  TContext extends { rowData: any },
  TDashboardRow extends Record<string, unknown>
>(
  inputRows: TContext["rowData"][],
  columns: BaseColumn<TContext, keyof TDashboardRow & string, string>[]
): TDashboardRow[] {
  return inputRows.map((input) => {
    const ctx = { rowData: input } as TContext;
    const result: Partial<TDashboardRow> = {};

    for (const col of columns) {
      result[col.key] = col.valueFn(ctx);
    }

    return result as TDashboardRow;
  });
}

export function getColumnIndicesByLabels(
  headerRow: string[],
  expectedLabels: string[]
): Record<string, number> {
  const labelToIndex: Record<string, number> = {};

  for (const label of expectedLabels) {
    const idx = headerRow.indexOf(label);
    if (idx === -1) {
      throw new Error(`Missing expected column: "${label}"`);
    }
    labelToIndex[label] = idx;
  }

  return labelToIndex;
}

export function getMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1];
}

export function setNamedRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rangeName: string,
  range: GoogleAppsScript.Spreadsheet.Range
) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getRangeByName(rangeName);
  if (existing) ss.removeNamedRange(rangeName);
  ss.setNamedRange(rangeName, range);
}
