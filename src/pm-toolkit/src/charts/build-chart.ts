import { ChartPosition } from "./positioner";

export interface ChartConfig {
  chartType: GoogleAppsScript.Charts.ChartType;
  title: string;
  ranges: Array<{
    startRow: number;
    startCol: number;
    numRows: number;
    numCols: number;
  }>;
  options?: Record<string, any>;
}

export function buildChart(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  config: ChartConfig
): void {
  const chartBuilder = sheet.newChart().setChartType(config.chartType);

  for (const range of config.ranges) {
    chartBuilder.addRange(
      sheet.getRange(
        range.startRow,
        range.startCol,
        range.numRows,
        range.numCols
      )
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
