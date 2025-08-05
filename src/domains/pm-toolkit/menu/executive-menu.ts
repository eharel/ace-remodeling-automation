import { LIB_IDENTIFIER } from "../constants";

export function buildExecutiveMenu(ui: GoogleAppsScript.Base.Ui): void {
  ui.createMenu("Ace Remodeling Executive 🧠")
    .addItem(
      "Update Executive Leads Dashboard",
      `${LIB_IDENTIFIER}.generateOverviewDashboard`
    )
    // Optional future items:
    // .addItem("Sync Leads DB", `${LIB_IDENTIFIER}.syncAllLeadsData`)
    .addToUi();
}
