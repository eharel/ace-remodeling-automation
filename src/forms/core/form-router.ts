// src/forms/core/form-router.ts
import { handleVendorFormById } from "../../domains/vendors/core/handle-vendor-form-id";
import { handleOnboardingFormById } from "../../domains/onboarding/core/handle-onboarding-form-id";

import { getFormsConfig } from "@/forms/config/config";
import { normalizeEnv, type EnvName } from "@/lib/env/env";
import { createLogger, errFields, setGlobalLogLevel } from "@/lib/logging/log";
import { withRunContext } from "@/lib/logging/run-context";

// Accept the lib's EnvName here to avoid mixing names
const levelForEnv = (env: EnvName) =>
  env === "development" || env === "staging" ? "debug" : "info";

export function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  const formId =
    (e?.source as GoogleAppsScript.Forms.Form)?.getId() ??
    FormApp.getActiveForm().getId();

  // Auto-detect environment based on form ID
  const devConfig = getFormsConfig("development");
  const stagingConfig = getFormsConfig("staging");
  const prodConfig = getFormsConfig("production");

  let env: EnvName;
  if (
    formId === devConfig.VENDOR_FORM ||
    formId === devConfig.ONBOARDING_FORM
  ) {
    env = "development";
  } else if (
    formId === stagingConfig.VENDOR_FORM ||
    formId === stagingConfig.ONBOARDING_FORM
  ) {
    env = "staging";
  } else if (
    formId === prodConfig.VENDOR_FORM ||
    formId === prodConfig.ONBOARDING_FORM
  ) {
    env = "production";
  } else {
    // Fallback to development if form ID is unknown
    env = "development";
  }

  // 2) Set reqId/env for this execution; everything else happens inside
  return withRunContext(() => {
    // 3) Apply global log level from env
    setGlobalLogLevel(levelForEnv(env));

    // 4) Pull config using the detected env
    const ids = getFormsConfig(env);

    const FORM_IDS = {
      VENDOR: ids.VENDOR_FORM,
      ONBOARDING: ids.ONBOARDING_FORM,
    } as const;

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
          // Convert staging to development for the ID-based handler
          const vendorEnv = env === "staging" ? "development" : env;
          return handleVendorFormById(e, ids, vendorEnv);
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
