import {
  PROFESSION_TO_TAB_MAPPING,
  PROFESSION_TO_VENDOR_TYPE_MAPPING,
} from "../constants";
import { OnboardingData } from "../types";
import { parseYesNo } from "@/forms/utils/parse-fields";
import { toEnglish } from "@utils/index";
import {
  processFormResponse,
  validateFormResponse,
} from "@/forms/core/form-processor";

/**
 * Parses raw form response data into structured OnboardingData using ID-based field matching
 */
export function parseOnboardingResponseById(
  response: GoogleAppsScript.Forms.FormResponse,
  environment: "development" | "production" = "development"
): OnboardingData {
  // Debug: Log the raw form data to see what we're getting
  console.log("🔍 Processing onboarding form response with ID-based matching");
  console.log("🔍 Environment:", environment);

  // Validate required fields
  const validation = validateFormResponse("onboarding", response, environment);
  if (!validation.isValid) {
    throw new Error(`Missing required fields: ${validation.errors.join(", ")}`);
  }

  // Process form response using ID-based matching
  const rawData = processFormResponse("onboarding", response, environment);

  console.log("🔍 Processed form data:", JSON.stringify(rawData, null, 2));

  // Determine target tabs and categorize professions by tab
  const profession = rawData.profession || "";
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
    name: rawData.name || "",
    companyName: rawData.companyName || "",
    profession: profession,
    hasInsurance: parseYesNo(rawData.insurance || ""),
    phone: rawData.phone || "",
    email: rawData.email || "",
    address: rawData.address || "",
    website: rawData.website || "",
    paymentMethod: rawData.paymentMethods || "",
    paymentInfo: rawData.paymentInfo || "",
    comments: rawData.comments || undefined,
    targetTabs,
    professionsByTab,
  };

  console.log(
    "🔍 Final parsed onboarding data:",
    JSON.stringify(data, null, 2)
  );
  return data;
}
