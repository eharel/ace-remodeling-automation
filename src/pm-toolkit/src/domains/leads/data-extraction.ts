import { getColumnIndicesByLabels } from "../../utils/helpers";
import { LeadsInputRow } from "./types";
import { inputKeys, labels, INPUT_SHEET, NR_MONTHLY_GOALS } from "./constants";

// 🔠 Extract InputKey union from keys
type InputKey = keyof typeof inputKeys;

export function extractLeadsData(): LeadsInputRow[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(INPUT_SHEET);
  if (!sheet) throw new Error(`Sheet "${INPUT_SHEET}" not found`);

  const values = sheet.getDataRange().getValues();
  const [headerRow, ...dataRows] = values;
  if (!headerRow) return [];

  const normalizedHeader = headerRow.map((label) => String(label).trim());

  // Build label → column index map
  const columnIndexByLabel: Record<string, number> = {};
  normalizedHeader.forEach((label, idx) => {
    columnIndexByLabel[label] = idx;
  });

  // 🔐 Strictly verify all required columns are present
  const keys = Object.keys(inputKeys) as InputKey[];
  for (const key of keys) {
    const label = labels[key];
    if (!(label in columnIndexByLabel)) {
      throw new Error(
        `❌ Missing column "${label}" (for key "${inputKeys[key]}") in sheet "${INPUT_SHEET}"`
      );
    }
  }

  // ✅ Build typed input rows
  return dataRows
    .filter((row) => {
      const yearIdx = columnIndexByLabel[labels.YEAR];
      const value = row[yearIdx];
      return typeof value === "number" || !isNaN(Number(value));
    })
    .map((row) => {
      const result: Partial<LeadsInputRow> = {};

      for (const key of keys) {
        const label = labels[key];
        const colIndex = columnIndexByLabel[label];
        const raw = row[colIndex];
        result[key] = typeof raw === "number" ? raw : Number(raw) || 0;
      }

      return result as LeadsInputRow;
    });
}

export function extractMonthlyRevenueGoalsFromNamedRange(
  namedRangeName: string = NR_MONTHLY_GOALS
): Map<string, number> {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = ss.getRangeByName(namedRangeName);
  if (!range) throw new Error(`Named range "${namedRangeName}" not found`);

  const [headers, ...rows] = range.getValues();
  if (!headers || headers.length === 0) return new Map();

  const monthColIdx = headers.findIndex((val) => val === labels.MONTH);
  const goalColIdx = headers.findIndex((val) => val === labels.REVENUE_GOAL);

  if (monthColIdx === -1 || goalColIdx === -1) return new Map();

  const goals = new Map<string, number>();
  for (const row of rows) {
    const month = String(row[monthColIdx]);
    const goal = row[goalColIdx];
    if (month && typeof goal === "number" && !isNaN(goal)) {
      goals.set(month, goal);
    }
  }

  return goals;
}
