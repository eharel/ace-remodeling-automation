import { QUARTER_COLORS } from "./constants";

export const getQuarterFromMonth = (month: number): 1 | 2 | 3 | 4 => {
  return Math.ceil(month / 3) as 1 | 2 | 3 | 4;
};

export const getQuarterColor = (quarter: number | string): string => {
  const quarterKey = typeof quarter === "string" ? quarter : `Q${quarter}`;
  return QUARTER_COLORS[quarterKey as keyof typeof QUARTER_COLORS];
};
