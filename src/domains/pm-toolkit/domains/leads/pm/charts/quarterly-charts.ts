import { ChartPosition } from "../../../../charts/positioner";
import { TableInfo } from "@shared/styles";
import { buildChart } from "../../../../charts/build-chart";
import { ChartFunction } from "./types";
import { QUARTER_COLUMNS } from "../../shared/columns";
import { quarterlyKeys } from "../../shared/columns";
import { CHART_COLORS, QUARTER_COLORS } from "../../shared/styles";

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
      colors: [CHART_COLORS.ACTUAL, CHART_COLORS.GOAL],
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
      colors: [CHART_COLORS.CONVERSION],
    },
  });
}

export const addQuarterlyRevenuePieChart: ChartFunction = (
  sheet,
  position,
  _monthlyInfo,
  quarterlyInfo
) => {
  const { dataStartRow, dataEndRow, startCol, endCol } = quarterlyInfo;

  // Get static column positions from QUARTER_COLUMNS
  const quarterColOffset = QUARTER_COLUMNS.findIndex(
    (c) => c.key === quarterlyKeys.QUARTER
  );
  const revenueColOffset = QUARTER_COLUMNS.findIndex(
    (c) => c.key === quarterlyKeys.REVENUE
  );

  if (quarterColOffset === -1 || revenueColOffset === -1) return;

  const numRows = dataEndRow - dataStartRow + 1;

  const quarterRange = sheet.getRange(
    dataStartRow,
    startCol + quarterColOffset,
    numRows,
    1
  );

  const revenueRange = sheet.getRange(
    dataStartRow,
    startCol + revenueColOffset,
    numRows,
    1
  );

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(quarterRange) // Labels
    .addRange(revenueRange) // Values
    .setPosition(
      position.row,
      position.col,
      position.offsetX ?? 0,
      position.offsetY ?? 0
    )
    .setOption("title", "Quarterly Revenue Breakdown")
    .setOption("pieHole", 0.3)
    .setOption("colors", Object.values(QUARTER_COLORS))
    .build();

  sheet.insertChart(chart);
};
