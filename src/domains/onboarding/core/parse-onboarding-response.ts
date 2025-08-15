import { FORM_FIELDS, PROFESSION_TO_TAB_MAPPING } from "../constants";
import { OnboardingData } from "../types";
import { parseYesNo, validateRequiredFields } from "@/forms/utils/parse-fields";
import { toEnglish } from "@utils/index";

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

  // Determine target tab based on profession
  const profession = rawData[FORM_FIELDS.professions] || "";
  const professionEnglish = toEnglish(profession);
  const targetTab =
    PROFESSION_TO_TAB_MAPPING[
      professionEnglish as keyof typeof PROFESSION_TO_TAB_MAPPING
    ] || "Other";

  // Map form field names to our structured data
  const data: OnboardingData = {
    name: rawData[FORM_FIELDS.name] || "",
    companyName: rawData[FORM_FIELDS.company_name] || "",
    profession: profession,
    hasInsurance: parseYesNo(rawData[FORM_FIELDS.insurance] || ""),
    phone: rawData[FORM_FIELDS.phone] || "",
    email: rawData[FORM_FIELDS.email] || "",
    address: rawData[FORM_FIELDS.address] || "",
    paymentMethod: rawData[FORM_FIELDS.payment_methods] || "",
    paymentInfo: rawData[FORM_FIELDS.payment_info] || "",
    comments: rawData[FORM_FIELDS.comments] || undefined,
    targetTab,
  };

  return data;
}
