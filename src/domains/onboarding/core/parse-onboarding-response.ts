import { OnboardingFormData, OnboardingFormResponse } from "../types";
import { ONBOARDING_FORM_FIELDS } from "../constants";
import { formatPhoneNumber } from "../../../utils";

/**
 * Parses raw form response into structured onboarding data
 */
export function parseOnboardingResponse(
  rawData: OnboardingFormResponse
): OnboardingFormData {
  console.log("🔍 Parsing onboarding form response...");

  // Extract contact information
  const contactInfo = {
    name: rawData[ONBOARDING_FORM_FIELDS.NAME] || "",
    email: rawData[ONBOARDING_FORM_FIELDS.EMAIL] || "",
    phone: formatPhoneNumber(rawData[ONBOARDING_FORM_FIELDS.PHONE] || ""),
    address: rawData[ONBOARDING_FORM_FIELDS.ADDRESS] || "",
    company: rawData[ONBOARDING_FORM_FIELDS.COMPANY] || "",
  };

  // Extract payment details
  const paymentDetails = {
    paymentMethod: rawData[ONBOARDING_FORM_FIELDS.PAYMENT_METHOD] || "",
    accountNumber: rawData[ONBOARDING_FORM_FIELDS.ACCOUNT_NUMBER] || "",
    routingNumber: rawData[ONBOARDING_FORM_FIELDS.ROUTING_NUMBER] || "",
    cardNumber: rawData[ONBOARDING_FORM_FIELDS.CARD_NUMBER] || "",
    expirationDate: rawData[ONBOARDING_FORM_FIELDS.EXPIRATION_DATE] || "",
    cvv: rawData[ONBOARDING_FORM_FIELDS.CVV] || "",
  };

  // Create the complete onboarding data object
  const onboardingData: OnboardingFormData = {
    contactInfo,
    paymentDetails,
    additionalNotes: rawData[ONBOARDING_FORM_FIELDS.ADDITIONAL_NOTES] || "",
    submissionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
  };

  console.log("✅ Onboarding data parsed successfully");
  return onboardingData;
}
