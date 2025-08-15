import { FORM_FIELDS } from "./constants";

export type OnboardingFormFields = typeof FORM_FIELDS;

export type OnboardingFormResponse = {
  [K in keyof OnboardingFormFields]: string;
};

export type OnboardingData = {
  name: string;
  companyName: string;
  profession: string;
  hasInsurance: boolean;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  paymentInfo: string;
  comments?: string;
  targetTab: string; // The sheet tab where this data should be saved
};
