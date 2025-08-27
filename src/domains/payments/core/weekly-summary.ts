import { log } from "../../../lib/logging";

/**
 * Weekly Summary Sidebar Module
 *
 * This module provides weekly expense summaries in a sidebar for monthly payment sheets.
 */

export interface WeeklyData {
  week: number;
  startDate: string;
  endDate: string;
  total: number;
  formattedTotal: string;
}

export interface WeeklySummaryResult {
  sheetName: string;
  weeks: WeeklyData[];
  grandTotal: string;
}

export interface WeeklySummaryError {
  error: string;
}

export type WeeklySummaryResponse = WeeklySummaryResult | WeeklySummaryError;

/**
 * Shows the weekly summary sidebar
 */
export function showWeeklySummary(): void {
  const html = HtmlService.createTemplateFromFile(
    "domains/payments/ui/sidebar/modules/weekly-summary/WeeklySummarySidebar"
  );
  html.weeklyData = getWeeklyTotals();
  html.sheetName = SpreadsheetApp.getActiveSheet().getName();

  const htmlOutput = html.evaluate().setTitle("Weekly Summary").setWidth(300);

  SpreadsheetApp.getUi().showSidebar(htmlOutput);

  log.info("Weekly Summary sidebar opened", { sheetName: html.sheetName });
}

/**
 * Refreshes the weekly summary data
 * Called from the sidebar to refresh data
 */
export function refreshSummary(): WeeklySummaryResponse {
  return getWeeklyTotals();
}

/**
 * Gets weekly totals for the current sheet
 */
export function getWeeklyTotals(): WeeklySummaryResponse {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();

  // Define excluded sheets
  const excludedSheets = [
    "Month Template",
    "Dashboard",
    "Summary",
    "Settings",
    "Template",
  ];

  // Check if this is an excluded sheet
  const isExcluded = excludedSheets.some((excluded) =>
    sheetName.toLowerCase().includes(excluded.toLowerCase())
  );

  if (isExcluded) {
    return { error: "Please select a monthly payment sheet" };
  }

  // Additional check: ensure this looks like a payments sheet
  const dataRange = sheet.getDataRange();
  if (dataRange.getNumRows() < 2) {
    return { error: "No payment data found in this sheet" };
  }

  const values = dataRange.getValues();
  const headerRow = values[0];

  // Check if this has payment-related columns
  const hasPaymentColumns = headerRow.some((header) =>
    ["date", "amount", "payment", "total"].some((keyword) =>
      header.toString().toLowerCase().includes(keyword)
    )
  );

  if (!hasPaymentColumns) {
    return { error: "This doesn't appear to be a payments sheet" };
  }

  // Find date and amount columns (adjust indices as needed)
  const dateCol = 0; // Column A
  const amountCol = 4; // Column E

  const weeklyTotals: WeeklyData[] = [];
  let currentWeekStart: Date | null = null;
  let currentWeekEnd: Date | null = null;
  let currentWeekTotal = 0;
  let weekNumber = 1;

  // Skip header row
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const dateValue = row[dateCol];
    const amountValue = parseFloat(row[amountCol]) || 0;

    if (!dateValue) continue;

    const date = new Date(dateValue);

    // Detect week boundaries (when there's a gap or visual break)
    if (isNewWeek(date, currentWeekEnd)) {
      // Save previous week if it exists
      if (currentWeekStart) {
        weeklyTotals.push({
          week: weekNumber - 1,
          startDate: formatDate(currentWeekStart),
          endDate: formatDate(currentWeekEnd),
          total: currentWeekTotal,
          formattedTotal: formatCurrency(currentWeekTotal),
        });
      }

      // Start new week
      currentWeekStart = date;
      currentWeekTotal = 0;
      weekNumber++;
    }

    currentWeekEnd = date;
    currentWeekTotal += amountValue;
  }

  // Add final week
  if (currentWeekStart) {
    weeklyTotals.push({
      week: weekNumber - 1,
      startDate: formatDate(currentWeekStart),
      endDate: formatDate(currentWeekEnd),
      total: currentWeekTotal,
      formattedTotal: formatCurrency(currentWeekTotal),
    });
  }

  const grandTotal = formatCurrency(
    weeklyTotals.reduce((sum, week) => sum + week.total, 0)
  );

  log.info("Weekly totals calculated", {
    sheetName,
    weekCount: weeklyTotals.length,
    grandTotal,
  });

  return {
    sheetName,
    weeks: weeklyTotals,
    grandTotal,
  };
}

/**
 * Determines if a new week should start based on date gaps
 */
function isNewWeek(currentDate: Date, lastDate: Date | null): boolean {
  if (!lastDate) return true;

  // Check if there's more than 2 days gap (indicates week break)
  const daysDiff =
    (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff > 2;
}

/**
 * Formats a date as MM/DD
 */
function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Formats currency as USD
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Refreshes the sidebar if it's currently open
 * Called from onEdit to update the sidebar when data changes
 */
export function refreshSidebarIfOpen(): void {
  try {
    const html = HtmlService.createTemplateFromFile(
      "domains/payments/ui/sidebar/modules/weekly-summary/WeeklySummarySidebar"
    );
    html.weeklyData = getWeeklyTotals();
    html.sheetName = SpreadsheetApp.getActiveSheet().getName();

    const htmlOutput = html.evaluate().setTitle("Weekly Summary").setWidth(300);

    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  } catch (error) {
    // Sidebar might not be open, which is fine
    log.info("Sidebar refresh skipped", { error: String(error) });
  }
}

/**
 * Determines if a sidebar update is needed based on the edited range
 */
export function shouldUpdateSidebar(
  editedRange: GoogleAppsScript.Spreadsheet.Range
): boolean {
  // Check if the edit affects columns that impact weekly totals
  const startCol = editedRange.getColumn();
  const endCol = editedRange.getLastColumn();

  // Update if Date column (A=1) or Amount column (E=5) was edited
  const dateCol = 1;
  const amountCol = 5;

  return (
    (startCol <= dateCol && endCol >= dateCol) ||
    (startCol <= amountCol && endCol >= amountCol)
  );
}
