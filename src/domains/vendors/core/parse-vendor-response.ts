import {
  DEFAULT_VENDOR_RESPONSE,
  RAW_TO_VENDOR_KEY,
  VENDOR_CATEGORIES,
} from "../constants";
import { parseYesNo } from "./utils";
import { Vendor } from "../types";
import { PRODUCT_BY_LABEL } from "../products";

// Helper function to extract English part from bilingual labels
function english(label: string): string {
  return label.split("/")[0].trim();
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
      console.warn(`⚠️ Unrecognized form field: ${rawKey}`);
      continue;
    }

    // Special handling for the products form field
    if (rawKey.includes("Type of Products You Offer")) {
      console.log(`🔍 Processing products field: ${rawKey}`);
      console.log(`🔍 Raw value: ${value}`);

      const products = value.split(",").map((s: string) => s.trim());
      console.log(`🔍 Parsed products: ${products.join(", ")}`);

      const roughProducts: string[] = [];
      const finishProducts: string[] = [];

      for (const product of products) {
        const productDef = PRODUCT_BY_LABEL[english(product)];
        console.log(
          `🔍 Product: "${product}" -> English: "${english(product)}" -> Def: ${
            productDef ? productDef.key : "NOT FOUND"
          }`
        );

        if (productDef) {
          if (
            productDef.category === VENDOR_CATEGORIES.ROUGH ||
            productDef.category === VENDOR_CATEGORIES.BOTH
          ) {
            roughProducts.push(product);
            console.log(`🔍 Added to Rough: ${product}`);
          }
          if (
            productDef.category === VENDOR_CATEGORIES.FINISH ||
            productDef.category === VENDOR_CATEGORIES.BOTH
          ) {
            finishProducts.push(product);
            console.log(`🔍 Added to Finish: ${product}`);
          }
        } else {
          console.warn(`⚠️ Unknown product type: ${product}`);
          // Default to both tables for unknown products
          roughProducts.push(product);
          finishProducts.push(product);
        }
      }

      console.log(`🔍 Final Rough products: ${roughProducts.join(", ")}`);
      console.log(`🔍 Final Finish products: ${finishProducts.join(", ")}`);

      if (roughProducts.length > 0) {
        parsed.roughProducts = roughProducts;
      }
      if (finishProducts.length > 0) {
        parsed.finishProducts = finishProducts;
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
