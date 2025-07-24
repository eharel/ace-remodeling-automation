import { LeadsInputRow } from "../../shared/rows/types";
import { LeadsDashboardRow } from "../../shared/types";
import { createMonthlyDashboardRows } from "../../shared/data-transformation";

export function transformData(
  mapPM2InputRows: Record<string, LeadsInputRow[]>
): Record<string, LeadsDashboardRow[]> {
  // for each key in mapPM2InputRows, create a dashboard row via createMonthlyDashboardRows
  const mapPM2DashboardRows: Record<string, LeadsDashboardRow[]> = {};
  for (const [key, rows] of Object.entries(mapPM2InputRows)) {
    mapPM2DashboardRows[key] = createMonthlyDashboardRows(rows);
  }
  return mapPM2DashboardRows;
}
