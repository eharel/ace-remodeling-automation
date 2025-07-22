// Generic map builders and accessors

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

// export function getColumnLabel(key: DashboardColumnKey): DashboardColumnLabel {
//   return COLUMN_LABELS_BY_KEY[key];
// }

// export function getColumnKey(label: DashboardColumnLabel): DashboardColumnKey {
//   return COLUMN_KEYS_BY_LABEL[label];
// }

// export function getColumnDescription(
//   key: DashboardColumnKey
// ): string | undefined {
//   return DASHBOARD_COLUMNS.find((col) => col.key === key)?.description;
// }

// export function getColumnLabel<K extends string, L extends string>(
//   key: K,
//   map: Record<K, L>
// ): L {
//   return map[key];
// }

// export function getColumnKey<K extends string, L extends string>(
//   label: L,
//   reverseMap: Record<L, K>
// ): K {
//   return reverseMap[label];
// }

// export function buildLabelKeyMaps<K extends string, L extends string>(
//   columns: { key: K; label: L }[]
// ): {
//   labelsByKey: Record<K, L>;
//   keysByLabel: Record<L, K>;
// } {
//   const labelsByKey = {} as Record<K, L>;
//   const keysByLabel = {} as Record<L, K>;

//   for (const col of columns) {
//     labelsByKey[col.key] = col.label;
//     keysByLabel[col.label] = col.key;
//   }

//   return { labelsByKey, keysByLabel };
// }
