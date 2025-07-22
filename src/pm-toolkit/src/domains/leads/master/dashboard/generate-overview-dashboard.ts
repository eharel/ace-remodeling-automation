import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { DASHBOARD_SHEET } from "../../pm/core/constants";

export function generateOverviewDashboard() {
  const sheet = getOrCreateLeadsDashboardSheet(DASHBOARD_SHEET);
  sheet.clear();
  // exract data
}
