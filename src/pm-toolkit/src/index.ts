import { registerGlobals } from "./register-globals";

import { onOpen, onEdit } from "./main";
import { showStructureHelp, showFirstTimeSetup } from "./menu/modals";
import {
  closeActiveProject,
  promptProjectToClose,
} from "./projects/close-project";
import { generateProjectDashboard } from "./projects/dashboard";
import { promptForNewProject } from "./projects/new-project";
import { generateLeadsPaymentsDashboard } from "./leads-payments";

declare global {
  var onEdit: (e: GoogleAppsScript.Events.SheetsOnEdit) => void;
  var onOpen: () => void;
  var showStructureHelp: () => void;
  var showFirstTimeSetup: () => void;
  var closeActiveProject: () => void;
  var promptProjectToClose: () => void;
  var generateProjectDashboard: () => void;
  var promptForNewProject: () => void;
  var generateLeadsPaymentsDashboard: () => void;
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
  generateLeadsPaymentsDashboard,
});
