import { registerGlobals } from "@utils/register-globals";

// Import the main functions from the pm-toolkit domain
import { onOpen, onEdit } from "../../../domains/pm-toolkit/main";

// Register the global functions that Apps Script will call
declare global {
  var onOpen: () => void;
  var onEdit: () => void;
}

registerGlobals({
  onOpen,
  onEdit,
});
