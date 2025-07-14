import { LeadsInputRow, LeadsDashboardRow, LeadsRowContext } from "./types";
import { LEADS_COLUMNS } from "./columns-months";
import { mapInputToDashboardRows } from "../../utils/helpers";

export function createMonthlyDashboardRows(
  inputRows: LeadsInputRow[]
): LeadsDashboardRow[] {
  return mapInputToDashboardRows<LeadsRowContext, LeadsDashboardRow>(
    inputRows.map((row) => ({
      inputRowData: row,
    })),
    LEADS_COLUMNS
  );
}
