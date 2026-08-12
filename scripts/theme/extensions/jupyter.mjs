import { withAlpha } from '../color-utils.mjs';

/** Jupyter Notebook UI colors. */
export function getJupyterColors(p) {
  const { isDark, editor, surface, primary, info, warning, error, fg } = p;
  return {
    'notebook.editorBackground': editor,
    'notebook.cellEditorBackground': isDark ? withAlpha(surface, 0.6) : '#FFFFFF',
    'notebook.cellBorderColor': withAlpha(primary, isDark ? 0.25 : 0.18),
    'notebook.focusedCellBorder': primary,
    'notebook.focusedEditorBorder': primary,
    'notebook.selectedCellBorder': withAlpha(info, 0.5),
    'notebook.inactiveFocusedCellBorder': withAlpha(primary, 0.35),
    'notebook.cellStatusBarItemHoverBackground': withAlpha(primary, isDark ? 0.15 : 0.1),
    'notebook.cellInsertionIndicator': success(p),
    'notebook.cellToolbarSeparator': withAlpha(fg, isDark ? 0.15 : 0.1),
    'notebook.focusedCellBackground': withAlpha(primary, isDark ? 0.08 : 0.05),
    'notebook.symbolHighlightBackground': withAlpha(warning, 0.2),
    'notebookScrollbarSlider.background': withAlpha(fg, isDark ? 0.15 : 0.12),
    'notebookScrollbarSlider.hoverBackground': withAlpha(fg, isDark ? 0.25 : 0.2),
    'notebookScrollbarSlider.activeBackground': withAlpha(fg, isDark ? 0.35 : 0.28),
    'notebook.outputContainerBackgroundColor': isDark ? withAlpha(surface, 0.5) : withAlpha(surface, 0.3),
    'notebook.outputContainerBorderColor': withAlpha(info, 0.25),
    'notebookStatusErrorIcon.foreground': error,
    'notebookStatusSuccessIcon.foreground': success(p),
    'notebookStatusRunningIcon.foreground': info,
  };
}

function success(p) {
  return p.success;
}
