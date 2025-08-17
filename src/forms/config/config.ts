import type { EnvName } from "@/config/env-name";

export type FormsIds = {
  VENDOR_FORM: string;
  VENDOR_SHEET: string;
  VENDOR_TAB: string;
  ONBOARDING_FORM: string;
  ONBOARDING_SHEET: string;
  ONBOARDING_TAB: string;
};

const byEnv: Record<EnvName, FormsIds> = {
  development: {
    VENDOR_FORM: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
    VENDOR_SHEET: "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0",
    VENDOR_TAB: "Vendors",
    ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
    ONBOARDING_SHEET: "12OHjm3AxeWqAluZ92bKRl_8aM9cK3ANUwqsHxpNGO3I",
    ONBOARDING_TAB: "Trades",
  },
  staging: {
    // you can copy dev or prod for now; update later if you add real staging
    VENDOR_FORM: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
    VENDOR_SHEET: "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0",
    VENDOR_TAB: "Vendors",
    ONBOARDING_FORM: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
    ONBOARDING_SHEET: "12OHjm3AxeWqAluZ92bKRl_8aM9cK3ANUwqsHxpNGO3I",
    ONBOARDING_TAB: "Trades",
  },
  production: {
    VENDOR_FORM: "1RJvElIltYNylJMebgqCn_1AsqlkhcVA3lkRU1rseUwY",
    VENDOR_SHEET: "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w",
    VENDOR_TAB: "Vendors",
    ONBOARDING_FORM: "1FHMyMzeYcja8SmLHlLABX53GSX8s-vyBrEkahX3RxWw",
    ONBOARDING_SHEET: "1Z5E8mkDERK28w8KO4q5r2Sc0n4OwqJm5um2LbjvMgOE",
    ONBOARDING_TAB: "Trades",
  },
};

export const getFormsConfig = (envName: EnvName) => byEnv[envName];
