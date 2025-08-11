/**
 * Onboarding domain types
 */

export interface OnboardingContactInfo {
  name: string;
  company: string;
  profession: string[];
  insurance: string;
  phone: string;
  email: string;
  address: string;
}

export interface OnboardingPaymentDetails {
  paymentMethod: string[];
  paymentInfo: string;
}

export interface OnboardingFormData {
  contactInfo: OnboardingContactInfo;
  paymentDetails: OnboardingPaymentDetails;
  comments?: string;
  submissionDate: string;
}

export interface OnboardingFormResponse {
  [key: string]: string;
}
