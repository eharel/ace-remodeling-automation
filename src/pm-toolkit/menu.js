function onOpen() {
  const ui = SpreadsheetApp.getUi();

  const closeSubMenu = ui
    .createMenu("Close Project")
    .addItem("This Project", `${LIB_IDENTIFIER}.closeActiveProject`)
    .addItem("Other Project...", `${LIB_IDENTIFIER}.promptProjectToClose`);

  ui.createMenu("Ace Remodeling PM Toolkit")
    .addItem("Update Dashboard", `${LIB_IDENTIFIER}.generateProjectDashboard`)
    .addItem("Add New Project", `${LIB_IDENTIFIER}.promptForNewProject`)
    .addSubMenu(closeSubMenu)
    .addSeparator()
    .addItem("📄 Structure Help", `${LIB_IDENTIFIER}.showStructureHelp`)
    .addItem("⚙️ First-time Setup", `${LIB_IDENTIFIER}.showFirstTimeSetup`)
    .addToUi();
}

function showStructureHelp() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    "Dashboard Structure Help",
    `To ensure the dashboard works correctly, please follow these guidelines:\n
1️⃣ Each project tab must begin with a number followed by a space and client name (e.g., "123 Smith").\n
2️⃣ There are two supported tab formats:
   • Older tabs use fixed cell positions (e.g., M2, M7, M13, I21).\n
   • Newer tabs use named ranges (e.g., 'contract_price', 'advance_total').\n
3️⃣ If you’re creating a new tab, always use the "Add New Project" option from the menu — it ensures everything is set up correctly.\n
4️⃣ You can safely delete or regenerate the "Projects Dashboard" at any time using the menu.\n
5️⃣ Edits inside any project tab will automatically trigger a dashboard update.`,
    ui.ButtonSet.OK
  );
}

function showFirstTimeSetup() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    "First-time Setup Instructions",
    `If this file was duplicated from another sheet, you must authorize the script once to enable automation:\n
1️⃣ Go to: Extensions → Apps Script\n
2️⃣ In the Apps Script editor, click ▶ (Run) next to any function\n
3️⃣ Approve the permission prompt when it appears\n
✅ This only needs to be done once per user per file.`,
    ui.ButtonSet.OK
  );
}
