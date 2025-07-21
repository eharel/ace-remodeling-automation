// export function loadSidebarModule(moduleName: string): string {
//   Logger.log(`Loading sidebar module: ${moduleName}`);
//   const htmlPath = `ui/sidebar/modules/${moduleName}/${capitalizeModuleName(
//     moduleName
//   )}.html`;
//   Logger.log(`HTML path: ${htmlPath}`);
//   return HtmlService.createHtmlOutputFromFile(htmlPath).getContent();
// }

export function loadSidebarModule(moduleName: string): string {
  console.log("🧪 Hardcoded test for TabSearchSidebar");
  return HtmlService.createHtmlOutputFromFile(
    "ui/sidebar/modules/tab-search/TabSearchSidebar.html"
  ).getContent();
}

function capitalizeModuleName(moduleName: string): string {
  const parts = moduleName.split("-");
  return (
    parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("") +
    "Sidebar"
  );
}
