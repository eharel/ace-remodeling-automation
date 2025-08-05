import { registerGlobals } from "@utils/register-globals";

// Import the main function from the forms router
import { onFormSubmit } from "@forms/core/form-router";

// Register the global function that Apps Script will call
declare global {
  var onFormSubmit: (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void;
}

registerGlobals({
  onFormSubmit,
});
