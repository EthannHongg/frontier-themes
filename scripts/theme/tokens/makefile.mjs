/** Makefile TextMate rules. */
export function getMakefileTokenColors(p) {
  const { storage, fn } = p;
  return [
    { scope: 'meta.scope.prerequisites.make', settings: { foreground: storage } },
    { scope: 'entity.name.function.target.make', settings: { foreground: fn, fontStyle: 'bold' } },
    { scope: 'entity.name.function.make', settings: { foreground: fn, fontStyle: 'bold' } },
  ];
}
