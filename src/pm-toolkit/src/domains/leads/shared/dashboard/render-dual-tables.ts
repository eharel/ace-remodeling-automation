import { QuarterDashboardRow } from "../rows/types";
import { TableInfo } from "@shared/styles";
import { LEADS_COLUMNS } from "../columns";
import { MONTHLY_SUMMARY_OPERATIONS } from "./summary-operations";
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
      [inputKeys.MONTH]: 80,
      [quarterlyKeys.TOTAL_LEADS]: 82,
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
    splitTitle: {
      frozenColumns: 1,
    },
  });

  applyQuarterColoring(sheet, monthlyInfo, LEADS_COLUMNS, quarterRowSpanMap);
  // Apply vertical borders (Google Sheets API: row, column, numRows, numColumns)
  const monthlyRow = stylizeOptionsMonths.hasTitle
    ? monthlyInfo.startRow + 1
    : monthlyInfo.startRow;
  const monthlyColumn = monthlyInfo.startCol;
  const monthlyNumRows = monthlyInfo.endRow - monthlyRow + 1;
  const monthlyNumColumns = monthlyInfo.endCol - monthlyInfo.startCol + 1;

  applyVerticalBorders(
    sheet,
    monthlyRow,
    monthlyColumn,
    monthlyNumRows,
    monthlyNumColumns
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
      [quarterlyKeys.TOTAL_LEADS]: 82,
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
    splitTitle: {
      frozenColumns: 1,
    },
  });

  applyQuarterColoring(
    sheet,
    quarterlyInfo,
    QUARTER_COLUMNS,
    quarterRowSpanMap
  );
  // Apply vertical borders (Google Sheets API: row, column, numRows, numColumns)
  const row = quarterlyInfo.startRow;
  const column = quarterlyInfo.startCol;
  const numRows = quarterlyInfo.endRow - quarterlyInfo.startRow;
  const numColumns = quarterlyInfo.endCol - quarterlyInfo.startCol + 1;

  applyVerticalBorders(sheet, row, column, numRows, numColumns);
  applyQuarterBorders(
    sheet,
    quarterlyInfo,
    QUARTER_COLUMNS,
    quarterlyKeys.QUARTER,
    { rowSpanMap: quarterRowSpanMap }
  );

  return { monthlyInfo, quarterlyInfo };
}
