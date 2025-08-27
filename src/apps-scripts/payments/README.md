# ACE Payments Apps Script

This directory contains the Google Apps Script project for the ACE Remodeling Payments Pipeline.

## Quick Deploy

To deploy the payments domain to the Google Apps Script project:

1. **Navigate to the payments directory:**

   ```bash
   cd src/apps-scripts/payments
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

## Manual Deployment

If you prefer to deploy manually:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the TypeScript code:**

   ```bash
   npm run build
   ```

3. **Push to Google Apps Script:**
   ```bash
   npm run push
   ```

## Setup (First Time Only)

Before deploying for the first time, you need to set up the Google Apps Script project:

1. **Create a new Google Apps Script project:**

   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Name it "ACE Payments Pipeline"

2. **Get the project ID:**

   - In the Apps Script editor, note the project ID from the URL
   - It will look like: `1v5NZjNfwUvfKeqDuUsc1lDmmWMbAAz0OTSE-DuPE8f8`

3. **Initialize clasp:**

   ```bash
   cd src/apps-scripts/payments
   clasp login
   clasp create --type standalone --title "ACE Payments Pipeline"
   ```

4. **Update the .clasp.json file:**
   ```json
   {
     "scriptId": "YOUR_PROJECT_ID_HERE",
     "rootDir": "."
   }
   ```

## Available Functions

After deployment, the following functions will be available in the Google Apps Script project:

### Main Functions

- `updatePipeline()` - Updates the pipeline with current data
- `autoUpdatePipeline()` - Auto-updates during business hours
- `applyPipelineFormatting()` - Applies basic formatting
- `applyEnhancedFormatting()` - Applies advanced formatting options

### Event Handlers

- `onEdit(e)` - Handles edit events on monthly sheets
- `onOpen()` - Sets up the spreadsheet menu

### Utility Functions

- `getPipelineStats()` - Returns pipeline statistics

## Testing

After deployment:

1. **Open the Payments spreadsheet**
2. **Go to Extensions > Apps Script**
3. **Test the functions:**
   - Run `updatePipeline()` to test data extraction
   - Run `applyPipelineFormatting()` to test formatting
   - Check that the menu appears when you refresh the spreadsheet

## Troubleshooting

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Check TypeScript compilation: `npm run build`

### Push Errors

- Verify you're logged into clasp: `clasp login`
- Check the project ID in `.clasp.json`
- Ensure you have edit permissions on the Apps Script project

### Runtime Errors

- Check the Apps Script logs for error details
- Verify the spreadsheet has the required sheets (monthly sheets + "\_pipeline")
- Ensure the column structure matches the expected format

## File Structure

```
src/apps-scripts/payments/
├── src/
│   ├── index.ts           # Main entry point
│   └── appsscript.json    # Apps Script manifest
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── deploy.sh              # Deployment script
└── README.md              # This file
```

## Integration

The payments domain integrates with:

- **Monthly sheets** (e.g., "May 2025") - Data source
- **"\_pipeline" sheet** - Centralized view
- **ACE Remodeling menu** - User interface

The domain automatically:

- Extracts data from monthly sheets
- Updates the pipeline during business hours
- Applies formatting and styling
- Handles edit events for smart date copying
