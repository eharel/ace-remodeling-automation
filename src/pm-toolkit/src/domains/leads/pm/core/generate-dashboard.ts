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

const SHOW_DESCRIPTION = false;

export function generateLeadsDashboard(showToast = true) {
  const year = getYearFilter();
  const sheet = getOrCreateLeadsDashboardSheet(DASHBOARD_SHEET);
  sheet.clear();

  const inputRows = extractLeadsData();
  const monthlyDashboardRows = createMonthlyDashboardRows(inputRows);
  const quarterlyDashboardRows = createQuarterlyDashboardRows(inputRows, year);
  const quarterRowSpanMap = getQuarterRowSpanMap(inputRows);

  const startRow = createHeader(sheet, year, 1);

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
