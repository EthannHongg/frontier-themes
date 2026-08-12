/** JavaScript / TypeScript TextMate rules. */
export function getJavaScriptTokenColors(p) {
  const { purple, operator, type, fn } = p;
  return [
    { scope: ['variable.language', 'variable.language.this'], settings: { foreground: purple } },
    { scope: ['keyword.control.import', 'keyword.control.export', 'keyword.control.from'], settings: { foreground: operator } },
    { scope: ['entity.name.type.interface', 'entity.name.type.alias'], settings: { foreground: type } },
    { scope: 'entity.name.function.js', settings: { foreground: fn } },
    { scope: 'meta.import.ts entity.name', settings: { foreground: type } },
  ];
}
