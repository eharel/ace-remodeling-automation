export function showTabSearchSidebarLocal(): void {
  const html = HtmlService.createHtmlOutputFromFile("tab-search/sidebar.html")
    .setTitle("Tab Search")
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
}

export function getAllTabsLocal(): any {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ss.getSheets().map((sheet) => ({
    name: sheet.getName(),
    index: sheet.getIndex(),
  }));

  console.log("🧪 LOCAL getAllTabsLocal(): about to return:");
  console.log(JSON.stringify(tabs, null, 2));

  return tabs;
}

export function activateTabLocal(name: string): void {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (sheet) ss.setActiveSheet(sheet);
}

export function getAllTabsLocalTest(): { name: string; index: number }[] {
  return [
    { name: "Dashboard", index: 1 },
    { name: "Leads 2024", index: 2 },
    { name: "Projects", index: 3 },
    { name: "Archived", index: 4 },
  ];
}
