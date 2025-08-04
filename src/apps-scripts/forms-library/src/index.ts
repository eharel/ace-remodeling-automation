import { registerGlobals } from "@utils/register-globals";

// Import form handlers for each domain
import { handleVendorForm } from "./domains/vendors/form-handler";

// Form IDs - we'll need to get these from your actual Google Forms
const FORM_IDS = {
  VENDOR: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU", // Copy for testing
  TRADES: "your-trades-form-id-here", // Replace with actual form ID
  KITCHEN_REMODEL: "your-kitchen-form-id-here", // Replace with actual form ID
  BATHROOM_REMODEL: "your-bathroom-form-id-here", // Replace with actual form ID
} as const;

/**
 * Main form submission handler that routes to the appropriate domain handler
 */
export function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  console.log("🚀 onFormSubmit function called!");
  console.log("📧 Event object:", e);

  const formId = FormApp.getActiveForm().getId();
  console.log(`📝 Form submission received for form ID: ${formId}`);

  try {
    switch (formId) {
      case FORM_IDS.VENDOR:
        console.log("🛠️ Routing to vendor form handler");
        return handleVendorForm(e);

      case FORM_IDS.TRADES:
        console.log("🔧 Routing to trades form handler");
        // return handleTradesForm(e);
        throw new Error("Trades form handler not implemented yet");

      case FORM_IDS.KITCHEN_REMODEL:
        console.log("🏠 Routing to kitchen remodel form handler");
        // return handleKitchenRemodelForm(e);
        throw new Error("Kitchen remodel form handler not implemented yet");

      case FORM_IDS.BATHROOM_REMODEL:
        console.log("🚿 Routing to bathroom remodel form handler");
        // return handleBathroomRemodelForm(e);
        throw new Error("Bathroom remodel form handler not implemented yet");

      default:
        console.error(`❌ Unknown form ID: ${formId}`);
        throw new Error(`Unknown form ID: ${formId}`);
    }
  } catch (error) {
    console.error("❌ Error processing form submission:", error);
    throw error;
  }
}

// Register the global function that Apps Script will call
declare global {
  var onFormSubmit: (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void;
}

registerGlobals({
  onFormSubmit,
});
