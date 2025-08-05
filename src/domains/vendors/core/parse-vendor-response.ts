import { DEFAULT_VENDOR_RESPONSE, RAW_TO_VENDOR_KEY } from "../constants";
import { Vendor } from "../types";

// Type-safe field assignment using a mapping function
const fieldHandlers: Record<
  keyof Vendor,
  (value: string, parsed: Partial<Vendor>) => void
> = {
  companyName: (value, parsed) => {
    parsed.companyName = value;
  },
  contactName: (value, parsed) => {
    parsed.contactName = value;
  },
  phone: (value, parsed) => {
    parsed.phone = value;
  },
  email: (value, parsed) => {
    parsed.email = value;
  },
  website: (value, parsed) => {
    parsed.website = value;
  },
  materials: (value, parsed) => {
    parsed.materials = value.split(",").map((s) => s.trim());
  },
  certifications: (value, parsed) => {
    parsed.certifications = value.split(",").map((s) => s.trim());
  },
  tradeType: (value, parsed) => {
    parsed.tradeType = value;
  },
  uploads: (value, parsed) => {
    parsed.uploads = value.split(",").map((s) => s.trim());
  },
  bio: (value, parsed) => {
    // If bio already has content, append with separator
    if (parsed.bio) {
      parsed.bio += ` | ${value}`;
    } else {
      parsed.bio = value;
    }
  },
  submittedAt: () => {
    /* Set programmatically later */
  },
};

export function parseVendorResponse(raw: Record<string, string>): Vendor {
  const parsed: Partial<Vendor> = {};

  for (const [rawKey, value] of Object.entries(raw)) {
    const fieldKey = RAW_TO_VENDOR_KEY[rawKey];
    if (!fieldKey) continue;

    // Execute the handler for this field
    const handler = fieldHandlers[fieldKey];
    if (handler) {
      handler(value, parsed);
    }
  }

  parsed.submittedAt = new Date();

  return {
    ...DEFAULT_VENDOR_RESPONSE,
    ...parsed,
  };
}
