export type YesNo = "Yes" | "No";

export interface Vendor {
  companyName: string; // 1
  contactName: string; // 2
  phone: string; // 3
  email: string; // 4
  address: string; // 5

  productsOffered?: string[]; // 6
  websiteOrSocial?: string; // 7

  hasShowroom?: boolean; // 8
  offersCustomOrders?: boolean; // 9
  offersDelivery?: boolean; // 10
  turnaroundTime?: string; // 11
  offersContractorPricing?: boolean; // 12

  paymentMethods: string[]; // 13 (checkboxes: ACH, Zelle, Check)
  paymentDetails: string; // 14

  willEmailCatalogs?: boolean;
  comments?: string; // 16

  submittedAt: Date; // Set programmatically
}
