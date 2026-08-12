import { brandSyntaxRole, muted, mix, withAlpha, onPrimary } from './color-utils.mjs';

/**
 * Gruvbox reference syntax roles — vivid, proven readable on code.
 * @see https://github.com/jdinhify/vscode-theme-gruvbox
 */
const GRUV_DARK = {
  keyword: '#FB4934',
  storage: '#FE8019',
  string: '#B8BB26',
  function: '#8EC07C',
  method: '#8EC07C',
  type: '#FABD2F',
  variable: '#EBDBB2',
  parameter: '#83A598',
  property: '#83A598',
  constant: '#D3869B',
  operator: '#8EC07C',
  regexp: '#FE8019',
  escape: '#FB4934',
  comment: '#928374',
  builtin: '#FE8019',
  tag: '#8EC07C',
  attribute: '#FABD2F',
  purple: '#D3869B',
  info: '#83A598',
  error: '#FB4934',
  warning: '#FABD2F',
  success: '#B8BB26',
};

const GRUV_LIGHT = {
  keyword: '#9D0006',
  storage: '#AF3A03',
  string: '#79740E',
  function: '#427B58',
  method: '#427B58',
  type: '#B57614',
  variable: '#3C3836',
  parameter: '#076678',
  property: '#076678',
  constant: '#8F3F71',
  operator: '#427B58',
  regexp: '#AF3A03',
  escape: '#9D0006',
  comment: '#928374',
  builtin: '#AF3A03',
  tag: '#427B58',
  attribute: '#B57614',
  purple: '#8F3F71',
  info: '#076678',
  error: '#9D0006',
  warning: '#B57614',
  success: '#79740E',
};

/**
 * Derive semantic color roles from a brand palette.
 * Syntax uses Gruvbox-readable hues shifted toward brand primary;
 * workbench chrome stays brand-colored.
 */
export function derivePalette(brand, mode) {
  const isDark = mode === 'dark';
  const palette = brand[mode];
  const { primary, secondary, accent } = brand;
  const { bg, surface, editor, fg } = palette;
  const gruv = isDark ? GRUV_DARK : GRUV_LIGHT;
  const brandWeight = 0.2;

  const tint = (role) => brandSyntaxRole(gruv[role], primary, brandWeight);
  const tintSecondary = (role) => brandSyntaxRole(gruv[role], secondary, brandWeight * 0.85);
  const tintAccent = (role) => brandSyntaxRole(gruv[role], accent, brandWeight * 0.7);

  const border = isDark ? mix(surface, '#000000', 0.82) : mix(surface, '#000000', 0.07);
  const mutedFg = muted(fg, editor, isDark ? 0.42 : 0.35);
  const subtleFg = muted(fg, editor, isDark ? 0.28 : 0.22);
  const tabInactive = isDark ? bg : mix(surface, '#FFFFFF', 0.45);

  const error = tint('error');
  const warning = tint('warning');
  const success = tintSecondary('success');
  const info = tint('info');

  const comment = muted(fg, editor, isDark ? 0.48 : 0.42);
  const string = tintSecondary('string');
  const constant = tint('constant');
  const keyword = tint('keyword');
  const storage = tint('storage');
  const operator = tint('operator');
  const regexp = tintAccent('regexp');
  const escape = tint('escape');
  const fn = tint('function');
  const method = tint('method');
  const type = tint('type');
  const builtin = tint('builtin');
  const variable = fg;
  const parameter = tint('parameter');
  const property = tint('property');
  const tag = tint('tag');
  const attribute = tint('attribute');
  const purple = tint('purple');
  const invalid = error;
  const deprecated = purple;

  const selection = withAlpha(primary, isDark ? 0.28 : 0.2);
  const selectionHi = withAlpha(primary, isDark ? 0.14 : 0.1);

  const brackets = [
    tint('keyword'),
    tint('info'),
    tintSecondary('string'),
    tint('warning'),
    tint('purple'),
    tint('operator'),
  ];

  const terminal = {
    black: bg,
    red: error,
    green: success,
    yellow: warning,
    blue: info,
    magenta: purple,
    cyan: operator,
    white: fg,
    brightBlack: mutedFg,
    brightRed: mix(error, fg, isDark ? 0.15 : 0.1),
    brightGreen: mix(success, fg, isDark ? 0.15 : 0.1),
    brightYellow: mix(warning, fg, isDark ? 0.15 : 0.1),
    brightBlue: mix(info, fg, isDark ? 0.15 : 0.1),
    brightMagenta: mix(purple, fg, isDark ? 0.15 : 0.1),
    brightCyan: mix(operator, fg, isDark ? 0.15 : 0.1),
    brightWhite: isDark ? '#FFFFFF' : fg,
  };

  return {
    isDark,
    brand,
    mode,
    label: `${brand.name} ${isDark ? 'Dark' : 'Light'}`,
    bg,
    surface,
    editor,
    fg,
    border,
    mutedFg,
    subtleFg,
    tabInactive,
    primary,
    secondary,
    accent,
    error,
    warning,
    success,
    info,
    comment,
    string,
    constant,
    keyword,
    storage,
    operator,
    regexp,
    escape,
    fn,
    method,
    type,
    builtin,
    variable,
    parameter,
    property,
    tag,
    attribute,
    purple,
    invalid,
    deprecated,
    selection,
    selectionHi,
    brackets,
    terminal,
    onPrimary: onPrimary(primary),
    widgetBg: isDark ? surface : '#FFFFFF',
    stickyScroll: isDark ? mix(editor, '#FFFFFF', 0.05) : mix(editor, '#000000', 0.03),
    ghostText: muted(fg, editor, isDark ? 0.52 : 0.45),
    mergeCurrent: withAlpha(primary, isDark ? 0.32 : 0.22),
    mergeIncoming: withAlpha(info, isDark ? 0.32 : 0.22),
  };
}
