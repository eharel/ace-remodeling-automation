// 🧱 Row shape for dashboard table data
export type DashboardRow<K extends string> = {
  [Key in K]: string | number;
};
