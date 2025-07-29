# Dashboard System Architecture

## Overview

The dashboard system is a type-safe, modular framework for generating Google Sheets dashboards from raw data. It's built around a column-driven architecture where each column defines how to extract, transform, and display data.

## Core Architecture

### 1. **Keys & Labels System** 📋

The foundation of type safety comes from separating data keys from display labels:

#### Input Keys (`inputKeys`)
```typescript
// Raw data field identifiers
export const inputKeys = {
  MONTH: "MONTH",
  REVENUE: "REVENUE", 
  TOTAL_LEADS: "TOTAL_LEADS",
  // ... etc
} as const;
```

#### Dashboard Keys (`dashboardKeys`) 
```typescript
// Extends input keys + derived fields
export const dashboardKeys = {
  ...inputKeys,
  CONVERSION_RATE: "CONVERSION_RATE", // Calculated field
  REVENUE_DIFF: "REVENUE_DIFF",       // Calculated field
} as const;
```

#### Labels (`dashboardLabels`)
```typescript
// Human-readable column headers
export const dashboardLabels = {
  MONTH: "Month",
  REVENUE: "Approved Revenue",
  CONVERSION_RATE: "Conversion Rate (%)",
  // ... etc
};
```

**Location:** `src/pm-toolkit/src/domains/leads/shared/columns/`

### 2. **Column Definition System** 🏗️

Columns are the heart of the system - they define how data flows from input to display.

#### Base Column Type
```typescript
export type BaseColumn<TContext, TKey, TLabel> = {
  key: TKey;           // Unique identifier
  label: TLabel;       // Display name
  valueFn: (ctx: TContext) => any;  // Data transformation
  format?: ColumnFormat;            // Display formatting
  align?: Alignment;               // Cell alignment
  description?: string;            // Optional help text
  help?: string;                  // Tooltip text
};
```

#### Domain-Specific Columns
```typescript
// Monthly leads columns
export const LEADS_COLUMNS: LeadsColumn[] = [
  {
    key: dashboardKeys.CONVERSION_RATE,
    label: dashboardLabels.CONVERSION_RATE,
    valueFn: ({ inputRowData }) => {
      const signed = inputRowData[inputKeys.SIGNED] ?? 0;
      const total = inputRowData[inputKeys.TOTAL_LEADS] ?? 0;
      return formatPercent(signed, total);
    },
    format: "percent",
    help: "Signed Proposals ÷ Total Leads",
    align: "center",
  },
  // ... more columns
];
```

**Location:** 
- Base types: `src/shared/columns/types.ts`
- PM columns: `src/pm-toolkit/src/domains/leads/pm/columns/`

### 3. **Row Types & Context** 📊

#### Input Rows
Raw data structure from spreadsheets:
```typescript
export type LeadsInputRow = {
  [K in InputKey]: number;
};
```

#### Dashboard Rows  
Processed data ready for display:
```typescript
export type LeadsDashboardRow = DashboardRow<DashboardKey>;
export type QuarterDashboardRow = DashboardRow<QuarterlyKey>;
```

#### Row Context
Data passed to column `valueFn`:
```typescript
export interface LeadsRowContext {
  inputRowData: LeadsInputRow;
}
```

**Location:** `src/pm-toolkit/src/domains/leads/shared/rows/types.ts`

### 4. **Data Transformation Pipeline** 🔄

The system transforms data through a standardized pipeline:

```
Raw Input Data → Row Context → Column valueFn → Dashboard Rows → Google Sheets
```

#### Core Transformation Function
```typescript
export function mapInputToDashboardRows<TContext, TDashboardRow>(
  contexts: TContext[],
  columns: BaseColumn<TContext, keyof TDashboardRow & string, string>[]
): TDashboardRow[] {
  return contexts.map((ctx) => {
    const result: Partial<TDashboardRow> = {};
    for (const col of columns) {
      result[col.key] = col.valueFn(ctx);
    }
    return result as TDashboardRow;
  });
}
```

**Location:** `src/pm-toolkit/src/utils/helpers.ts`

### 5. **Table Generation System** 📋

The table builder creates styled Google Sheets tables:

#### Main Builder Function
```typescript
export function generateAndStylizeTableFromRows<RowType, T>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rows: RowType[],
  startRow: number,
  startCol: number, 
  title: string,
  columns: BaseColumn<any, any, any>[],
  summaryRowOps: SummaryOperationsMap,
  options: StylizeOptions<T> = {}
): TableInfo
```

#### Features:
- **Headers:** Auto-generated from column labels
- **Data Rows:** Populated using column `valueFn`
- **Summary Rows:** Automatic calculations (sum, avg, etc.)
- **Styling:** Format-aware cell styling
- **Merging:** Row spanning for grouped data

**Location:** `src/tables/builder.ts`

### 6. **Label-Key Mapping System** 🗺️

Bidirectional maps for converting between keys and labels:

```typescript
export function buildLabelKeyMaps<K extends string, L extends string>(
  columns: { key: K; label: L }[]
): {
  labelsByKey: Record<K, L>;
  keysByLabel: Record<L, K>;
}
```

**Usage:**
```typescript
const labelMaps = buildLabelKeyMaps(LEADS_COLUMNS);
export const DASHBOARD_LABELS_BY_KEY = labelMaps.labelsByKey;
export const DASHBOARD_KEYS_BY_LABEL = labelMaps.keysByLabel;
```

**Location:** `src/shared/columns/utils.ts`

## Data Flow Architecture

### 1. **Data Extraction**
```
Google Sheets → Raw Input Rows → LeadsInputRow[]
```

### 2. **Data Transformation** 
```
LeadsInputRow[] → LeadsRowContext[] → mapInputToDashboardRows() → LeadsDashboardRow[]
```

### 3. **Table Generation**
```
LeadsDashboardRow[] → generateAndStylizeTableFromRows() → Styled Google Sheets Table
```

### 4. **Chart Generation** (Optional)
```
TableInfo → Chart Functions → Google Sheets Charts
```

## Key Benefits

### ✅ **Type Safety**
- All keys, labels, and data flows are type-checked
- Compile-time validation of column definitions
- IntelliSense support throughout

### ✅ **Modularity** 
- Columns are self-contained units
- Easy to add/remove/modify individual columns
- Reusable across different dashboard types

### ✅ **Consistency**
- Standardized data transformation pipeline
- Uniform styling and formatting
- Predictable table structure

### ✅ **Maintainability**
- Clear separation of concerns
- Single source of truth for labels/keys
- Easy to trace data flow

## File Organization

```
src/
├── shared/                          # Shared utilities
│   ├── columns/                     # Base column types & utils
│   ├── rows/                        # Base row types
│   └── styles/                      # Styling system
├── pm-toolkit/src/domains/leads/    # Leads domain
│   ├── shared/                      # Shared leads components
│   │   ├── columns/                 # Keys, labels, types
│   │   └── rows/                    # Row types & contexts
│   └── pm/                          # PM-specific implementation
│       ├── columns/                 # Column definitions
│       ├── core/                    # Data transformation
│       └── dashboard/               # Dashboard generation
└── tables/                          # Table builder system
    └── builder.ts                   # Main table generation
```

## Usage Example

```typescript
// 1. Define your data structure
const inputRows: LeadsInputRow[] = extractLeadsData(sheet);

// 2. Transform to dashboard rows  
const dashboardRows = createMonthlyDashboardRows(inputRows);

// 3. Generate styled table
const tableInfo = generateAndStylizeTableFromRows(
  sheet,
  dashboardRows,
  startRow,
  startCol,
  "Monthly Leads Dashboard",
  LEADS_COLUMNS,
  MONTHLY_SUMMARY_OPERATIONS,
  { showDescription: false }
);

// 4. Optional: Add charts
generateCharts(sheet, tableInfo, quarterlyTableInfo);
```

## Extension Points

### Adding New Columns
1. Add key to `dashboardKeys`
2. Add label to `dashboardLabels` 
3. Add column definition to `LEADS_COLUMNS`
4. Update type definitions if needed

### Adding New Dashboard Types
1. Create new keys/labels in `shared/columns/`
2. Define column definitions in domain folder
3. Create transformation functions
4. Wire up in dashboard generation

### Custom Styling
1. Add custom stylizers to `StylizeOptions`
2. Implement styling logic in stylizer functions
3. Apply during table generation

## Common Patterns

### Calculated Fields
```typescript
{
  key: dashboardKeys.CONVERSION_RATE,
  valueFn: ({ inputRowData }) => {
    const signed = inputRowData[inputKeys.SIGNED] ?? 0;
    const total = inputRowData[inputKeys.TOTAL_LEADS] ?? 0;
    return formatPercent(signed, total);
  },
  format: "percent"
}
```

### Conditional Formatting
```typescript
{
  key: dashboardKeys.REVENUE_DIFF,
  valueFn: ({ inputRowData }) => {
    const revenue = inputRowData[inputKeys.REVENUE];
    const goal = inputRowData[inputKeys.REVENUE_GOAL];
    if (typeof revenue !== "number" || typeof goal !== "number") return "";
    return goal - revenue;
  },
  format: "currency"
}
```

### Row Grouping
```typescript
// In StylizeOptions
{
  rowSpanMap: { "Q1": 3, "Q2": 3, "Q3": 3, "Q4": 3 },
  customStylizers: [applyQuarterColoring, applyQuarterBorders]
}
```

---

This architecture provides a robust, type-safe foundation for building complex dashboard systems while maintaining clarity and ease of maintenance.
