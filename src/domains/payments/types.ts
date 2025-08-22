/**
 * Payments domain types
 */

export interface PipelineRow {
  date: Date | string;
  projectName: string;
  clientName: string;
  amount: number | string;
  status: string;
  notes: string;
  pm: string;
  category: string;
  murphy: string; // Renamed from "Shay" to "Murphy"
  monthValue: Date | string; // Computed month value for grouping
}

export interface PipelineData {
  rows: PipelineRow[];
  totalRows: number;
  lastUpdated: Date;
}

export interface MonthlySheetData {
  sheetName: string;
  rows: PipelineRow[];
  rowCount: number;
}

export interface PipelineUpdateOptions {
  autoUpdate?: boolean;
  businessHoursOnly?: boolean;
  validateData?: boolean;
  applyFormatting?: boolean;
}

export interface DateGroupBorder {
  rowIndex: number;
  dateValue: string;
  hasBorder: boolean;
}
