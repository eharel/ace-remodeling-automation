export function loadSidebarModule(moduleName: string): string {
  return HtmlService.createHtmlOutputFromFile(
    `ui/sidebar/modules/${moduleName}`
  ).getContent();
}
