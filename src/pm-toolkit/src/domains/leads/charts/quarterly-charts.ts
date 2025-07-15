import { ChartPosition } from "../../../charts/positioner";
import { TableInfo } from "../../../types";
import { QUARTER_COLUMNS } from "../columns-quarters";
import { quarterlyKeys } from "../constants";
import { buildChart } from "../../../charts/build-chart";

export function addQuarterlyRevenueComparisonChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  quarterTableInfo: TableInfo
) {
  const startRow = quarterTableInfo.dataStartRow;
  const endRowInclusive = quarterTableInfo.dataEndRow;
  const startCol = quarterTableInfo.startCol;

  const labelCol =
    startCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.QUARTER);
  const revenueCol =
    startCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.REVENUE);
  const goalCol =
    startCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.REVENUE_GOAL);

  buildChart(sheet, position, {
    chartType: Charts.ChartType.COLUMN,
    title: "Quarterly Revenue vs Goal",
    ranges: [
      { startRow, endRowInclusive, startCol: labelCol, numCols: 1 },
      { startRow, endRowInclusive, startCol: revenueCol, numCols: 1 }, // Actual (first)
      { startRow, endRowInclusive, startCol: goalCol, numCols: 1 }, // Goal (second)
    ],
    options: {
      legend: { position: "bottom" },
      colors: ["#2196f3", "#4caf50"], // blue (actual), green (goal)
      series: {
        0: { labelInLegend: "Actual" },
        1: { labelInLegend: "Goal" },
      },
      annotations: {
        alwaysOutside: true,
        textStyle: { fontSize: 10, color: "black" },
      },
    },
  });
}

export function addQuarterlyConversionRateChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  quarterTableInfo: TableInfo
) {
  const startRow = quarterTableInfo.dataStartRow;
  const endRowInclusive = quarterTableInfo.dataEndRow;
  const startCol = quarterTableInfo.startCol;

  const labelCol =
    startCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.QUARTER);
  const convRateCol =
    startCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.CONVERSION_RATE);

  buildChart(sheet, position, {
    chartType: Charts.ChartType.LINE,
    title: "Quarterly Conversion Rate",
    ranges: [
      { startRow, endRowInclusive, startCol: labelCol, numCols: 1 },
      { startRow, endRowInclusive, startCol: convRateCol, numCols: 1 },
    ],
    options: {
      legend: { position: "none" },
      vAxis: { format: "percent" },
    },
  });
}
