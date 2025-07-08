import { extractLeadsData } from "./extract-leads";
import { LeadsInputRow, LeadsContext } from "./types";
import { LEADS_COLUMNS, LEADS_KEYS } from "./columns";

export function generateLeadsPaymentsDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    ss.getSheetByName("Leads Dashboard") || ss.insertSheet("Leads Dashboard");
  sheet.clear();

  const inputRows: LeadsInputRow[] = extractLeadsData();

  const dashboardRows: LeadsContext[] = inputRows.map((row) => {
    const conversionRate =
      row.totalLeads > 0 ? row.signedProposals / row.totalLeads : 0;

    return {
      rowData: {
        COL_LEADS_YEAR: row.year,
        COL_LEADS_MONTH: row.month,
        COL_TOTAL_LEADS: row.totalLeads,
        COL_SIGNED_PROPOSALS: row.signedProposals,
        COL_APPROVED_REVENUE: row.approvedRevenue,
        COL_CONVERSION_RATE: conversionRate,
      },
    };
  });

  // Header
  const headers = LEADS_COLUMNS.map((col) => col.label);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Data rows
  const values = dashboardRows.map((ctx) =>
    LEADS_COLUMNS.map((col) => (col.valueFn ? col.valueFn(ctx) : ""))
  );

  if (values.length > 0) {
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }

  // Group by quarter
  type QuarterKey = `${number}-Q${number}`;
  const grouped = new Map<QuarterKey, LeadsContext[]>();

  for (const row of dashboardRows) {
    const q = Math.ceil(Number(row.rowData[LEADS_KEYS.MONTH]) / 3);
    const key = `${row.rowData[LEADS_KEYS.YEAR]}-Q${q}` as QuarterKey;
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
  const quarterStartRow = values.length + 4;
  sheet
    .getRange(quarterStartRow, 1, 1, quarterHeaders.length)
    .setValues([quarterHeaders]);

  const quarterValues = Array.from(grouped.entries()).map(([key, rows]) => {
    const [year, qStr] = key.split("-Q");
    const totalLeads = rows.reduce(
      (sum, r) => sum + Number(r.rowData[LEADS_KEYS.TOTAL_LEADS]),
      0
    );
    const signed = rows.reduce(
      (sum, r) => sum + Number(r.rowData[LEADS_KEYS.SIGNED]),
      0
    );
    const revenue = rows.reduce(
      (sum, r) => sum + Number(r.rowData[LEADS_KEYS.REVENUE]),
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
