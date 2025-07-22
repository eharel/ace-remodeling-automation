export function extractTableData<T extends Record<string, any>>({
  sheetName,
  labelMap,
  keyMap,
  blankableKeys = new Set<string>(),
  rowFilter = () => true,
  valueParser = defaultParser,
}: {
  sheetName: string;
  labelMap: Record<string, string>; // e.g. labels.YEAR → "Year"
  keyMap: Record<string, string>; // e.g. inputKeys.YEAR → "YEAR"
  blankableKeys?: Set<string>;
  rowFilter?: (row: any[]) => boolean;
  valueParser?: (key: string, raw: any, isBlankable: boolean) => any;
}): T[] {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  const values = sheet.getDataRange().getValues();
  const [headerRow, ...dataRows] = values;
  if (!headerRow) return [];

  const normalizedHeader = headerRow.map((label) => String(label).trim());

  const columnIndexByLabel: Record<string, number> = {};
  normalizedHeader.forEach((label, idx) => {
    columnIndexByLabel[label] = idx;
  });

  for (const key of Object.keys(keyMap)) {
    const label = labelMap[key];
    if (!(label in columnIndexByLabel)) {
      throw new Error(
        `❌ Missing column "${label}" (for key "${keyMap[key]}") in sheet "${sheetName}"`
      );
    }
  }

  return dataRows.filter(rowFilter).map((row) => {
    const result: Record<string, any> = {};

    for (const key of Object.keys(keyMap)) {
      const label = labelMap[key];
      const colIndex = columnIndexByLabel[label];
      const raw = row[colIndex];

      result[key] = valueParser(key, raw, blankableKeys.has(key));
    }

    return result as T;
  });
}

function defaultParser(
  key: string,
  raw: any,
  isBlankable: boolean
): number | undefined {
  if (isBlankable) {
    if (raw === "" || raw === undefined || raw === null) return undefined;
  }

  const parsed = typeof raw === "number" ? raw : Number(raw);
  return isNaN(parsed) ? (isBlankable ? undefined : 0) : parsed;
}
