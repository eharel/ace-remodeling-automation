import { extractTableData } from "@tables/reader";
import { LeadsInputRow } from "../../shared/rows/types";
import { INPUT_SHEET, NR_MONTHLY_GOALS } from "../core/constants";
import { inputKeys } from "../../shared/columns";
import { dashboardLabels, inputLabels } from "../../shared/columns/labels";

// 🔠 Extract InputKey union from keys
type InputKey = keyof typeof inputKeys;
const BLANKABLE_KEYS = new Set<InputKey>([inputKeys.REVENUE_GOAL]);

export function extractLeadsData(): LeadsInputRow[] {
  return extractTableData<LeadsInputRow>({
    sheetName: INPUT_SHEET,
    labelMap: inputLabels,
    blankableKeys: BLANKABLE_KEYS,
    rowFilter: (row) => {
      const year = row[Object.values(inputLabels).indexOf(inputLabels.YEAR)];
      return typeof year === "number" || !isNaN(Number(year));
    },
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

  const monthColIdx = headers.findIndex((val) => val === inputLabels.MONTH);
  const goalColIdx = headers.findIndex(
    (val) => val === inputLabels.REVENUE_GOAL
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
