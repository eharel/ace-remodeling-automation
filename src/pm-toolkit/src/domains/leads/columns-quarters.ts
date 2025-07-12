import { LeadsQuarterColumn, QuarterContext } from "./types";
import { QUARTER_KEYS, QUARTER_LABELS } from "./constants";
import { buildLabelKeyMaps } from "../../columns/utils";
import { formatPercent } from "../../utils/helpers";

export type QuarterColumnKey = (typeof QUARTER_KEYS)[keyof typeof QUARTER_KEYS];
export type QuarterColumnLabel =
  (typeof QUARTER_LABELS)[keyof typeof QUARTER_LABELS];

export const QUARTER_COLUMNS: LeadsQuarterColumn[] = [
  //   {
  //     key: QUARTER_KEYS.YEAR,
  //     label: QUARTER_LABELS.YEAR,
  //     valueFn: ({ rowData }: QuarterContext) => rowData[QUARTER_KEYS.YEAR],
  //     format: "number",
  //     align: "center",
  //   },
  {
    key: QUARTER_KEYS.QUARTER,
    label: QUARTER_LABELS.QUARTER,
    valueFn: ({ rowData }: QuarterContext) => rowData[QUARTER_KEYS.QUARTER],
    format: "text",
    align: "center",
  },
  {
    key: QUARTER_KEYS.TOTAL_LEADS,
    label: QUARTER_LABELS.TOTAL_LEADS,
    valueFn: ({ rowData }: QuarterContext) => rowData[QUARTER_KEYS.TOTAL_LEADS],
    format: "number",
    align: "center",
  },
  {
    key: QUARTER_KEYS.SIGNED,
    label: QUARTER_LABELS.SIGNED,
    valueFn: ({ rowData }: QuarterContext) => rowData[QUARTER_KEYS.SIGNED],
    format: "number",
    align: "center",
  },
  {
    key: QUARTER_KEYS.CONVERSION_RATE,
    label: QUARTER_LABELS.CONVERSION_RATE,
    valueFn: ({ rowData }: QuarterContext) => {
      const signed = Number(rowData[QUARTER_KEYS.SIGNED]) || 0;
      const total = Number(rowData[QUARTER_KEYS.TOTAL_LEADS]) || 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
  },
  {
    key: QUARTER_KEYS.REVENUE,
    label: QUARTER_LABELS.REVENUE,
    valueFn: ({ rowData }: QuarterContext) => rowData[QUARTER_KEYS.REVENUE],
    format: "currency",
  },
  {
    key: QUARTER_KEYS.REVENUE_GOAL,
    label: QUARTER_LABELS.REVENUE_GOAL,
    valueFn: ({ rowData }: QuarterContext) =>
      rowData[QUARTER_KEYS.REVENUE_GOAL],
    format: "currency",
  },
  {
    key: QUARTER_KEYS.REVENUE_DIFF,
    label: QUARTER_LABELS.REVENUE_DIFF,
    valueFn: ({ rowData }: QuarterContext) =>
      rowData[QUARTER_KEYS.REVENUE_DIFF],
    format: "currency",
  },
];

const labelMaps = buildLabelKeyMaps<QuarterColumnKey, QuarterColumnLabel>(
  QUARTER_COLUMNS
);
export const QUARTER_LABELS_BY_KEY = labelMaps.labelsByKey;
export const QUARTER_KEYS_BY_LABEL = labelMaps.keysByLabel;
