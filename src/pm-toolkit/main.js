function onEdit(e) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  if (sheetName === PROJECT_DASHBOARD_SHEET_NAME) return;

  if (startsWithProjectNumber(sheetName)) {
    generateProjectDashboard();
  }
}