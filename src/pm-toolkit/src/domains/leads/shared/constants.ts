// 🔢 QUARTER → MONTH
export const QUARTER_TO_MONTHS = {
  Q1: [1, 2, 3],
  Q2: [4, 5, 6],
  Q3: [7, 8, 9],
  Q4: [10, 11, 12],
};

export type Quarter = keyof typeof QUARTER_TO_MONTHS;
export type Month = (typeof QUARTER_TO_MONTHS)[Quarter][number];

export const QUARTERS_ROW_SPAN = 3;
