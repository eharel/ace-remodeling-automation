export function clearExistingCharts(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const charts = sheet.getCharts();
  for (const chart of charts) {
    sheet.removeChart(chart);
  }
}
