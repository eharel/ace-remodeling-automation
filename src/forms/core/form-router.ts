import { handleVendorForm } from "../../domains/vendors/core/handle-vendor-form";
import { handleOnboardingForm } from "../../domains/onboarding/core/handle-onboarding-form";

// Form IDs - we'll need to get these from your actual Google Forms
const FORM_IDS = {
  VENDOR: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU", // Copy for testing
  ONBOARDING: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY", // Dev onboarding form
  TRADES: "your-trades-form-id-here", // Replace with actual form ID
  KITCHEN_REMODEL: "your-kitchen-form-id-here", // Replace with actual form ID
  BATHROOM_REMODEL: "your-bathroom-form-id-here", // Replace with actual form ID
} as const;

/**
 * Main form submission handler that routes to the appropriate domain handler
 */
export function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {

  const formId = FormApp.getActiveForm().getId();

  try {
    switch (formId) {
      case FORM_IDS.VENDOR:
        return handleVendorForm(e);

      case FORM_IDS.ONBOARDING:
        return handleOnboardingForm(e);

      case FORM_IDS.TRADES:
        // return handleTradesForm(e);
        throw new Error("Trades form handler not implemented yet");

      case FORM_IDS.KITCHEN_REMODEL:
        // return handleKitchenRemodelForm(e);
        throw new Error("Kitchen remodel form handler not implemented yet");

      case FORM_IDS.BATHROOM_REMODEL:
        // return handleBathroomRemodelForm(e);
        throw new Error("Bathroom remodel form handler not implemented yet");

      default:
        throw new Error(`Unknown form ID: ${formId}`);
    }
  } catch (error) {
    throw error;
  }
}
