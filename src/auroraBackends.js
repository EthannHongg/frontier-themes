const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const AURORA_MARKER = 'frontier-themes-aurora';

/** @typedef {'custom-css-loader' | 'custom-ui-style'} AuroraBackendId */

/** @type {Record<AuroraBackendId, { extensionIds: string[], setting: string, label: string, marketplaceId: string, inCursorMarketplace: boolean, inVsCodeMarketplace: boolean }>} */
const HELPERS = {
  'custom-ui-style': {
    extensionIds: ['subframe7536.custom-ui-style'],
    setting: 'custom-ui-style.external.imports',
    label: 'Custom UI Style',
    marketplaceId: 'subframe7536.custom-ui-style',
    inCursorMarketplace: true,
    inVsCodeMarketplace: true,
  },
  'custom-css-loader': {
    extensionIds: ['be5invis.vscode-custom-css', 's-h-a-d-o-w.vscode-custom-css'],
    setting: 'vscode_custom_css.imports',
    label: 'Custom CSS and JS Loader',
    marketplaceId: 'be5invis.vscode-custom-css',
    inCursorMarketplace: false,
    inVsCodeMarketplace: true,
  },
};

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
 * @returns {boolean}
 */
function isCursor() {
  return /cursor/i.test(vscode.env.appName);
}

/**
 * @param {string} extensionId
 * @returns {boolean}
 */
function hasExtension(extensionId) {
  return Boolean(vscode.extensions.getExtension(extensionId));
}

/**
 * @returns {AuroraBackendId | undefined}
 */
function detectAuroraBackend() {
  for (const backendId of /** @type {AuroraBackendId[]} */ (Object.keys(HELPERS))) {
    const helper = HELPERS[backendId];
    if (helper.extensionIds.some((id) => hasExtension(id))) {
      return backendId;
    }
  }
  return undefined;
}

/**
 * @returns {AuroraBackendId}
 */
function getRecommendedHelper() {
  return isCursor() ? 'custom-ui-style' : 'custom-css-loader';
}

/**
 * @param {AuroraBackendId} backendId
 * @returns {boolean}
 */
function isHelperAvailableInEditor(backendId) {
  const helper = HELPERS[backendId];
  return isCursor() ? helper.inCursorMarketplace : helper.inVsCodeMarketplace;
}

/**
 * @param {string[]} imports
 * @returns {string[]}
 */
function stripCustomCssAuroraImports(imports) {
  return imports.filter((item) => !String(item).includes(AURORA_MARKER));
}

/**
 * @param {unknown[]} imports
 * @returns {unknown[]}
 */
function stripCustomUiAuroraImports(imports) {
  return imports.filter((item) => {
    const value = typeof item === 'string' ? item : item?.url;
    return !String(value || '').includes(AURORA_MARKER);
  });
}

/**
 * @param {string} scriptPath
 * @param {string} key
 * @returns {string}
 */
function auroraImportUri(scriptPath, key) {
  return `${toFileUri(scriptPath)}?${AURORA_MARKER}=${key}`;
}

/**
 * @param {AuroraBackendId} backendId
 * @param {string} scriptPath
 * @param {string} key
 * @returns {Promise<void>}
 */
async function applyAuroraImport(backendId, scriptPath, key) {
  const config = vscode.workspace.getConfiguration();
  const uri = auroraImportUri(scriptPath, key);

  if (backendId === 'custom-css-loader') {
    const current = config.get('vscode_custom_css.imports', []);
    const next = [...stripCustomCssAuroraImports(current), uri];
    await config.update('vscode_custom_css.imports', next, vscode.ConfigurationTarget.Global);
    return;
  }

  const current = config.get('custom-ui-style.external.imports', []);
  const entry = { type: 'js', url: uri };
  const next = [...stripCustomUiAuroraImports(current), entry];
  await config.update(
    'custom-ui-style.external.imports',
    next,
    vscode.ConfigurationTarget.Global
  );
}

/**
 * @param {AuroraBackendId | undefined} backendId
 * @returns {Promise<void>}
 */
async function removeAuroraImport(backendId) {
  const config = vscode.workspace.getConfiguration();

  if (!backendId || backendId === 'custom-css-loader') {
    const current = config.get('vscode_custom_css.imports', []);
    const cleaned = stripCustomCssAuroraImports(current);
    if (cleaned.length !== current.length) {
      await config.update('vscode_custom_css.imports', cleaned, vscode.ConfigurationTarget.Global);
    }
  }

  if (!backendId || backendId === 'custom-ui-style') {
    const current = config.get('custom-ui-style.external.imports', []);
    const cleaned = stripCustomUiAuroraImports(current);
    if (cleaned.length !== current.length) {
      await config.update(
        'custom-ui-style.external.imports',
        cleaned,
        vscode.ConfigurationTarget.Global
      );
    }
  }
}

/**
 * @param {AuroraBackendId} backendId
 * @returns {Promise<void>}
 */
async function reloadAuroraBackend(backendId) {
  const commands =
    backendId === 'custom-css-loader'
      ? ['extension.updateCustomCSS', 'vscode_custom_css.reload']
      : ['custom-ui-style.reload'];

  for (const command of commands) {
    try {
      await vscode.commands.executeCommand(command);
      return;
    } catch {
      /* try next */
    }
  }
}

/**
 * @param {AuroraBackendId} backendId
 * @returns {Promise<boolean>}
 */
async function enableAuroraBackend(backendId) {
  const commands =
    backendId === 'custom-css-loader'
      ? ['extension.installCustomCSS', 'vscode_custom_css.install']
      : ['custom-ui-style.reload'];

  for (const command of commands) {
    try {
      await vscode.commands.executeCommand(command);
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

/**
 * @param {AuroraBackendId} backendId
 * @returns {Promise<void>}
 */
async function openHelperInMarketplace(backendId) {
  const helper = HELPERS[backendId];
  try {
    await vscode.commands.executeCommand(
      'workbench.extensions.installExtension',
      helper.marketplaceId
    );
  } catch {
    await vscode.commands.executeCommand('workbench.extensions.search', `@id:${helper.marketplaceId}`);
  }
}

function getAuroraSetupGuide() {
  const editor = isCursor() ? 'Cursor' : 'VS Code';
  const recommended = HELPERS[getRecommendedHelper()];

  return [
    '# Aurora setup',
    '',
    '## Why is a helper extension required?',
    '',
    `${editor} does not expose any official API for animated editor backgrounds.`,
    'Frontier Themes only ships color theme JSON — aurora is a separate WebGL script that must',
    'be injected into the editor UI by a third-party extension that patches workbench files.',
    '',
    '**Frontier Themes never downloads or installs extensions for you.**',
    'Install a helper yourself from the Extensions panel, then toggle Aurora again.',
    '',
    '## Recommended helper',
    '',
    `**${recommended.label}** (\`${recommended.marketplaceId}\`)`,
    '',
    isCursor()
      ? '- Listed in the **Cursor** Extensions marketplace.'
      : '- Listed in the **VS Code** Extensions marketplace.',
    '',
    '## Steps',
    '',
    `1. Extensions → search \`${recommended.marketplaceId}\` → Install`,
    '2. Toggle **Aurora On** in the status bar (Frontier Themes wires the script path into settings)',
    recommended.label === 'Custom UI Style'
      ? '3. Command Palette → **Custom UI Style: Reload**'
      : '3. Command Palette → **Enable Custom CSS and JS** (administrator on Windows)',
    '4. Reload the window when prompted',
    '',
    '## Cursor note',
    '',
    'Custom CSS and JS Loader is **not** in Cursor\'s marketplace. Use Custom UI Style instead.',
    '',
    '## Limitations',
    '',
    '- Patches can break after editor updates — re-run the helper reload/enable command.',
    '- You may see a "corrupt installation" warning; that is expected with UI injectors.',
    '- Aurora is optional — all 48 color themes work without it.',
  ].join('\n');
}

/**
 * Shows setup guidance. Does not download or sideload anything.
 * @returns {Promise<boolean>} true if a helper extension is now installed
 */
async function promptAuroraSetup() {
  const recommendedId = getRecommendedHelper();
  const recommended = HELPERS[recommendedId];
  const editorName = isCursor() ? 'Cursor' : 'VS Code';

  if (!isHelperAvailableInEditor(recommendedId)) {
    const alt = HELPERS['custom-ui-style'];
    const choice = await vscode.window.showWarningMessage(
      `Aurora cannot run natively in ${editorName}. Install ${alt.label} from Extensions (available in Cursor), then toggle Aurora again.`,
      'Open Extensions',
      'Setup Guide',
      'Cancel'
    );
    if (choice === 'Open Extensions') await openHelperInMarketplace('custom-ui-style');
    if (choice === 'Setup Guide') {
      await vscode.commands.executeCommand(
        'markdown.showPreview',
        vscode.Uri.parse(`data:text/markdown;charset=utf-8,${encodeURIComponent(getAuroraSetupGuide())}`)
      );
    }
    return false;
  }

  const choice = await vscode.window.showInformationMessage(
    `Aurora needs ${recommended.label} (${recommended.marketplaceId}). ` +
      `${editorName} has no built-in API for live backgrounds — install the helper from Extensions, then toggle Aurora again.`,
    'Open Extensions',
    'Setup Guide',
    'Cancel'
  );

  if (choice === 'Open Extensions') {
    await openHelperInMarketplace(recommendedId);
  }

  if (choice === 'Setup Guide') {
    await vscode.commands.executeCommand(
      'markdown.showPreview',
      vscode.Uri.parse(`data:text/markdown;charset=utf-8,${encodeURIComponent(getAuroraSetupGuide())}`)
    );
  }

  return Boolean(detectAuroraBackend());
}

module.exports = {
  AURORA_MARKER,
  detectAuroraBackend,
  getRecommendedHelper,
  applyAuroraImport,
  removeAuroraImport,
  reloadAuroraBackend,
  enableAuroraBackend,
  promptAuroraSetup,
  openHelperInMarketplace,
  getAuroraSetupGuide,
  isCursor,
  hasExtension,
};
