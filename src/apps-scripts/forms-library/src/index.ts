// src/apps-scripts/forms-library/src/index.ts
import { registerGlobals } from "@utils/register-globals";
import { onFormSubmit } from "@forms/core/form-router";

// Extend the global declarations
declare global {
  var onFormSubmit: (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void;
}

registerGlobals({
  onFormSubmit,
});
