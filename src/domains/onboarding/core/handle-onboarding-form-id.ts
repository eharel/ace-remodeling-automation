import { parseOnboardingResponseById } from "./parse-onboarding-response-id";
import { saveOnboardingDataToSheet } from "./integrations/sheets-integration";
import { createLogger, errFields } from "@lib/logging/log";
import type { OnboardingData } from "../types";
import type { FormsIds } from "@/forms/config/config";

export interface FormDataWithMetadata<T> {
  data: T;
  uuid: string;
  submittedAt: string;
}

/**
 * Handles onboarding form submissions using ID-based field matching
 */
export function handleOnboardingFormById(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  ids: FormsIds,
  environment: "development" | "production" = "development"
) {
  const log = createLogger("Onboarding", {
    bound: { formId: ids.ONBOARDING_FORM as string },
  });
  const span = log.start("Handle onboarding form submission (ID-based)");

  let error: Error | undefined;
  try {
    log.info("Processing form response with ID-based matching", {
      environment,
    });

    // Use the ID-based parser directly with the form response
    const parsedData = parseOnboardingResponseById(e.response, environment);

    const formDataWithMetadata: FormDataWithMetadata<OnboardingData> = {
      data: parsedData,
      uuid: Utilities.getUuid(),
      submittedAt: new Date().toISOString(),
    };

    // Save to Google Sheets
    const sheetId = ids.ONBOARDING_SHEET as string;
    const tabName = ids.ONBOARDING_TAB as string;

    saveOnboardingDataToSheet(formDataWithMetadata, sheetId, tabName);

    log.info("Saved onboarding data to sheet", {
      sheetId,
      tab: tabName,
      environment,
    });
  } catch (err) {
    error = err as Error;
    log.error("Error processing onboarding form", errFields(error));
    throw error;
  } finally {
    span.end({ success: !error });
  }
}
