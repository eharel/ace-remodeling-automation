import {
  extractLeadsData,
  extractMonthlyRevenueGoalsFromNamedRange,
} from "./extract-leads";
import { LeadsInputRow, QuarterDashboardRow } from "./types";
import { LEADS_COLUMNS } from "./columns-months";
import { generateAndStylizeTableFromRows } from "../../utils/table-builder";
import {
  BLANK_SHEET_TEMPLATE,
  LEADS_DASHBOARD_SHEET,
  NR_LEADS_MONTHLY_DASHBOARD_TABLE,
  NR_LEADS_MONTHLY_GOALS,
  QUARTER_KEYS,
  QUARTER_LABELS,
} from "./constants";
import { TEMPLATE_SPREADSHEET_ID } from "../../constants";
import { createMonthlyDashboardRows } from "./data-months";
import { LEADS_KEYS } from "./constants";
import { applyQuarterBorders, applyQuarterColoring } from "./styles";
import { getQuarterFromMonth } from "./utils";
import { QUARTER_COLUMNS, QuarterColumnKey } from "./columns-quarters";
import { TableInfo } from "../../types";
import { setNamedRange } from "../../utils/helpers";

const QUARTERS_ROW_SPAN = 3;
const SHOW_DESCRIPTION = false;

export function generateLeadsDashboard() {
  const year = getYearFilter();
  const sheet = getOrCreateLeadsDashboardSheet();
  const existingGoals = extractMonthlyRevenueGoalsFromNamedRange(
    NR_LEADS_MONTHLY_GOALS
  );
  sheet.clear();
  const inputRows: LeadsInputRow[] = extractLeadsData();
  const monthlyRows = createMonthlyDashboardRows(inputRows, existingGoals);

  const startingRow = createHeader(sheet, year, 1);
  const monthlyTableInfo = generateAndStylizeTableFromRows(
    sheet,
    monthlyRows,
    startingRow,
    1,
    "📈 Leads — Monthly Breakdown",
    LEADS_COLUMNS,
    [LEADS_KEYS.REVENUE, LEADS_KEYS.TOTAL_LEADS, LEADS_KEYS.SIGNED],
    { zebra: false, showDescription: SHOW_DESCRIPTION }
  );

  handleMonthlyGoalsNamedRange(sheet, monthlyTableInfo);
  applyQuarterColoring(sheet, monthlyTableInfo, LEADS_COLUMNS);
  applyQuarterBorders(sheet, monthlyTableInfo, LEADS_COLUMNS, LEADS_KEYS.MONTH);

  const quarterRows = createQuarterlyDashboardRows(inputRows);
  const quarterStartRow = monthlyTableInfo.startRow;
  const quarterStartCol = monthlyTableInfo.endCol + 1;

  const quarterTableInfo = generateAndStylizeTableFromRows(
    sheet,
    quarterRows,
    quarterStartRow,
    quarterStartCol,
    "📈 Leads — Quarterly Breakdown",
    QUARTER_COLUMNS,
    [QUARTER_KEYS.REVENUE, QUARTER_KEYS.TOTAL_LEADS, QUARTER_KEYS.SIGNED],
    { zebra: false, showDescription: false, rowSpan: QUARTERS_ROW_SPAN }
  );

  applyQuarterColoring(
    sheet,
    quarterTableInfo,
    QUARTER_COLUMNS,
    QUARTERS_ROW_SPAN
  );
  applyQuarterBorders(
    sheet,
    quarterTableInfo,
    QUARTER_COLUMNS,
    QUARTER_KEYS.QUARTER,
    QUARTERS_ROW_SPAN
  );
}

function getOrCreateLeadsDashboardSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getSheetByName(LEADS_DASHBOARD_SHEET);
  if (existing) return existing;

  const templateFile = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const templateSheet = templateFile.getSheetByName(BLANK_SHEET_TEMPLATE);
  if (!templateSheet) throw new Error("Template sheet not found.");

  const copiedSheet = templateSheet.copyTo(ss);
  copiedSheet.setName(LEADS_DASHBOARD_SHEET);
  ss.setActiveSheet(copiedSheet);
  return copiedSheet;
}

export function createQuarterlyDashboardRows(
  inputRows: LeadsInputRow[]
): QuarterDashboardRow[] {
  type QuarterKey = `${number}-Q${number}`;
  const grouped = new Map<QuarterKey, LeadsInputRow[]>();

  for (const row of inputRows) {
    const year = row[LEADS_KEYS.YEAR];
    const quarter = getQuarterFromMonth(Number(row[LEADS_KEYS.MONTH]));
    const key = `${year}-Q${quarter}` as QuarterKey;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  const unsortedRows = Array.from(grouped.entries()).map(([key, group]) => {
    const [yearStr, qStr] = key.split("-Q");
    const year = Number(yearStr);
    const quarter = `Q${qStr}`;

    const totalLeads = sum(group, LEADS_KEYS.TOTAL_LEADS);
    const signed = sum(group, LEADS_KEYS.SIGNED);
    const revenue = sum(group, LEADS_KEYS.REVENUE);
    const conversionRate = totalLeads > 0 ? signed / totalLeads : 0;

    const goal = "";
    const diff = typeof goal === "number" ? revenue - goal : "";

    const fullRow: Partial<Record<QuarterColumnKey, string | number>> = {
      [QUARTER_KEYS.YEAR]: year,
      [QUARTER_KEYS.QUARTER]: quarter,
      [QUARTER_KEYS.TOTAL_LEADS]: totalLeads,
      [QUARTER_KEYS.SIGNED]: signed,
      [QUARTER_KEYS.REVENUE]: revenue,
      [QUARTER_KEYS.CONVERSION_RATE]: conversionRate,
      [QUARTER_KEYS.REVENUE_GOAL]: goal,
      [QUARTER_KEYS.REVENUE_DIFF]: diff,
    };

    const filtered = Object.fromEntries(
      QUARTER_COLUMNS.map((col) => [col.key, fullRow[col.key]])
    );

    return filtered as QuarterDashboardRow;
  });

  return unsortedRows.sort((a, b) => {
    const yA = Number(a[QUARTER_KEYS.YEAR]);
    const yB = Number(b[QUARTER_KEYS.YEAR]);
    if (yA !== yB) return yA - yB;

    const qA = Number(String(a[QUARTER_KEYS.QUARTER]).slice(1));
    const qB = Number(String(b[QUARTER_KEYS.QUARTER]).slice(1));
    return qA - qB;
  });
}

function sum<K extends keyof LeadsInputRow>(
  rows: LeadsInputRow[],
  key: K
): number {
  return rows.reduce((acc, r) => acc + Number(r[key] || 0), 0);
}

function extractExistingRevenueGoals(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): Map<string, number> {
  const goals = new Map<string, number>();
  const headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];

  const yearColIdx = headers.findIndex((val) => val === QUARTER_LABELS.YEAR);
  const quarterColIdx = headers.findIndex(
    (val) => val === QUARTER_LABELS.QUARTER
  );
  const goalColIdx = headers.findIndex(
    (val) => val === QUARTER_LABELS.REVENUE_GOAL
  );

  if (yearColIdx === -1 || quarterColIdx === -1 || goalColIdx === -1)
    return goals;

  const dataRange = sheet.getRange(
    3,
    1,
    sheet.getLastRow() - 2,
    sheet.getLastColumn()
  );
  const values = dataRange.getValues();

  for (const row of values) {
    const year = row[yearColIdx];
    const quarter = row[quarterColIdx];
    const goal = row[goalColIdx];

    if (year && quarter && typeof goal === "number" && !isNaN(goal)) {
      goals.set(`${year}-${quarter}`, goal);
    }
  }

  return goals;
}

function getYearFilter(): number {
  return 2025;
}

function createHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  year: number,
  startCol: number
): number {
  const headerTitle = `${year} Leads Breakdown`;
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

export function handleMonthlyGoalsNamedRange(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  monthlyTableInfo: TableInfo
) {
  if (!sheet) throw new Error("Leads dashboard sheet not found.");

  const goalColOffset = LEADS_COLUMNS.findIndex(
    (col) => col.key === LEADS_KEYS.REVENUE_GOAL
  );

  if (goalColOffset === -1)
    throw new Error("Revenue Goal column not found in LEADS_COLUMNS");

  const goalRange = sheet.getRange(
    monthlyTableInfo.dataStartRow,
    monthlyTableInfo.startCol + goalColOffset,
    monthlyTableInfo.dataEndRow - monthlyTableInfo.dataStartRow + 1,
    1
  );

  setNamedRange(sheet, NR_LEADS_MONTHLY_GOALS, goalRange);
}
