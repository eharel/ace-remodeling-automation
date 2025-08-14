// src/forms/core/form-router.ts
import { handleVendorForm } from "../../domains/vendors/core/handle-vendor-form";
import { handleOnboardingForm } from "../../domains/onboarding/core/handle-onboarding-form";

import { getFormsConfig } from "@/forms/config/config";
import type { EnvName } from "@/config/env-name";
import { createLogger } from "@lib/logging/log";

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

  const log = createLogger("FormRouter");
  log.info("Received form submission", {
    formId,
    effectiveMode,
  });

  // Safety check: ensure formId is in expected IDs for current mode
  const expectedFormIds = Object.values(FORM_IDS);
  if (!expectedFormIds.includes(formId)) {
    throw new Error(
      `Form ID ${formId} not found in expected IDs for mode ${effectiveMode}: ${expectedFormIds.join(
        ", "
      )}`
    );
  }

  try {
    switch (formId) {
      case FORM_IDS.VENDOR:
        return handleVendorForm(e, ids);
      case FORM_IDS.ONBOARDING:
        return handleOnboardingForm(e, ids);
    }
  } catch (err) {
    throw err;
  }
}
