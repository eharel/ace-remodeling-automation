import {
  FORM_FIELDS,
  PROFESSION_TO_TAB_MAPPING,
  PROFESSION_TO_VENDOR_TYPE_MAPPING,
} from "../constants";
import { OnboardingData } from "../types";
import { parseYesNo, validateRequiredFields } from "@/forms/utils/parse-fields";
import { toEnglish } from "@utils/index";

/**
 * Parses raw form response data into structured OnboardingData
 */
export function parseOnboardingResponse(
  rawData: Record<string, string>
): OnboardingData {
  // Debug: Log the raw form data to see what we're getting
  console.log("🔍 Raw form data received:", JSON.stringify(rawData, null, 2));
  console.log(
    "🔍 Form field names we're looking for:",
    Object.values(FORM_FIELDS)
  );

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

  console.log("🔍 Required fields to validate:", requiredFields);
  validateRequiredFields(rawData, requiredFields);

  // Determine target tabs and categorize professions by tab
  const profession = rawData[FORM_FIELDS.professions] || "";
  const professions = profession.split(",").map((p) => p.trim());

  const targetTabs: string[] = [];
  const professionsByTab: Record<string, string[]> = {};

  for (const prof of professions) {
    const professionEnglish = toEnglish(prof);
    const targetTab =
      PROFESSION_TO_TAB_MAPPING[
        professionEnglish as keyof typeof PROFESSION_TO_TAB_MAPPING
      ] || "Other";

    // Add tab if not already included
    if (!targetTabs.includes(targetTab)) {
      targetTabs.push(targetTab);
      professionsByTab[targetTab] = [];
    }

    // Add profession to its corresponding tab
    professionsByTab[targetTab].push(professionEnglish);
  }

  // If no tabs found, default to "Other"
  if (targetTabs.length === 0) {
    targetTabs.push("Other");
    professionsByTab["Other"] = ["Other"];
  }

  // Map form field names to our structured data
  const data: OnboardingData = {
    name: rawData[FORM_FIELDS.name] || "",
    companyName: rawData[FORM_FIELDS.company_name] || "",
    profession: profession,
    hasInsurance: parseYesNo(rawData[FORM_FIELDS.insurance] || ""),
    phone: rawData[FORM_FIELDS.phone] || "",
    email: rawData[FORM_FIELDS.email] || "",
    address: rawData[FORM_FIELDS.address] || "",
    website: rawData[FORM_FIELDS.website] || "",
    paymentMethod: rawData[FORM_FIELDS.payment_methods] || "",
    paymentInfo: rawData[FORM_FIELDS.payment_info] || "",
    comments: rawData[FORM_FIELDS.comments] || undefined,
    targetTabs,
    professionsByTab,
  };

  console.log(
    "🔍 Final parsed onboarding data:",
    JSON.stringify(data, null, 2)
  );
  return data;
}
