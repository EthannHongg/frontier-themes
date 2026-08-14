const vscode = require('vscode');

const AURORA_MARKERS = ['frontier-themes-aurora', '/aurora/'];

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isLegacyAuroraImport(value) {
  const text = String(value || '');
  return AURORA_MARKERS.some((marker) => text.includes(marker));
}

/**
 * Remove leftover aurora settings and helper-extension imports from older releases.
 * @returns {Promise<void>}
 */
async function cleanupLegacyAurora() {
  const config = vscode.workspace.getConfiguration();
  const frontierThemes = vscode.workspace.getConfiguration('frontierThemes');
  const target = vscode.ConfigurationTarget.Global;

  if (frontierThemes.get('aurora.enabled') !== undefined) {
    await frontierThemes.update('aurora.enabled', undefined, target);
  }
  if (frontierThemes.get('experimental.aurora') !== undefined) {
    await frontierThemes.update('experimental.aurora', undefined, target);
  }

  const cssImports = config.get('vscode_custom_css.imports', []);
  const cleanedCss = cssImports.filter((item) => !isLegacyAuroraImport(item));
  if (cleanedCss.length !== cssImports.length) {
    await config.update('vscode_custom_css.imports', cleanedCss, target);
  }

  const uiImports = config.get('custom-ui-style.external.imports', []);
  const cleanedUi = uiImports.filter((item) => {
    const value = typeof item === 'string' ? item : item?.url;
    return !isLegacyAuroraImport(value);
  });
  if (cleanedUi.length !== uiImports.length) {
    await config.update('custom-ui-style.external.imports', cleanedUi, target);
  }
}

module.exports = { cleanupLegacyAurora };
