import { TableInfo } from "../../types";
import { setNamedRange } from "../../utils/helpers";
import { LeadsColumn } from "./types";
import { labels, NR_MONTHLY_GOALS, NR_MONTHLY_TABLE } from "./constants";

// 🔑 Helper
export function toMonthlyGoalKey(year: number, month: number): string {
  return `${year}-${month.toString().padStart(2, "0")}`;
}

// 🔎 Shared helper
function findColumnIndices(
  headers: unknown[],
  labels: Partial<Record<"year" | "month" | "goal", string>>
) {
  return {
    yearIdx: headers.findIndex((val) => val === labels.year),
    monthIdx: headers.findIndex((val) => val === labels.month),
    goalIdx: headers.findIndex((val) => val === labels.goal),
  };
}

// 📥 READ
export function extractMonthlyRevenueGoalsFromNamedRange(): Map<
  string,
  number
> {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = ss.getRangeByName(NR_MONTHLY_GOALS);
  if (!range) throw new Error(`Named range "${NR_MONTHLY_GOALS}" not found`);

  const [headers, ...rows] = range.getValues();
  const { yearIdx, monthIdx, goalIdx } = findColumnIndices(headers, {
    year: labels.YEAR,
    month: labels.MONTH,
    goal: labels.REVENUE_GOAL,
  });

  if (yearIdx === -1 || monthIdx === -1 || goalIdx === -1) return new Map();

  const goals = new Map<string, number>();

  for (const row of rows) {
    const year = row[yearIdx];
    const month = row[monthIdx];
    const goal = row[goalIdx];

    if (year && month && typeof goal === "number" && !isNaN(goal)) {
      const key = toMonthlyGoalKey(year, month);
      goals.set(key, goal);
    }
  }

  return goals;
}

// 📝 WRITE
export function saveMonthlyRevenueGoalsNamedRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfo: TableInfo,
  columns: LeadsColumn[]
) {
  const goalColOffset = columns.findIndex((col) => col.key === "REVENUE_GOAL");

  if (goalColOffset === -1)
    throw new Error("Revenue Goal column not found in columns");

  const goalRange = sheet.getRange(
    tableInfo.dataStartRow - 1, // include header
    tableInfo.startCol + goalColOffset,
    tableInfo.dataEndRow - tableInfo.dataStartRow + 2, // +1 to include header
    1
  );

  setNamedRange(sheet, NR_MONTHLY_GOALS, goalRange);
}

export function extractExistingRevenueGoals(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): Map<string, number> {
  const goals = new Map<string, number>();
  const headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];

  const yearColIdx = headers.findIndex((val) => val === labels.YEAR);
  const monthColIdx = headers.findIndex((val) => val === labels.MONTH);
  const goalColIdx = headers.findIndex((val) => val === labels.REVENUE_GOAL);

  if (yearColIdx === -1 || monthColIdx === -1 || goalColIdx === -1)
    return goals;

  const dataRange = sheet.getRange(
    3,
    1,
    sheet.getLastRow() - 2,
    sheet.getLastColumn()
  );
  const values = dataRange.getValues();

  for (const row of values) {
    const year = row[yearColIdx];
    const month = row[monthColIdx];
    const goal = row[goalColIdx];

    if (year && month && typeof goal === "number" && !isNaN(goal)) {
      goals.set(`${year}-${month}`, goal);
    }
  }

  return goals;
}
