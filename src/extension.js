const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const CUSTOM_CSS_SETTING = 'vscode_custom_css.imports';
const AURORA_MARKER = 'brand-themes-aurora';
const CUSTOM_CSS_EXTENSIONS = [
  'be5invis.vscode-custom-css',
  's-h-a-d-o-w.vscode-custom-css',
];

/** @type {vscode.StatusBarItem | undefined} */
let themeStatusBar;
/** @type {vscode.StatusBarItem | undefined} */
let auroraStatusBar;
/** @type {string | undefined} */
let extensionPath;

/** @type {import('./themeCatalog.json')} */
let catalog = [];

/**
 * @param {string} filePath
 * @returns {string}
 */
function toFileUri(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (/^[a-zA-Z]:/.test(normalized)) {
    return `file:///${normalized}`;
  }
  return `file://${normalized}`;
}

/**
 * @returns {string | undefined}
 */
function getExtensionRoot() {
  return extensionPath;
}

function loadCatalog() {
  const root = getExtensionRoot();
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

function updateThemeStatusBar() {
  if (!themeStatusBar) return;
  const active = getActiveCatalogEntry();
  if (active) {
    themeStatusBar.text = `$(symbol-color) ${active.name}`;
    themeStatusBar.tooltip = `Brand Themes: ${active.label}\nClick to switch theme`;
  } else {
    themeStatusBar.text = '$(symbol-color) Brand Themes';
    themeStatusBar.tooltip = 'Click to pick a brand theme';
  }
}

function isAuroraEnabled() {
  return vscode.workspace.getConfiguration('brandThemes').get('aurora.enabled', false);
}

function updateAuroraStatusBar() {
  if (!auroraStatusBar) return;
  const on = isAuroraEnabled();
  auroraStatusBar.text = on ? '$(sparkle) Aurora On' : '$(sparkle) Aurora Off';
  auroraStatusBar.tooltip = on
    ? 'Aurora background is enabled — click to turn off'
    : 'Click to enable brand-matched aurora background';
  auroraStatusBar.backgroundColor = on
    ? new vscode.ThemeColor('statusBarItem.prominentBackground')
    : undefined;
}

/**
 * @returns {boolean}
 */
function hasCustomCssLoader() {
  return CUSTOM_CSS_EXTENSIONS.some((id) => vscode.extensions.getExtension(id));
}

/**
 * @param {import('./themeCatalog.json')[number]} entry
 * @returns {string | undefined}
 */
function getAuroraScriptPath(entry) {
  const root = getExtensionRoot();
  if (!root) return undefined;
  return path.join(root, 'aurora', `${entry.id}-${entry.mode}.js`);
}

/**
 * @param {string[]} imports
 * @returns {string[]}
 */
function stripAuroraImports(imports) {
  return imports.filter((item) => !item.includes(AURORA_MARKER));
}

/**
 * @param {import('./themeCatalog.json')[number]} entry
 * @returns {Promise<void>}
 */
async function applyAuroraImport(entry) {
  const scriptPath = getAuroraScriptPath(entry);
  if (!scriptPath || !fs.existsSync(scriptPath)) {
    throw new Error(`Aurora script not found for ${entry.label}`);
  }

  const config = vscode.workspace.getConfiguration();
  const currentImports = config.get(CUSTOM_CSS_SETTING, []);
  const auroraUri = `${toFileUri(scriptPath)}?${AURORA_MARKER}=${entry.id}-${entry.mode}`;
  const cleaned = stripAuroraImports(currentImports);
  const nextImports = [...cleaned, auroraUri];

  await config.update(CUSTOM_CSS_SETTING, nextImports, vscode.ConfigurationTarget.Global);
}

async function removeAuroraImport() {
  const config = vscode.workspace.getConfiguration();
  const currentImports = config.get(CUSTOM_CSS_SETTING, []);
  const cleaned = stripAuroraImports(currentImports);
  if (cleaned.length !== currentImports.length) {
    await config.update(CUSTOM_CSS_SETTING, cleaned, vscode.ConfigurationTarget.Global);
  }
}

async function promptEnableCustomCss() {
  const choice = await vscode.window.showInformationMessage(
    'Aurora requires the "Custom CSS and JS Loader" extension. Enable Custom CSS now?',
    'Enable Custom CSS',
    'Install Extension',
    'Cancel'
  );

  if (choice === 'Install Extension') {
    await vscode.commands.executeCommand(
      'workbench.extensions.search',
      'Custom CSS and JS Loader'
    );
    return false;
  }

  if (choice === 'Enable Custom CSS') {
    try {
      await vscode.commands.executeCommand('extension.installCustomCSS');
      return true;
    } catch {
      try {
        await vscode.commands.executeCommand('vscode_custom_css.install');
        return true;
      } catch {
        vscode.window.showWarningMessage(
          'Could not auto-enable Custom CSS. Run "Enable Custom CSS and JS" from the Command Palette, then reload.'
        );
        return false;
      }
    }
  }

  return false;
}

/**
 * @param {boolean} enabled
 */
async function setAuroraEnabled(enabled) {
  const entry = getActiveCatalogEntry();
  if (enabled && !entry) {
    vscode.window.showWarningMessage('Select a Brand Theme first, then enable Aurora.');
    return;
  }

  if (enabled && !hasCustomCssLoader()) {
    const installed = await promptEnableCustomCss();
    if (!installed && !hasCustomCssLoader()) {
      return;
    }
  }

  await vscode.workspace
    .getConfiguration('brandThemes')
    .update('aurora.enabled', enabled, vscode.ConfigurationTarget.Global);

  if (enabled && entry) {
    try {
      await applyAuroraImport(entry);
      if (hasCustomCssLoader()) {
        const reload = await vscode.window.showInformationMessage(
          `Aurora enabled for ${entry.label}. Reload Custom CSS to apply?`,
          'Reload Custom CSS',
          'Later'
        );
        if (reload === 'Reload Custom CSS') {
          try {
            await vscode.commands.executeCommand('extension.updateCustomCSS');
          } catch {
            await vscode.commands.executeCommand('vscode_custom_css.reload');
          }
        }
      } else {
        vscode.window.showInformationMessage(
          'Aurora script path saved. Install Custom CSS and JS Loader, enable it, then reload.'
        );
      }
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to enable Aurora: ${err.message}`);
      await vscode.workspace
        .getConfiguration('brandThemes')
        .update('aurora.enabled', false, vscode.ConfigurationTarget.Global);
    }
  } else {
    await removeAuroraImport();
    if (hasCustomCssLoader()) {
      try {
        await vscode.commands.executeCommand('extension.updateCustomCSS');
      } catch {
        /* optional reload */
      }
    }
  }

  updateAuroraStatusBar();
}

async function toggleAurora() {
  await setAuroraEnabled(!isAuroraEnabled());
}

async function pickTheme() {
  const bigtech = catalog.filter((c) => c.category === 'bigtech');
  const startups = catalog.filter((c) => c.category === 'startups');

  /** @type {vscode.QuickPickItem[]} */
  const items = [
    { label: 'Big Tech', kind: vscode.QuickPickItemKind.Separator },
    ...bigtech.map((entry) => ({
      label: entry.label,
      description: entry.mode === 'dark' ? 'Dark' : 'Light',
      detail: entry.name,
    })),
    { label: 'AI & Startups', kind: vscode.QuickPickItemKind.Separator },
    ...startups.map((entry) => ({
      label: entry.label,
      description: entry.mode === 'dark' ? 'Dark' : 'Light',
      detail: entry.name,
    })),
  ];

  const active = getActiveCatalogEntry();
  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: 'Choose a brand theme',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (!picked || picked.kind === vscode.QuickPickItemKind.Separator) {
    return;
  }

  await vscode.workspace.getConfiguration().update('workbench.colorTheme', picked.label, true);

  if (isAuroraEnabled()) {
    const entry = findCatalogEntry(picked.label);
    if (entry) {
      await applyAuroraImport(entry);
      if (hasCustomCssLoader()) {
        try {
          await vscode.commands.executeCommand('extension.updateCustomCSS');
        } catch {
          /* ignore */
        }
      }
    }
  }

  updateThemeStatusBar();
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
  const picked = await vscode.window.showQuickPick(
    filtered.map((entry) => ({
      label: entry.label,
      description: entry.mode === 'dark' ? 'Dark' : 'Light',
      detail: entry.name,
    })),
    { placeHolder: `Pick a ${category.id === 'bigtech' ? 'Big Tech' : 'Startup'} theme` }
  );

  if (!picked) return;
  await vscode.workspace.getConfiguration().update('workbench.colorTheme', picked.label, true);

  if (isAuroraEnabled()) {
    const entry = findCatalogEntry(picked.label);
    if (entry) await applyAuroraImport(entry);
  }

  updateThemeStatusBar();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  extensionPath = context.extension.extensionPath;
  catalog = loadCatalog();

  themeStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
  themeStatusBar.command = 'brandThemes.pickTheme';
  themeStatusBar.show();
  updateThemeStatusBar();

  auroraStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 199);
  auroraStatusBar.command = 'brandThemes.toggleAurora';
  auroraStatusBar.show();
  updateAuroraStatusBar();

  context.subscriptions.push(
    themeStatusBar,
    auroraStatusBar,
    vscode.commands.registerCommand('brandThemes.pickTheme', pickTheme),
    vscode.commands.registerCommand('brandThemes.pickThemeByCategory', pickThemeByCategory),
    vscode.commands.registerCommand('brandThemes.toggleAurora', toggleAurora),
    vscode.commands.registerCommand('brandThemes.enableAurora', () => setAuroraEnabled(true)),
    vscode.commands.registerCommand('brandThemes.disableAurora', () => setAuroraEnabled(false)),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('workbench.colorTheme')) {
        updateThemeStatusBar();
        if (isAuroraEnabled()) {
          const entry = getActiveCatalogEntry();
          if (entry) {
            applyAuroraImport(entry).catch(() => undefined);
          }
        }
      }
      if (event.affectsConfiguration('brandThemes.aurora.enabled')) {
        updateAuroraStatusBar();
      }
    })
  );
}

function deactivate() {
  themeStatusBar?.dispose();
  auroraStatusBar?.dispose();
}

module.exports = { activate, deactivate };
