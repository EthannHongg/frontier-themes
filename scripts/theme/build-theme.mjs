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
import { getSemanticTokenColors } from './semantic-colors.mjs';
import { getGitLensColors } from './extensions/gitlens.mjs';
import { getJupyterColors } from './extensions/jupyter.mjs';

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
  };

  const tokenColors = [
    ...getBaseTokenColors(palette),
    ...getPythonTokenColors(palette),
    ...getJavaScriptTokenColors(palette),
    ...getMarkdownTokenColors(palette),
    ...getCssTokenColors(palette),
    ...getHtmlTokenColors(palette),
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
