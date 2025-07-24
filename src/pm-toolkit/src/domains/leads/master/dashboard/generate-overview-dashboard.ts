import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "../core/data-extraction";
import { createMonthlyDashboardRows } from "../../shared/data-transformation";
import { transformData } from "../core/data-transformation";

export function generateOverviewDashboard() {
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const inputRowsByPM = extractData();
  const dashboardRowsByPM = transformData(inputRowsByPM);
  console.log("Dashboard rows by PM:", dashboardRowsByPM);
}
