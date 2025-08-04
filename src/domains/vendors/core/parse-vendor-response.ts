import { VendorFormResponse } from "../types";

export function parseVendorResponse(
  raw: Record<string, string>
): VendorFormResponse {
  return {
    "Company Name": raw["Company Name"] || "",
    "Type of Trade": raw["Type of Trade"] || "",
    "Contact Name": raw["Contact Name"] || "",
    "Phone Number": raw["Phone Number"] || "",
    Email: raw["Email"] || "",
    "Website (if applicable)": raw["Website (if applicable)"] || "",
    "Company Bio": raw["Company Bio"] || "",
    "Type of Materials": raw["Type of Materials"]
      ? raw["Type of Materials"].split(", ")
      : [],
    "Are you Insured, Licensed, or New?": raw[
      "Are you Insured, Licensed, or New?"
    ]
      ? raw["Are you Insured, Licensed, or New?"].split(", ")
      : [],
    "Date of Submission": new Date(),
    "Upload License and/or Insurance": raw["Upload License and/or Insurance"]
      ? raw["Upload License and/or Insurance"].split(", ")
      : [],
  };
}
