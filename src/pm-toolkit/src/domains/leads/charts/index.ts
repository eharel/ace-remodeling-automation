import { TableInfo } from "../../../types";
import { clearExistingCharts } from "../../../charts";
import { createChartPositioner } from "../../../charts";
import { addMonthlyRevenueChart } from "./monthly-charts";
import { addQuarterlyRevenueComparisonChart } from "./quarterly-charts";
import { addMonthlyConversionRateChart } from "./monthly-charts";
import { addQuarterlyConversionRateChart } from "./quarterly-charts";

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

  addMonthlyRevenueChart(sheet, positioner.nextPosition(), monthlyTableInfo);
  positioner.advance();

  addMonthlyConversionRateChart(
    sheet,
    positioner.nextPosition(),
    monthlyTableInfo
  );
  positioner.advance();

  addQuarterlyRevenueComparisonChart(
    sheet,
    positioner.nextPosition(),
    quarterTableInfo
  );
  positioner.advance();
}
