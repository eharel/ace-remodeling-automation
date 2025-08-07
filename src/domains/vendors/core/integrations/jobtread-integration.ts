import { Vendor } from "../../types";
import {
  transformVendorToJobTread,
  JobTreadVendor,
} from "../transformations/vendor-to-jobtread";

/**
 * Configuration for JobTread integration
 */
export interface JobTreadConfig {
  apiKey: string;
  baseUrl: string;
  // ... other JobTread API configuration
}

/**
 * Syncs vendor data to JobTread
 * TODO: Implement when JobTread API integration is ready
 */
export function syncVendorToJobTread(
  vendor: Vendor,
  config: JobTreadConfig
): Promise<void> {
  // TODO: Implement JobTread API integration
  console.log(`🔄 Syncing vendor to JobTread: ${vendor.companyName}`);

  const jobTreadVendor = transformVendorToJobTread(vendor);

  // TODO: Make API call to JobTread
  // const response = await fetch(`${config.baseUrl}/vendors`, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${config.apiKey}` },
  //   body: JSON.stringify(jobTreadVendor)
  // });

  console.log(
    `✅ Successfully synced vendor to JobTread: ${vendor.companyName}`
  );
  return Promise.resolve();
}
