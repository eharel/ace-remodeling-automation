import { env } from "@/env/index-gas";
import { getFormsConfig } from "@/forms/config/config";

const DOMAIN = "forms";

/** Quick check that Script Properties are being read correctly. */
export function peekEnv() {
  // Optional visibility: show all three layers
  // (If domainOverride is unset, you'll see "undefined")
  // @ts-ignore - logging convenience
  Logger.log("workspaceDefault: %s", env.workspaceDefault());
  // @ts-ignore - logging convenience
  Logger.log("domainOverride(forms): %s", env.domainOverride(DOMAIN));

  const mode = env.resolve(DOMAIN);
  Logger.log("resolve(forms): %s", mode);

  const ids = getFormsConfig(mode);
  Logger.log(
    "IDs => vendor: %s | onboarding: %s",
    ids.VENDOR_FORM,
    ids.ONBOARDING_FORM
  );
}

/** Router-level check: confirms which ID the current form has and how it would route. */
export function peekRouterContext() {
  const mode = env.resolve(DOMAIN);
  const ids = getFormsConfig(mode);
  const activeFormId =
    FormApp.getActiveForm()?.getId() ??
    (
      Session.getActiveUser() && (FormApp.getUi(), FormApp.getActiveForm())
    )?.getId(); // fallback attempt

  Logger.log("mode: %s", mode);
  Logger.log("activeFormId: %s", activeFormId);
  Logger.log("VENDOR_FORM: %s", ids.VENDOR_FORM);
  Logger.log("ONBOARDING_FORM: %s", ids.ONBOARDING_FORM);

  if (activeFormId === ids.VENDOR_FORM)
    Logger.log("→ This host would route to: handleVendorForm");
  else if (activeFormId === ids.ONBOARDING_FORM)
    Logger.log("→ This host would route to: handleOnboardingForm");
  else Logger.log("→ This host would hit the default/unknown branch.");
}
