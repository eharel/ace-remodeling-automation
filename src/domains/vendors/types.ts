export interface Vendor {
  companyName: string;
  tradeType: string;
  contactName: string;
  phone: string;
  email: string;
  website?: string;
  bio?: string;
  materials: string[];
  certifications: string[];
  submittedAt: Date;
  uploads: string[];
}
