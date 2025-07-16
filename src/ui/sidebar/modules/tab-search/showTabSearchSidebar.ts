/**
 * Tab Search Sidebar Module
 * 
 * This module provides tab search functionality in the sidebar.
 */

import { loadSidebarModule } from '../../loadSidebarModule';

/**
 * Shows the tab search sidebar with search functionality
 */
export function showTabSearchSidebar() {
  // Load the HTML template for this module
  const html = HtmlService.createTemplateFromFile('sidebar/modules/tab-search/TabSearchSidebar.html')
    .evaluate()
    .setTitle('Tab Search')
    .setWidth(300);

  // Display the sidebar
  SpreadsheetApp.getUi().showSidebar(html);
  
  // Log for testing
  console.log('Tab Search Sidebar opened');
  
  // You could add additional functionality here, such as:
  // - Pre-populating the sidebar with data
  // - Setting up event handlers
  // - Initializing the sidebar state
}

/**
 * Helper function to search tabs based on a query
 * This would be called from the sidebar UI
 */
function searchTabs(query: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  // Simple search implementation for testing
  const results = sheets
    .filter(sheet => sheet.getName().toLowerCase().includes(query.toLowerCase()))
    .map(sheet => ({
      name: sheet.getName(),
      index: sheet.getIndex()
    }));
    
  return results;
}
