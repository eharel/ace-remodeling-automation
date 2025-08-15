import { FORM_FIELDS } from "../constants";
import { OnboardingData } from "../types";
import { parseYesNo, validateRequiredFields } from "@/forms/utils/parse-fields";

/**
 * Parses raw form response data into structured OnboardingData
 */
export function parseOnboardingResponse(
  rawData: Record<string, string>
): OnboardingData {
  // Validate required fields
  const requiredFields = [
    FORM_FIELDS.name,
    FORM_FIELDS.company_name,
    FORM_FIELDS.professions,
    FORM_FIELDS.insurance,
    FORM_FIELDS.phone,
    FORM_FIELDS.email,
    FORM_FIELDS.address,
    FORM_FIELDS.payment_methods,
    FORM_FIELDS.payment_info,
  ];

  validateRequiredFields(rawData, requiredFields);

  // Map form field names to our structured data
  const data: OnboardingData = {
    name: rawData[FORM_FIELDS.name] || "",
    companyName: rawData[FORM_FIELDS.company_name] || "",
    profession: rawData[FORM_FIELDS.professions] || "",
    hasInsurance: parseYesNo(rawData[FORM_FIELDS.insurance] || ""),
    phone: rawData[FORM_FIELDS.phone] || "",
    email: rawData[FORM_FIELDS.email] || "",
    address: rawData[FORM_FIELDS.address] || "",
    paymentMethod: rawData[FORM_FIELDS.payment_methods] || "",
    paymentInfo: rawData[FORM_FIELDS.payment_info] || "",
    comments: rawData[FORM_FIELDS.comments] || undefined,
  };

  return data;
}
