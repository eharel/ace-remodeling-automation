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

export type RenderDualTablesParams = {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  year: number;
  startRow: number;
  startCol: number;
  monthlyDashboardRows: LeadsDashboardRow[];
  quarterlyDashboardRows: QuarterDashboardRow[];
  quarterRowSpanMap: Record<string, number>;
  showDescription?: boolean;
  monthlyTitle?: string;
  quarterlyTitle?: string;
  hasHeaders?: boolean;
};

export function renderMonthlyAndQuarterlyBreakdowns({
  sheet,
  year,
  startRow,
  startCol,
  monthlyDashboardRows,
  quarterlyDashboardRows,
  quarterRowSpanMap,
  showDescription = false,
  monthlyTitle,
  quarterlyTitle,
  hasHeaders = true,
}: RenderDualTablesParams): {
  monthlyInfo: TableInfo;
  quarterlyInfo: TableInfo;
} {
  const stylizeOptionsMonths = {
    zebra: false,
    showDescription,
    colorKeys: [dashboardKeys.REVENUE_DIFF],
    columnWidths: {
      [inputKeys.MONTH]: 76,
    },
    rowSpanMap: quarterRowSpanMap,
    hasTitle: Boolean(monthlyTitle),
    hasHeaders,
  };

  const monthlyInfo = generateAndStylizeTableFromRows({
    sheet,
    rows: monthlyDashboardRows,
    startRow,
    startCol,
    columns: LEADS_COLUMNS,
    summaryRowOps: MONTHLY_SUMMARY_OPERATIONS,
    options: stylizeOptionsMonths,
    title: monthlyTitle,
  });

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
    hasTitle: Boolean(quarterlyTitle),
    hasHeaders,
  };

  const quarterlyInfo = generateAndStylizeTableFromRows({
    sheet,
    rows: quarterlyDashboardRows,
    startRow: quarterStartRow,
    startCol: quarterStartCol,
    columns: QUARTER_COLUMNS,
    summaryRowOps: QUARTERLY_SUMMARY_OPERATIONS,
    options: stylizeOptionsQuarters,
    title: quarterlyTitle,
  });

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
