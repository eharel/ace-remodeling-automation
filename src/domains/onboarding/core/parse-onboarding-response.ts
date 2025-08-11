import { OnboardingFormData, OnboardingFormResponse } from "../types";
import { ONBOARDING_FORM_FIELDS } from "../constants";
import { formatPhoneNumber } from "../../../utils";

/**
 * Parses profession string into array of selected professions
 */
function parseProfession(professionString: string): string[] {
  if (!professionString) return [];

  // Split by comma and clean up whitespace
  return professionString
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Parses payment method string into array of selected methods
 */
function parsePaymentMethod(paymentMethodString: string): string[] {
  if (!paymentMethodString) return [];

  // Split by comma and clean up whitespace
  return paymentMethodString
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

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
    company: rawData[ONBOARDING_FORM_FIELDS.COMPANY] || "",
    profession: parseProfession(
      rawData[ONBOARDING_FORM_FIELDS.PROFESSION] || ""
    ),
    insurance: rawData[ONBOARDING_FORM_FIELDS.INSURANCE] || "",
    phone: formatPhoneNumber(rawData[ONBOARDING_FORM_FIELDS.PHONE] || ""),
    email: rawData[ONBOARDING_FORM_FIELDS.EMAIL] || "",
    address: rawData[ONBOARDING_FORM_FIELDS.ADDRESS] || "",
  };

  // Extract payment details
  const paymentDetails = {
    paymentMethod: parsePaymentMethod(
      rawData[ONBOARDING_FORM_FIELDS.PAYMENT_METHOD] || ""
    ),
    paymentInfo: rawData[ONBOARDING_FORM_FIELDS.PAYMENT_INFO] || "",
  };

  // Create the complete onboarding data object
  const onboardingData: OnboardingFormData = {
    contactInfo,
    paymentDetails,
    comments: rawData[ONBOARDING_FORM_FIELDS.COMMENTS] || "",
    submissionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
  };

  console.log("✅ Onboarding data parsed successfully");
  return onboardingData;
}
