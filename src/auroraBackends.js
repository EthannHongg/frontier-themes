const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const https = require('https');

const AURORA_MARKER = 'frontier-themes-aurora';
const CUSTOM_CSS_VSIX_URL =
  'https://marketplace.visualstudio.com/_apis/public/gallery/publishers/be5invis/vsextensions/vscode-custom-css/latest/vspackage';

/** @typedef {'custom-css-loader' | 'custom-ui-style'} AuroraBackendId */

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
  if (
    hasExtension('be5invis.vscode-custom-css') ||
    hasExtension('s-h-a-d-o-w.vscode-custom-css')
  ) {
    return 'custom-css-loader';
  }
  if (hasExtension('subframe7536.custom-ui-style')) {
    return 'custom-ui-style';
  }
  return undefined;
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
 * @param {string} url
 * @param {string} destination
 * @returns {Promise<void>}
 */
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    const request = (targetUrl) => {
      https
        .get(targetUrl, (response) => {
          if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            request(response.headers.location);
            return;
          }
          if (response.statusCode !== 200) {
            reject(new Error(`Download failed (${response.statusCode})`));
            return;
          }
          response.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
        })
        .on('error', reject);
    };
    request(url);
  });
}

/**
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<boolean>}
 */
async function installCustomCssLoaderVsix(context) {
  const storageDir = context.globalStorageUri.fsPath;
  fs.mkdirSync(storageDir, { recursive: true });
  const vsixPath = path.join(storageDir, 'vscode-custom-css.vsix');

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Downloading Custom CSS and JS Loader…',
      cancellable: false,
    },
    async () => {
      await downloadFile(CUSTOM_CSS_VSIX_URL, vsixPath);
      await vscode.commands.executeCommand(
        'workbench.extensions.installExtension',
        vscode.Uri.file(vsixPath)
      );
    }
  );

  return (
    hasExtension('be5invis.vscode-custom-css') || hasExtension('s-h-a-d-o-w.vscode-custom-css')
  );
}

/**
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<boolean>}
 */
async function installAuroraHelperExtension(context) {
  if (isCursor()) {
    return installCustomCssLoaderVsix(context);
  }

  try {
    await vscode.commands.executeCommand(
      'workbench.extensions.installExtension',
      'be5invis.vscode-custom-css'
    );
    return hasExtension('be5invis.vscode-custom-css');
  } catch {
    return installCustomCssLoaderVsix(context);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<boolean>}
 */
async function promptInstallAuroraHelper(context) {
  const editorName = isCursor() ? 'Cursor' : 'VS Code';
  const choice = await vscode.window.showInformationMessage(
    `Aurora needs a helper extension to inject the live background into ${editorName}. ` +
      'Custom CSS and JS Loader is not in the Cursor marketplace — we can install it from a VSIX automatically.',
    'Install Helper',
    'Manual Steps',
    'Cancel'
  );

  if (choice === 'Manual Steps') {
    const doc = [
      '# Aurora setup in Cursor',
      '',
      '1. Install **Custom CSS and JS Loader** from a VSIX:',
      '   - Command Palette → **Extensions: Install from VSIX**',
      '   - Or run: `cursor --install-extension <path-to.vsix>`',
      '   - VSIX: https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css',
      '',
      '2. Command Palette → **Enable Custom CSS and JS** (admin on Windows)',
      '',
      '3. Toggle **Aurora On** in the status bar again',
      '',
      '**Alternative:** Install **Custom UI Style** (`subframe7536.custom-ui-style`) from the marketplace, then enable Aurora.',
    ].join('\n');
    const docUri = vscode.Uri.parse(
      `data:text/markdown;charset=utf-8,${encodeURIComponent(doc)}`
    );
    await vscode.commands.executeCommand('markdown.showPreview', docUri);
    return false;
  }

  if (choice === 'Install Helper') {
    try {
      return await installAuroraHelperExtension(context);
    } catch (err) {
      vscode.window.showErrorMessage(`Install failed: ${err.message}`);
      return false;
    }
  }

  return false;
}

module.exports = {
  AURORA_MARKER,
  detectAuroraBackend,
  applyAuroraImport,
  removeAuroraImport,
  reloadAuroraBackend,
  enableAuroraBackend,
  promptInstallAuroraHelper,
  isCursor,
  hasExtension,
};
