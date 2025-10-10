/**
 * Utilities for payments domain
 */

import { log } from "@/lib/logging";
import { MONTHLY_SHEET_REGEX } from "../constants";

/**
 * Validates if a sheet name follows the monthly pattern
 */
export function isValidMonthlySheet(sheetName: string): boolean {
  return MONTHLY_SHEET_REGEX.test(sheetName);
}

/**
 * Extracts month and year from a monthly sheet name
 */
export function parseMonthlySheetName(
  sheetName: string
): { month: string; year: number } | null {
  const match = sheetName.match(/^(\w+) (\d{4})$/);
  if (!match) return null;

  return {
    month: match[1],
    year: parseInt(match[2], 10),
  };
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    return date;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats currency amounts
 */
export function formatCurrency(amount: number | string): string {
  if (typeof amount === "string") {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return amount;
    amount = parsed;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Validates business hours
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  return day >= 1 && day <= 5 && hour >= 7 && hour <= 18;
}

/**
 * Gets the current business day status
 */
export function getBusinessDayStatus(): {
  isBusinessDay: boolean;
  isBusinessHours: boolean;
  nextBusinessDay: Date;
} {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isBusinessDay = day >= 1 && day <= 5;
  const isBusinessHours = isBusinessDay && hour >= 7 && hour <= 18;

  // Calculate next business day
  const nextBusinessDay = new Date(now);
  if (day === 0) {
    // Sunday
    nextBusinessDay.setDate(now.getDate() + 1);
  } else if (day === 6) {
    // Saturday
    nextBusinessDay.setDate(now.getDate() + 2);
  } else if (hour >= 18) {
    // After business hours
    nextBusinessDay.setDate(now.getDate() + 1);
  }

  return {
    isBusinessDay,
    isBusinessHours,
    nextBusinessDay,
  };
}

/**
 * Sanitizes data for spreadsheet storage
 */
export function sanitizeForSpreadsheet(value: any): any {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return isNaN(value) ? "" : value;
  }

  if (value instanceof Date) {
    return value;
  }

  return String(value);
}

/**
 * Validates pipeline row data
 */
export function validatePipelineRow(row: any[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check minimum required fields
  if (!row[0] && !row[1] && !row[2]) {
    errors.push("Row is completely empty");
  }

  // Validate date if present
  if (row[0]) {
    const date = new Date(row[0]);
    if (isNaN(date.getTime())) {
      errors.push("Invalid date format");
    }
  }

  // Validate amount if present
  if (row[3]) {
    const amount = parseFloat(row[3]);
    if (isNaN(amount) || amount < 0) {
      errors.push("Invalid amount");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a summary of pipeline data
 */
export function createPipelineSummary(data: any[][]): {
  totalRows: number;
  totalAmount: number;
  uniqueProjects: number;
  uniqueClients: number;
  byStatus: Record<string, number>;
  byPM: Record<string, number>;
} {
  const summary = {
    totalRows: data.length,
    totalAmount: 0,
    uniqueProjects: new Set<string>(),
    uniqueClients: new Set<string>(),
    byStatus: {} as Record<string, number>,
    byPM: {} as Record<string, number>,
  };

  data.forEach((row) => {
    // Calculate total amount
    const amount = parseFloat(row[3]) || 0;
    summary.totalAmount += amount;

    // Track unique projects and clients
    if (row[1]) summary.uniqueProjects.add(row[1]);
    if (row[2]) summary.uniqueClients.add(row[2]);

    // Count by status
    const status = row[4] || "Unknown";
    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

    // Count by PM
    const pm = row[6] || "Unknown";
    summary.byPM[pm] = (summary.byPM[pm] || 0) + 1;
  });

  return {
    ...summary,
    uniqueProjects: summary.uniqueProjects.size,
    uniqueClients: summary.uniqueClients.size,
  };
}
