import { LeadsInputRow } from "../rows/types";
import { inputKeys } from "../columns";
import { getQuarterFromMonth } from "../../pm/core/utils";

export function getQuarterRowSpanMap(
  rows: Array<{ MONTH: number | undefined }>
): Record<string, number> {
  const map: Record<string, number> = {};

  for (const row of rows) {
    const month = row.MONTH;
    if (typeof month !== "number") continue;

    const quarter = getQuarterFromMonth(month);
    const key = `Q${quarter}`;
    map[key] = (map[key] ?? 0) + 1;
  }

  return map;
}
