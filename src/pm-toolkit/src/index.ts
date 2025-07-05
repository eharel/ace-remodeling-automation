// src/index.ts

declare global {
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
  var onOpen: () => void;
  var showStructureHelp: () => void;
  var showFirstTimeSetup: () => void;
  var closeActiveProject: () => void;
  var promptProjectToClose: () => void;
  var generateProjectDashboard: () => void;
  var promptForNewProject: () => void;
}

import { onEdit } from "./onedit-handler";
import { onOpen, showStructureHelp, showFirstTimeSetup } from "./menu";
import { closeActiveProject, promptProjectToClose } from "./close-project";
import { generateProjectDashboard } from "./dashboard/generate-dashboard";
import { promptForNewProject } from "./new-project";

// ✅ Register globally for Apps Script
globalThis.onEdit = onEdit;
globalThis.onOpen = onOpen;
globalThis.showStructureHelp = showStructureHelp;
globalThis.showFirstTimeSetup = showFirstTimeSetup;
globalThis.closeActiveProject = closeActiveProject;
globalThis.promptProjectToClose = promptProjectToClose;
globalThis.generateProjectDashboard = generateProjectDashboard;
globalThis.promptForNewProject = promptForNewProject;
