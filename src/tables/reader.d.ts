export declare function extractTableData<TRow extends Record<string, any>>({ ss, sheetName, labelMap, blankableKeys, rowFilter, valueParser, }: {
    ss?: GoogleAppsScript.Spreadsheet.Spreadsheet;
    sheetName: string;
    labelMap: Record<keyof TRow, string>;
    blankableKeys?: Set<keyof TRow>;
    rowFilter?: (row: any[]) => boolean;
    valueParser?: (key: keyof TRow, raw: any, isBlankable: boolean) => any;
}): TRow[];
