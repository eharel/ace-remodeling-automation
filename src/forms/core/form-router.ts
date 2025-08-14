// src/forms/core/form-router.ts
import { handleVendorForm } from "../../domains/vendors/core/handle-vendor-form";
import { handleOnboardingForm } from "../../domains/onboarding/core/handle-onboarding-form";

import { getFormsConfig } from "@/forms/config/config";
import type { EnvName } from "@/config/env-name";
import { createLogger, setGlobalLogLevel } from "@/lib/logging/log";
import {
  withRunContext,
  normalizeRunEnv,
  type RunEnv,
} from "@/lib/logging/run-context";

// Accept the lib's RunEnv here to avoid mixing names
const levelForEnv = (env: RunEnv) =>
  env === "development" || env === "staging" ? "debug" : "info";

export function onFormSubmit(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  mode?: EnvName
) {
  // 1) Normalize ONCE at the boundary
  const env: RunEnv = normalizeRunEnv(mode);

  // 2) Set reqId/env for this execution; everything else happens inside
  return withRunContext(() => {
    // 3) Apply global log level from env
    setGlobalLogLevel(levelForEnv(env));

    // 4) Pull config using the same env
    const ids = getFormsConfig(env as EnvName); // cast only if getFormsConfig wants EnvName

    const FORM_IDS = {
      VENDOR: ids.VENDOR_FORM,
      ONBOARDING: ids.ONBOARDING_FORM,
    } as const;

    const formId =
      (e?.source as GoogleAppsScript.Forms.Form)?.getId() ??
      FormApp.getActiveForm().getId();

    const log = createLogger("FormRouter");
    log.info("Received form submission", { formId, env });

    const expectedFormIds = Object.values(FORM_IDS);
    if (!expectedFormIds.includes(formId)) {
      log.error("Form ID not found in expected IDs", {
        formId,
        expectedFormIds,
        env,
      });
      throw new Error(
        `Form ID ${formId} not found in expected IDs for ${env}: ${expectedFormIds.join(
          ", "
        )}`
      );
    }

    switch (formId) {
      case FORM_IDS.VENDOR:
        return handleVendorForm(e, ids);
      case FORM_IDS.ONBOARDING:
        return handleOnboardingForm(e, ids);
    }
  }, env);
}
