import { LeadsInputRow } from "../../shared/rows/types";
import { LeadsDashboardRow } from "../../shared/types";
import { createMonthlyDashboardRows } from "../../shared/data-transformation";
import { createQuarterlyDashboardRows } from "../../shared/data-transformation";
import { getQuarterRowSpanMap } from "../../shared/dashboard/utils";
import { QuarterDashboardRow } from "../../shared/rows/types";

export type PMDashboardData = {
  monthly: LeadsDashboardRow[];
  quarterly: QuarterDashboardRow[];
  rowSpanMap: Record<string, number>;
};

export function transformData(
  inputRowsByPM: Record<string, LeadsInputRow[]>,
  year: number
): Record<string, PMDashboardData> {
  const result: Record<string, PMDashboardData> = {};

  for (const [pm, inputRows] of Object.entries(inputRowsByPM)) {
    const monthly = createMonthlyDashboardRows(inputRows);
    const quarterly = createQuarterlyDashboardRows(inputRows, year);
    const rowSpanMap = getQuarterRowSpanMap(inputRows);

    result[pm] = { monthly, quarterly, rowSpanMap };
  }

  return result;
}
