const PROJECT_FIELDS = [
  { dbHeader: COL_PROJECT_NO, namedRange: NR_PROJECT_NUMBER, valueFn: sheet => getProjectNumber(sheet) },
  { dbHeader: COL_CLIENT_NAME, namedRange: NR_CLIENT_NAME, valueFn: sheet => getClientName(sheet) },
  { dbHeader: COL_CONTRACT_PRICE, namedRange: NR_CONTRACT_PRICE, cell: "M2" },
  { dbHeader: COL_CHANGE_ORDERS, namedRange: NR_CHANGE_ORDER_TOTAL, cell: "M7" },
  { dbHeader: COL_EXPENSES, namedRange: NR_EXPENSE_TOTAL, cell: "M13" },
  { dbHeader: COL_MAX_ADVANCE, namedRange: NR_ADVANCE_MAX, computed: true },
  { dbHeader: COL_TOTAL_ADVANCE, namedRange: NR_ADVANCE_TOTAL, cell: "I21" },
  { dbHeader: COL_ADVANCE_BALANCE, namedRange: NR_ADVANCE_BALANCE, computed: true },
  { dbHeader: COL_PM_AFTER_ADVANCE, namedRange: NR_PM_AFTER_ADVANCE, cell: "M21" },
];

const PROJECT_DASHBOARD_HEADERS = PROJECT_FIELDS.map(f => f.dbHeader);
const headerIndexMap = PROJECT_DASHBOARD_HEADERS.reduce((map, header, i) => {
  map[header] = i;
  return map;
}, {});

const CURRENCY_COLUMNS = [
  COL_CONTRACT_PRICE,
  COL_CHANGE_ORDERS,
  COL_EXPENSES,
  COL_MAX_ADVANCE,
  COL_TOTAL_ADVANCE,
  COL_ADVANCE_BALANCE,
  COL_PM_AFTER_ADVANCE,
];

function getFieldValue(rowData, header) {
  const index = PROJECT_FIELDS.findIndex(f => f.dbHeader === header);
  return rowData[index];
}

function generateProjectDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  let projectDashboard = ss.getSheetByName(PROJECT_DASHBOARD_SHEET_NAME);
  if (!projectDashboard) {
    projectDashboard = ss.insertSheet(PROJECT_DASHBOARD_SHEET_NAME);
  } else {
    projectDashboard.clear();
  }

  const activeSheets = [];
  const closedSheets = [];

  for (const sheet of allSheets) {
    const name = sheet.getName();
    if (!startsWithProjectNumber(name)) continue;

    if (isClosedTabName(name)) {
      closedSheets.push(sheet);
    } else {
      activeSheets.push(sheet);
    }
  }

  const startRow = 1;
  const startColActive = 1;
  const startColClosed = PROJECT_DASHBOARD_HEADERS.length + COL_GAP_BETWEEN_TABLES;

  const tableInfo = [];

  tableInfo.push(
    generateProjectTable(projectDashboard, activeSheets, startRow, startColActive, "🟢 Active Projects")
  );

  tableInfo.push(
    generateProjectTable(projectDashboard, closedSheets, startRow, startColClosed, "🔴 Closed Projects")
  );

  stylizeDashboard(projectDashboard, tableInfo);
}

function generateProjectTable(sheet, projectSheets, startRow, startCol, title = "") {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let rowIndex = startRow;

  if (title) {
    sheet.getRange(rowIndex, startCol).setValue(title).setFontWeight("bold");
    sheet.getRange(rowIndex, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
      .merge()
      .setHorizontalAlignment("center")
      .setFontSize(12)
      .setFontWeight("bold");
    rowIndex++;
  }

  sheet.getRange(rowIndex, startCol, 1, PROJECT_DASHBOARD_HEADERS.length)
    .setValues([PROJECT_DASHBOARD_HEADERS]);
  rowIndex++;

  const tableStartRow = rowIndex;

  for (const sheetTab of projectSheets) {
    const rowData = getProjectRowData(sheetTab);
    sheet.getRange(rowIndex, startCol, 1, rowData.length).setValues([rowData]);
    rowIndex++;
  }

  const numRows = rowIndex - tableStartRow;
  if (numRows > 0) {
    sheet.getRange(tableStartRow, startCol, numRows, PROJECT_DASHBOARD_HEADERS.length)
      .sort({ column: startCol, ascending: IS_ASCENDING_ORDER });
  }

  Logger.log(`Wrote ${projectSheets.length} rows at row ${startRow}, col ${startCol} for "${title}"`);
  return {
    title,
    startRow,
    startCol,
    headerRow: startRow + 1,
    dataStartRow: startRow + 2,
    dataEndRow: rowIndex - 1,
  };
}

function getProjectRowData(sheetTab) {
  const sheetName = sheetTab.getName();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const namedRangeMap = buildNamedRangeMap(ss, sheetName);
  const directValueMap = buildDirectValueMap(sheetTab); // Support legacy projects by getting values of specific cells

  const rowData = buildProjectRowData(sheetTab, namedRangeMap, directValueMap);



  // for (const field of PROJECT_FIELDS) {
  //   const { valueFn, namedRange, cell, computed } = field;

  //   if (valueFn) {
  //     rowData.push(valueFn(sheetTab));
  //     continue;
  //   }

  //   if (namedRange) {
  //     const matchingEntry = [...namedRangeMap.entries()].find(([key]) => {
  //       const namePart = key.includes("!") ? key.split("!").pop() : key;

  //       return (
  //         namePart === namedRange ||            // exact match (e.g. contract_price)
  //         namePart.endsWith(`__${namedRange}`)  // safe manual match (e.g. 881__contract_price)
  //       );
  //     });

  //     if (matchingEntry) {
  //       const [key, range] = matchingEntry;

  //       // logToSheet(`📌 Sheet: ${sheetName}, Named range match: "${key}" → A1: ${range.getA1Notation()}, Value: "${range.getDisplayValue()}"`);

  //       if (range.getNumRows() === 1 && range.getNumColumns() === 1) {
  //         rowData.push(range.getValue());
  //         continue;
  //       }
  //     } else {
  //       // logToSheet(`⚠️ Sheet: ${sheetName}, No named range found ending in "${namedRange}"`);
  //     }
  //   }

  //   if (cell && !computed) {
  //     const value = directValueMap.get(cell);
  //     rowData.push(value !== undefined ? value : "N/A");
  //     continue;
  //   }

  //   if (computed) {
  //     rowData.push(null);
  //   } else {
  //     rowData.push("N/A");
  //   }
  // }




  // Compute derived values
  const contractPrice = toNumber(getFieldValue(rowData, COL_CONTRACT_PRICE));
  const changeOrders = toNumber(getFieldValue(rowData, COL_CHANGE_ORDERS));
  const totalAdvance = toNumber(getFieldValue(rowData, COL_TOTAL_ADVANCE));

  if (typeof contractPrice === "number" && typeof changeOrders === "number") {
    const maxAdvance = calculateAdvanceMax(contractPrice, changeOrders);
    rowData[headerIndexMap[COL_MAX_ADVANCE]] = maxAdvance;

    if (typeof totalAdvance === "number") {
      const balance = maxAdvance - totalAdvance;
      rowData[headerIndexMap[COL_ADVANCE_BALANCE]] = balance;
    }
  }

  for (let i = 0; i < rowData.length; i++) {
    if (rowData[i] === null) rowData[i] = "N/A";
  }

  return rowData;
}



function buildNamedRangeMap(ss, sheetName) {
  const namedRangeMap = new Map();

  for (const nr of ss.getNamedRanges()) {
    const range = nr.getRange();
    if (range.getSheet().getName() === sheetName) {
      namedRangeMap.set(nr.getName(), range);
    }
  }

  return namedRangeMap;
}

function buildDirectValueMap(sheet) {
  const map = new Map();
  for (const field of PROJECT_FIELDS) {
    if (field.cell && !field.computed) {
      map.set(field.cell, sheet.getRange(field.cell).getValue());
    }
  }
  return map;
}

function buildProjectRowData(sheetTab, namedRangeMap, directValueMap) {
  const rowData = [];

  for (const field of PROJECT_FIELDS) {
    rowData.push(getFieldValueFromSheet(field, sheetTab, namedRangeMap, directValueMap));
  }

  return rowData;
}

function getFieldValueFromSheet(field, sheetTab, namedRangeMap, directValueMap) {
  const { valueFn, namedRange, cell, computed } = field;

  if (valueFn) return valueFn(sheetTab);

  if (namedRange) {
    const matchingEntry = [...namedRangeMap.entries()].find(([key]) => {
      const namePart = key.includes("!") ? key.split("!").pop() : key;
      return (
        namePart === namedRange ||
        namePart.endsWith(`__${namedRange}`)
      );
    });

    if (matchingEntry) {
      const [, range] = matchingEntry;
      if (range.getNumRows() === 1 && range.getNumColumns() === 1) {
        return range.getValue();
      }
    }
  }

  if (cell && !computed) {
    const value = directValueMap.get(cell);
    return value !== undefined ? value : "N/A";
  }

  return computed ? null : "N/A";
}
