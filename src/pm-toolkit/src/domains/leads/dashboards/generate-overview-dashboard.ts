import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { DASHBOARD_SHEET } from "../core/constants";

export function generateOverviewDashboard() {
  const sheet = getOrCreateLeadsDashboardSheet(DASHBOARD_SHEET);
  // exract data
}
