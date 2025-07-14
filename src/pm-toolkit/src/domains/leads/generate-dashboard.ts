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
} from "./constants";
import { TEMPLATE_SPREADSHEET_ID } from "../../constants";
import { createMonthlyDashboardRows } from "./data-transformation";
import {
  applyBorders,
  applyQuarterBorders,
  applyQuarterColoring,
} from "./styles";
import { getQuarterFromMonth } from "./utils";
import { QUARTER_COLUMNS } from "./columns-quarters";
import { QuarterlyKey } from "./constants";

const QUARTERS_ROW_SPAN = 3;
const SHOW_DESCRIPTION = false;
const stylizeOptionsMonths = {
  zebra: false,
  showDescription: SHOW_DESCRIPTION,
  colorKeys: [dashboardKeys.REVENUE_DIFF],
  columnWidths: {
    [inputKeys.MONTH]: 73,
  },
};
const stylizeOptionsQuarters = {
  ...stylizeOptionsMonths,
  rowSpan: QUARTERS_ROW_SPAN,
  columnWidths: {
    [quarterlyKeys.QUARTER]: 60,
  },
};

export function generateLeadsDashboard() {
  const year = getYearFilter();
  const sheet = getOrCreateLeadsDashboardSheet();

  sheet.clear();
  const inputRows: LeadsInputRow[] = extractLeadsData();
  const monthlyRows = createMonthlyDashboardRows(inputRows);

  const startingRow = createHeader(sheet, year, 1);
  const monthlyTableInfo = generateAndStylizeTableFromRows(
    sheet,
    monthlyRows,
    startingRow,
    1,
    "📈 Leads — Monthly Breakdown",
    LEADS_COLUMNS,
    [inputKeys.REVENUE, inputKeys.TOTAL_LEADS, inputKeys.SIGNED],
    stylizeOptionsMonths
  );

  applyQuarterColoring(sheet, monthlyTableInfo, LEADS_COLUMNS);
  // applyBorders(
  //   sheet,
  //   monthlyTableInfo.startRow,
  //   monthlyTableInfo.endRow,
  //   monthlyTableInfo.startCol,
  //   monthlyTableInfo.endCol
  // );
  applyQuarterBorders(sheet, monthlyTableInfo, LEADS_COLUMNS, inputKeys.MONTH);

  const quarterRows = createQuarterlyDashboardRows(inputRows, year);
  const quarterStartRow = monthlyTableInfo.startRow;
  const quarterStartCol = monthlyTableInfo.endCol + 1;

  const quarterTableInfo = generateAndStylizeTableFromRows(
    sheet,
    quarterRows,
    quarterStartRow,
    quarterStartCol,
    "📈 Leads — Quarterly Breakdown",
    QUARTER_COLUMNS,
    [quarterlyKeys.REVENUE, quarterlyKeys.TOTAL_LEADS, quarterlyKeys.SIGNED],
    stylizeOptionsQuarters
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
    quarterlyKeys.QUARTER,
    QUARTERS_ROW_SPAN
  );
}

function getOrCreateLeadsDashboardSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getSheetByName(DASHBOARD_SHEET);
  if (existing) return existing;

  const templateFile = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const templateSheet = templateFile.getSheetByName(BLANK_SHEET_TEMPLATE);
  if (!templateSheet) throw new Error("Template sheet not found.");

  const copiedSheet = templateSheet.copyTo(ss);
  copiedSheet.setName(DASHBOARD_SHEET);
  ss.setActiveSheet(copiedSheet);
  return copiedSheet;
}

export function createQuarterlyDashboardRows(
  inputRows: LeadsInputRow[],
  year: number
): QuarterDashboardRow[] {
  type QuarterKey = `${number}-Q${number}`;
  const grouped = new Map<QuarterKey, LeadsInputRow[]>();

  for (const row of inputRows) {
    const quarter = getQuarterFromMonth(Number(row[inputKeys.MONTH]));
    const key = `${year}-Q${quarter}` as QuarterKey;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  const unsortedRows = Array.from(grouped.entries()).map(([key, group]) => {
    const [yearStr, qStr] = key.split("-Q");
    const year = Number(yearStr);
    const quarter = `Q${qStr}`;

    const totalLeads = sum(group, inputKeys.TOTAL_LEADS);
    const signed = sum(group, inputKeys.SIGNED);
    const conversionRate = totalLeads > 0 ? signed / totalLeads : 0;
    const revenue = sum(group, inputKeys.REVENUE);
    const goal = sum(group, inputKeys.REVENUE_GOAL);
    const diff = goal - revenue;

    const fullRow: Partial<Record<QuarterlyKey, string | number>> = {
      [quarterlyKeys.YEAR]: year,
      [quarterlyKeys.QUARTER]: quarter,
      [quarterlyKeys.TOTAL_LEADS]: totalLeads,
      [quarterlyKeys.SIGNED]: signed,
      [quarterlyKeys.REVENUE]: revenue,
      [quarterlyKeys.CONVERSION_RATE]: conversionRate,
      [quarterlyKeys.REVENUE_GOAL]: goal,
      [quarterlyKeys.REVENUE_DIFF]: diff,
    };

    const filtered = Object.fromEntries(
      QUARTER_COLUMNS.map((col) => [col.key, fullRow[col.key]])
    );

    return filtered as QuarterDashboardRow;
  });

  return unsortedRows.sort((a, b) => {
    const yA = Number(a[quarterlyKeys.YEAR]);
    const yB = Number(b[quarterlyKeys.YEAR]);
    if (yA !== yB) return yA - yB;

    const qA = Number(String(a[quarterlyKeys.QUARTER]).slice(1));
    const qB = Number(String(b[quarterlyKeys.QUARTER]).slice(1));
    return qA - qB;
  });
}

function sum<K extends keyof LeadsInputRow>(
  rows: LeadsInputRow[],
  key: K
): number {
  return rows.reduce((acc, r) => acc + Number(r[key] || 0), 0);
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
