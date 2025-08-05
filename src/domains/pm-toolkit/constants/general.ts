import { NR_CONTRACT_PRICE, NR_CHANGE_ORDER_TOTAL } from "./named-ranges";

// === Regex ===
export const PROJECT_TAB_NAME_REGEX = /^\d{3,4}\s/;

// === File IDs ===
export const FILE_IDS = {
  MANAGER_FILE: "1h351NGo2pJnA-dcI5wvDXTkDCImNFTxJJpVh3shy_Zg", // Manager dashboard file
  EXECUTIVE_FILE: "12i9kHVpKI2WZkN5UKZl7fkPT9PB5xeFl53Uvs6AxVX0",
};

// === General Config ===
export const TEMPLATE_SPREADSHEET_ID =
  "1GOAREjnQtBsYu1BXzSDD4xlU_lolOPduBfVVQ40d57I";
export const TEMPLATE_PROJECT_TAB_NAME = "_projectTemplate";
export const TEMPLATE_BLANK_SHEET = "Blank Sheet Template";

export const LIB_IDENTIFIER = "AceRemodelingPMToolkit";
export const MAX_ADVANCE_PERCENTAGE = 10;
export const EXPECTED_PROFIT_PERCENTAGE = 20;
export const IS_ASCENDING_ORDER = false;

export const LABEL_COLUMN_INDEX = 11;
export const VALUE_COLUMN_INDEX = 13;

export const CLOSED_SUFFIX = " (CLOSED)";
export const PROJECT_STATUS_SHEET_NAME = "_ProjectStatus";
export const COL_PROJECT_STATUS = 2;
export const PROJECT_STATUS_CLOSED = "Closed";

export const INACTIVE_STATUSES = ["closed", "removed", "cancelled"];

export const COL_GAP_BETWEEN_TABLES = 5;

// === Dashboard Sheet ===
export const PROJECT_DASHBOARD_SHEET_NAME = "Projects Dashboard";
export const LEADS_PAYMENTS_SHEET_NAME = "Leads/Payments Dashboard";

// === Sheet Formula Strings ===
export const ADVANCE_MAX_FORMULA = `=(${NR_CONTRACT_PRICE} + ${NR_CHANGE_ORDER_TOTAL}) * ${MAX_ADVANCE_PERCENTAGE} / 100`;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
