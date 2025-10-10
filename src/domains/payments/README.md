# Payments Domain

The payments domain handles the automated pipeline management for ACE Remodeling's payment tracking system. This domain extracts data from monthly sheets, processes it, and maintains a centralized pipeline view with enhanced formatting and validation.

## Features

### Core Functionality

- **Data Aggregation**: Collects payment data from monthly sheets (e.g., "May 2025")
- **Automated Updates**: Runs during business hours to keep pipeline current
- **Smart Date Handling**: Auto-copies dates down and clears empty rows
- **Visual Formatting**: Adds borders between date groups and conditional formatting
- **Data Validation**: Validates and cleans data before processing

### Enhanced Features

- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling and logging
- **Business Hours Logic**: Respects business hours for auto-updates
- **Advanced Formatting**: Multiple formatting options including:
  - Status-based color coding
  - PM color coding
  - Alternate row colors
  - Today's entries highlighting
  - Bold amounts
- **Statistics**: Pipeline analytics and reporting

## Structure

```
src/domains/payments/
├── core/
│   ├── pipeline-manager.ts    # Main orchestration logic
│   ├── data-extraction.ts     # Data extraction from sheets
│   ├── data-transformation.ts # Data validation and cleaning
│   ├── formatting.ts          # Visual formatting utilities
│   └── utils.ts              # Helper functions
├── types.ts                  # TypeScript interfaces
├── constants.ts              # Configuration constants
├── main.ts                   # Google Apps Script entry point
└── index.ts                  # Public API exports
```

## Usage

### Google Apps Script Functions

The following functions are available in Google Apps Script:

#### Main Functions

- `updatePipeline()` - Updates the pipeline with current data
- `autoUpdatePipeline()` - Auto-updates during business hours
- `applyPipelineFormatting()` - Applies basic formatting
- `applyEnhancedFormatting()` - Applies advanced formatting options

#### Event Handlers

- `onEdit(e)` - Handles edit events on monthly sheets
- `onOpen()` - Sets up the spreadsheet menu

#### Utility Functions

- `getPipelineStats()` - Returns pipeline statistics

### Menu Options

The domain adds the following menu items to the spreadsheet:

- **Refresh Pipeline** - Manual pipeline update
- **Auto Update Pipeline** - Business hours auto-update
- **Apply Formatting** - Basic formatting
- **Enhanced Formatting** - Advanced formatting options

## Data Structure

### Pipeline Row

```typescript
interface PipelineRow {
  date: Date | string;
  projectName: string;
  clientName: string;
  amount: number | string;
  status: string;
  notes: string;
  pm: string;
  category: string;
  murphy: string; // Renamed from "Shay"
  monthValue: Date | string;
}
```

### Column Mapping

- Column A: Date
- Column B: Project Name
- Column C: Client Name
- Column D: Amount
- Column E: Status
- Column F: Notes
- Column G: PM
- Column H: Category
- Column I: Murphy (formerly "Shay")

## Improvements Over Original Code

### 1. **Better Organization**

- Separated concerns into distinct modules
- Clear separation of data extraction, transformation, and formatting
- Consistent with monorepo patterns

### 2. **Enhanced Error Handling**

- Comprehensive error handling and logging
- Graceful degradation when sheets are missing
- Data validation before processing

### 3. **Type Safety**

- Full TypeScript support
- Proper interfaces for all data structures
- Compile-time error checking

### 4. **Advanced Formatting**

- Status-based conditional formatting
- PM color coding
- Alternate row colors
- Today's entries highlighting
- Configurable formatting options

### 5. **Better Logging**

- Uses the project's logging system instead of `Logger.log`
- Structured logging with different levels
- Better debugging capabilities

### 6. **Enhanced Functionality**

- Pipeline statistics and analytics
- Business hours validation
- Data filtering and sorting
- Enhanced menu system

### 7. **Maintainability**

- Unit testing capabilities
- Better code documentation
- Consistent code style
- Modular architecture

## Configuration

### Business Hours

```typescript
export const BUSINESS_HOURS = {
  startHour: 7,
  endHour: 18,
  startDay: 1, // Monday
  endDay: 5, // Friday
};
```

### Column Configuration

```typescript
export const PIPELINE_COLUMNS = {
  DATE: 1, // Column A
  PROJECT_NAME: 2, // Column B
  CLIENT_NAME: 3, // Column C
  AMOUNT: 4, // Column D
  STATUS: 5, // Column E
  NOTES: 6, // Column F
  PM: 7, // Column G
  CATEGORY: 8, // Column H
  MURPHY: 9, // Column I
};
```

## Deployment

To deploy the payments domain:

1. Build the TypeScript code
2. Push to the Google Apps Script project
3. The functions will be available in the spreadsheet

## Future Enhancements

- Dashboard generation with charts
- Integration with other domains (PM toolkit, vendors)
- Advanced filtering and search capabilities
- Automated reporting
- Email notifications for updates
