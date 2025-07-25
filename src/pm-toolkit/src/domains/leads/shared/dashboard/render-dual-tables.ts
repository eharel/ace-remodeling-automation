import { LeadsInputRow, QuarterDashboardRow } from "../rows/types";
import { TableInfo } from "@shared/styles";
import { LEADS_COLUMNS } from "../columns";
import { MONTHLY_SUMMARY_OPERATIONS } from "./summary-operations";
import { getQuarterRowSpanMap } from "./utils";
import { createHeader } from "./table-render-utils";
import { applyQuarterColoring } from "../styles";
import { applyVerticalBorders } from "../styles";
import { applyQuarterBorders } from "../styles";
import { generateAndStylizeTableFromRows } from "@tables/builder";
import { LeadsDashboardRow } from "../types";
import { QUARTER_COLUMNS } from "../columns";
import { QUARTERLY_SUMMARY_OPERATIONS } from "./summary-operations";
import { dashboardKeys } from "../columns";
import { inputKeys } from "../columns";
import { quarterlyKeys } from "../columns";

type RenderDualTablesParams = {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  year: number;
  monthlyDashboardRows: LeadsDashboardRow[];
  quarterlyDashboardRows: QuarterDashboardRow[];
  quarterRowSpanMap: Record<string, number>;
  showDescription?: boolean;
};

export function renderMonthlyAndQuarterlyBreakdowns({
  sheet,
  year,
  monthlyDashboardRows,
  quarterlyDashboardRows,
  quarterRowSpanMap,
  showDescription = false,
}: RenderDualTablesParams): {
  monthlyInfo: TableInfo;
  quarterlyInfo: TableInfo;
} {
  const startingRow = createHeader(sheet, year, 1);

  const stylizeOptionsMonths = {
    zebra: false,
    showDescription,
    colorKeys: [dashboardKeys.REVENUE_DIFF],
    columnWidths: {
      [inputKeys.MONTH]: 73,
    },
    rowSpanMap: quarterRowSpanMap,
  };

  const monthlyInfo = generateAndStylizeTableFromRows(
    sheet,
    monthlyDashboardRows,
    startingRow,
    1,
    "Monthly Breakdown",
    LEADS_COLUMNS,
    MONTHLY_SUMMARY_OPERATIONS,
    stylizeOptionsMonths
  );

  applyQuarterColoring(sheet, monthlyInfo, LEADS_COLUMNS, quarterRowSpanMap);
  applyVerticalBorders(
    sheet,
    monthlyInfo.startRow,
    monthlyInfo.endRow - 1,
    monthlyInfo.startCol,
    monthlyInfo.endCol - monthlyInfo.startCol + 1
  );
  applyQuarterBorders(sheet, monthlyInfo, LEADS_COLUMNS, inputKeys.MONTH, {
    rowSpanMap: quarterRowSpanMap,
  });

  const quarterStartRow = monthlyInfo.startRow;
  const quarterStartCol = monthlyInfo.endCol + 1;

  const stylizeOptionsQuarters = {
    ...stylizeOptionsMonths,
    columnWidths: {
      [quarterlyKeys.QUARTER]: 60,
    },
    summaryTitle: "",
  };

  const quarterlyInfo = generateAndStylizeTableFromRows(
    sheet,
    quarterlyDashboardRows,
    quarterStartRow,
    quarterStartCol,
    "Quarterly Breakdown",
    QUARTER_COLUMNS,
    QUARTERLY_SUMMARY_OPERATIONS,
    stylizeOptionsQuarters
  );

  applyQuarterColoring(
    sheet,
    quarterlyInfo,
    QUARTER_COLUMNS,
    quarterRowSpanMap
  );
  applyVerticalBorders(
    sheet,
    quarterlyInfo.startRow,
    quarterlyInfo.endRow - 1,
    quarterlyInfo.startCol,
    quarterlyInfo.endCol - quarterlyInfo.startCol + 1
  );
  applyQuarterBorders(
    sheet,
    quarterlyInfo,
    QUARTER_COLUMNS,
    quarterlyKeys.QUARTER,
    { rowSpanMap: quarterRowSpanMap }
  );

  return { monthlyInfo, quarterlyInfo };
}
