// Import the main functions from the payments domain
import {
  updatePipeline,
  onOpen,
  onEdit,
  applyAsafCheckboxFormatting,
  getPipelineStats,
  showWeeklySummary,
  refreshSummary,
} from "../../../domains/payments/main";

// Register the global functions that Apps Script will call
declare global {
  var updatePipeline: () => void;
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
  var onOpen: () => void;
  var applyAsafCheckboxFormatting: (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    row: number
  ) => void;
  var getPipelineStats: () => any;
  var showWeeklySummary: () => void;
  var refreshSummary: () => any;
}

// Direct global assignment (like PM toolkit)
globalThis.updatePipeline = updatePipeline;
globalThis.onEdit = onEdit;
globalThis.onOpen = onOpen;
globalThis.applyAsafCheckboxFormatting = applyAsafCheckboxFormatting;
globalThis.getPipelineStats = getPipelineStats;
globalThis.showWeeklySummary = showWeeklySummary;
globalThis.refreshSummary = refreshSummary;
