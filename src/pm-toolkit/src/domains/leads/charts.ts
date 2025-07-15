import { LEADS_COLUMNS } from "./columns-months";
import { inputKeys, quarterlyKeys } from "./constants";
import { QUARTER_COLUMNS } from "./columns-quarters";
import { TableInfo } from "../../types";

type ChartPosition = {
  row: number;
  col: number;
  offsetX?: number;
  offsetY?: number;
};

function createChartPositioner(
  startRow: number,
  startCol: number,
  chartsPerRow = 3
) {
  let row = startRow;
  const col = startCol;

  let chartIndexInRow = 0;

  const CHART_WIDTH_PX = 591; // Estimated chart width in pixels
  const PADDING_PX = 12; // Additional space between charts
  const offsetStepX = CHART_WIDTH_PX + PADDING_PX;

  const chartHeight = 18; // still row-based
  const offsetY = 0;

  return {
    nextPosition: (): ChartPosition => ({
      row,
      col,
      offsetX: chartIndexInRow * offsetStepX,
      offsetY,
    }),
    advance: () => {
      chartIndexInRow++;
      if (chartIndexInRow >= chartsPerRow) {
        chartIndexInRow = 0;
        row += chartHeight;
      }
    },
  };
}

export function generateCharts(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  monthlyTableInfo: TableInfo,
  quarterTableInfo: TableInfo
) {
  clearExistingCharts(sheet);

  const positioner = createChartPositioner(
    Math.max(monthlyTableInfo.endRow, quarterTableInfo.endRow) + 1,
    monthlyTableInfo.startCol
  );

  // Row 1 — Horizontal layout
  addMonthlyRevenueChart(sheet, positioner.nextPosition());
  positioner.advance();

  addQuarterlyRevenueComparisonChart(sheet, positioner.nextPosition());
  positioner.advance();

  addConversionRateChart(sheet, positioner.nextPosition());
  positioner.advance();
}

function clearExistingCharts(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const charts = sheet.getCharts();
  for (const chart of charts) {
    sheet.removeChart(chart);
  }
}

function addMonthlyRevenueChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition
) {
  const startRow = 3;
  const numMonths = 12;
  const labelCol = 1;
  const revenueCol =
    LEADS_COLUMNS.findIndex((c) => c.key === inputKeys.REVENUE) + 1;

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange(startRow, labelCol, numMonths, 1))
    .addRange(sheet.getRange(startRow, revenueCol, numMonths, 1))
    .setPosition(
      position.row,
      position.col,
      position.offsetX ?? 0,
      position.offsetY ?? 0
    )
    .setOption("title", "Monthly Revenue")
    .setOption("legend", { position: "none" })
    .build();

  sheet.insertChart(chart);
}

function addQuarterlyRevenueComparisonChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition
) {
  const startRow = 3;
  const quarters = 4;

  const quarterStartCol = LEADS_COLUMNS.length + 1;
  const labelCol =
    quarterStartCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.QUARTER);
  const revenueCol =
    quarterStartCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.REVENUE);
  const goalCol =
    quarterStartCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.REVENUE_GOAL);

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange(startRow, labelCol, quarters, 1))
    .addRange(sheet.getRange(startRow, revenueCol, quarters, 1))
    .addRange(sheet.getRange(startRow, goalCol, quarters, 1))
    .setPosition(
      position.row,
      position.col,
      position.offsetX ?? 0,
      position.offsetY ?? 0
    )
    .setOption("title", "Quarterly Revenue vs Goal")
    .setOption("legend", { position: "bottom" })
    .build();

  sheet.insertChart(chart);
}

function addConversionRateChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition
) {
  const startRow = 3;
  const quarters = 4;

  const quarterStartCol = LEADS_COLUMNS.length + 1;
  const labelCol =
    quarterStartCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.QUARTER);
  const convRateCol =
    quarterStartCol +
    QUARTER_COLUMNS.findIndex((c) => c.key === quarterlyKeys.CONVERSION_RATE);

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sheet.getRange(startRow, labelCol, quarters, 1))
    .addRange(sheet.getRange(startRow, convRateCol, quarters, 1))
    .setPosition(
      position.row,
      position.col,
      position.offsetX ?? 0,
      position.offsetY ?? 0
    )
    .setOption("title", "Quarterly Conversion Rate")
    .setOption("legend", { position: "none" })
    .setOption("vAxis", { format: "percent" })
    .build();

  sheet.insertChart(chart);
}
