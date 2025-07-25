import { LeadsInputRow } from "../rows/types";
import { inputKeys } from "../columns";
import { getQuarterFromMonth } from "../../pm/core/utils";

export function getQuarterRowSpanMap(
  monthlyRows: LeadsInputRow[]
): Record<string, number> {
  const map: Record<string, number> = {};

  for (const row of monthlyRows) {
    const month = Number(row[inputKeys.MONTH]);
    const quarter = getQuarterFromMonth(month);
    const key = `Q${quarter}`;
    map[key] = (map[key] ?? 0) + 1;
  }

  return map;
}
