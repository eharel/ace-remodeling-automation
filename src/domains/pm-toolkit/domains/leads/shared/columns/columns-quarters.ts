import { LeadsQuarterColumn } from "../types";
import { buildLabelKeyMaps } from "@sheets/columns";
import { formatPercent } from "../../../../utils/helpers";
import {
  QuarterlyKey,
  quarterlyKeys,
  QuarterlyLabel,
  quarterlyLabels,
} from "./labels";
import { leadsOps, percentAvgOps, revenueOps } from "./summary-presets";

export const QUARTER_COLUMNS: LeadsQuarterColumn[] = [
  {
    key: quarterlyKeys.QUARTER,
    label: quarterlyLabels.QUARTER,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.QUARTER],
    format: "text",
    align: "center",
  },
  {
    key: quarterlyKeys.TOTAL_LEADS,
    label: quarterlyLabels.TOTAL_LEADS,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.TOTAL_LEADS],
    format: "number",
    align: "center",
    formatDecimals: 1,
    summaryOps: leadsOps,
  },
  {
    key: quarterlyKeys.SIGNED,
    label: quarterlyLabels.SIGNED,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.SIGNED],
    format: "number",
    align: "center",
    formatDecimals: 1,
    summaryOps: leadsOps,
  },
  {
    key: quarterlyKeys.CONVERSION_RATE,
    label: quarterlyLabels.CONVERSION_RATE,
    valueFn: ({ inputRowData }) => {
      const signed = Number(inputRowData[quarterlyKeys.SIGNED]) || 0;
      const total = Number(inputRowData[quarterlyKeys.TOTAL_LEADS]) || 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
    align: "center",
    formatDecimals: 2,
    summaryOps: percentAvgOps,
  },
  {
    key: quarterlyKeys.REVENUE,
    label: quarterlyLabels.REVENUE,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE],
    format: "currency",
    formatDecimals: 2,
    summaryOps: revenueOps,
  },
  {
    key: quarterlyKeys.REVENUE_GOAL,
    label: quarterlyLabels.REVENUE_GOAL,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE_GOAL],
    format: "currency",
    formatDecimals: 2,
    summaryOps: revenueOps,
  },
  {
    key: quarterlyKeys.REVENUE_DIFF,
    label: quarterlyLabels.REVENUE_DIFF,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE_DIFF],
    format: "currency",
    formatDecimals: 2,
    summaryOps: revenueOps,
  },
];

const labelMaps = buildLabelKeyMaps<QuarterlyKey, QuarterlyLabel>(
  QUARTER_COLUMNS
);

export const QUARTER_LABELS_BY_KEY = labelMaps.labelsByKey;
export const QUARTER_KEYS_BY_LABEL = labelMaps.keysByLabel;
