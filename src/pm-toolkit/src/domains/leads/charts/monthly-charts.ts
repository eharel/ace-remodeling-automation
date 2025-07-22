import { ChartPosition } from "@pm/charts/positioner";
import { TableInfo } from "@shared/styles";
import { LEADS_COLUMNS } from "@pm/domains/leads/columns/columns-months";
import { dashboardKeys, inputKeys } from "@pm/domains/leads/core/constants";
import { buildChart } from "@pm/charts/build-chart";
import { CHART_COLORS } from "@pm/domains/leads/styles/colors";

export function addMonthlyRevenueChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  monthlyTableInfo: TableInfo
) {
  const startRow = monthlyTableInfo.dataStartRow;
  const endRowInclusive = monthlyTableInfo.dataEndRow;

  const labelCol =
    LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.MONTH) + 1;
  const revenueCol =
    LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.REVENUE) + 1;

  buildChart(sheet, position, {
    chartType: Charts.ChartType.COLUMN,
    title: "Monthly Revenue",
    ranges: [
      { startRow, endRowInclusive, startCol: labelCol, numCols: 1 },
      { startRow, endRowInclusive, startCol: revenueCol, numCols: 1 },
    ],
    options: {
      legend: { position: "none" },
      vAxis: { format: "$#,###" },
      colors: [CHART_COLORS.ACTUAL],
      annotations: {
        alwaysOutside: true,
        textStyle: { fontSize: 10, color: "#333" },
      },
      tooltip: {
        trigger: "focus",
        textStyle: { fontSize: 12 },
      },
    },
  });
}

export function addMonthlyConversionRateChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  monthlyTableInfo: TableInfo
) {
  const startRow = monthlyTableInfo.dataStartRow;
  const endRowInclusive = monthlyTableInfo.dataEndRow;
  const startCol = monthlyTableInfo.startCol;

  const labelCol =
    startCol + LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.MONTH);
  const convRateCol =
    startCol +
    LEADS_COLUMNS.findIndex((c) => c.key === dashboardKeys.CONVERSION_RATE);

  buildChart(sheet, position, {
    chartType: Charts.ChartType.LINE,
    title: "Monthly Conversion Rate",
    ranges: [
      { startRow, endRowInclusive, startCol: labelCol, numCols: 1 },
      { startRow, endRowInclusive, startCol: convRateCol, numCols: 1 },
    ],
    options: {
      legend: { position: "bottom" },
      colors: [CHART_COLORS.ACTUAL],
      vAxis: { format: "percent", minValue: 0 },
      annotations: {
        textStyle: { fontSize: 10, color: "#333" },
      },
      tooltip: {
        trigger: "focus",
        textStyle: { fontSize: 12 },
      },
    },
  });
}
