import {
  LeadsInputRow,
  LeadsDashboardRow,
  LeadsRowContext,
  QuarterDashboardRow,
} from "./types";
import { LEADS_COLUMNS } from "./columns-months";
import { QUARTER_COLUMNS } from "./columns-quarters";
import { mapInputToDashboardRows } from "../../utils/helpers";
import { inputKeys, QuarterlyKey, quarterlyKeys } from "./constants";
import { getQuarterFromMonth } from "./utils";

/**
 * Creates monthly dashboard rows from input data
 */
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

/**
 * Sums a specific key across multiple input rows
 */
export function sum<T>(rows: T[], key: keyof T): number {
  return rows.reduce((acc, row) => {
    const val = row[key];
    return typeof val === "number" ? acc + val : acc;
  }, 0);
}

/**
 * Creates quarterly dashboard rows from input data
 */
export function createQuarterlyDashboardRows(
  inputRows: LeadsInputRow[],
  year: number
): QuarterDashboardRow[] {
  type QuarterKey = `${number}-Q${number}`;
  const grouped = new Map<QuarterKey, LeadsInputRow[]>();

  for (const row of inputRows) {
    const quarter = getQuarterFromMonth(Number(row[inputKeys.MONTH]));
    const key = `${year}-Q${quarter}` as QuarterKey;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  const unsortedRows = Array.from(grouped.entries()).map(([key, group]) => {
    const [yearStr, qStr] = key.split("-Q");
    const year = Number(yearStr);
    const quarter = `Q${qStr}`;

    const totalLeads = sum(group, inputKeys.TOTAL_LEADS);
    const signed = sum(group, inputKeys.SIGNED);
    const conversionRate = totalLeads > 0 ? signed / totalLeads : 0;
    const revenue = sum(group, inputKeys.REVENUE);

    // Only include defined goals
    const definedGoals = group
      .map((row) => row[inputKeys.REVENUE_GOAL])
      .filter((val): val is number => typeof val === "number");

    const goal =
      definedGoals.length > 0
        ? definedGoals.reduce((a, b) => a + b, 0)
        : undefined;
    const diff = typeof goal === "number" ? goal - revenue : undefined;

    const fullRow: Partial<Record<QuarterlyKey, string | number>> = {
      [quarterlyKeys.YEAR]: year,
      [quarterlyKeys.QUARTER]: quarter,
      [quarterlyKeys.TOTAL_LEADS]: totalLeads,
      [quarterlyKeys.SIGNED]: signed,
      [quarterlyKeys.REVENUE]: revenue,
      [quarterlyKeys.CONVERSION_RATE]: conversionRate,
      [quarterlyKeys.REVENUE_GOAL]: goal ?? "",
      [quarterlyKeys.REVENUE_DIFF]: diff ?? "",
    };

    const filtered = Object.fromEntries(
      QUARTER_COLUMNS.map((col) => [col.key, fullRow[col.key]])
    );

    return { ...filtered, quarter } as QuarterDashboardRow;
  });

  return unsortedRows.sort((a, b) => {
    const yA = Number(a[quarterlyKeys.YEAR]);
    const yB = Number(b[quarterlyKeys.YEAR]);
    if (yA !== yB) return yA - yB;

    const qA = Number(String(a[quarterlyKeys.QUARTER]).slice(1));
    const qB = Number(String(b[quarterlyKeys.QUARTER]).slice(1));
    return qA - qB;
  });
}
