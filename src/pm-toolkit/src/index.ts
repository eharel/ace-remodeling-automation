import { registerGlobals } from "@utils/register-globals";

import { onOpen, onEdit } from "./main";
import { showStructureHelp, showFirstTimeSetup } from "./menu/modals";
import {
  closeActiveProject,
  promptProjectToClose,
} from "./domains/projects/close-project";
import { generateProjectDashboard } from "./domains/projects/dashboard";
import { promptForNewProject } from "./domains/projects/new-project";
import { generateLeadsDashboard } from "./domains/leads";

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
}

registerGlobals({
  onOpen,
  onEdit,
  showStructureHelp,
  showFirstTimeSetup,
  closeActiveProject,
  promptProjectToClose,
  generateProjectDashboard,
  promptForNewProject,
  generateLeadsDashboard,
});
