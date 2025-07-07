export type PaymentEntry = {
  date: Date;
  amount: number;
  transaction: string;
};

export type LeadsInputRow = {
  year: number;
  month: number;
  totalLeads: number;
  signedProposals: number;
  approvedRevenue: number;
  conversionRate: number;
};
