import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { DASHBOARD_SHEET } from ".";
import { extractLeadsData } from "./data-extraction";
import { createMonthlyDashboardRows } from "../../shared/data-transformation";
import { addBottomBorderBandaidFix } from "../../shared/styles";
import { generateCharts } from "../charts";
import { addTimestamp } from "@shared/styles";
import { renderMonthlyAndQuarterlyBreakdowns } from "../../shared/dashboard/render-dual-tables";
import { createQuarterlyDashboardRows } from "../../shared/data-transformation";
import { getQuarterRowSpanMap } from "../../shared/dashboard/utils";
import { createHeader } from "../../shared/dashboard";
import { MONTHLY_TITLE, QUARTERLY_TITLE } from "../../shared/constants";
import { LEADS_COLUMNS, QUARTER_COLUMNS } from "../../shared/columns";

const SHOW_DESCRIPTION = false;

export function generateLeadsDashboard(showToast = true) {
  const year = getYearFilter();
  const sheet = getOrCreateLeadsDashboardSheet(DASHBOARD_SHEET);
  sheet.clear();

  const inputRows = extractLeadsData();
  const monthlyDashboardRows = createMonthlyDashboardRows(inputRows);
  const quarterlyDashboardRows = createQuarterlyDashboardRows(inputRows, year);
  const quarterRowSpanMap = getQuarterRowSpanMap(inputRows);

  const totalTableWidth = LEADS_COLUMNS.length + QUARTER_COLUMNS.length;
  
  // Define header positioning (Google Sheets API: row, column, numRows, numColumns)
  const row = 1;
  const column = 1;
  const numRows = 2;
  const numColumns = totalTableWidth;
  
  const startRow = createHeader(sheet, year, row, column, numRows, numColumns);

  const { monthlyInfo, quarterlyInfo } = renderMonthlyAndQuarterlyBreakdowns({
    sheet,
    year,
    startRow,
    startCol: 1,
    monthlyDashboardRows,
    quarterlyDashboardRows,
    quarterRowSpanMap,
    showDescription: SHOW_DESCRIPTION,
    monthlyTitle: MONTHLY_TITLE,
    quarterlyTitle: QUARTERLY_TITLE,
  });

  addBottomBorderBandaidFix(sheet, quarterlyInfo);
  generateCharts(sheet, monthlyInfo, quarterlyInfo);
  addTimestamp(sheet, 1, quarterlyInfo.endCol + 1);

  if (showToast) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Leads Dashboard ready ✅",
      "Ace Toolkit"
    );
  }

  sheet.setFrozenRows(3);
}

function getYearFilter(): number {
  return 2025;
}
