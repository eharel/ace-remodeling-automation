import { PAYMENTS_INPUT_SHEET, PAYMENTS_INPUT_TABLE_ANCHOR } from "./constants";
import { PaymentEntry } from "./types";

export function extractPaymentsFromTable(): PaymentEntry[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(PAYMENTS_INPUT_SHEET);
  if (!sheet) throw new Error(`Sheet '${PAYMENTS_INPUT_SHEET}' not found`);

  const tableRange = sheet
    .getRange(PAYMENTS_INPUT_TABLE_ANCHOR)
    .getDataRegion(SpreadsheetApp.Dimension.ROWS);
  const values = tableRange.getValues();
  const [headerRow, ...dataRows] = values;

  // Build column name → index map
  const colIndexMap = new Map<string, number>();
  headerRow.forEach((name, i) => {
    colIndexMap.set(String(name).trim().toLowerCase(), i);
  });

  const get = (row: any[], name: string) =>
    row[colIndexMap.get(name.toLowerCase()) ?? -1];

  return dataRows
    .filter(
      (row) => get(row, "Date") instanceof Date && !isNaN(get(row, "Amount"))
    )
    .map((row) => ({
      date: get(row, "Date") as Date,
      amount: Number(get(row, "Amount")),
      transaction: String(get(row, "Transaction")),
    }));
}
