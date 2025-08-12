import type { EnvName } from "@/config/env-types";

type FormsIds = {
  VENDOR_FORM: string;
  VENDOR_SHEET: string;
  ONBOARDING_FORM: string;
};

const byEnv: Record<EnvName, FormsIds> = {
  development: {
    VENDOR_FORM: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
    VENDOR_SHEET: "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0",
    ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
  },
  staging: {
    // you can copy dev or prod for now; update later if you add real staging
    VENDOR_FORM: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
    VENDOR_SHEET: "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0",
    ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
  },
  production: {
    VENDOR_FORM: "1RJvElIltYNylJMebgqCn_1AsqlkhcVA3lkRU1rseUwY",
    VENDOR_SHEET: "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w",
    ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
  },
};

export const getFormsConfig = (envName: EnvName) => byEnv[envName];
