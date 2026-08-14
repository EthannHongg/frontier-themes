/** Shell / Bash / Zsh TextMate rules. */
export function getShellTokenColors(p) {
  const { keyword, storage, string, operator } = p;
  return [
    { scope: 'keyword.operator.logical.shell', settings: { foreground: keyword } },
    { scope: 'punctuation.definition.logical-expression.shell', settings: { foreground: storage } },
    { scope: ['string.interpolated.dollar.shell', 'string.interpolated.backtick.shell'], settings: { foreground: string } },
    { scope: 'support.function.builtin.shell', settings: { foreground: operator } },
    { scope: 'variable.other.normal.shell', settings: { foreground: p.variable } },
  ];
}
