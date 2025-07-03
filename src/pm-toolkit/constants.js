// === Regex ===
const PROJECT_TAB_NAME_REGEX = /^\d{3,4}\s/;


// === General Config ===
const TEMPLATE_SPREADSHEET_ID = "1xDhe0KFjF17te_m7cH34PbrInnwbcW6atYTqcCi_a_s";
const TEMPLATE_PROJECT_TAB_NAME = "_projectTemplate";

const LIB_IDENTIFIER = "AceRemodelingPMToolkit";
const MAX_ADVANCE_PERCENTAGE = 10;
const IS_ASCENDING_ORDER = false;
const COLUMN_PADDING = 5;

const LABEL_COLUMN_INDEX = 11;
const VALUE_COLUMN_INDEX = 13;

const CLOSED_SUFFIX = " (CLOSED)";
const PROJECT_STATUS_SHEET_NAME = "_ProjectStatus";
const COL_PROJECT_STATUS = 2;
const PROJECT_STATUS_CLOSED = "Closed";

const INACTIVE_STATUSES = ["closed", "removed", "cancelled"];

const COL_GAP_BETWEEN_TABLES = 5;

// === Dashboard Sheet ===
const PROJECT_DASHBOARD_SHEET_NAME = "Projects Dashboard";

// === Column Headers for Dashboard ===
const COL_ADVANCE_BALANCE   = "Advance Balance";
const COL_CHANGE_ORDERS     = "Change Orders";
const COL_CLIENT_NAME       = "Client Name";
const COL_CONTRACT_PRICE    = "Contract Price";
const COL_EXPENSES          = "Expenses";
const COL_MAX_ADVANCE       = "Max Advance";
const COL_PROJECT_NO        = "Project No";
const COL_TOTAL_ADVANCE     = "Total Advance";
const COL_PM_AFTER_ADVANCE  = "PM After Advance";


// === Named Ranges (NR_ prefix for clarity) ===
const NR_ADVANCE_BALANCE    = "advance_balance";
const NR_ADVANCE_MAX        = "advance_max";
const NR_ADVANCE_TOTAL      = "advance_total";
const NR_CHANGE_ORDER_TOTAL = "change_order_total";
const NR_CLIENT_NAME        = "name_client";
const NR_CONTRACT_PRICE     = "contract_price";
const NR_DATE_START         = "date_start";
const NR_EXPENSE_TOTAL      = "expense_total";
const NR_PM_NAME            = "name_pm";
const NR_PROJECT_NUMBER     = "project_number";
const NR_PM_AFTER_ADVANCE   = "pm_after_advance";

// === Sheet Formula Strings ===
const ADVANCE_MAX_FORMULA = `=(${NR_CONTRACT_PRICE} + ${NR_CHANGE_ORDER_TOTAL}) * ${MAX_ADVANCE_PERCENTAGE} / 100`;