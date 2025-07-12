// 📁 src/domains/leads/data-months.ts
import { LeadsInputRow, LeadsDashboardRow } from "./types";
import { LEADS_COLUMNS } from "./columns-months";
import { mapInputToDashboardRows } from "../../utils/helpers";

export function createMonthlyDashboardRows(
  inputRows: LeadsInputRow[]
): LeadsDashboardRow[] {
  return mapInputToDashboardRows<{ rowData: LeadsInputRow }, LeadsDashboardRow>(
    inputRows,
    LEADS_COLUMNS
  );
}
