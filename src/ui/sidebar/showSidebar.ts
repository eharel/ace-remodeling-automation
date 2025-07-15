export function showSidebar(): void {
  const html =
    HtmlService.createHtmlOutputFromFile("ui/sidebar/Sidebar").setTitle(
      "Ace Toolkit"
    );
  SpreadsheetApp.getUi().showSidebar(html);
}
