/**
 * Payments domain types
 */

export interface PipelineRow {
  date: Date | string;
  asaf: string;
  name: string;
  project: string;
  amount: number | string;
  how: string;
  comment: string;
  confirmation: string;
  murphy: string;
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
