import { NR_CONTRACT_PRICE, NR_CHANGE_ORDER_TOTAL } from "./named-ranges";

// === Regex ===
export const PROJECT_TAB_NAME_REGEX = /^\d{3,4}\s/;

// === General Config ===
export const TEMPLATE_SPREADSHEET_ID =
  "1GOAREjnQtBsYu1BXzSDD4xlU_lolOPduBfVVQ40d57I";
export const TEMPLATE_PROJECT_TAB_NAME = "_projectTemplate";
export const TEMPLATE_SHEET_NAME = "Blank Sheet Template";

export const LIB_IDENTIFIER = "AceRemodelingPMToolkit";
export const MAX_ADVANCE_PERCENTAGE = 10;
export const EXPECTED_PROFIT_PERCENTAGE = 20;
export const IS_ASCENDING_ORDER = false;
export const COLUMN_PADDING = 5;

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
