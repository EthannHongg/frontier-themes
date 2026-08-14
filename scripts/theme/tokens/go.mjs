/** Go TextMate rules. */
export function getGoTokenColors(p) {
  const { fg, storage, string, operator, type, fn, purple } = p;
  return [
    { scope: 'source.go storage.type', settings: { foreground: storage } },
    { scope: 'source.go entity.name.import', settings: { foreground: string } },
    { scope: ['source.go keyword.package', 'source.go keyword.import'], settings: { foreground: operator } },
    { scope: ['source.go keyword.interface', 'source.go keyword.struct'], settings: { foreground: type } },
    { scope: 'source.go entity.name.type', settings: { foreground: fg } },
    { scope: 'source.go entity.name.function', settings: { foreground: fn } },
    { scope: 'source.go variable.other', settings: { foreground: purple } },
  ];
}
