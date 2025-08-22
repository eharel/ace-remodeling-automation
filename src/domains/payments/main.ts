/**
 * Main entry point for payments domain
 * This file exports all functions that need to be accessible from Google Apps Script
 */

import { log } from "@/lib/logging";
import {
  updatePipeline,
  autoUpdatePipeline,
  handleMonthlySheetEdit,
  setupPipelineMenu,
  applyEnhancedFormatting,
  getPipelineStats,
} from "./core/pipeline-manager";
import { applyPipelineFormatting } from "./core/formatting";

// Export functions for Google Apps Script
declare const global: any;

// Main pipeline functions
global.updatePipeline = updatePipeline;
global.autoUpdatePipeline = autoUpdatePipeline;
global.applyPipelineFormatting = applyPipelineFormatting;
global.applyEnhancedFormatting = applyEnhancedFormatting;
global.getPipelineStats = getPipelineStats;

// Event handlers
global.onEdit = handleMonthlySheetEdit;
global.onOpen = setupPipelineMenu;

// Legacy function names for backward compatibility
global.getPipelineData = () => {
  log.warn("getPipelineData is deprecated. Use updatePipeline instead.");
  updatePipeline();
};

// Export for module system
export {
  updatePipeline,
  autoUpdatePipeline,
  handleMonthlySheetEdit,
  setupPipelineMenu,
  applyPipelineFormatting,
  applyEnhancedFormatting,
  getPipelineStats,
};
