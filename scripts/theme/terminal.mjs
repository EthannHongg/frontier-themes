/** Curated terminal ANSI palette aligned with syntax roles. */
export function getTerminalColors(p) {
  const { isDark, surface, fg, primary, terminal } = p;
  return {
    'terminal.background': isDark ? surface : '#FFFFFF',
    'terminal.foreground': fg,
    'terminal.ansiBlack': terminal.black,
    'terminal.ansiRed': terminal.red,
    'terminal.ansiGreen': terminal.green,
    'terminal.ansiYellow': terminal.yellow,
    'terminal.ansiBlue': terminal.blue,
    'terminal.ansiMagenta': terminal.magenta,
    'terminal.ansiCyan': terminal.cyan,
    'terminal.ansiWhite': terminal.white,
    'terminal.ansiBrightBlack': terminal.brightBlack,
    'terminal.ansiBrightRed': terminal.brightRed,
    'terminal.ansiBrightGreen': terminal.brightGreen,
    'terminal.ansiBrightYellow': terminal.brightYellow,
    'terminal.ansiBrightBlue': terminal.brightBlue,
    'terminal.ansiBrightMagenta': terminal.brightMagenta,
    'terminal.ansiBrightCyan': terminal.brightCyan,
    'terminal.ansiBrightWhite': terminal.brightWhite,
    'terminalCursor.foreground': primary,
  };
}
