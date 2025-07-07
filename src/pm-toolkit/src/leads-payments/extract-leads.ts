import { LeadsInputRow } from "./types";
import { NR_LEADS_INPUT_TABLE } from "./constants";

export function extractLeadsData(): LeadsInputRow[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = ss.getRangeByName(NR_LEADS_INPUT_TABLE);
  const values = range?.getValues() ?? [];

  // Remove empty rows and skip header
  return values
    .slice(1) // skip header
    .filter((row) => row[0] !== "") // year must be present
    .map((row) => {
      const totalLeads = Number(row[2]) || 0;
      const signedProposals = Number(row[3]) || 0;

      return {
        year: Number(row[0]),
        month: Number(row[1]),
        totalLeads,
        signedProposals,
        approvedRevenue: Number(row[4]) || 0,
        conversionRate: totalLeads > 0 ? signedProposals / totalLeads : 0,
      };
    });
}
