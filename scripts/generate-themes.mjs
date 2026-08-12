#!/usr/bin/env node
/**
 * Generates VS Code color theme JSON files from brand palette definitions.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const brands = JSON.parse(fs.readFileSync(path.join(__dirname, 'brands.json'), 'utf8'));

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function withAlpha(hex, alpha) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex.replace('#', '')}${a}`;
}

function mix(hex1, hex2, proportionOfHex2 = 0.5) {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  const w = proportionOfHex2;
  const r = Math.round(a[0] * (1 - w) + b[0] * w);
  const g = Math.round(a[1] * (1 - w) + b[1] * w);
  const bl = Math.round(a[2] * (1 - w) + b[2] * w);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

function muted(fg, bg, amount = 0.55) {
  return mix(fg, bg, amount);
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function onPrimary(hex) {
  return luminance(hex) > 0.55 ? '#1A1A1A' : '#FFFFFF';
}

function buildTheme(brand, mode) {
  const isDark = mode === 'dark';
  const palette = brand[mode];
  const primary = brand.primary;
  const secondary = brand.secondary;
  const accent = brand.accent;
  const bg = palette.bg;
  const surface = palette.surface;
  const editor = palette.editor;
  const fg = palette.fg;
  const border = isDark ? mix(surface, '#000000', 0.85) : mix(surface, '#000000', 0.08);
  const mutedFg = muted(fg, bg, isDark ? 0.55 : 0.45);
  const tabInactive = isDark ? bg : mix(surface, '#FFFFFF', 0.5);
  const selection = withAlpha(primary, isDark ? 0.28 : 0.22);
  const selectionHi = withAlpha(primary, isDark ? 0.14 : 0.1);
  const error = isDark ? '#EF4444' : '#DC2626';
  const success = isDark ? mix(primary, '#22C55E', 0.5) : mix(primary, '#059669', 0.4);
  const warning = isDark ? '#F59E0B' : '#D97706';
  const fnColor = isDark ? mix(accent, '#60A5FA', 0.45) : mix(accent, '#2563EB', 0.35);
  const typeColor = isDark ? mix(secondary, '#22D3EE', 0.4) : mix(secondary, '#0891B2', 0.35);
  const stringColor = isDark ? mix(primary, '#34D399', 0.45) : mix(primary, '#0D8A6A', 0.35);
  const label = `${brand.name} ${isDark ? 'Dark' : 'Light'}`;

  const colors = {
    'focusBorder': withAlpha(primary, 0.4),
    'foreground': fg,
    'descriptionForeground': mutedFg,
    'errorForeground': error,
    'icon.foreground': muted(fg, bg, 0.7),

    'textLink.foreground': primary,
    'textLink.activeForeground': mix(primary, fg, 0.3),
    'textCodeBlock.background': isDark ? bg : mix(surface, '#FFFFFF', 0.6),
    'textBlockQuote.background': surface,
    'textBlockQuote.border': primary,

    'button.background': primary,
    'button.foreground': onPrimary(primary),
    'button.hoverBackground': mix(primary, fg, 0.15),
    'button.secondaryBackground': isDark ? mix(surface, '#FFFFFF', 0.08) : mix(surface, '#000000', 0.06),
    'button.secondaryForeground': fg,
    'button.secondaryHoverBackground': isDark ? mix(surface, '#FFFFFF', 0.12) : mix(surface, '#000000', 0.1),

    'checkbox.background': isDark ? mix(editor, '#FFFFFF', 0.04) : '#FFFFFF',
    'checkbox.border': border,
    'checkbox.foreground': primary,

    'dropdown.background': isDark ? mix(editor, '#FFFFFF', 0.04) : '#FFFFFF',
    'dropdown.border': border,
    'dropdown.foreground': fg,
    'dropdown.listBackground': isDark ? surface : '#FFFFFF',

    'input.background': isDark ? bg : '#FFFFFF',
    'input.border': border,
    'input.foreground': fg,
    'input.placeholderForeground': mutedFg,
    'inputOption.activeBackground': withAlpha(primary, 0.2),
    'inputOption.activeBorder': primary,
    'inputOption.activeForeground': fg,
    'inputValidation.errorBackground': withAlpha(error, 0.15),
    'inputValidation.errorBorder': error,
    'inputValidation.infoBackground': withAlpha(primary, 0.12),
    'inputValidation.infoBorder': primary,
    'inputValidation.warningBackground': withAlpha(warning, 0.15),
    'inputValidation.warningBorder': warning,

    'badge.background': primary,
    'badge.foreground': onPrimary(primary),
    'progressBar.background': primary,

    'list.activeSelectionBackground': withAlpha(primary, isDark ? 0.22 : 0.14),
    'list.activeSelectionForeground': isDark ? '#FFFFFF' : fg,
    'list.inactiveSelectionBackground': isDark ? mix(surface, '#FFFFFF', 0.08) : mix(surface, '#000000', 0.04),
    'list.inactiveSelectionForeground': fg,
    'list.hoverBackground': isDark ? mix(editor, '#FFFFFF', 0.06) : mix(surface, '#000000', 0.03),
    'list.focusBackground': withAlpha(primary, 0.14),
    'list.focusOutline': withAlpha(primary, 0.4),
    'list.highlightForeground': primary,
    'list.dropBackground': withAlpha(primary, 0.14),
    'listFilterWidget.background': isDark ? mix(editor, '#FFFFFF', 0.04) : '#FFFFFF',
    'listFilterWidget.outline': primary,
    'listFilterWidget.noMatchesOutline': error,

    'activityBar.background': bg,
    'activityBar.foreground': fg,
    'activityBar.inactiveForeground': mutedFg,
    'activityBar.border': border,
    'activityBarBadge.background': primary,
    'activityBarBadge.foreground': onPrimary(primary),
    'activityBar.activeBorder': primary,

    'sideBar.background': surface,
    'sideBar.foreground': fg,
    'sideBar.border': border,
    'sideBarTitle.foreground': muted(fg, bg, 0.72),
    'sideBarSectionHeader.background': surface,
    'sideBarSectionHeader.foreground': muted(fg, bg, 0.72),
    'sideBarSectionHeader.border': border,

    'editorGroupHeader.tabsBackground': bg,
    'editorGroupHeader.noTabsBackground': bg,
    'editorGroup.border': border,
    'tab.activeBackground': isDark ? mix(editor, '#FFFFFF', 0.04) : '#FFFFFF',
    'tab.activeForeground': isDark ? '#FFFFFF' : fg,
    'tab.inactiveBackground': tabInactive,
    'tab.inactiveForeground': mutedFg,
    'tab.border': bg,
    'tab.activeBorderTop': primary,
    'tab.hoverBackground': isDark ? mix(bg, '#FFFFFF', 0.04) : mix(surface, '#FFFFFF', 0.5),
    'tab.unfocusedActiveBackground': surface,
    'tab.unfocusedActiveBorderTop': withAlpha(primary, 0.4),

    'editor.background': editor,
    'editor.foreground': fg,
    'editorLineNumber.foreground': mutedFg,
    'editorLineNumber.activeForeground': muted(fg, bg, 0.78),
    'editorCursor.foreground': primary,
    'editor.selectionBackground': selection,
    'editor.inactiveSelectionBackground': selectionHi,
    'editor.selectionHighlightBackground': selectionHi,
    'editor.wordHighlightBackground': withAlpha(muted(fg, bg, 0.5), 0.35),
    'editor.wordHighlightStrongBackground': withAlpha(primary, 0.2),
    'editor.findMatchBackground': withAlpha(primary, 0.4),
    'editor.findMatchHighlightBackground': withAlpha(primary, 0.2),
    'editor.hoverHighlightBackground': isDark ? mix(editor, '#FFFFFF', 0.06) : mix(editor, '#000000', 0.04),
    'editor.lineHighlightBackground': isDark ? mix(editor, '#FFFFFF', 0.04) : mix(editor, '#000000', 0.03),
    'editor.lineHighlightBorder': '#00000000',
    'editorIndentGuide.background1': border,
    'editorIndentGuide.activeBackground1': muted(border, fg, 0.5),
    'editorWhitespace.foreground': withAlpha(mutedFg, 0.5),
    'editorBracketMatch.background': withAlpha(primary, 0.2),
    'editorBracketMatch.border': primary,
    'editorOverviewRuler.border': border,
    'editorGutter.background': editor,
    'editorGutter.modifiedBackground': fnColor,
    'editorGutter.addedBackground': success,
    'editorGutter.deletedBackground': error,
    'editorWidget.background': surface,
    'editorWidget.border': border,
    'editorSuggestWidget.background': surface,
    'editorSuggestWidget.border': border,
    'editorSuggestWidget.foreground': fg,
    'editorSuggestWidget.selectedBackground': withAlpha(primary, isDark ? 0.22 : 0.14),
    'editorSuggestWidget.highlightForeground': primary,
    'editorHoverWidget.background': surface,
    'editorHoverWidget.border': border,

    'peekView.border': primary,
    'peekViewEditor.background': surface,
    'peekViewResult.background': bg,
    'peekViewTitle.background': bg,

    'diffEditor.insertedTextBackground': withAlpha(success, 0.14),
    'diffEditor.removedTextBackground': withAlpha(error, 0.14),
    'diffEditor.insertedLineBackground': withAlpha(success, 0.1),
    'diffEditor.removedLineBackground': withAlpha(error, 0.1),

    'panel.background': surface,
    'panel.border': border,
    'panelTitle.activeForeground': isDark ? '#FFFFFF' : fg,
    'panelTitle.inactiveForeground': mutedFg,
    'panelTitle.activeBorder': primary,

    'statusBar.background': bg,
    'statusBar.foreground': muted(fg, bg, 0.72),
    'statusBar.border': border,
    'statusBar.debuggingBackground': warning,
    'statusBar.debuggingForeground': '#FFFFFF',
    'statusBar.noFolderBackground': bg,
    'statusBarItem.hoverBackground': isDark ? mix(surface, '#FFFFFF', 0.08) : mix(surface, '#000000', 0.06),
    'statusBarItem.remoteBackground': primary,
    'statusBarItem.remoteForeground': onPrimary(primary),
    'statusBarItem.prominentBackground': primary,
    'statusBarItem.prominentForeground': onPrimary(primary),

    'titleBar.activeBackground': bg,
    'titleBar.activeForeground': fg,
    'titleBar.inactiveBackground': bg,
    'titleBar.inactiveForeground': mutedFg,
    'titleBar.border': border,

    'menu.background': isDark ? surface : '#FFFFFF',
    'menu.foreground': fg,
    'menu.selectionBackground': withAlpha(primary, isDark ? 0.22 : 0.14),
    'menu.separatorBackground': border,
    'menubar.selectionBackground': isDark ? mix(surface, '#FFFFFF', 0.08) : mix(surface, '#000000', 0.04),

    'scrollbar.shadow': isDark ? '#00000066' : '#00000022',
    'scrollbarSlider.background': isDark ? '#FFFFFF22' : '#00000022',
    'scrollbarSlider.hoverBackground': isDark ? '#FFFFFF33' : '#00000033',
    'scrollbarSlider.activeBackground': isDark ? '#FFFFFF44' : '#00000044',

    'terminal.background': isDark ? surface : '#FFFFFF',
    'terminal.foreground': fg,
    'terminal.ansiBlack': bg,
    'terminal.ansiRed': error,
    'terminal.ansiGreen': success,
    'terminal.ansiYellow': warning,
    'terminal.ansiBlue': fnColor,
    'terminal.ansiMagenta': mix(accent, '#A855F7', 0.5),
    'terminal.ansiCyan': typeColor,
    'terminal.ansiWhite': fg,
    'terminal.ansiBrightBlack': mutedFg,
    'terminal.ansiBrightRed': mix(error, '#FFFFFF', 0.2),
    'terminal.ansiBrightGreen': mix(success, '#FFFFFF', 0.2),
    'terminal.ansiBrightYellow': mix(warning, '#FFFFFF', 0.2),
    'terminal.ansiBrightBlue': mix(fnColor, '#FFFFFF', 0.2),
    'terminal.ansiBrightMagenta': mix(accent, '#FFFFFF', 0.3),
    'terminal.ansiBrightCyan': mix(typeColor, '#FFFFFF', 0.2),
    'terminal.ansiBrightWhite': isDark ? '#FFFFFF' : fg,
    'terminalCursor.foreground': primary,

    'gitDecoration.addedResourceForeground': success,
    'gitDecoration.modifiedResourceForeground': fnColor,
    'gitDecoration.deletedResourceForeground': error,
    'gitDecoration.untrackedResourceForeground': mix(success, '#FFFFFF', 0.15),
    'gitDecoration.ignoredResourceForeground': mutedFg,
    'gitDecoration.conflictingResourceForeground': warning,

    'notifications.background': surface,
    'notifications.foreground': fg,
    'notifications.border': border,
    'notificationCenterHeader.background': bg,
    'notificationsInfoIcon.foreground': primary,
    'notificationsWarningIcon.foreground': warning,
    'notificationsErrorIcon.foreground': error,
  };

  if (isDark) {
    colors['window.activeBorder'] = primary;
    colors['window.inactiveBorder'] = border;
    colors['textPreformat.foreground'] = fg;
  }

  return {
    name: label,
    type: isDark ? 'dark' : 'light',
    colors,
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: mutedFg, fontStyle: 'italic' } },
      { scope: ['string', 'string.quoted'], settings: { foreground: stringColor } },
      { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: warning } },
      { scope: ['keyword', 'storage.type', 'storage.modifier'], settings: { foreground: primary } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: fnColor } },
      { scope: ['entity.name.class', 'entity.name.type', 'support.type', 'support.class'], settings: { foreground: typeColor } },
      { scope: ['variable', 'meta.definition.variable'], settings: { foreground: fg } },
      { scope: ['variable.parameter', 'variable.other.property'], settings: { foreground: muted(fg, bg, 0.82) } },
      { scope: ['entity.name.tag'], settings: { foreground: primary } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: warning } },
      { scope: ['punctuation', 'meta.brace'], settings: { foreground: muted(fg, bg, 0.75) } },
      { scope: ['markup.heading'], settings: { foreground: primary, fontStyle: 'bold' } },
      { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
      { scope: ['markup.inline.raw', 'markup.fenced_code'], settings: { foreground: stringColor } },
      { scope: ['invalid'], settings: { foreground: error } },
    ],
    semanticHighlighting: true,
  };
}

const allBrands = [...brands.bigtech, ...brands.startups];
const themesDir = path.join(ROOT, 'themes');
const catalog = [];

fs.mkdirSync(themesDir, { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src'), { recursive: true });

for (const brand of allBrands) {
  for (const mode of ['dark', 'light']) {
    const theme = buildTheme(brand, mode);
    const filename = `${brand.id}-${mode}.json`;
    fs.writeFileSync(path.join(themesDir, filename), JSON.stringify(theme, null, 2) + '\n');
    catalog.push({
      id: brand.id,
      name: brand.name,
      mode,
      label: theme.name,
      filename,
      category: brands.bigtech.some((b) => b.id === brand.id) ? 'bigtech' : 'startups',
      primary: brand.primary,
    });
  }
}

fs.writeFileSync(path.join(ROOT, 'src', 'themeCatalog.json'), JSON.stringify(catalog, null, 2) + '\n');

const packagePath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.contributes.themes = catalog.map((entry) => ({
  label: entry.label,
  uiTheme: entry.mode === 'dark' ? 'vs-dark' : 'vs',
  path: `./themes/${entry.filename}`,
}));
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, '\t') + '\n');

console.log(`Generated ${catalog.length} themes and updated package.json`);
