import { ChartPosition } from "../../../charts/positioner";
import { TableInfo } from "../../../types";
import { LEADS_COLUMNS } from "../columns-months";
import { dashboardKeys, inputKeys } from "../constants";
import { buildChart } from "../../../charts/build-chart";

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
      legend: { position: "none" },
      vAxis: { format: "percent" },
    },
  });
}
