# Deployment Guide

## Simple Process

The deployment process is straightforward - we just change the script ID to point to different Google Apps Script projects.

## Development Setup

1. **Copy the Payments spreadsheet:**

   - Open the original: https://docs.google.com/spreadsheets/d/1v5NZjNfwUvfKeqDuUsc1lDmmWMbAAz0OTSE-DuPE8f8/edit
   - Go to `File` > `Make a copy`
   - Name it "ACE Payments - DEV"

2. **Open Apps Script in the dev copy:**

   - Go to `Extensions` > `Apps Script`
   - This creates a new Apps Script project

3. **Get the Script ID:**

   - Copy the script ID from the Apps Script editor URL

4. **Update .clasp.json:**

   ```json
   {
     "scriptId": "YOUR_DEV_SCRIPT_ID_HERE",
     "rootDir": "."
   }
   ```

5. **Deploy:**
   ```bash
   cd src/apps-scripts/payments
   ./deploy.sh
   ```

## Production Deployment

1. **Get the production Script ID:**

   - Open Apps Script in the original Payments spreadsheet
   - Copy the script ID from the URL

2. **Update .clasp.json:**

   ```json
   {
     "scriptId": "YOUR_PROD_SCRIPT_ID_HERE",
     "rootDir": "."
   }
   ```

3. **Deploy:**
   ```bash
   cd src/apps-scripts/payments
   ./deploy.sh
   ```

## That's It!

- **Dev**: Change script ID → Deploy → Test
- **Prod**: Change script ID → Deploy → Done

No complex configurations needed - just different script IDs for different environments.
