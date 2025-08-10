/**
 * Onboarding domain constants
 */

export const ONBOARDING_FORM_FIELDS = {
  // Contact Information
  NAME: "Full Name",
  EMAIL: "Email Address",
  PHONE: "Phone Number",
  ADDRESS: "Address",
  COMPANY: "Company Name",

  // Payment Details
  PAYMENT_METHOD: "Payment Method",
  ACCOUNT_NUMBER: "Account Number",
  ROUTING_NUMBER: "Routing Number",
  CARD_NUMBER: "Card Number",
  EXPIRATION_DATE: "Expiration Date",
  CVV: "CVV",

  // Additional Information
  ADDITIONAL_NOTES: "Additional Notes",
} as const;

export const PAYMENT_METHODS = {
  ACH: "ACH / Bank Transfer",
  CREDIT_CARD: "Credit Card",
  CHECK: "Check",
  CASH: "Cash",
} as const;

export const ONBOARDING_SHEET_CONFIG = {
  SHEET_NAME: "Onboarding Contacts",
  HEADERS: [
    "Name",
    "Email",
    "Phone",
    "Address",
    "Company",
    "Payment Method",
    "Account Number",
    "Routing Number",
    "Card Number",
    "Expiration Date",
    "CVV",
    "Additional Notes",
    "Submission Date",
    "Status",
  ],
} as const;

export const ONBOARDING_STATUS = {
  NEW: "New",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
} as const;
