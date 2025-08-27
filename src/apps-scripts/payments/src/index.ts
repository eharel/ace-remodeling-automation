// Import the main functions from the payments domain
import {
  updatePipeline,
  autoUpdatePipeline,
  onOpen,
  onEdit,
  applyPipelineFormatting,
  applyEnhancedFormatting,
  applyAsafCheckboxFormatting,
  getPipelineStats,
} from "../../../domains/payments/main";

// Register the global functions that Apps Script will call
declare global {
  var updatePipeline: () => void;
  var autoUpdatePipeline: () => void;
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
  var onOpen: () => void;
  var applyPipelineFormatting: (
    sheet: GoogleAppsScript.Spreadsheet.Sheet
  ) => void;
  var applyEnhancedFormatting: () => void;
  var applyAsafCheckboxFormatting: (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    row: number
  ) => void;
  var getPipelineStats: () => any;
}

// Direct global assignment (like PM toolkit)
globalThis.updatePipeline = updatePipeline;
globalThis.autoUpdatePipeline = autoUpdatePipeline;
globalThis.onEdit = onEdit;
globalThis.onOpen = onOpen;
globalThis.applyPipelineFormatting = applyPipelineFormatting;
globalThis.applyEnhancedFormatting = applyEnhancedFormatting;
globalThis.applyAsafCheckboxFormatting = applyAsafCheckboxFormatting;
globalThis.getPipelineStats = getPipelineStats;
