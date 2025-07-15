// 🌈 QUARTER COLORS
export const QUARTER_COLORS = {
  Q1: "#D2E3FC",
  Q2: "#D9F5DD",
  Q3: "#FEF3C0",
  Q4: "#FAD2CF",
};

// Generic chart role colors
export const CHART_COLORS = {
  ACTUAL: "#2196f3", // Blue
  GOAL: "#4caf50", // Green
  CONVERSION: "#9c27b0", // Purple
};

export function getQuarterColor(quarter: keyof typeof QUARTER_COLORS): string {
  return QUARTER_COLORS[quarter];
}
