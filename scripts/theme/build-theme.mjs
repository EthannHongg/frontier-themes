import { derivePalette } from './derive-palette.mjs';
import { getShellColors } from './workbench/shell.mjs';
import { getEditorColors } from './workbench/editor.mjs';
import { getMergeColors } from './workbench/merge.mjs';
import { getTerminalColors } from './terminal.mjs';
import { getBaseTokenColors } from './tokens/base.mjs';
import { getPythonTokenColors } from './tokens/python.mjs';
import { getJavaScriptTokenColors } from './tokens/javascript.mjs';
import { getMarkdownTokenColors } from './tokens/markdown.mjs';
import { getCssTokenColors } from './tokens/css.mjs';
import { getHtmlTokenColors } from './tokens/html.mjs';
import { getShellTokenColors } from './tokens/shell.mjs';
import { getJsonTokenColors } from './tokens/json.mjs';
import { getGoTokenColors } from './tokens/go.mjs';
import { getJavaTokenColors } from './tokens/java.mjs';
import { getCTokenColors } from './tokens/c.mjs';
import { getPowerShellTokenColors } from './tokens/powershell.mjs';
import { getMakefileTokenColors } from './tokens/makefile.mjs';
import { getRustTokenColors } from './tokens/rust.mjs';
import { getYamlTokenColors } from './tokens/yaml.mjs';
import { getSemanticTokenColors } from './semantic-colors.mjs';
import { getGitLensColors } from './extensions/gitlens.mjs';
import { getJupyterColors } from './extensions/jupyter.mjs';
import { getErrorLensColors } from './extensions/errorlens.mjs';

/**
 * Compose a complete VS Code color theme from brand definition + mode.
 */
export function buildTheme(brand, mode) {
  const palette = derivePalette(brand, mode);

  const colors = {
    ...getShellColors(palette),
    ...getEditorColors(palette),
    ...getMergeColors(palette),
    ...getTerminalColors(palette),
    ...getGitLensColors(palette),
    ...getJupyterColors(palette),
    ...getErrorLensColors(palette),
  };

  const tokenColors = [
    ...getBaseTokenColors(palette),
    ...getPythonTokenColors(palette),
    ...getJavaScriptTokenColors(palette),
    ...getMarkdownTokenColors(palette),
    ...getCssTokenColors(palette),
    ...getHtmlTokenColors(palette),
    ...getShellTokenColors(palette),
    ...getJsonTokenColors(palette),
    ...getGoTokenColors(palette),
    ...getJavaTokenColors(palette),
    ...getCTokenColors(palette),
    ...getPowerShellTokenColors(palette),
    ...getMakefileTokenColors(palette),
    ...getRustTokenColors(palette),
    ...getYamlTokenColors(palette),
  ];

  return {
    $schema: 'vscode://schemas/color-theme',
    name: palette.label,
    type: palette.isDark ? 'dark' : 'light',
    colors,
    tokenColors,
    semanticHighlighting: true,
    semanticTokenColors: getSemanticTokenColors(palette),
  };
}
