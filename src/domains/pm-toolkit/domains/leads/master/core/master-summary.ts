import { dashboardKeys } from "../../shared/columns";
import { PMDashboardData } from "./data-transformation";
import { LeadsDashboardRow } from "../../shared/types";
import { LEADS_COLUMNS } from "../../shared/columns";
import { formatSummaryValue } from "@tables/builder";

/**
 * Creates a summary row across all PM dashboards for a given year.
 */
export function createMasterSummary(
  dashboardRowsByPM: Record<string, PMDashboardData>,
  year: number
): LeadsDashboardRow {
  const allMonthlyRows = Object.values(dashboardRowsByPM).flatMap(
    ({ monthly }) => monthly
  );

  const totals = {
    leads: 0,
    signed: 0,
    revenue: 0,
    goal: 0,
    weightedNumerator: 0,
    weightedDenominator: 0,
    propNotSent: 0,
  };

  for (const row of allMonthlyRows) {
    const leads = Number(row[dashboardKeys.TOTAL_LEADS] ?? 0);
    const signed = Number(row[dashboardKeys.SIGNED] ?? 0);
    const revenue = Number(row[dashboardKeys.REVENUE] ?? 0);
    const conversion = Number(row[dashboardKeys.CONVERSION_RATE] ?? 0);
    const goal = Number(row[dashboardKeys.REVENUE_GOAL] ?? 0);
    const propNotSent = Number(row[dashboardKeys.PROP_NOT_SENT] ?? 0);

    totals.leads += leads;
    totals.signed += signed;
    totals.revenue += revenue;
    totals.goal += goal;
    totals.propNotSent += propNotSent;

    if (!isNaN(conversion) && leads > 0) {
      totals.weightedNumerator += conversion * leads;
      totals.weightedDenominator += leads;
    }
  }

  const weightedAvgConversion =
    totals.weightedDenominator > 0
      ? totals.weightedNumerator / totals.weightedDenominator
      : 0;

  return {
    [dashboardKeys.MONTH]: "",
    [dashboardKeys.TOTAL_LEADS]: totals.leads,
    [dashboardKeys.SIGNED]: totals.signed,
    [dashboardKeys.CONVERSION_RATE]: weightedAvgConversion,
    [dashboardKeys.REVENUE]: formatSummaryValue(totals.revenue, "currency", 2),
    [dashboardKeys.REVENUE_GOAL]:
      totals.goal > 0 ? formatSummaryValue(totals.goal, "currency", 2) : "",
    [dashboardKeys.REVENUE_DIFF]:
      totals.goal > 0
        ? formatSummaryValue(totals.revenue - totals.goal, "currency", 2)
        : "",
    [dashboardKeys.PROP_NOT_SENT]:
      totals.propNotSent > 0 ? totals.propNotSent : "",
    [dashboardKeys.YEAR]: year,
  };
}

/**
 * Helper to retrieve format and decimals from the LEADS_COLUMNS definition.
 */
function getFormatConfig(key: string): {
  format: "currency" | "percent" | "number";
  decimals: number;
} {
  const col = LEADS_COLUMNS.find((col) => col.key === key);
  return {
    format:
      col?.format === "currency" ||
      col?.format === "percent" ||
      col?.format === "number"
        ? col.format
        : "number",
    decimals:
      col?.formatDecimals ??
      (col?.format === "currency" || col?.format === "percent" ? 2 : 0),
  };
}
