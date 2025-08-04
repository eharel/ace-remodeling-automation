import { ChartPosition } from "./positioner";

export interface ChartRange {
  startRow: number;
  endRowInclusive?: number; // Preferred: inclusive row range
  numRows?: number; // Optional fallback for manual control
  startCol: number;
  numCols: number;
}

export interface ChartConfig {
  chartType: GoogleAppsScript.Charts.ChartType;
  title: string;
  ranges: ChartRange[];
  options?: Record<string, any>;
}

export function buildChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  config: ChartConfig
): void {
  const chartBuilder = sheet.newChart().setChartType(config.chartType);

  for (const range of config.ranges) {
    const numRows =
      range.numRows ??
      (range.endRowInclusive !== undefined
        ? range.endRowInclusive - range.startRow + 1
        : undefined);

    if (numRows === undefined) {
      throw new Error(
        `Chart range is missing both numRows and endRowInclusive: ${JSON.stringify(
          range
        )}`
      );
    }

    chartBuilder.addRange(
      sheet.getRange(range.startRow, range.startCol, numRows, range.numCols)
    );
  }

  chartBuilder.setPosition(
    position.row,
    position.col,
    position.offsetX ?? 0,
    position.offsetY ?? 0
  );

  chartBuilder.setOption("title", config.title);

  if (config.options) {
    for (const [key, value] of Object.entries(config.options)) {
      chartBuilder.setOption(key, value);
    }
  }

  const chart = chartBuilder.build();
  sheet.insertChart(chart);
}
