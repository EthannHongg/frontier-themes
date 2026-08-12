/** Python-specific TextMate rules. */
export function getPythonTokenColors(p) {
  const { fn, storage, keyword, purple, constant, string } = p;
  return [
    { scope: ['entity.name.function.decorator.python', 'meta.function.decorator.python'], settings: { foreground: fn } },
    { scope: ['storage.type.function.python', 'storage.modifier.async.python'], settings: { foreground: storage } },
    { scope: 'keyword.control.flow.python', settings: { foreground: keyword } },
    { scope: 'support.type.python', settings: { foreground: purple } },
    { scope: 'constant.language.python', settings: { foreground: constant } },
    { scope: 'string.quoted.docstring.multi.python', settings: { foreground: string, fontStyle: 'italic' } },
  ];
}
