import { LeadsColumn } from "./types";
import { getMonthName, formatPercent } from "../../utils/helpers";
import {
  DashboardKey,
  DashboardLabel,
  dashboardKeys,
  labels,
  inputKeys,
} from "./constants";
import { buildLabelKeyMaps } from "../../columns/utils";

export const LEADS_COLUMNS: LeadsColumn[] = [
  // {
  //   key: DASHBOARD_KEYS.YEAR,
  //   label: DASHBOARD_LABELS.YEAR,
  //   valueFn: ({ inputRowData }: LeadsRowContext) =>
  //     inputRowData[INPUT_KEYS.YEAR],
  //   format: "number",
  //   align: "center",
  // },
  {
    key: dashboardKeys.MONTH,
    label: labels.MONTH,
    valueFn: ({ inputRowData }) => getMonthName(inputRowData[inputKeys.MONTH]),
    format: "number",
  },
  {
    key: dashboardKeys.TOTAL_LEADS,
    label: labels.TOTAL_LEADS,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.TOTAL_LEADS],
    format: "number",
    align: "center",
  },
  {
    key: dashboardKeys.SIGNED,
    label: labels.SIGNED,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.SIGNED],
    format: "number",
    align: "center",
  },
  {
    key: dashboardKeys.CONVERSION_RATE,
    label: labels.CONVERSION_RATE,
    valueFn: ({ inputRowData }) => {
      const signed = inputRowData[inputKeys.SIGNED] ?? 0;
      const total = inputRowData[inputKeys.TOTAL_LEADS] ?? 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
  },
  {
    key: dashboardKeys.REVENUE,
    label: labels.REVENUE,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.REVENUE],
    format: "currency",
  },
  {
    key: dashboardKeys.REVENUE_GOAL,
    label: labels.REVENUE_GOAL,
    description: "Monthly revenue goal",
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.REVENUE_GOAL] ?? "",
    format: "currency",
  },
  {
    key: dashboardKeys.REVENUE_DIFF,
    label: labels.REVENUE_DIFF,
    description: "Revenue minus goal",
    valueFn: ({ inputRowData }) => {
      const revenue = inputRowData[inputKeys.REVENUE];
      const goal = inputRowData[inputKeys.REVENUE_GOAL];
      if (typeof revenue !== "number" || typeof goal !== "number") return "";
      return revenue - goal;
    },
    format: "currency",
  },
  // {
  //   key: DASHBOARD_KEYS.PROP_NOT_SENT,
  //   label: DASHBOARD_LABELS.PROP_NOT_SENT,
  //   valueFn: ({ inputRowData }) =>
  //     inputRowData[INPUT_KEYS.PROP_NOT_SENT],
  //   format: "number",
  //   align: "center",
  // },
];

const labelMaps = buildLabelKeyMaps<DashboardKey, DashboardLabel>(
  LEADS_COLUMNS
);

export const DASHBOARD_LABELS_BY_KEY = labelMaps.labelsByKey;
export const DASHBOARD_KEYS_BY_LABEL = labelMaps.keysByLabel;
