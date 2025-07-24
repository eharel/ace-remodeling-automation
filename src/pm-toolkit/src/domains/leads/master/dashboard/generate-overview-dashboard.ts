import { getOrCreateLeadsDashboardSheet } from "@pm/utils";
import { OVERVIEW_SHEET } from "../../pm/core/constants";
import { extractData } from "../core/data-extraction";

export function generateOverviewDashboard() {
  console.log("Generating overview dashboard...");
  const sheet = getOrCreateLeadsDashboardSheet(OVERVIEW_SHEET);
  sheet.clear();
  const data = extractData();
  console.log("Data extracted:", data);
}
