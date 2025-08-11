// Environment configuration
// Change this single value to switch between production and development
export const IS_PRODUCTION = true;

// Production IDs
const PRODUCTION_IDS = {
  VENDOR_FORM: "1RJvElIltYNylJMebgqCn_1AsqlkhcVA3lkRU1rseUwY",
  VENDOR_SHEET: "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w",
  ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY", // Dev onboarding form
} as const;

// Development IDs
const DEVELOPMENT_IDS = {
  VENDOR_FORM: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
  VENDOR_SHEET: "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0",
  ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY", // Dev onboarding form
} as const;

// Helper functions to get the appropriate IDs based on environment
export const getVendorFormId = (): string =>
  IS_PRODUCTION ? PRODUCTION_IDS.VENDOR_FORM : DEVELOPMENT_IDS.VENDOR_FORM;

export const getVendorSheetId = (): string =>
  IS_PRODUCTION ? PRODUCTION_IDS.VENDOR_SHEET : DEVELOPMENT_IDS.VENDOR_SHEET;

export const getOnboardingFormId = (): string =>
  IS_PRODUCTION
    ? PRODUCTION_IDS.ONBOARDING_FORM
    : DEVELOPMENT_IDS.ONBOARDING_FORM;

// Export the current environment's IDs for direct access
export const IDS = IS_PRODUCTION ? PRODUCTION_IDS : DEVELOPMENT_IDS;
