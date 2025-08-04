import { FILE_IDS } from "../../../../constants/general";
import { extractTableData } from "@tables/reader";
import {
  LEADS_MASTER_TABLE_NAME,
  LEADS_MASTER_LABELS,
  REVENUE_MASTER_TABLE_NAME,
  REVENUE_LABELS,
} from "./constants";
import { LeadsInputRow } from "../../shared/rows/types";

export function extractData(): Record<string, LeadsInputRow[]> {
  const leads = extractLeadsData();
  const revenue = extractRevenueData();
  const revenueMap = reduceRevenue(revenue);
  const mapPM2InputRows = combineLeadsAndRevenue(leads, revenueMap);

  return mapPM2InputRows;
}

function extractLeadsData(): any[] {
  const sourceFile = SpreadsheetApp.openById(FILE_IDS.MANAGER_FILE);
  const leads = extractTableData({
    ss: sourceFile,
    sheetName: LEADS_MASTER_TABLE_NAME,
    labelMap: LEADS_MASTER_LABELS,
    blankableKeys: new Set(["SIGNED"]),
  });

  return leads;
}

function extractRevenueData(): any[] {
  const sourceFile = SpreadsheetApp.openById(FILE_IDS.MANAGER_FILE);
  const revenue = extractTableData({
    ss: sourceFile,
    sheetName: REVENUE_MASTER_TABLE_NAME,
    labelMap: REVENUE_LABELS,
  });

  return revenue;
}

function reduceRevenue(revenue: any[]): Record<string, number> {
  const revenueMap: Record<string, number> = {};
  for (const row of revenue) {
    const key = `${row.PM}|${row.YEAR}|${row.MONTH}`;
    const prev = revenueMap[key] ?? 0;
    revenueMap[key] = prev + (row.REVENUE ?? 0);
  }
  return revenueMap;
}

function combineLeadsAndRevenue(
  leads: any[],
  revenueMap: Record<string, number>
): Record<string, LeadsInputRow[]> {
  // Step 2: Build dashboard rows
  const groupedLeads: Record<string, LeadsInputRow[]> = {};

  for (const leadRow of leads) {
    const { PM, YEAR, MONTH, TOTAL_LEADS, SIGNED } = leadRow;

    const key = `${PM}|${YEAR}|${MONTH}`;
    const REVENUE = revenueMap[key] ?? undefined;

    const inputRow: LeadsInputRow = {
      MONTH,
      TOTAL_LEADS,
      SIGNED,
      REVENUE,
      REVENUE_GOAL: undefined,
      PROP_NOT_SENT: undefined,
      YEAR,
    };

    if (!groupedLeads[PM]) {
      groupedLeads[PM] = [];
    }
    groupedLeads[PM].push(inputRow);
  }

  return groupedLeads;
}
