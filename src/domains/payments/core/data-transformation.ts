/**
 * Data transformation for payments pipeline
 */

import { log } from "@/lib/logging";
import { PipelineRow, PipelineData } from "../types";

/**
 * Transforms and validates pipeline data
 */
export function transformPipelineData(rows: PipelineRow[]): PipelineData {
  log.info(`Transforming ${rows.length} pipeline rows`);

  const transformedRows = rows
    .map(validateAndCleanRow)
    .filter(Boolean) as PipelineRow[]; // Remove invalid rows

  log.info(`Transformed ${transformedRows.length} valid rows`);

  return {
    rows: transformedRows,
    totalRows: transformedRows.length,
    lastUpdated: new Date(),
  };
}

/**
 * Validates and cleans a single pipeline row
 */
function validateAndCleanRow(row: PipelineRow): PipelineRow | null {
  // Basic validation
  if (!row.date && !row.projectName && !row.clientName) {
    return null; // Skip completely empty rows
  }

  // Clean and normalize data
  return {
    ...row,
    projectName: cleanString(row.projectName),
    clientName: cleanString(row.clientName),
    amount: cleanAmount(row.amount),
    status: cleanString(row.status),
    notes: cleanString(row.notes),
    pm: cleanString(row.pm),
    category: cleanString(row.category),
    murphy: cleanString(row.murphy),
  };
}

/**
 * Cleans and normalizes string values
 */
function cleanString(value: any): string {
  if (typeof value === "string") {
    return value.trim();
  }
  return String(value || "").trim();
}

/**
 * Cleans and validates amount values
 */
function cleanAmount(value: any): number | string {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    if (!cleaned) return "";

    // Remove currency symbols and commas
    const numeric = cleaned.replace(/[$,]/g, "");
    const parsed = parseFloat(numeric);

    return isNaN(parsed) ? cleaned : parsed;
  }

  return "";
}

/**
 * Converts pipeline data to array format for spreadsheet writing
 */
export function convertToSpreadsheetFormat(data: PipelineData): any[][] {
  return data.rows.map((row) => [
    row.date,
    row.projectName,
    row.clientName,
    row.amount,
    row.status,
    row.notes,
    row.pm,
    row.category,
    row.murphy,
  ]);
}

/**
 * Sorts pipeline data by date and project name
 */
export function sortPipelineData(data: PipelineData): PipelineData {
  const sortedRows = [...data.rows].sort((a, b) => {
    // Sort by date first
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    // Then by project name
    return (a.projectName || "").localeCompare(b.projectName || "");
  });

  return {
    ...data,
    rows: sortedRows,
  };
}

/**
 * Filters pipeline data by various criteria
 */
export function filterPipelineData(
  data: PipelineData,
  filters: {
    dateRange?: { start: Date; end: Date };
    pm?: string;
    status?: string;
    category?: string;
  }
): PipelineData {
  let filteredRows = data.rows;

  if (filters.dateRange) {
    filteredRows = filteredRows.filter((row) => {
      const rowDate = row.date instanceof Date ? row.date : new Date(row.date);
      return (
        rowDate >= filters.dateRange!.start && rowDate <= filters.dateRange!.end
      );
    });
  }

  if (filters.pm) {
    filteredRows = filteredRows.filter((row) =>
      row.pm.toLowerCase().includes(filters.pm!.toLowerCase())
    );
  }

  if (filters.status) {
    filteredRows = filteredRows.filter((row) =>
      row.status.toLowerCase().includes(filters.status!.toLowerCase())
    );
  }

  if (filters.category) {
    filteredRows = filteredRows.filter((row) =>
      row.category.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  return {
    rows: filteredRows,
    totalRows: filteredRows.length,
    lastUpdated: data.lastUpdated,
  };
}
