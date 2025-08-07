import { Vendor } from "../../types";

/**
 * Interface for JobTread vendor format
 * This will be implemented when JobTread integration is ready
 */
export interface JobTreadVendor {
  // TODO: Define JobTread vendor structure
  id?: string;
  name: string;
  // ... other JobTread fields
}

/**
 * Transforms Vendor data to JobTread format
 * TODO: Implement when JobTread API integration is ready
 */
export function transformVendorToJobTread(vendor: Vendor): JobTreadVendor {
  // TODO: Implement JobTread transformation
  return {
    name: vendor.companyName,
    // ... map other fields to JobTread format
  };
}
