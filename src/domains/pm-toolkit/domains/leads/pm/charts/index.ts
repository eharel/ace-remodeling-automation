import { TableInfo } from "@shared/styles";
import { clearExistingCharts } from "../../../../charts";
import {
  addMonthlyConversionRateChart,
  addMonthlyRevenueChart,
} from "./monthly-charts";
import {
  addQuarterlyRevenueComparisonChart,
  addQuarterlyRevenuePieChart,
} from "./quarterly-charts";
import {
  generateGridLayoutCharts,
  generateStackedLayoutCharts,
  STACKED_LAYOUT,
} from "./layouts";
import type { ChartLayoutConfig } from "../../../../charts";
import type { ChartFunction } from "./types";

// -----------------------------
// 🎯 Choose layout here
// -----------------------------
const CHART_LAYOUT: ChartLayoutConfig = STACKED_LAYOUT;

// -----------------------------
// 📊 Group chart functions
// -----------------------------
export const monthlyCharts: ChartFunction[] = [
  addMonthlyRevenueChart,
  addMonthlyConversionRateChart,
];

export const quarterlyCharts: ChartFunction[] = [
  addQuarterlyRevenueComparisonChart,
  addQuarterlyRevenuePieChart,
];

// -----------------------------
// 🚀 Main chart generation
// -----------------------------
export function generateCharts(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  monthlyTableInfo: TableInfo,
  quarterlyTableInfo: TableInfo
): void {
  clearExistingCharts(sheet);

  switch (CHART_LAYOUT.layoutType) {
    case "grid":
      generateGridLayoutCharts(
        sheet,
        [...monthlyCharts, ...quarterlyCharts],
        monthlyTableInfo,
        quarterlyTableInfo,
        CHART_LAYOUT
      );
      break;

    case "stacked":
      generateStackedLayoutCharts(
        sheet,
        monthlyCharts,
        quarterlyCharts,
        monthlyTableInfo,
        quarterlyTableInfo,
        CHART_LAYOUT
      );
      break;

    default:
      throw new Error(`Unknown chart layout type: ${CHART_LAYOUT.layoutType}`);
  }
}

// -----------------------------
// 📐 Utility
// -----------------------------
export function getCenteredStartCol(
  tableStartCol: number,
  tableEndCol: number,
  chartWidthPx: number,
  avgColumnWidthPx = 120
): number {
  const tableWidthCols = tableEndCol - tableStartCol + 1;
  const tableWidthPx = tableWidthCols * avgColumnWidthPx;
  const offsetPx = Math.max((tableWidthPx - chartWidthPx) / 2, 0);
  const offsetCols = Math.round(offsetPx / avgColumnWidthPx);
  return tableStartCol + offsetCols;
}
