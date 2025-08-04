import { LIB_IDENTIFIER } from "../constants";

export function buildMainMenu(ui: GoogleAppsScript.Base.Ui) {
  const closeSubMenu = ui
    .createMenu("Close Project")
    .addItem("This Project", `${LIB_IDENTIFIER}.closeActiveProject`)
    .addItem("Other Project...", `${LIB_IDENTIFIER}.promptProjectToClose`);

  return (
    ui
      .createMenu("Ace Remodeling PM Toolkit 🚧")
      .addItem(
        "Update Projects Dashboard",
        `${LIB_IDENTIFIER}.generateProjectDashboard`
      )
      .addItem(
        "Update Leads Dashboard",
        `${LIB_IDENTIFIER}.generateLeadsDashboard`
      )
      .addItem("Add New Project", `${LIB_IDENTIFIER}.promptForNewProject`)
      .addSubMenu(closeSubMenu)
      .addSeparator()
      // .addItem("📂 Open Sidebar", `${LIB_IDENTIFIER}.showSidebar`)
      // .addItem(
      //   "Tab Search (WIP)",
      //   "showTabSearchSidebar"
      //   // `${LIB_IDENTIFIER}.showTabSearchSidebarLocal`
      // )
      // .addSeparator()
      .addItem("📄 Structure Help", `${LIB_IDENTIFIER}.showStructureHelp`)
      .addItem("⚙️ First-time Setup", `${LIB_IDENTIFIER}.showFirstTimeSetup`)
    // .addItem(
    //   "Call getAllTabsLocalTest",
    //   `${LIB_IDENTIFIER}.getAllTabsLocalTest`
    // )
  );
}
