import { getCenteredStartCol } from ".";
import { TableInfo } from "@shared/styles";
import { ChartFunction } from "./types";
import {
  ChartLayoutConfig,
  createChartPositioner,
} from "../../../../charts/positioner";

export const GRID_LAYOUT: ChartLayoutConfig & { layoutType: "grid" } = {
  layoutType: "grid",
  chartsPerRow: 3,
  chartWidthPx: 591,
  chartHeightRows: 18,
  paddingPx: 12,
  useOffsetX: true,
  useOffsetY: true,
};

export const STACKED_LAYOUT: ChartLayoutConfig & { layoutType: "stacked" } = {
  layoutType: "stacked",
  chartsPerRow: 1,
  chartWidthPx: 591,
  chartHeightRows: 18,
  paddingPx: 0,
  useOffsetX: false,
  useOffsetY: true,
};

export function generateGridLayoutCharts(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  chartFns: ChartFunction[],
  monthlyTableInfo: TableInfo,
  quarterlyTableInfo: TableInfo,
  layoutConfig: ChartLayoutConfig = {}
) {
  const maxRow = Math.max(monthlyTableInfo.endRow, quarterlyTableInfo.endRow);
  const startCol = monthlyTableInfo.startCol;

  const positioner = createChartPositioner(maxRow + 1, startCol, layoutConfig);

  for (const chartFn of chartFns) {
    chartFn(
      sheet,
      positioner.nextPosition(),
      monthlyTableInfo,
      quarterlyTableInfo
    );
    positioner.advance();
  }
}

export function generateStackedLayoutCharts(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  monthlyChartFns: ChartFunction[],
  quarterlyChartFns: ChartFunction[],
  monthlyTableInfo: TableInfo,
  quarterlyTableInfo: TableInfo,
  layoutConfig: ChartLayoutConfig
) {
  const chartWidthPx = layoutConfig.chartWidthPx ?? 591;

  const monthlyStartCol = getCenteredStartCol(
    monthlyTableInfo.startCol,
    monthlyTableInfo.endCol,
    chartWidthPx
  );

  const quarterlyStartCol = getCenteredStartCol(
    quarterlyTableInfo.startCol,
    quarterlyTableInfo.endCol,
    chartWidthPx
  );

  const monthlyPositioner = createChartPositioner(
    monthlyTableInfo.endRow + 1,
    monthlyStartCol,
    layoutConfig
  );

  renderCharts(
    sheet,
    monthlyPositioner,
    monthlyChartFns,
    monthlyTableInfo,
    quarterlyTableInfo
  );

  const quarterlyPositioner = createChartPositioner(
    quarterlyTableInfo.endRow + 1,
    quarterlyStartCol,
    layoutConfig
  );

  renderCharts(
    sheet,
    quarterlyPositioner,
    quarterlyChartFns,
    monthlyTableInfo,
    quarterlyTableInfo
  );
}

function renderCharts(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  positioner: ReturnType<typeof createChartPositioner>,
  chartFns: ChartFunction[],
  monthlyInfo: TableInfo,
  quarterlyInfo: TableInfo
) {
  for (const chartFn of chartFns) {
    chartFn(sheet, positioner.nextPosition(), monthlyInfo, quarterlyInfo);
    positioner.advance();
  }
}
