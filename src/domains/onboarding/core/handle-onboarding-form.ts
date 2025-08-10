import { parseOnboardingResponse } from "./parse-onboarding-response";
import { saveOnboardingDataToSheet } from "./integrations/sheets-integration";

/**
 * Handles onboarding form submissions
 */
export function handleOnboardingForm(
  e: GoogleAppsScript.Events.FormsOnFormSubmit
) {
  console.log("🛠️ Processing onboarding form submission...");

  try {
    // Extract raw form data
    const rawFormData = e.response
      .getItemResponses()
      .reduce((acc, itemResponse) => {
        const question = itemResponse.getItem().getTitle();
        const answer = itemResponse.getResponse();

        // Handle different response types
        let answerString: string;
        if (Array.isArray(answer)) {
          answerString = answer.join(", ");
        } else {
          answerString = String(answer);
        }

        acc[question] = answerString;
        return acc;
      }, {} as Record<string, string>);

    console.log("📋 Raw form data extracted");

    // Parse the raw data into our OnboardingFormData type
    const onboardingData = parseOnboardingResponse(rawFormData);
    console.log("✅ Onboarding data parsed successfully");

    // Save to Google Sheets
    saveOnboardingDataToSheet(onboardingData);
    console.log("📊 Onboarding data saved to Google Sheets");

    console.log("🎉 Onboarding form processed successfully");
  } catch (error) {
    console.error("❌ Error processing onboarding form:", error);
    throw error;
  }
}
