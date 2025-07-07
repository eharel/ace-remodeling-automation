export function showStructureHelp() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    "Dashboard Structure Help",
    `To ensure the dashboard works correctly, please follow these guidelines:\n
1️⃣ Each project tab must begin with a number followed by a space and client name (e.g., "123 Smith").\n
2️⃣ Older tabs use fixed cells (M2, M7...) and newer ones use named ranges.\n
3️⃣ Always use the menu to create new tabs.\n
4️⃣ You can regenerate the dashboard safely at any time.\n
5️⃣ Edits inside any project tab auto-update the dashboard.`,
    ui.ButtonSet.OK
  );
}

export function showFirstTimeSetup() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    "First-time Setup Instructions",
    `If this file was duplicated, you must authorize the script:\n
1️⃣ Go to Extensions → Apps Script\n
2️⃣ Click ▶ (Run) next to any function\n
3️⃣ Approve permissions\n
✅ Only needs to be done once per user per file.`,
    ui.ButtonSet.OK
  );
}
