/** Rust TextMate rules. */
export function getRustTokenColors(p) {
  const { storage, type, fn, keyword, builtin, purple, constant } = p;
  return [
    { scope: 'storage.type.rust', settings: { foreground: storage } },
    { scope: ['entity.name.type.rust', 'entity.name.type.mod.rust'], settings: { foreground: type } },
    { scope: 'entity.name.function.rust', settings: { foreground: fn } },
    { scope: ['keyword.other.rust', 'keyword.operator.arrow.rust'], settings: { foreground: keyword } },
    { scope: 'support.function.std.rust', settings: { foreground: builtin } },
    { scope: 'variable.language.self.rust', settings: { foreground: purple } },
    { scope: 'constant.other.caps.rust', settings: { foreground: constant, fontStyle: 'bold' } },
    { scope: 'meta.attribute.rust', settings: { foreground: storage } },
    { scope: 'variable.other.metavariable.name.rust', settings: { foreground: type } },
  ];
}
