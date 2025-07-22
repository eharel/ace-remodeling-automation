import { registerGlobals } from "@utils/register-globals";

import { onOpen, onEdit } from "./main";
import { showStructureHelp, showFirstTimeSetup } from "./menu/modals";
import {
  closeActiveProject,
  promptProjectToClose,
} from "./domains/projects/close-project";
import { generateProjectDashboard } from "./domains/projects/dashboard";
import { generateOverviewDashboard } from "./domains/leads/dashboards/generate-overview-dashboard";
import { promptForNewProject } from "./domains/projects/new-project";
import { generateLeadsDashboard } from "./domains/leads";
import { showSidebar } from "../../ui/sidebar/showSidebar";
import { showTabSearchSidebar } from "../../ui/sidebar/modules/tab-search/showTabSearchSidebar";
import { SHARED_GLOBALS } from "../../globals/global-exports";

declare global {
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
  var onOpen: () => void;
  var showStructureHelp: () => void;
  var showFirstTimeSetup: () => void;
  var closeActiveProject: () => void;
  var promptProjectToClose: () => void;
  var generateProjectDashboard: () => void;
  var promptForNewProject: () => void;
  var generateLeadsDashboard: () => void;
  var generateOverviewDashboard: () => void;
  var showSidebar: () => void;
  var showTabSearchSidebar: () => void;
}

// Register all global functions that Apps Script will call directly
registerGlobals({
  // Core Apps Script triggers must be registered first
  onOpen,
  onEdit,

  // Menu functions
  showStructureHelp,
  showFirstTimeSetup,
  closeActiveProject,
  promptProjectToClose,
  generateProjectDashboard,
  promptForNewProject,
  generateLeadsDashboard,
  generateOverviewDashboard,

  // UI functions
  showSidebar,
  showTabSearchSidebar,

  // Include shared globals (utility functions used by UI)
  ...SHARED_GLOBALS,
});
