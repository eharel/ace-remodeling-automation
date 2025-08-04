import * as NR from "../../../constants/named-ranges";
import { DASHBOARD_KEYS } from "./columns";

export const PROJECT_DATA_FIELDS = [
  {
    key: DASHBOARD_KEYS.PROJECT_NO,
  },
  {
    key: DASHBOARD_KEYS.CLIENT_NAME,
  },
  {
    key: DASHBOARD_KEYS.CONTRACT_PRICE,
    namedRange: NR.NR_CONTRACT_PRICE,
    legacyCell: "M2",
  },
  {
    key: DASHBOARD_KEYS.CHANGE_ORDERS,
    namedRange: NR.NR_CHANGE_ORDER_TOTAL,
    legacyCell: "M7",
  },
  {
    key: DASHBOARD_KEYS.EXPENSES,
    namedRange: NR.NR_EXPENSE_TOTAL,
    legacyCell: "M13",
  },
  {
    key: DASHBOARD_KEYS.TOTAL_ADVANCE,
    namedRange: NR.NR_ADVANCE_TOTAL,
    legacyCell: "I21",
  },
  {
    key: DASHBOARD_KEYS.PM_AFTER_ADVANCE,
    namedRange: NR.NR_PM_AFTER_ADVANCE,
    legacyCell: "M21",
  },
] as const;
