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
