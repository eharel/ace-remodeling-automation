import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "./data-extraction";
import { createMonthlyDashboardRows } from "../../shared/data-transformation";
import { transformData } from "./data-transformation";
import { LeadsDashboardRow } from "../../shared/types";
import { createHeader } from "../../shared/dashboard";
import { renderMonthlyAndQuarterlyBreakdowns } from "../../shared/dashboard/render-dual-tables";

export function generateOverviewDashboard() {
  const year = 2025; // TODO: make this dynamic
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const inputRowsByPM = extractData();
  const dashboardRowsByPM = transformData(inputRowsByPM);
  renderDashboard(year, sheet, dashboardRowsByPM);
}

function renderDashboard(
  year: number,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dashboardRowsByPM: Record<string, LeadsDashboardRow[]>
) {
  let currentRow = createHeader(sheet, year, 1);
  currentRow = createMasterSummary(sheet, currentRow);
  const entries = Object.entries(dashboardRowsByPM);
  for (const [index, [pmName, rows]] of entries.entries()) {
    const isLast = index === entries.length - 1;

    // const { monthlyInfo } = renderMonthlyAndQuarterlyBreakdowns(
    //   sheet,
    //   year,
    //   inputRowsByPM,
    //   rows,
    //   showDescription,
    //   currentRow
    // );

    // const { monthlyInfo } = renderMonthlyAndQuarterlyBreakdowns({
    //   sheet,
    //   year,
    //   inputRows: [], // Not available yet — will be added later
    //   monthlyRows,
    //   showDescription: false,
    // });

    // currentRow = monthlyInfo.endRow;

    // Leave a gap between sections for borders, unless it's the last one
    if (!isLast) currentRow += 1;

    // Create merged section with name to the left

    // Add bottom border (skipping last one)
  }
}

function createMasterSummary(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  currentRow: number
) {
  // At the current row, create a summary row with the title "Master Summary (Placeholder)"
  const summaryRow = sheet.getRange(currentRow, 1, 1, 1);
  summaryRow.setValue("Master Summary (Placeholder)");

  return currentRow + 1;
}

export function applyBottomBorder(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  startCol: number,
  numCols: number
) {
  sheet
    .getRange(row, startCol, 1, numCols)
    .setBorder(
      true,
      false,
      false,
      false,
      false,
      false,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
}
