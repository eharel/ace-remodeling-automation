import { getColumnIndicesByLabels } from "../../utils/helpers";
import { LeadsInputRow } from "./types";
import { NR_LEADS_INPUT_TABLE } from "./constants";
import { LEADS_KEYS, LEADS_LABELS } from "./constants";

export function extractLeadsData(): LeadsInputRow[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = ss.getRangeByName(NR_LEADS_INPUT_TABLE);
  const values = range?.getValues() ?? [];

  const [headerRow, ...dataRows] = values;
  if (!headerRow) return [];

  const normalizedHeader = headerRow.map((label) => label.trim());
  const columnIndexByLabel = getColumnIndicesByLabels(normalizedHeader, [
    LEADS_LABELS.YEAR,
    LEADS_LABELS.MONTH,
    LEADS_LABELS.TOTAL_LEADS,
    LEADS_LABELS.SIGNED,
    LEADS_LABELS.REVENUE,
  ]);

  return dataRows
    .filter((row) => row[columnIndexByLabel[LEADS_LABELS.YEAR]] !== "")
    .map((row) => ({
      [LEADS_KEYS.YEAR]: Number(row[columnIndexByLabel[LEADS_LABELS.YEAR]]),
      [LEADS_KEYS.MONTH]: Number(row[columnIndexByLabel[LEADS_LABELS.MONTH]]),
      [LEADS_KEYS.TOTAL_LEADS]:
        Number(row[columnIndexByLabel[LEADS_LABELS.TOTAL_LEADS]]) || 0,
      [LEADS_KEYS.SIGNED]:
        Number(row[columnIndexByLabel[LEADS_LABELS.SIGNED]]) || 0,
      [LEADS_KEYS.REVENUE]:
        Number(row[columnIndexByLabel[LEADS_LABELS.REVENUE]]) || 0,
      [LEADS_KEYS.PROP_NOT_SENT]:
        Number(row[columnIndexByLabel[LEADS_LABELS.PROP_NOT_SENT]]) || 0,
    }));
}

export function extractMonthlyRevenueGoalsFromNamedRange(
  namedRangeName: string
): Map<string, number> {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = ss.getRangeByName(namedRangeName);
  if (!range) throw new Error(`Named range "${namedRangeName}" not found`);

  const sheet = range.getSheet();
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();
  if (numRows < 2) return new Map(); // must have at least header + one data row

  const [headers, ...rows] = range.getValues();

  const monthColIdx = headers.findIndex((val) => val === LEADS_LABELS.MONTH);
  const goalColIdx = headers.findIndex(
    (val) => val === LEADS_LABELS.REVENUE_GOAL
  );

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
