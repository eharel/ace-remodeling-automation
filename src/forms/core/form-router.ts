// src/forms/core/form-router.ts
import { handleVendorForm } from "../../domains/vendors/core/handle-vendor-form";
import { handleOnboardingForm } from "../../domains/onboarding/core/handle-onboarding-form";

import { getFormsConfig } from "@/forms/config/config";
import type { EnvName } from "@/config/env-types";

/**
 * Library entry. The HOST should pass `mode` based on its Script Properties.
 * If `mode` is omitted, we default to 'development' as a safe fallback.
 */
export function onFormSubmit(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  mode?: EnvName
) {
  const effectiveMode: EnvName =
    mode === "production" || mode === "staging" || mode === "development"
      ? mode
      : "development";

  const ids = getFormsConfig(effectiveMode);

  // ID table for routing in this execution
  const FORM_IDS = {
    VENDOR: ids.VENDOR_FORM,
    ONBOARDING: ids.ONBOARDING_FORM,
  } as const;

  // Prefer e.source in installable triggers; fallback to active form
  const formId =
    (e?.source as GoogleAppsScript.Forms.Form)?.getId() ??
    FormApp.getActiveForm().getId();

  Logger.log("[FORM ROUTER] mode=%s formId=%s", effectiveMode, formId);

  try {
    switch (formId) {
      case FORM_IDS.VENDOR:
        return handleVendorForm(e);
      case FORM_IDS.ONBOARDING:
        return handleOnboardingForm(e);
      default:
        throw new Error(`Unknown form ID: ${formId}`);
    }
  } catch (err) {
    throw err;
  }
}
