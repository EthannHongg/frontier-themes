import { withAlpha } from '../color-utils.mjs';

/** Merge conflict UI colors. */
export function getMergeColors(p) {
  const { isDark, fg, error, warning, primary, info, mergeCurrent, mergeIncoming } = p;

  return {
    'merge.currentHeaderBackground': mergeCurrent,
    'merge.currentContentBackground': withAlpha(primary, isDark ? 0.12 : 0.08),
    'merge.incomingHeaderBackground': mergeIncoming,
    'merge.incomingContentBackground': withAlpha(info, isDark ? 0.12 : 0.08),
    'merge.border': withAlpha(warning, 0.5),
    'merge.commonContentBackground': withAlpha(fg, isDark ? 0.06 : 0.04),
    'merge.commonHeaderBackground': withAlpha(fg, isDark ? 0.1 : 0.06),
    'merge.editor.change.background': withAlpha(warning, 0.15),
    'editorOverviewRuler.bracketMatchForeground': withAlpha(primary, 0.7),
  };
}
