export interface VendorFormResponse {
  "Company Name": string;
  "Type of Trade": string;
  "Contact Name": string;
  "Phone Number": string;
  Email: string;
  "Website (if applicable)"?: string;
  "Company Bio"?: string;
  "Type of Materials": string[];
  "Are you Insured, Licensed, or New?": string[];
  "Date of Submission": Date | null;
  "Upload License and/or Insurance": string[];
}
