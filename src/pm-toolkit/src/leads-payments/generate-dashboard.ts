import { extractLeadsData } from "./extract-leads";
import { LeadsInputRow } from "./types";
import { LEADS_COLUMNS, LEADS_KEYS } from "./columns";
import { generateAndStylizeTableFromRows } from "../utils/table-builder";
import { LEADS_PAYMENTS_DASHBOARD_SHEET } from "./constants";

export function generateLeadsPaymentsDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    ss.getSheetByName(LEADS_PAYMENTS_DASHBOARD_SHEET) ||
    ss.insertSheet(LEADS_PAYMENTS_DASHBOARD_SHEET);
  sheet.clear();

  const inputRows: LeadsInputRow[] = extractLeadsData();

  const dashboardRows = inputRows.map((row) => ({
    COL_LEADS_YEAR: row.year,
    COL_LEADS_MONTH: row.month,
    COL_TOTAL_LEADS: row.totalLeads,
    COL_SIGNED_PROPOSALS: row.signedProposals,
    COL_APPROVED_REVENUE: row.approvedRevenue,
    COL_CONVERSION_RATE:
      row.totalLeads > 0 ? row.signedProposals / row.totalLeads : 0,
  }));

  const tableInfo = generateAndStylizeTableFromRows(
    sheet,
    dashboardRows,
    1,
    1,
    "📈 Leads — Monthly Breakdown",
    LEADS_COLUMNS,
    [LEADS_KEYS.REVENUE],
    [LEADS_KEYS.CONVERSION_RATE]
  );

  // Group by quarter
  type QuarterKey = `${number}-Q${number}`;
  type DashboardRow = (typeof dashboardRows)[number];
  const grouped = new Map<QuarterKey, DashboardRow[]>();

  for (const row of dashboardRows) {
    const q = Math.ceil(Number(row[LEADS_KEYS.MONTH]) / 3);
    const key = `${row[LEADS_KEYS.YEAR]}-Q${q}` as QuarterKey;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  // Quarterly section
  const quarterHeaders = [
    "Year",
    "Quarter",
    "Total Leads",
    "Signed Proposals",
    "Approved Revenue",
    "Avg Conversion Rate (%)",
  ];

  const quarterStartRow = tableInfo.summaryRow
    ? tableInfo.summaryRow + 4
    : tableInfo.dataEndRow + 4;
  sheet
    .getRange(quarterStartRow, 1, 1, quarterHeaders.length)
    .setValues([quarterHeaders]);

  const quarterValues = Array.from(grouped.entries()).map(([key, rows]) => {
    const [year, qStr] = key.split("-Q");
    const totalLeads = rows.reduce(
      (sum, r) => sum + Number(r[LEADS_KEYS.TOTAL_LEADS]),
      0
    );
    const signed = rows.reduce(
      (sum, r) => sum + Number(r[LEADS_KEYS.SIGNED]),
      0
    );
    const revenue = rows.reduce(
      (sum, r) => sum + Number(r[LEADS_KEYS.REVENUE]),
      0
    );
    const avgConversion = totalLeads > 0 ? signed / totalLeads : 0;

    return [
      Number(year),
      `Q${qStr}`,
      totalLeads,
      signed,
      revenue,
      Math.round(avgConversion * 10000) / 100,
    ];
  });

  sheet
    .getRange(
      quarterStartRow + 1,
      1,
      quarterValues.length,
      quarterHeaders.length
    )
    .setValues(quarterValues);
}
