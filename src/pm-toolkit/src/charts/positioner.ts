export type ChartPosition = {
  row: number;
  col: number;
  offsetX?: number;
  offsetY?: number;
};

export function createChartPositioner(
  startRow: number,
  startCol: number,
  chartsPerRow = 3
) {
  let row = startRow;
  const col = startCol;

  let chartIndexInRow = 0;

  const CHART_WIDTH_PX = 591;
  const PADDING_PX = 12;
  const offsetStepX = CHART_WIDTH_PX + PADDING_PX;

  const chartHeight = 18;
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
