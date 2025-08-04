export function extractTableData({ ss = SpreadsheetApp.getActiveSpreadsheet(), sheetName, labelMap, blankableKeys = new Set(), rowFilter = () => true, valueParser = defaultParser, }) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet)
        throw new Error(`Sheet "${sheetName}" not found`);
    const values = sheet.getDataRange().getValues();
    const [headerRow, ...dataRows] = values;
    if (!headerRow)
        return [];
    const normalizedHeader = headerRow.map((label) => String(label).trim());
    const columnIndexByLabel = {};
    normalizedHeader.forEach((label, idx) => {
        columnIndexByLabel[label] = idx;
    });
    for (const key of Object.keys(labelMap)) {
        const label = labelMap[key];
        if (!(label in columnIndexByLabel)) {
            throw new Error(`❌ Missing column "${label}" (for key "${String(key)}") in sheet "${sheetName}"`);
        }
    }
    return dataRows.filter(rowFilter).map((row) => {
        const result = {};
        for (const key of Object.keys(labelMap)) {
            const label = labelMap[key];
            const colIndex = columnIndexByLabel[label];
            const raw = row[colIndex];
            result[key] = valueParser(key, raw, blankableKeys.has(key));
        }
        return result;
    });
}
// function defaultParser<TRow extends Record<string, any>>(
//   key: keyof TRow,
//   raw: any,
//   isBlankable: boolean
// ): number | undefined {
//   if (isBlankable && (raw === "" || raw === undefined || raw === null)) {
//     return undefined;
//   }
//   const parsed = typeof raw === "number" ? raw : Number(raw);
//   return isNaN(parsed) ? (isBlankable ? undefined : 0) : parsed;
// }
function defaultParser(key, raw, isBlankable) {
    if (raw === "" || raw === undefined || raw === null) {
        return isBlankable ? undefined : raw;
    }
    // Try parsing as number
    const parsed = typeof raw === "number" ? raw : Number(raw);
    return isNaN(parsed) ? raw : parsed;
}
