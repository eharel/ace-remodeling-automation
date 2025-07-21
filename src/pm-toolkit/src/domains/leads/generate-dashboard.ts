import { extractLeadsData } from "./data-extraction";
import { LeadsInputRow, QuarterDashboardRow } from "./types";
import { LEADS_COLUMNS } from "./columns-months";
import { generateAndStylizeTableFromRows } from "../../utils/table-builder";
import {
  BLANK_SHEET_TEMPLATE,
  DASHBOARD_SHEET,
  dashboardKeys,
  inputKeys,
  quarterlyKeys,
  QUARTERS_ROW_SPAN,
} from "./constants";
import { TEMPLATE_SPREADSHEET_ID } from "../../constants";
import { createMonthlyDashboardRows, createQuarterlyDashboardRows } from "./data-transformation";
import {
  applyQuarterBorders,
  applyQuarterColoring,
  applyVerticalBorders,
} from "./styles";
import { getQuarterFromMonth } from "./utils";
import { QUARTER_COLUMNS } from "./columns-quarters";
import { addTimestamp } from "../../styles";
import { generateCharts } from "./charts";
import { SummaryOperation, SummaryOperationsMap, TableInfo } from "../../types";

const SHOW_DESCRIPTION = false;

// Summary row operations for monthly table
const MONTHLY_SUMMARY_OPERATIONS: SummaryOperationsMap = {
  [inputKeys.REVENUE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [inputKeys.REVENUE_GOAL]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [dashboardKeys.REVENUE_DIFF]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [inputKeys.TOTAL_LEADS]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [inputKeys.SIGNED]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [dashboardKeys.CONVERSION_RATE]: {
    operation: "avg",
    format: "percent",
    decimals: 2,
  },
};

// Summary row operations for quarterly table
const QUARTERLY_SUMMARY_OPERATIONS: SummaryOperationsMap = {
  [quarterlyKeys.REVENUE]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.REVENUE_GOAL]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.REVENUE_DIFF]: {
    operation: "sum",
    format: "currency",
    decimals: 0,
  },
  [quarterlyKeys.TOTAL_LEADS]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [quarterlyKeys.SIGNED]: {
    operation: "sum",
    format: "number",
    decimals: 0,
  },
  [quarterlyKeys.CONVERSION_RATE]: {
    operation: "avg",
    format: "percent",
    decimals: 2,
  },
};

const stylizeOptionsMonths = {
  zebra: false,
  showDescription: SHOW_DESCRIPTION,
  colorKeys: [dashboardKeys.REVENUE_DIFF],
  columnWidths: {
    [inputKeys.MONTH]: 73,
  },
};

/**
 * Generates the leads dashboard
 * @param showToast Whether to show a toast notification when complete (default: true)
 */
export function generateLeadsDashboard(showToast = true) {
  const year = getYearFilter();
  const sheet = getOrCreateLeadsDashboardSheet();

  sheet.clear();
  const inputRows: LeadsInputRow[] = extractLeadsData();
  const monthlyRows = createMonthlyDashboardRows(inputRows);

  const quarterRowSpanMap = getQuarterRowSpanMap(inputRows);

  const startingRow = createHeader(sheet, year, 1);
  const stylizeOptionsMonths = {
    zebra: false,
    showDescription: false,
    colorKeys: [dashboardKeys.REVENUE_DIFF],
    columnWidths: {
      [inputKeys.MONTH]: 73,
    },
    rowSpanMap: quarterRowSpanMap, // ✅ NEW
  };

  const monthlyTableInfo = generateAndStylizeTableFromRows(
    sheet,
    monthlyRows,
    startingRow,
    1,
    "Monthly Breakdown",
    LEADS_COLUMNS,
    MONTHLY_SUMMARY_OPERATIONS,
    stylizeOptionsMonths
  );

  applyQuarterColoring(
    sheet,
    monthlyTableInfo,
    LEADS_COLUMNS,
    quarterRowSpanMap
  );
  applyVerticalBorders(
    sheet,
    monthlyTableInfo.startRow,
    monthlyTableInfo.endRow - 1,
    monthlyTableInfo.startCol,
    monthlyTableInfo.endCol - monthlyTableInfo.startCol + 1
  );
  applyQuarterBorders(
    sheet,
    monthlyTableInfo,
    LEADS_COLUMNS,
    inputKeys.MONTH,
    { rowSpanMap: quarterRowSpanMap } // ✅ NEW
  );

  const stylizeOptionsQuarters = {
    ...stylizeOptionsMonths,
    columnWidths: {
      [quarterlyKeys.QUARTER]: 60,
    },
    summaryTitle: "", // Empty string for the quarterly summary row since it's side-by-side with monthly table
  };

  const quarterRows = createQuarterlyDashboardRows(inputRows, year);
  const quarterStartRow = monthlyTableInfo.startRow;
  const quarterStartCol = monthlyTableInfo.endCol + 1;

  const quarterTableInfo = generateAndStylizeTableFromRows(
    sheet,
    quarterRows,
    quarterStartRow,
    quarterStartCol,
    "Quarterly Breakdown",
    QUARTER_COLUMNS,
    QUARTERLY_SUMMARY_OPERATIONS,
    stylizeOptionsQuarters
  );

  applyQuarterColoring(
    sheet,
    quarterTableInfo,
    QUARTER_COLUMNS,
    quarterRowSpanMap
  );
  applyVerticalBorders(
    sheet,
    quarterTableInfo.startRow,
    quarterTableInfo.endRow - 1,
    quarterTableInfo.startCol,
    quarterTableInfo.endCol - quarterTableInfo.startCol + 1
  );
  applyQuarterBorders(
    sheet,
    quarterTableInfo,
    QUARTER_COLUMNS,
    quarterlyKeys.QUARTER,
    { rowSpanMap: quarterRowSpanMap } // ✅ NEW
  );

  addBottomBorderBandaidFix(sheet, quarterTableInfo);

  generateCharts(sheet, monthlyTableInfo, quarterTableInfo);

  // ⌚️ Add timestamp to the right of the quarters table
  addTimestamp(sheet, 1, quarterTableInfo.endCol + 1);

  // Show toast notification if requested
  if (showToast) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Leads Dashboard ready ✅",
      "Ace Toolkit"
    );
  }

  // ✅ Freeze the row of the table titles so they stay visible while scrolling
  sheet.setFrozenRows(3);
}

// Add a top border to the summary row to separate it from the data rows
// I was going crazy with figuring out why the bottom border wasn't showing up, so I added this bandaid fix
// Don't judge me
function addBottomBorderBandaidFix(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  tableInfo: TableInfo
) {
  // Find the summary row (which is right after the data rows)
  const summaryRow = tableInfo.dataEndRow + 1;

  sheet
    .getRange(
      summaryRow,
      tableInfo.startCol,
      1,
      tableInfo.endCol - tableInfo.startCol + 1
    )
    .setBorder(
      true, // top border instead of bottom border
      null,
      null,
      null,
      null,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
}

function getOrCreateLeadsDashboardSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getSheetByName(DASHBOARD_SHEET);
  if (existing) {
    // Adding logging
    Logger.log(`Using existing dashboard sheet: ${DASHBOARD_SHEET}`);
    return existing;
  }

  const templateFile = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const templateSheet = templateFile.getSheetByName(BLANK_SHEET_TEMPLATE);
  if (!templateSheet) throw new Error("Template sheet not found.");

  const copiedSheet = templateSheet.copyTo(ss);
  copiedSheet.setName(DASHBOARD_SHEET);
  ss.setActiveSheet(copiedSheet);
  return copiedSheet;
}


function getYearFilter(): number {
  return 2025;
}

function createHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number,
  startCol: number
): number {
  const headerTitle = `📈 ${year} Leads Breakdown`;
  const totalTableWidth = LEADS_COLUMNS.length + QUARTER_COLUMNS.length;
  // Write the title in row 1, spanning `colSpan` columns
  const titleRange = sheet.getRange(1, startCol, 2, totalTableWidth);
  titleRange.merge();
  titleRange.setValue(headerTitle);
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(14);
  titleRange.setFontColor("white");
  titleRange.setBackground("#1A237E");
  titleRange.setHorizontalAlignment("center");
  titleRange.setVerticalAlignment("middle");

  // Return the row after the header (row 3)
  return 3;
}

function getQuarterRowSpanMap(
  monthlyRows: LeadsInputRow[]
): Record<string, number> {
  const map: Record<string, number> = {};

  for (const row of monthlyRows) {
    const month = Number(row[inputKeys.MONTH]);
    const quarter = getQuarterFromMonth(month);
    const key = `Q${quarter}`;
    map[key] = (map[key] ?? 0) + 1;
  }

  return map;
}
