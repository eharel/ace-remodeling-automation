import { LeadsQuarterColumn } from "../core/types";
import { buildLabelKeyMaps } from "shared/columns";
import { formatPercent } from "@pm/utils/helpers";
import {
  QuarterlyKey,
  quarterlyKeys,
  QuarterlyLabel,
  quarterlyLabels,
} from "../../shared/columns/labels";

export const QUARTER_COLUMNS: LeadsQuarterColumn[] = [
  // {
  //   key: quarterlyKeys.YEAR,
  //   label: quarterlyLabels.YEAR,
  //   valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.YEAR],
  //   format: "number",
  //   align: "center",
  // },
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
  },
  {
    key: quarterlyKeys.SIGNED,
    label: quarterlyLabels.SIGNED,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.SIGNED],
    format: "number",
    align: "center",
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
  },
  {
    key: quarterlyKeys.REVENUE,
    label: quarterlyLabels.REVENUE,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE],
    format: "currency",
  },
  {
    key: quarterlyKeys.REVENUE_GOAL,
    label: quarterlyLabels.REVENUE_GOAL,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE_GOAL],
    format: "currency",
  },
  {
    key: quarterlyKeys.REVENUE_DIFF,
    label: quarterlyLabels.REVENUE_DIFF,
    valueFn: ({ inputRowData }) => inputRowData[quarterlyKeys.REVENUE_DIFF],
    format: "currency",
  },
];

const labelMaps = buildLabelKeyMaps<QuarterlyKey, QuarterlyLabel>(
  QUARTER_COLUMNS
);

export const QUARTER_LABELS_BY_KEY = labelMaps.labelsByKey;
export const QUARTER_KEYS_BY_LABEL = labelMaps.keysByLabel;
