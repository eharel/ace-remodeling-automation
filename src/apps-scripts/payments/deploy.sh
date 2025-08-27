#!/bin/bash

# ACE Payments Domain Deployment Script
# This script builds and deploys the payments domain to Google Apps Script

set -e

echo "🚀 Starting ACE Payments Domain Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the payments Apps Script directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. build directory not found."
    exit 1
fi

# Push to Google Apps Script
echo "📤 Pushing to Google Apps Script..."
npm run push

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Open the Payments spreadsheet"
echo "2. Go to Extensions > Apps Script"
echo "3. Verify the functions are available"
echo "4. Test the menu items and functions"
echo ""
echo "🔧 Available functions:"
echo "- updatePipeline()"
echo "- autoUpdatePipeline()"
echo "- applyPipelineFormatting()"
echo "- applyEnhancedFormatting()"
echo "- getPipelineStats()"
