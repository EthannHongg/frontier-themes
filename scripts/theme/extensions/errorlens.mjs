import { withAlpha } from '../color-utils.mjs';

/** Error Lens inline diagnostic colors (usernamehw.errorlens). */
export function getErrorLensColors(p) {
  const { isDark, error, warning, info, mutedFg } = p;

  return {
    'errorLens.errorBackground': withAlpha(error, isDark ? 0.11 : 0.13),
    'errorLens.errorMessageBackground': withAlpha(error, isDark ? 0.18 : 0.2),
    'errorLens.errorForeground': error,
    'errorLens.errorForegroundLight': error,
    'errorLens.warningBackground': withAlpha(warning, isDark ? 0.11 : 0.13),
    'errorLens.warningMessageBackground': withAlpha(warning, isDark ? 0.18 : 0.2),
    'errorLens.warningForeground': warning,
    'errorLens.warningForegroundLight': warning,
    'errorLens.infoBackground': withAlpha(info, isDark ? 0.11 : 0.13),
    'errorLens.infoMessageBackground': withAlpha(info, isDark ? 0.18 : 0.2),
    'errorLens.infoForeground': info,
    'errorLens.hintBackground': withAlpha(mutedFg, isDark ? 0.1 : 0.12),
    'errorLens.hintMessageBackground': withAlpha(mutedFg, isDark ? 0.16 : 0.18),
    'errorLens.hintForeground': mutedFg,
    'errorLens.statusBarErrorForeground': error,
    'errorLens.statusBarWarningForeground': warning,
    'errorLens.statusBarInfoForeground': info,
    'errorLens.statusBarHintForeground': mutedFg,
    'errorLens.statusBarIconErrorForeground': error,
    'errorLens.statusBarIconWarningForeground': warning,
    'errorLens.statusBarIconInfoForeground': info,
    'errorLens.statusBarIconHintForeground': mutedFg,
  };
}
