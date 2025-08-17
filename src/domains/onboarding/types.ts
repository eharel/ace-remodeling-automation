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
  website: string;
  paymentMethod: string;
  paymentInfo: string;
  comments?: string;
  targetTabs: string[]; // The sheet tabs where this data should be saved (multiple for multiple professions)
  professionsByTab: Record<string, string[]>; // Professions categorized by tab
};
