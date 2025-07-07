import { extractLeadsData } from "./extract-leads";

export function generateLeadsPaymentsDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    ss.getSheetByName("Leads Dashboard") || ss.insertSheet("Leads Dashboard");
  sheet.clear();

  const data = extractLeadsData();

  // Header
  const headers = [
    "Year",
    "Month",
    "Total Leads",
    "Signed Proposals",
    "Approved Revenue",
    "Conversion Rate (%)",
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Data rows
  const values = data.map((row) => [
    row.year,
    row.month,
    row.totalLeads,
    row.signedProposals,
    row.approvedRevenue,
    Math.round(row.conversionRate * 10000) / 100, // e.g. 23.46%
  ]);

  if (values.length > 0) {
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }

  // --- Group data by quarter ---
  type QuarterKey = `${number}-Q${number}`;
  const grouped = new Map<QuarterKey, typeof data>();

  for (const row of data) {
    const q = Math.ceil(row.month / 3);
    const key = `${row.year}-Q${q}` as QuarterKey;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  // --- Write quarterly headers ---
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

  // --- Write quarterly values ---
  const quarterValues = Array.from(grouped.entries()).map(([key, rows]) => {
    const [year, qStr] = key.split("-Q");
    const totalLeads = rows.reduce((sum, r) => sum + r.totalLeads, 0);
    const signed = rows.reduce((sum, r) => sum + r.signedProposals, 0);
    const revenue = rows.reduce((sum, r) => sum + r.approvedRevenue, 0);
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
