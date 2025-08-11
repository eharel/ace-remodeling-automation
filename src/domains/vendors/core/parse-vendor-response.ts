import {
  DEFAULT_VENDOR_RESPONSE,
  RAW_TO_VENDOR_KEY,
  VENDOR_CATEGORIES,
} from "../constants";
import { parseYesNo } from "./utils";
import { Vendor } from "../types";
import { PRODUCT_BY_LABEL } from "../products";
import { toEnglish } from "@utils/index";

/**
 * Categorizes products into Rough, Finish, and Other arrays
 */
function categorizeProducts(productsString: string): {
  rough: string[];
  finish: string[];
  other: string[];
} {
  const products = productsString.split(",").map((s: string) => s.trim());
  const roughProducts: string[] = [];
  const finishProducts: string[] = [];
  const otherProducts: string[] = [];

  for (const product of products) {
    const productDef = PRODUCT_BY_LABEL[toEnglish(product)];

    if (productDef) {
      if (
        productDef.category === VENDOR_CATEGORIES.ROUGH ||
        productDef.category === VENDOR_CATEGORIES.BOTH
      ) {
        roughProducts.push(product);
      }
      if (
        productDef.category === VENDOR_CATEGORIES.FINISH ||
        productDef.category === VENDOR_CATEGORIES.BOTH
      ) {
        finishProducts.push(product);
      }
      if (productDef.category === VENDOR_CATEGORIES.OTHER) {
        // OTHER category products go to Other table only
        otherProducts.push(product);
      }
    } else {
      // Default to both tables for unknown products
      roughProducts.push(product);
      finishProducts.push(product);
    }
  }

  return {
    rough: roughProducts,
    finish: finishProducts,
    other: otherProducts,
  };
}

// Type-safe field assignment using a mapping function
const fieldHandlers: Record<
  keyof Vendor,
  (value: string, parsed: Partial<Vendor>) => void
> = {
  companyName: (value: string, parsed: Partial<Vendor>) => {
    parsed.companyName = value;
  },
  contactName: (value: string, parsed: Partial<Vendor>) => {
    parsed.contactName = value;
  },
  phone: (value: string, parsed: Partial<Vendor>) => {
    parsed.phone = value;
  },
  email: (value: string, parsed: Partial<Vendor>) => {
    parsed.email = value;
  },
  address: (value: string, parsed: Partial<Vendor>) => {
    parsed.address = value;
  },
  roughProducts: (value: string, parsed: Partial<Vendor>) => {
    // This field is populated by the productsOffered handler
  },
  finishProducts: (value: string, parsed: Partial<Vendor>) => {
    // This field is populated by the productsOffered handler
  },
  otherProducts: (value: string, parsed: Partial<Vendor>) => {
    // This field is populated by the productsOffered handler
  },
  websiteOrSocial: (value: string, parsed: Partial<Vendor>) => {
    parsed.websiteOrSocial = value;
  },
  hasShowroom: (value: string, parsed: Partial<Vendor>) => {
    parsed.hasShowroom = parseYesNo(value);
  },
  offersCustomOrders: (value: string, parsed: Partial<Vendor>) => {
    parsed.offersCustomOrders = parseYesNo(value);
  },
  offersDelivery: (value: string, parsed: Partial<Vendor>) => {
    parsed.offersDelivery = parseYesNo(value);
  },
  turnaroundTime: (value: string, parsed: Partial<Vendor>) => {
    parsed.turnaroundTime = value;
  },
  offersContractorPricing: (value: string, parsed: Partial<Vendor>) => {
    parsed.offersContractorPricing = parseYesNo(value);
  },
  paymentMethods: (value: string, parsed: Partial<Vendor>) => {
    parsed.paymentMethods = value.split(",").map((s: string) => s.trim());
  },
  paymentDetails: (value: string, parsed: Partial<Vendor>) => {
    parsed.paymentDetails = value;
  },
  willEmailCatalogs: (value: string, parsed: Partial<Vendor>) => {
    parsed.willEmailCatalogs = parseYesNo(value);
  },
  comments: (value: string, parsed: Partial<Vendor>) => {
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
      continue;
    }

    // Special handling for the products form field
    if (rawKey.includes("Type of Products You Offer")) {
      const categorizedProducts = categorizeProducts(value);

      if (categorizedProducts.rough.length > 0) {
        parsed.roughProducts = categorizedProducts.rough;
      }
      if (categorizedProducts.finish.length > 0) {
        parsed.finishProducts = categorizedProducts.finish;
      }
      if (categorizedProducts.other.length > 0) {
        parsed.otherProducts = categorizedProducts.other;
      }
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
