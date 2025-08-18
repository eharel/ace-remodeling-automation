// src/forms/core/form-router.ts
import { handleVendorForm } from "../../domains/vendors/core/handle-vendor-form";
import { handleOnboardingForm } from "../../domains/onboarding/core/handle-onboarding-form";
import { handleOnboardingFormById } from "../../domains/onboarding/core/handle-onboarding-form-id";

import { getFormsConfig } from "@/forms/config/config";
import { normalizeEnv, type EnvName } from "@/lib/env/env";
import { createLogger, errFields, setGlobalLogLevel } from "@/lib/logging/log";
import { withRunContext } from "@/lib/logging/run-context";

// Accept the lib's EnvName here to avoid mixing names
const levelForEnv = (env: EnvName) =>
  env === "development" || env === "staging" ? "debug" : "info";

export function onFormSubmit(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  mode?: EnvName
) {
  // 1) Normalize ONCE at the boundary
  const env: EnvName = normalizeEnv(mode);

  // 2) Set reqId/env for this execution; everything else happens inside
  return withRunContext(() => {
    // 3) Apply global log level from env
    setGlobalLogLevel(levelForEnv(env));

    // 4) Pull config using the same env
    const ids = getFormsConfig(env);

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
    try {
      if (!expectedFormIds.includes(formId)) {
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
          // Convert staging to development for the ID-based handler
          const onboardingEnv = env === "staging" ? "development" : env;
          return handleOnboardingFormById(e, ids, onboardingEnv);
        default:
          throw new Error(`Unknown form ID: ${formId}`);
      }
    } catch (error) {
      log.error("Error processing form", {
        ...errFields(error),
        formId,
        env,
        expectedFormIds,
      });
      throw error;
    }
  }, env);
}
