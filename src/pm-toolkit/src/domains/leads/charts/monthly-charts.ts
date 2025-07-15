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
  const numMonths = monthlyTableInfo.dataEndRow - monthlyTableInfo.dataStartRow;

  const labelCol =
    LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.MONTH) + 1;
  const revenueCol =
    LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.REVENUE) + 1;

  buildChart(sheet, position, {
    chartType: Charts.ChartType.COLUMN,
    title: "Monthly Revenue",
    ranges: [
      { startRow, startCol: labelCol, numRows: numMonths, numCols: 1 },
      { startRow, startCol: revenueCol, numRows: numMonths, numCols: 1 },
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
  const numMonths = monthlyTableInfo.dataEndRow - monthlyTableInfo.dataStartRow;
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
      { startRow, startCol: labelCol, numRows: numMonths, numCols: 1 },
      { startRow, startCol: convRateCol, numRows: numMonths, numCols: 1 },
    ],
    options: {
      legend: { position: "none" },
      vAxis: { format: "percent" },
    },
  });
}
