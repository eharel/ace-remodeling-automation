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
  const quarters = quarterTableInfo.dataEndRow - quarterTableInfo.dataStartRow;
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
      { startRow, startCol: labelCol, numRows: quarters, numCols: 1 },
      { startRow, startCol: revenueCol, numRows: quarters, numCols: 1 },
      { startRow, startCol: goalCol, numRows: quarters, numCols: 1 },
    ],
    options: {
      legend: { position: "bottom" },
    },
  });
}

export function addQuarterlyConversionRateChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  quarterTableInfo: TableInfo
) {
  const startRow = quarterTableInfo.dataStartRow;
  const quarters = quarterTableInfo.dataEndRow - quarterTableInfo.dataStartRow;
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
      { startRow, startCol: labelCol, numRows: quarters, numCols: 1 },
      { startRow, startCol: convRateCol, numRows: quarters, numCols: 1 },
    ],
    options: {
      legend: { position: "none" },
      vAxis: { format: "percent" },
    },
  });
}
