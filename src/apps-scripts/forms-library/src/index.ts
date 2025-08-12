// src/apps-scripts/forms-library/src/index.ts
import { registerGlobals } from "@utils/register-globals";
import { onFormSubmit } from "@forms/core/form-router";

// ✅ add these two imports
import { peekEnv, peekRouterContext } from "@forms/core/peek-env";

// Extend the global declarations
declare global {
  var onFormSubmit: (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void;
  var peekEnv: () => void; // ✅ add
  var peekRouterContext: () => void; // ✅ add
}

registerGlobals({
  onFormSubmit,
  peekEnv, // ✅ add
  peekRouterContext, // ✅ add
});
