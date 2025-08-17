import { parseOnboardingResponse } from "./parse-onboarding-response";
import { saveOnboardingDataToSheet } from "./integrations/sheets-integration";
import { createFormHandler } from "@/forms/core/base-form-handler";
import type { OnboardingData } from "../types";

/**
 * Handles onboarding form submissions using the shared form handler pattern
 */
export const handleOnboardingForm = createFormHandler<OnboardingData>({
  parseFunction: parseOnboardingResponse,
  saveFunction: saveOnboardingDataToSheet,
  loggerModule: "Onboarding",
  formIdKey: "ONBOARDING_FORM",
  sheetIdKey: "ONBOARDING_SHEET",
  tabKey: "ONBOARDING_TAB",
});
