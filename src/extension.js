const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/** @type {vscode.StatusBarItem | undefined} */
let themeStatusBar;
/** @type {string | undefined} */
let extensionPath;

/** @type {import('./themeCatalog.json')} */
let catalog = [];

function loadCatalog() {
  const root = extensionPath;
  if (!root) return [];
  const catalogPath = path.join(root, 'src', 'themeCatalog.json');
  return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
}

/**
 * @param {string} label
 * @returns {import('./themeCatalog.json')[number] | undefined}
 */
function findCatalogEntry(label) {
  return catalog.find((entry) => entry.label === label);
}

/**
 * @returns {import('./themeCatalog.json')[number] | undefined}
 */
function getActiveCatalogEntry() {
  const current = vscode.workspace.getConfiguration().get('workbench.colorTheme');
  return findCatalogEntry(current);
}

/**
 * @param {import('./themeCatalog.json')[number]} entry
 * @returns {vscode.Uri}
 */
function createSwatchIcon(entry) {
  const bg = entry.background || (entry.mode === 'dark' ? '#1e1e1e' : '#ffffff');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <rect width="22" height="22" rx="5" fill="${bg}" stroke="rgba(128,128,128,0.35)" stroke-width="1"/>
    <circle cx="7.5" cy="11" r="4" fill="${entry.primary}"/>
    <circle cx="15" cy="7.5" r="2.8" fill="${entry.secondary}"/>
    <circle cx="15" cy="14.5" r="2.8" fill="${entry.accent}"/>
  </svg>`;
  return vscode.Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
}

function updateThemeStatusBar() {
  if (!themeStatusBar) return;
  const active = getActiveCatalogEntry();
  if (active) {
    themeStatusBar.text = `$(symbol-color) ${active.name}`;
    themeStatusBar.tooltip = `Frontier Themes: ${active.label}\nClick to switch — ↑↓ to preview`;
  } else {
    themeStatusBar.text = '$(symbol-color) Frontier Themes';
    themeStatusBar.tooltip = 'Click to pick a theme — use ↑↓ to preview';
  }
}

/**
 * @param {string} themeLabel
 * @returns {Promise<void>}
 */
async function applyTheme(themeLabel) {
  await vscode.workspace.getConfiguration().update('workbench.colorTheme', themeLabel, true);
  updateThemeStatusBar();
}

/**
 * @param {import('./themeCatalog.json')} entries
 * @returns {Array<vscode.QuickPickItem & { entry?: import('./themeCatalog.json')[number] }>}
 */
function buildThemeQuickPickItems(entries) {
  /** @type {Array<vscode.QuickPickItem & { entry?: import('./themeCatalog.json')[number] }>} */
  const items = [];
  const bigtech = entries.filter((c) => c.category === 'bigtech');
  const startups = entries.filter((c) => c.category === 'startups');

  items.push({ label: 'Big Tech', kind: vscode.QuickPickItemKind.Separator });
  for (const entry of bigtech) {
    items.push({
      label: entry.label,
      description: entry.mode === 'dark' ? 'Dark' : 'Light',
      detail: entry.name,
      iconPath: createSwatchIcon(entry),
      entry,
    });
  }

  items.push({ label: 'AI & Startups', kind: vscode.QuickPickItemKind.Separator });
  for (const entry of startups) {
    items.push({
      label: entry.label,
      description: entry.mode === 'dark' ? 'Dark' : 'Light',
      detail: entry.name,
      iconPath: createSwatchIcon(entry),
      entry,
    });
  }

  return items;
}

/**
 * @param {import('./themeCatalog.json')} entries
 * @param {string} placeHolder
 * @returns {Promise<import('./themeCatalog.json')[number] | undefined>}
 */
function showThemePickerWithPreview(entries, placeHolder) {
  return new Promise((resolve) => {
    const originalTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
    const selectableItems = buildThemeQuickPickItems(entries);
    const active = getActiveCatalogEntry();

    const quickPick = vscode.window.createQuickPick();
    quickPick.title = 'Frontier Themes';
    quickPick.placeholder = `${placeHolder} — ↑↓ to preview, Enter to apply, Esc to cancel`;
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;
    quickPick.items = selectableItems;

    if (active) {
      const activeItem = selectableItems.find((item) => item.entry?.label === active.label);
      if (activeItem) {
        quickPick.activeItems = [activeItem];
      }
    }

    let accepted = false;
    let previewing = false;
    let lastPreviewLabel = originalTheme;

    const previewTheme = async (/** @type {typeof selectableItems[number] | undefined} */ item) => {
      if (!item?.entry) return;
      if (item.entry.label === lastPreviewLabel) return;
      lastPreviewLabel = item.entry.label;
      previewing = true;
      await applyTheme(item.entry.label);
    };

    quickPick.onDidChangeActive((activeItems) => {
      const item = activeItems[0];
      if (item?.kind === vscode.QuickPickItemKind.Separator) return;
      previewTheme(item).catch(() => undefined);
    });

    quickPick.onDidAccept(() => {
      accepted = true;
      const item = quickPick.selectedItems[0] || quickPick.activeItems[0];
      quickPick.hide();
      resolve(item?.entry);
    });

    quickPick.onDidHide(() => {
      if (!accepted && previewing) {
        vscode.workspace
          .getConfiguration()
          .update('workbench.colorTheme', originalTheme, true)
          .finally(() => updateThemeStatusBar());
      }
      quickPick.dispose();
      if (!accepted) resolve(undefined);
    });

    quickPick.show();
  });
}

async function pickTheme() {
  const picked = await showThemePickerWithPreview(catalog, 'Choose a brand theme');
  if (picked) updateThemeStatusBar();
}

async function pickThemeByCategory() {
  const categories = [
    { label: '$(organization) Big Tech', id: 'bigtech' },
    { label: '$(rocket) AI & Startups', id: 'startups' },
  ];

  const category = await vscode.window.showQuickPick(categories, {
    placeHolder: 'Filter by category',
  });
  if (!category) return;

  const filtered = catalog.filter((c) => c.category === category.id);
  const picked = await showThemePickerWithPreview(
    filtered,
    `Pick a ${category.id === 'bigtech' ? 'Big Tech' : 'Startup'} theme`
  );
  if (picked) updateThemeStatusBar();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  extensionPath = context.extension.extensionPath;
  catalog = loadCatalog();

  const showPicker = vscode.workspace
    .getConfiguration('frontierThemes')
    .get('showStatusBarPicker', true);

  if (showPicker) {
    themeStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
    themeStatusBar.command = 'frontierThemes.pickTheme';
    themeStatusBar.show();
    updateThemeStatusBar();
  }

  context.subscriptions.push(
    themeStatusBar,
    vscode.commands.registerCommand('frontierThemes.pickTheme', pickTheme),
    vscode.commands.registerCommand('frontierThemes.pickThemeByCategory', pickThemeByCategory),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('workbench.colorTheme')) {
        updateThemeStatusBar();
      }
    })
  );
}

function deactivate() {
  themeStatusBar?.dispose();
}

module.exports = { activate, deactivate };
