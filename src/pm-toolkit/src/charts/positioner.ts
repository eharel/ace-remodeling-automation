export type LayoutType = "grid" | "stacked";

export type ChartPosition = {
  row: number;
  col: number;
  offsetX?: number;
  offsetY?: number;
};

export type ChartLayoutConfig = {
  layoutType?: LayoutType;
  chartsPerRow?: number;
  chartWidthPx?: number;
  chartHeightRows?: number;
  paddingPx?: number;
  useOffsetX?: boolean;
  useOffsetY?: boolean;
};

export const DEFAULT_CHART_LAYOUT: Required<ChartLayoutConfig> = {
  layoutType: "grid",
  chartsPerRow: 3,
  chartWidthPx: 591,
  chartHeightRows: 18,
  paddingPx: 12,
  useOffsetX: true,
  useOffsetY: true,
};

function resolveLayoutConfig(
  partial: ChartLayoutConfig
): Required<ChartLayoutConfig> {
  return { ...DEFAULT_CHART_LAYOUT, ...partial };
}

export function createChartPositioner(
  startRow: number,
  startCol: number,
  layout: ChartLayoutConfig
) {
  const {
    layoutType = "grid",
    chartsPerRow,
    chartWidthPx,
    chartHeightRows,
    paddingPx,
    useOffsetX,
    useOffsetY,
  } = resolveLayoutConfig(layout);

  let row = startRow;
  const col = startCol;
  let chartIndexInRow = 0;

  const offsetStepX = chartWidthPx + paddingPx;

  return {
    nextPosition: (): ChartPosition => ({
      row,
      col,
      offsetX: useOffsetX ? chartIndexInRow * offsetStepX : undefined,
      offsetY: useOffsetY ? 0 : undefined,
    }),
    advance: () => {
      chartIndexInRow++;
      if (chartIndexInRow >= chartsPerRow) {
        chartIndexInRow = 0;
        row += chartHeightRows;
      }
    },
  };
}
