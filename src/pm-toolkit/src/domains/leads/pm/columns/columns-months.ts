import { LeadsColumn } from "../../shared/types";
import { getMonthName, formatPercent } from "@pm/utils/helpers";

import { buildLabelKeyMaps } from "shared/columns";
import {
  DashboardKey,
  dashboardKeys,
  DashboardLabel,
  inputKeys,
} from "../../shared/columns";
import { dashboardLabels } from "../../shared/columns/labels";

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
    label: dashboardLabels.MONTH,
    valueFn: ({ inputRowData }) => getMonthName(inputRowData[inputKeys.MONTH]),
    format: "number",
  },
  {
    key: dashboardKeys.TOTAL_LEADS,
    label: dashboardLabels.TOTAL_LEADS,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.TOTAL_LEADS],
    format: "number",
    align: "center",
  },
  {
    key: dashboardKeys.SIGNED,
    label: dashboardLabels.SIGNED,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.SIGNED],
    format: "number",
    align: "center",
  },
  {
    key: dashboardKeys.CONVERSION_RATE,
    label: dashboardLabels.CONVERSION_RATE,
    valueFn: ({ inputRowData }) => {
      const signed = inputRowData[inputKeys.SIGNED] ?? 0;
      const total = inputRowData[inputKeys.TOTAL_LEADS] ?? 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
    align: "center",
  },
  {
    key: dashboardKeys.REVENUE,
    label: dashboardLabels.REVENUE,
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.REVENUE],
    format: "currency",
  },
  {
    key: dashboardKeys.REVENUE_GOAL,
    label: dashboardLabels.REVENUE_GOAL,
    description: "Monthly revenue goal",
    valueFn: ({ inputRowData }) => inputRowData[inputKeys.REVENUE_GOAL] ?? "",
    format: "currency",
  },
  {
    key: dashboardKeys.REVENUE_DIFF,
    label: dashboardLabels.REVENUE_DIFF,
    description: "Goal minus revenue (gap to target)",
    valueFn: ({ inputRowData }) => {
      const revenue = inputRowData[inputKeys.REVENUE];
      const goal = inputRowData[inputKeys.REVENUE_GOAL];
      if (typeof revenue !== "number" || typeof goal !== "number") return "";
      return goal - revenue;
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
