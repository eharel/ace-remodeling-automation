import { DEFAULT_VENDOR_RESPONSE, RAW_TO_VENDOR_KEY } from "../constants";
import { parseYesNo } from "./utils";
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
  address: (value, parsed) => {
    parsed.address = value;
  },
  productsOffered: (value, parsed) => {
    parsed.productsOffered = value.split(",").map((s) => s.trim());
  },
  websiteOrSocial: (value, parsed) => {
    parsed.websiteOrSocial = value;
  },
  hasShowroom: (value, parsed) => {
    parsed.hasShowroom = parseYesNo(value);
  },
  offersCustomOrders: (value, parsed) => {
    parsed.offersCustomOrders = parseYesNo(value);
  },
  offersDelivery: (value, parsed) => {
    parsed.offersDelivery = parseYesNo(value);
  },
  turnaroundTime: (value, parsed) => {
    parsed.turnaroundTime = value;
  },
  offersContractorPricing: (value, parsed) => {
    parsed.offersContractorPricing = parseYesNo(value);
  },
  paymentMethods: (value, parsed) => {
    parsed.paymentMethods = value.split(",").map((s) => s.trim());
  },
  paymentDetails: (value, parsed) => {
    parsed.paymentDetails = value;
  },
  willEmailCatalogs: (value, parsed) => {
    parsed.willEmailCatalogs = parseYesNo(value);
  },
  comments: (value, parsed) => {
    parsed.comments = value;
  },
  submittedAt: () => {
    /* Set programmatically later */
  },
};

export function parseVendorResponse(raw: Record<string, string>): Vendor {
  const parsed: Partial<Vendor> = {};

  for (const [rawKey, value] of Object.entries(raw)) {
    const fieldKey = RAW_TO_VENDOR_KEY[rawKey];
    if (!fieldKey) {
      console.warn(`⚠️ Unrecognized form field: ${rawKey}`);
      continue;
    }

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
