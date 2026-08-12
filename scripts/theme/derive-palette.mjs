import { mix, muted, withAlpha, onPrimary } from './color-utils.mjs';

/**
 * Derive semantic color roles from a brand palette.
 * All theme modules consume this object — single source of truth per theme.
 */
export function derivePalette(brand, mode) {
  const isDark = mode === 'dark';
  const palette = brand[mode];
  const { primary, secondary, accent } = brand;
  const { bg, surface, editor, fg } = palette;

  const border = isDark ? mix(surface, '#000000', 0.85) : mix(surface, '#000000', 0.08);
  const mutedFg = muted(fg, bg, isDark ? 0.55 : 0.45);
  const subtleFg = muted(fg, bg, isDark ? 0.72 : 0.58);
  const tabInactive = isDark ? bg : mix(surface, '#FFFFFF', 0.5);

  const error = isDark ? '#EF4444' : '#DC2626';
  const warning = isDark ? '#F59E0B' : '#D97706';
  const success = isDark ? mix(primary, '#22C55E', 0.5) : mix(primary, '#059669', 0.4);
  const info = isDark ? mix(accent, '#60A5FA', 0.45) : mix(accent, '#2563EB', 0.35);

  const comment = mutedFg;
  const string = isDark ? mix(primary, '#34D399', 0.45) : mix(primary, '#0D8A6A', 0.35);
  const constant = isDark ? mix(warning, '#FBBF24', 0.35) : mix(warning, '#CA8A04', 0.3);
  const keyword = primary;
  const storage = isDark ? mix(primary, warning, 0.35) : mix(primary, warning, 0.25);
  const operator = isDark ? mix(secondary, '#22D3EE', 0.4) : mix(secondary, '#0891B2', 0.35);
  const regexp = isDark ? mix(accent, warning, 0.4) : mix(accent, warning, 0.3);
  const escape = isDark ? mix(error, '#F87171', 0.3) : mix(error, '#B91C1C', 0.25);
  const fn = info;
  const method = isDark ? mix(fn, '#67E8F9', 0.25) : mix(fn, '#38BDF8', 0.2);
  const type = isDark ? mix(secondary, '#22D3EE', 0.4) : mix(secondary, '#0891B2', 0.35);
  const builtin = isDark ? mix(accent, warning, 0.35) : mix(accent, warning, 0.3);
  const variable = isDark ? mix(fg, info, 0.15) : mix(fg, info, 0.1);
  const parameter = isDark ? mix(variable, mutedFg, 0.35) : mix(variable, mutedFg, 0.3);
  const property = isDark ? mix(info, '#818CF8', 0.2) : mix(info, '#4F46E5', 0.15);
  const tag = isDark ? mix(primary, operator, 0.35) : mix(primary, operator, 0.25);
  const attribute = constant;
  const purple = isDark ? mix(accent, '#A855F7', 0.5) : mix(accent, '#9333EA', 0.4);
  const invalid = error;
  const deprecated = purple;

  const selection = withAlpha(primary, isDark ? 0.28 : 0.22);
  const selectionHi = withAlpha(primary, isDark ? 0.14 : 0.1);

  const brackets = [
    isDark ? mix(primary, '#F472B6', 0.35) : mix(primary, '#DB2777', 0.3),
    isDark ? mix(info, '#60A5FA', 0.35) : mix(info, '#2563EB', 0.3),
    isDark ? mix(success, '#34D399', 0.35) : mix(success, '#059669', 0.3),
    isDark ? mix(warning, '#FBBF24', 0.35) : mix(warning, '#D97706', 0.3),
    isDark ? mix(purple, '#C084FC', 0.3) : mix(purple, '#7C3AED', 0.25),
    isDark ? mix(operator, '#67E8F9', 0.35) : mix(operator, '#0891B2', 0.3),
  ];

  const terminal = {
    black: bg,
    red: error,
    green: success,
    yellow: warning,
    blue: fn,
    magenta: purple,
    cyan: operator,
    white: fg,
    brightBlack: mutedFg,
    brightRed: mix(error, '#FFFFFF', isDark ? 0.2 : 0.1),
    brightGreen: mix(success, '#FFFFFF', isDark ? 0.2 : 0.1),
    brightYellow: mix(warning, '#FFFFFF', isDark ? 0.2 : 0.1),
    brightBlue: mix(fn, '#FFFFFF', isDark ? 0.2 : 0.1),
    brightMagenta: mix(purple, '#FFFFFF', isDark ? 0.25 : 0.15),
    brightCyan: mix(operator, '#FFFFFF', isDark ? 0.2 : 0.1),
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
    stickyScroll: isDark ? mix(editor, '#FFFFFF', 0.06) : mix(editor, '#000000', 0.04),
    ghostText: muted(fg, editor, isDark ? 0.65 : 0.55),
    mergeCurrent: isDark ? withAlpha(primary, 0.35) : withAlpha(primary, 0.25),
    mergeIncoming: isDark ? withAlpha(info, 0.35) : withAlpha(info, 0.25),
  };
}
