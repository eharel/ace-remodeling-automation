// Generic map builders and accessors

import { BaseColumn } from "./types";
import { SummaryOperationConfig, SummaryOperationsMap } from "./summary";

export function buildLabelKeyMaps<K extends string, L extends string>(
  columns: { key: K; label: L }[]
): {
  labelsByKey: Record<K, L>;
  keysByLabel: Record<L, K>;
} {
  const labelsByKey = {} as Record<K, L>;
  const keysByLabel = {} as Record<L, K>;

  for (const col of columns) {
    labelsByKey[col.key] = col.label;
    keysByLabel[col.label] = col.key;
  }

  return { labelsByKey, keysByLabel };
}

export function getColumnLabel<K extends string, L extends string>(
  key: K,
  labelsByKey: Record<K, L>
): L {
  return labelsByKey[key];
}

export function getColumnKey<K extends string, L extends string>(
  label: L,
  keysByLabel: Record<L, K>
): K {
  return keysByLabel[label];
}

export function extractSummaryOps<T extends BaseColumn<any, any, any>>(
  columns: T[],
  overrides?: Partial<Record<string, SummaryOperationConfig>>
): SummaryOperationsMap {
  const map: SummaryOperationsMap = {};

  for (const col of columns) {
    const override = overrides?.[col.key];
    if (override) {
      map[col.key] = override;
    } else if (col.summaryOps) {
      map[col.key] = col.summaryOps;
    }
  }

  return map;
}
