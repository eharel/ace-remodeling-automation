// leads/dashboard.ts
import { LeadsColumn, LeadsContext } from "./types";
import { buildLabelKeyMaps } from "../../columns/utils";
import { formatPercent } from "../../utils/helpers";
import { LEADS_KEYS, LEADS_LABELS } from "./constants";
import { getMonthName } from "../../utils/helpers";

export type LeadsColumnKey = (typeof LEADS_KEYS)[keyof typeof LEADS_KEYS];
export type LeadsColumnLabel = (typeof LEADS_LABELS)[keyof typeof LEADS_LABELS];

export const LEADS_COLUMNS: LeadsColumn[] = [
  // {
  //   key: LEADS_KEYS.YEAR,
  //   label: LEADS_LABELS.YEAR,
  //   valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.YEAR],
  //   format: "number",
  //   align: "center",
  // },
  {
    key: LEADS_KEYS.MONTH,
    label: LEADS_LABELS.MONTH,
    valueFn: ({ rowData }: LeadsContext) =>
      getMonthName(rowData[LEADS_KEYS.MONTH]),
    format: "number",
  },
  {
    key: LEADS_KEYS.TOTAL_LEADS,
    label: LEADS_LABELS.TOTAL_LEADS,
    valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.TOTAL_LEADS],
    format: "number",
    align: "center",
  },
  {
    key: LEADS_KEYS.SIGNED,
    label: LEADS_LABELS.SIGNED,
    valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.SIGNED],
    format: "number",
    align: "center",
  },
  {
    key: LEADS_KEYS.CONVERSION_RATE,
    label: LEADS_LABELS.CONVERSION_RATE,
    valueFn: ({ rowData }: LeadsContext) => {
      const signed = Number(rowData[LEADS_KEYS.SIGNED]) || 0;
      const total = Number(rowData[LEADS_KEYS.TOTAL_LEADS]) || 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
  },
  {
    key: LEADS_KEYS.REVENUE,
    label: LEADS_LABELS.REVENUE,
    valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.REVENUE],
    format: "currency",
  },
  {
    key: LEADS_KEYS.REVENUE_GOAL,
    label: LEADS_LABELS.REVENUE_GOAL,
    // valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.REVENUE_GOAL],
    valueFn: ({ rowData }: LeadsContext) => "666",
    format: "currency",
  },
  {
    key: LEADS_KEYS.REVENUE_DIFF,
    label: LEADS_LABELS.REVENUE_DIFF,
    valueFn: ({ rowData }: LeadsContext) => "666",
    format: "currency",
  },
  // {
  //   key: LEADS_KEYS.PROP_NOT_SENT,
  //   label: LEADS_LABELS.PROP_NOT_SENT,
  //   valueFn: ({ rowData }: LeadsContext) => rowData[LEADS_KEYS.PROP_NOT_SENT],
  //   format: "number",
  //   align: "center",
  // },
];

const labelMaps = buildLabelKeyMaps<LeadsColumnKey, LeadsColumnLabel>(
  LEADS_COLUMNS
);
export const LEADS_LABELS_BY_KEY = labelMaps.labelsByKey;
export const LEADS_KEYS_BY_LABEL = labelMaps.keysByLabel;
